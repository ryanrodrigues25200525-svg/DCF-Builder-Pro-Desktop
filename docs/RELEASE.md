# Release Guide

## What users download

Publish installer artifacts from GitHub Releases, not generated build folders in the repository.

- macOS: `.dmg` or `.zip`
- Windows: `.exe`
- Linux: `.AppImage` or `.deb`

The packaged desktop app bundles the Next.js frontend and Python backend. End users should not need to install Node, npm, Python, pip, or project dependencies.

## Local release build

Install dependencies first:

```bash
npm install
npm install --prefix frontend
cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

Build the current platform:

```bash
npm run electron:build
```

Artifacts are written to `dist-electron/`.

## GitHub Actions release

The workflow at `.github/workflows/release.yml` builds macOS, Windows, and Linux artifacts.

Run it manually from GitHub Actions, or create a release tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Tagged builds publish artifacts to a GitHub Release automatically.

## Trust warnings

The release workflow intentionally does not use Apple notarization or Windows certificate signing.

Users may see operating-system trust warnings on first launch. On macOS, users can open the app from System Settings > Privacy & Security after the first blocked launch, or right-click the app and choose Open. On Windows, users may need to choose More info > Run anyway.

This keeps the project distributable without maintaining private signing certificates.
