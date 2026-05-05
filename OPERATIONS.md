# Operations Guide

This project is set up for a low-traffic deployment model:

- Frontend on Vercel
- Backend on Google Cloud Run
- Backend cache stored locally per Cloud Run instance

## Monitoring

Minimum production checks:

- Vercel deployment status and function errors
- Cloud Run request count, latency, and 5xx rate
- `/health`
- `/ready`
- `/api/health`

Recommended alert thresholds:

- Cloud Run 5xx ratio above `2%` for 5 minutes
- P95 latency above `8s` for 5 minutes
- Consecutive deployment failures on either platform

## Error Correlation

Backend responses now include:

- `X-Request-ID`
- `X-Response-Time-Ms`

Use the request id to correlate user-reported failures with Cloud Run logs.

## Rate Limiting

The backend applies a conservative in-memory rate limit to `/api/*` paths.

Default settings:

- `RATE_LIMIT_ENABLED=true`
- `RATE_LIMIT_REQUESTS=120`
- `RATE_LIMIT_WINDOW_SECONDS=60`

This is instance-local and intended as a low-complexity abuse guard, not a distributed gateway.

## Secrets

Do not store secrets in repo files.

Use:

- Vercel project environment variables for frontend/BFF values
- Cloud Run service environment variables or Secret Manager references for backend values

Minimum backend secrets/config:

- `EDGAR_IDENTITY`
- `CORS_ORIGINS`
- `ALLOWED_HOSTS`

## GitHub -> Cloud Run Deploy

The backend can be deployed automatically from GitHub Actions using:

- `.github/workflows/backend-cloud-run.yml`

Set these GitHub repository variables:

- `GCP_PROJECT_ID`
- `CLOUD_RUN_SERVICE`
- `CLOUD_RUN_REGION`

Set this GitHub repository secret:

- `GCP_SA_KEY`

`GCP_SA_KEY` should be the full JSON key for a service account with permissions to:

- build from source with Cloud Build
- push container artifacts
- deploy/update the target Cloud Run service

After those values are configured, pushes to `main` that touch `dcf-builder/backend/**` will deploy a new Cloud Run revision automatically.

## Backup / Recovery

The SQLite cache is disposable. It is not a source of truth.

Recovery model:

- GitHub is the source of truth for code
- Vercel and Cloud Run can be redeployed from GitHub
- External providers are the source of truth for data

If the backend cache is lost:

- restart service
- allow cache to warm naturally
- verify `/ready` and `/api/health`

## Rollback

Rollback path:

1. Revert or redeploy the previous GitHub commit.
2. Promote the previous Vercel deployment if frontend-only.
3. Redeploy the previous Cloud Run revision if backend-only.
4. Re-run:
   - `npm run verify`
   - `npm run test:e2e:dcf-flow`

## Release Checks

Run before deploy:

```bash
npm run verify
npm run test:e2e:dcf-flow
```
