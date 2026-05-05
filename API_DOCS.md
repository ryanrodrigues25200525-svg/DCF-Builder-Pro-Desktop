# DCF Builder API Documentation

This document reflects the current active API surface in the project.

## Base URLs

- Frontend local: `http://localhost:3000`
- Backend local: `http://localhost:8000`
- Backend OpenAPI: `http://localhost:8000/docs`

## Frontend BFF Routes (Next.js)

### `GET /api/sec/company?ticker={TICKER}`

- Purpose: Unified company payload for the app.
- Upstream: `GET {SEC_SERVICE_URL}/api/company/{ticker}/unified/native?years=5`
- Fallback behavior:
  - If unified payload has unusable financials, fetches `.../financials/native`.
  - Uses in-memory response cache per ticker.
  - Returns stale cached data when upstream fails.

### `GET /api/sec/search?q={QUERY}&limit={N}`

- Purpose: Company search for ticker/name/CIK.
- Uses SEC ticker index with fuzzy matching.

### `POST /api/projections/{ticker}`

- Purpose: Build lightweight revenue/earnings projections from native historical data.
- Upstream source: backend unified native endpoint.

### `POST /api/dcf/export`

- Purpose: Generate downloadable DCF Excel file.
- Upstream: `POST {SEC_SERVICE_URL}/api/export/dcf/excel`

### Other frontend API routes

- `GET /api/wacc/erp`
- `GET /api/wacc/treasury`
- `GET /api/market-data`

## Backend Routes (FastAPI)

Base prefixes registered in `app/main.py`:

- `/api/company`
- `/api/search`
- `/api/export`
- `/api/macro`

### Health and service

- `GET /`
- `GET /health`
- `GET /api/health`
- `GET /api/cache/stats`

### Company endpoints (`/api/company`)

- `GET /{ticker}` profile
- `GET /{ticker}/unified`
- `GET /{ticker}/unified/native` alias
- `GET /{ticker}/financials`
- `GET /{ticker}/financials/native` alias
- `GET /{ticker}/market`
- `GET /{ticker}/peers`
- `GET /{ticker}/peers/suggested`
- `GET /{ticker}/filings`
- `GET /{ticker}/insider-trades`
- `GET /{ticker}/insiders` alias

### Search endpoint (`/api/search`)

- `GET /?query={QUERY}&limit={N}`

### Macro endpoint (`/api/macro`)

- `GET /api/macro`

### Export endpoint (`/api/export`)

- `POST /dcf/excel`

## Data Source Strategy

- Financial statements/profile: `edgartools` primary.
- Live market data: `stockdex` primary, Yahoo fallback.
- Macro context: Yahoo and cached backend context.
- Response caching: SQLite-backed repository/cache layer.

## Core Environment Variables

### Backend

- `EDGAR_IDENTITY`
- `CORS_ORIGINS`
- `ALLOWED_HOSTS`
- `EXPOSE_IDENTITY_HINT`
- `FINANCIALS_OPERATING_COMPANY_FILTER`
- `FINANCIALS_REQUIRE_10K_PREFLIGHT`

### Frontend

- `SEC_SERVICE_URL`
- `NEXT_PUBLIC_SEC_SERVICE_URL`
- `SEC_USER_AGENT`

## Error Model

- Frontend BFF routes return JSON errors with HTTP status codes (`400`, `404`, `5xx`).
- Backend uses FastAPI handlers and a normalized internal error envelope for server errors.
