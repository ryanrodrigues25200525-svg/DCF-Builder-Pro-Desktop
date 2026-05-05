# DCF Builder Pro - Electron Desktop

## Overview
DCF Builder Pro can now be run as a standalone desktop application using Electron. 
The Electron app wraps the existing Next.js frontend and FastAPI backend, loading them as child processes and opening a BrowserWindow for the Next.js UI. The existing web UI, components, and design systems are intentionally preserved.

In both development and production modes, the backend binds strictly to `localhost` (127.0.0.1) for safety. 

## Prerequisites
- **Node.js** and **npm**
- **Python 3** (required for running the FastAPI backend locally, both in dev mode and production fallback mode)
- Backend dependencies (installed via `pip install -r requirements.txt`)

## Commands
* `npm run electron:dev`: Starts the app in desktop development mode. It will spawn the frontend dev server, backend dev server, wait for both to be ready, and open the Electron shell.
* `npm run build:desktop`: Builds the Next.js frontend and prepares the backend for desktop.
* `npm run build:backend:desktop`: Fallback placeholder for PyInstaller build. Currently uses the raw python files as a fallback.
* `npm run electron:pack`: Packages the app for the current platform (outputs to `dist-electron`).
* `npm run electron:dist`: Same as `electron:pack`.
* `npm run electron:build`: Runs the desktop build step, then packages the app.

*(Note: Existing web development commands like `npm run dev` and `npm run verify` continue to work unchanged)*

## Local Identity Setup
On first desktop launch, the app requires you to configure an identity (Full Name and Email address).
* The setup screen is presented before loading the main app interface.
* **This is NOT a cloud login.** No password or account is created.
* Your identity is used solely to construct the `EDGAR_IDENTITY` environment variable required by the SEC EDGAR API.
* The identity is stored securely and locally in the Electron `userData` folder (`config.json`).
* You can update your identity at any time by selecting `Settings > Identity` from the native app menu.

## Environment Variables
The following environment variables are injected dynamically by the Electron process manager:
- `EDGAR_IDENTITY`: Injected into the backend from the user's local `config.json`.
- `DCF_BACKEND_PORT`: Defaults to `8000`. Controls which port the local FastAPI server binds to.
- `CORS_ORIGINS`: Restricted to localhost and Electron schemas.
- `ALLOWED_HOSTS`: Restricted to `localhost,127.0.0.1`.
- `SEC_SERVICE_URL`: Injected into the Next.js process to ensure frontend API routes correctly contact the local backend over the chosen `DCF_BACKEND_PORT`.

## Packaging
The app is packaged using `electron-builder`.
- **Output Directory**: `dist-electron/`
- **macOS**: Target formats `dmg` and `zip`.
- **Windows**: Target formats `nsis` and `portable`.
- **Linux**: Target formats `AppImage` and `deb`.
- **Backend Fallback**: The packaged app currently includes the raw `backend` folder and relies on the user's machine having Python installed. Future iterations may include PyInstaller bundling to remove the Python dependency.

## Logs
* Electron and Process Manager logs are written to `desktop.log` in your system's Electron `userData` directory (e.g., `~/Library/Application Support/dcf-builder-root/desktop.log` on macOS).
* Standard output and standard error from both the frontend and backend processes are captured here.
* **WARNING**: Do not share this log file publicly if it contains your personal email/name used during the identity setup.

## Troubleshooting
- **Port Conflicts**: Ensure port `8000` (or `DCF_BACKEND_PORT`) and `3000` are available before launching.
- **Backend Startup Failure**: Ensure Python is installed and the backend's `.venv` is properly configured. Check the `desktop.log` file for Python tracebacks.
- **Missing or Invalid Identity**: If you manually delete the `config.json` file, the app will prompt you for your identity again.
- **SEC Request Failures**: Ensure you provided a real-sounding email address in the identity setup, as the SEC may block improperly formatted EDGAR identities.
- **Blank Screen**: Ensure the Next.js server finished compiling. `electron:dev` uses `wait-on` to wait for localhost:3000, but Next.js might still be compiling on the first load.
