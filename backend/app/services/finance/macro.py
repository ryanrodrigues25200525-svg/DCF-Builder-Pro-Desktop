from __future__ import annotations

import asyncio
import logging
import time
from typing import Any, Dict, Optional

import yfinance as yf

from app.core.cache_versions import (
    macro_context_key,
    macro_market_returns_key,
    macro_treasury_key,
)
from app.services import cache

from .utils import (
    _to_positive_float,
)

logger = logging.getLogger("finance-macro")

_MARKET_CONTEXT_INFLIGHT: Optional[asyncio.Task] = None
_MARKET_CONTEXT_INFLIGHT_LOCK = asyncio.Lock()

async def fetch_market_context() -> Dict[str, Any]:
    """
    Fetch global market context (Risk Free Rate, ERP) using yfinance macro indices only.
    """
    cache_key = macro_context_key()
    if cached := await cache.get_from_cache(cache_key):
        return cached

    global _MARKET_CONTEXT_INFLIGHT
    async with _MARKET_CONTEXT_INFLIGHT_LOCK:
        in_flight = _MARKET_CONTEXT_INFLIGHT
        if in_flight is None:
            in_flight = asyncio.create_task(_fetch_and_cache_market_context(cache_key))
            _MARKET_CONTEXT_INFLIGHT = in_flight

    try:
        return await asyncio.shield(in_flight)
    finally:
        async with _MARKET_CONTEXT_INFLIGHT_LOCK:
            if _MARKET_CONTEXT_INFLIGHT is in_flight:
                _MARKET_CONTEXT_INFLIGHT = None

async def _fetch_and_cache_market_context(cache_key: str) -> Dict[str, Any]:
    default_rfr = 0.045
    default_erp = 0.055

    treasury_cache_key = macro_treasury_key()
    market_returns_cache_key = macro_market_returns_key()

    treasury_cached = await cache.get_from_cache(treasury_cache_key) or {}
    market_returns_cached = await cache.get_from_cache(market_returns_cache_key) or {}

    rfr = _to_positive_float(treasury_cached.get("value")) or default_rfr
    sp500_annual_return = _to_positive_float(market_returns_cached.get("value"))
    erp = max(0.03, min(0.09, sp500_annual_return - rfr)) if sp500_annual_return > 0 else default_erp

    treasury_source = "cached"
    if not treasury_cached:
        treasury_source = "default"
    if treasury_cached and treasury_cached.get("fetched_at_ms"):
        age_ms = int(time.time() * 1000) - int(treasury_cached["fetched_at_ms"])
        age_h = max(0, int(age_ms / (1000 * 3600)))
        treasury_source = f"cached_{age_h}h_ago"

    needs_treasury = not treasury_cached
    needs_market_returns = not market_returns_cached
    now_ms = int(time.time() * 1000)

    async def _fetch_treasury_10y() -> Optional[float]:
        try:
            ticker = yf.Ticker("^TNX")
            hist = await asyncio.to_thread(lambda: ticker.history(period="7d", interval="1d", auto_adjust=True))
            if hist is not None and not hist.empty:
                close = float(hist["Close"].dropna().iloc[-1])
                return close / 100.0 if close > 0 else None
        except Exception as e:
            logger.warning(f"Failed to fetch ^TNX macro data: {e}")
        return None

    async def _fetch_sp500_annualized_return() -> Optional[float]:
        try:
            ticker = yf.Ticker("^GSPC")
            hist = await asyncio.to_thread(lambda: ticker.history(period="6y", interval="1mo", auto_adjust=True))
            if hist is None or hist.empty:
                return None
            closes = hist["Close"].dropna()
            if closes.size < 24:
                return None
            start_price = float(closes.iloc[0])
            end_price = float(closes.iloc[-1])
            if start_price <= 0 or end_price <= 0:
                return None
            elapsed_years = max(1.0, (closes.index[-1] - closes.index[0]).days / 365.25)
            return (end_price / start_price) ** (1.0 / elapsed_years) - 1.0
        except Exception as e:
            logger.warning(f"Failed to fetch ^GSPC macro data: {e}")
        return None

    if needs_treasury or needs_market_returns:
        fetches = await asyncio.gather(
            asyncio.wait_for(_fetch_treasury_10y(), timeout=4.0) if needs_treasury else asyncio.sleep(0, result=None),
            asyncio.wait_for(_fetch_sp500_annualized_return(), timeout=4.0)
            if needs_market_returns
            else asyncio.sleep(0, result=None),
            return_exceptions=True,
        )
        treasury_result, market_returns_result = fetches

        if isinstance(treasury_result, float) and treasury_result > 0:
            rfr = treasury_result
            treasury_source = "live"
            await cache.set_to_cache(
                treasury_cache_key,
                {"value": rfr, "fetched_at_ms": now_ms},
                ttl_seconds=3600 * 24,
            )

        if isinstance(market_returns_result, float) and market_returns_result != 0:
            sp500_annual_return = market_returns_result
            erp = max(0.03, min(0.09, sp500_annual_return - rfr))
            await cache.set_to_cache(
                market_returns_cache_key,
                {"value": sp500_annual_return, "fetched_at_ms": now_ms},
                ttl_seconds=3600 * 24 * 7,
            )

    context = {
        "risk_free_rate": rfr,
        "equity_risk_premium": erp,
        "expected_return": rfr + erp,
        "treasury_source": treasury_source,
        "fetched_at_ms": now_ms,
    }
    await cache.set_to_cache(cache_key, context, ttl_seconds=3600 * 12)
    return context
