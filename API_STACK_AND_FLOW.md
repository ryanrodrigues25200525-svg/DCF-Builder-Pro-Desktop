# DCF Builder Architecture and Flow

## High-Level Map

```text
[User Browser]
   |
   v
[Next.js Frontend UI]
   |
   +--> [BFF: /api/sec/company]
            |
            v
      [Backend: /api/company/{ticker}/unified/native]
            |
            +--> [Cache lookup (SQLite repository)]
            |       |
            |       +-- hit -> return unified payload
            |
            +--> [Profile + Financials: edgartools]
            +--> [Market: stockdex -> Yahoo fallback]
            +--> [Peers + Insider + Macro context]
            |
            +--> [Unified response]
                    |
                    +--> cache write
                    +--> return to frontend
```

## Request Lifecycle

1. User searches/selects ticker in frontend.
2. Frontend calls `/api/sec/company?ticker=...`.
3. BFF requests backend unified native payload.
4. Backend checks cache first.
5. On miss, backend fetches and normalizes source data, then caches.
6. BFF validates unified payload usability.
7. If financials are insufficient, BFF requests backend financials-native fallback and merges result.
8. Final payload returned to frontend state/hooks.

## Fallback Strategy

### Financials and profile

- Primary: `edgartools`.
- No alternate provider for native financial structure.

### Market data

- Primary: `stockdex`.
- Fallback: Yahoo Finance.

### BFF response behavior

- Uses short in-memory cache keyed by ticker.
- Returns stale cache on upstream failure when available.
- Emits source headers (`X-Data-Source`, `X-Cache-Hit`).

## Backend Modules (Current)

- `app/api/routers/financials_router.py`: company endpoints, unified/native payloads.
- `app/api/routers/search.py`: search endpoint.
- `app/api/routers/macro_router.py`: macro context endpoint.
- `app/api/routers/export_router.py`: DCF Excel export.
- `app/services/edgar.py`: SEC/edgartools integration.
- `app/services/finance.py`: market/macro/peer sourcing and fallbacks.
- `app/infrastructure/repository.py`: cache persistence layer.

## Deployment Update Flow

GitHub is the deployment trigger source:

1. Code pushed/merged to GitHub.
2. Frontend pipeline deploys to Vercel.
3. Backend pipeline deploys to Google Cloud.
4. Production env vars are injected at platform level.

## Operational Checks

- Backend health: `/health`
- API health and cache status: `/api/health`, `/api/cache/stats`
- Frontend build gate: `npm run build:frontend`
- Security gate: `npm run security:scan`
