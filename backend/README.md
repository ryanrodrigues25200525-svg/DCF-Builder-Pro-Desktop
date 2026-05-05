# Backend Service (FastAPI)

Backend API for DCF Builder. Provides unified company payloads, SEC-native financials, market context, and Excel export.

## Stack

- FastAPI + Uvicorn
- `edgartools` for SEC data
- `stockdex` with Yahoo fallback for market data
- SQLite-backed cache repository

## Run Locally

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API docs at `http://localhost:8000/docs`.

## Main Route Groups

- `/api/company`
- `/api/search`
- `/api/export`
- `/api/macro`
- `/health`
- `/ready`

## Critical Endpoints

- `GET /api/company/{ticker}/unified/native?years=5`
- `GET /api/company/{ticker}/financials/native?years=5`
- `GET /api/company/{ticker}/market`
- `GET /api/company/{ticker}/peers`
- `GET /api/search?query=...&limit=...`
- `POST /api/export/dcf/excel`

## Environment

Copy from `.env.example` and set production values in deployment platform:

- `EDGAR_IDENTITY`
- `CORS_ORIGINS`
- `ALLOWED_HOSTS`
- `EXPOSE_IDENTITY_HINT`

Optional:

- `FINANCIALS_OPERATING_COMPANY_FILTER`
- `FINANCIALS_REQUIRE_10K_PREFLIGHT`
- `SINGLE_TICKER_CACHE`
- `LOG_LEVEL`
- `REQUEST_LOG_ENABLED`
- `RATE_LIMIT_ENABLED`
- `RATE_LIMIT_REQUESTS`
- `RATE_LIMIT_WINDOW_SECONDS`

## Data Provider Priority

- Financials/profile: `edgartools` primary.
- Market: `stockdex` primary, Yahoo fallback.

## Cache Notes

- Financial/profile, market, peers, and macro context are cached behind the API.
- Cache stats available via `/api/cache/stats`.
- Purge old cache when changing normalization or schema behavior.
- SQLite cache is acceptable for low-traffic Cloud Run deployments, but it is per-instance and disposable.

## Production Guardrails

- Request/response observability headers:
  - `X-Request-ID`
  - `X-Response-Time-Ms`
- Health endpoints:
  - `/health`
  - `/ready`
  - `/api/health`
- Conservative in-memory API rate limiting enabled by environment variables.
