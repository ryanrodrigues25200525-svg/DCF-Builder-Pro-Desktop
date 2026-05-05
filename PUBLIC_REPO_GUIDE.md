# Public Repo Guide

This project can be split into:

- a **private repo** for active development, deployment history, internal docs, and operational material
- a **public repo** for portfolio/demo/open-source sharing

## Recommended Model

Keep the current repository private as the source of truth.

Create a second public repository that contains a sanitized copy of `dcf-builder/`.

That gives you:

- cleaner public history
- less risk of leaking infra details
- freedom to keep internal notes and experiments private

## What Should Stay Private

Do not publish these files to the public repo:

- `OPERATIONS.md`
- `PROJECT_MAP.md`
- `backend/.env`
- `frontend/.env.local`
- `node_modules/`
- `.pytest_cache/`
- local cache/database files under backend runtime data
- any future internal runbooks, deployment notes, or customer-specific docs

Keep private if you want to avoid exposing operational assumptions:

- exact Cloud Run / Vercel deployment notes
- provider-specific hostnames
- internal roadmap or business positioning docs

## What Can Go Public

These are safe to publish after review:

- app source code
- tests
- sample env files
- Docker files
- public-facing README/docs
- local setup docs
- CI workflow

## Files to Review Before Public Push

Review these carefully each time:

- `README.md`
- `LOCAL_SETUP.md`
- `API_DOCS.md`
- `API_STACK_AND_FLOW.md`
- `backend/.env.example`
- `frontend/.env.example`
- `docker-compose.yml`
- `start.sh`

They currently use placeholder identities and example hostnames, which is fine, but keep them generic.

## Suggested Public Repo Shape

Keep in the public repo:

- `README.md`
- `LOCAL_SETUP.md`
- `API_DOCS.md`
- `API_STACK_AND_FLOW.md`
- `backend/`
- `frontend/`
- `scripts/security_scan.sh`
- `.github/workflows/dcf-builder-ci.yml`
- `docker-compose.yml`
- `package.json`

Exclude from the public repo:

- `OPERATIONS.md`
- `PROJECT_MAP.md`
- local env files
- generated output and caches

## Public Repo Checklist

Before publishing:

1. Confirm there are no committed real secrets in git history.
2. Rotate any secret that may ever have been committed, even if deleted later.
3. Remove internal-only docs from the export.
4. Verify `.env.example` files contain placeholders only.
5. Run:
   - `npm run verify`
   - `npm run test:e2e:dcf-flow`
6. Read the exported README as if you were a stranger cloning the repo for the first time.

## Notes on Secrets

Placeholder values like:

- `your@email.com`
- `your-cloud-run-service.run.app`
- `security@example.com`

are fine for a public repo.

Real secrets are not just env files. Also check:

- old commits
- shell scripts
- CI configs
- copied logs
- screenshots

## Recommended Workflow

Use the private repo for development.

When you want to refresh the public repo:

1. Export a sanitized copy.
2. Review the exported files.
3. Commit that sanitized copy to the public repository.

Use the helper script:

```bash
bash scripts/prepare_public_repo.sh /absolute/path/to/public-repo
```
