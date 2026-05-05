# DCF Builder

DCF Builder is a valuation workspace with a Next.js frontend and FastAPI backend, using SEC/EDGAR-native financial structures for company data and user-controlled assumptions for model outputs.

## What It Does

- Search public companies by ticker or name
- Pull SEC-native financial history
- Build DCF outputs from editable assumptions
- Run sensitivity, reverse DCF, comparables, and export workflows
- Support a Vercel frontend + Cloud Run backend deployment model

## Who This Is For

- Developers who want to run or extend the app locally
- Analysts who want a customizable DCF modeling workspace
- Operators deploying a low-traffic valuation app on modern serverless infrastructure

## Quick Start

### Download the desktop app

Most users should download the latest installer from GitHub Releases instead of cloning the repo.

- macOS: download the `.dmg`
- Windows: download the `.exe`
- Linux: download the `.AppImage` or `.deb`

The desktop app bundles its own frontend and backend runtime. Users do not need to install Node.js, Python, npm, or pip.

Because builds are not Apple-notarized or Windows code-signed, first launch may show an operating-system trust warning. On macOS, right-click the app and choose Open, or approve it in System Settings > Privacy & Security. On Windows, choose More info > Run anyway.

Release build notes are in `docs/RELEASE.md`.

### Run from source

Clone the repo, create env files, install dependencies, and start both services:

```bash
git clone <your-github-repo-url>
cd Antigravity/dcf-builder
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
npm run install:all
npm run dev
```

Then open:

- Frontend: `http://localhost:3000`
- Backend docs: `http://localhost:8000/docs`

Full local setup guide:

- `LOCAL_SETUP.md`

## Project Layout

- `frontend/`: Next.js app, BFF routes, native payload normalization, UI.
- `backend/`: FastAPI API, SEC/market data orchestration, cache, export services.
- `scripts/`: repository-level utility scripts (including security scan).

## Current Data Pipeline

1. Browser requests `frontend` API route `/api/sec/company`.
2. Frontend BFF requests backend `/api/company/{ticker}/unified/native?years=5`.
3. Backend assembles unified payload:
   - Financials and profile: `edgartools` primary source.
   - Market data: `stockdex` primary, Yahoo fallback.
   - Peers and insider data included in unified payload.
   - Cache read/write wraps expensive fetch paths.
4. Frontend normalizes and renders Overview, Financials, Revenue Build, WACC, Sensitivity, and Comps.

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm 10+

### Standard local run

```bash
npm run install:all
npm run dev
```

### Docker run

```bash
docker compose up --build
```

### Local endpoints

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Backend OpenAPI docs: `http://localhost:8000/docs`

## Environment

- Backend template: `backend/.env.example`
- Frontend template: `frontend/.env.example`
- Real `.env` files must remain local only.
- Local onboarding and recommended values: `LOCAL_SETUP.md`

## Pre-Push Safety Checks

```bash
npm run security:scan
npm run lint:frontend
npm run test:frontend
npm run build:frontend
npm run test:backend
```

Full local verification:

```bash
npm run verify
```

Browser verification:

```bash
npm run test:e2e:dcf-flow
```

## Deployment Model

Push/merge to GitHub is the source-of-truth update trigger:

- Frontend deploys from GitHub to Vercel.
- Backend can deploy from GitHub to Google Cloud Run when `.github/workflows/backend-cloud-run.yml`
  is configured with the required repo variables/secrets from `OPERATIONS.md`.

Keep production env values configured in each deployment platform, not in repository files.

## Additional Docs

- API reference: `API_DOCS.md`
- Architecture and request flow: `API_STACK_AND_FLOW.md`
- Backend service details: `backend/README.md`
- Production ops and rollback notes: `OPERATIONS.md`
- Local developer onboarding: `LOCAL_SETUP.md`
- Public/private repo split guide: `PUBLIC_REPO_GUIDE.md`

## Desktop Application
DCF Builder Pro can be run as a standalone Electron desktop app. See [docs/ELECTRON_DESKTOP.md](docs/ELECTRON_DESKTOP.md) for details.
