# Local Setup

This guide is for developers who want to clone `dcf-builder` from GitHub and run it locally.

## What You Need

- Node.js `20+`
- npm `10+`
- Python `3.11+`
- Git

Optional:

- Docker Desktop if you want to use `docker-compose`

## 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd Antigravity/dcf-builder
```

If the repo name changes, the important part is ending up inside the `dcf-builder/` directory before running commands.

## 2. Create Local Environment Files

Frontend:

```bash
cp frontend/.env.example frontend/.env.local
```

Backend:

```bash
cp backend/.env.example backend/.env
```

Recommended local values:

`frontend/.env.local`

```bash
SEC_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_SEC_SERVICE_URL=http://localhost:8000
SEC_USER_AGENT=DCFBuilder_Research/1.0 (you@example.com)
```

`backend/.env`

```bash
EDGAR_IDENTITY=Your Name you@example.com
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=localhost,127.0.0.1
LOG_LEVEL=INFO
REQUEST_LOG_ENABLED=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=120
RATE_LIMIT_WINDOW_SECONDS=60
```

Notes:

- `EDGAR_IDENTITY` should be a real identifier for SEC requests.
- Do not commit `.env` or `.env.local`.

## 3. Install Dependencies

From `dcf-builder/`:

```bash
npm install
npm install --prefix frontend
cd backend
python3 -m pip install -r requirements.txt pytest
cd ..
```

If you prefer the existing shortcut:

```bash
npm run install:all
```

That command also creates a backend virtual environment if one does not already exist.

## 4. Run the App

From `dcf-builder/`:

```bash
npm run dev
```

This starts:

- frontend on `http://localhost:3000`
- backend on `http://localhost:8000`

Useful backend endpoints:

- `http://localhost:8000/health`
- `http://localhost:8000/ready`
- `http://localhost:8000/docs`

## 5. Verify the Setup

Run the standard verification:

```bash
npm run verify
```

Run the browser flow:

```bash
npm run test:e2e:dcf-flow
```

## Docker Option

If you want to run it with Docker:

```bash
docker compose up --build
```

That uses [docker-compose.yml](/Users/ryanrodrigues/Antigravity/dcf-builder/docker-compose.yml).

Services:

- frontend: `http://localhost:3000`
- backend: `http://localhost:8000`

## Common Issues

### Port already in use

If `3000` or `8000` is busy, stop the existing process first or change the port in the relevant start command.

### SEC requests fail

Usually this means:

- `EDGAR_IDENTITY` is missing or still a placeholder
- local internet access is blocked
- the SEC endpoint is rate-limiting or temporarily unavailable

### Playwright E2E fails on startup

Make sure:

- the frontend is reachable at `http://localhost:3000`
- the backend is reachable at `http://localhost:8000`
- you are using `localhost`, not `127.0.0.1`, for the Playwright-managed frontend URL in dev

### Backend package mismatch

Reinstall backend requirements:

```bash
cd backend
python3 -m pip install -r requirements.txt pytest
```

## Suggested First Developer Checks

After first clone:

```bash
npm run lint:frontend
npm run test:frontend
npm run build:frontend
npm run test:backend
npm run test:e2e:dcf-flow
```
