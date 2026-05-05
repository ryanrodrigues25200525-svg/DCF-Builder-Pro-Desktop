#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
ADD_DATA_SEPARATOR=":"

case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*)
    PYTHON_BIN="${PYTHON_BIN:-python}"
    ADD_DATA_SEPARATOR=";"
    ;;
  *)
    PYTHON_BIN="${PYTHON_BIN:-python3}"
    ;;
esac

cd "$BACKEND_DIR"

if ! "$PYTHON_BIN" -m PyInstaller --version >/dev/null 2>&1; then
  "$PYTHON_BIN" -m pip install pyinstaller
fi

"$PYTHON_BIN" -m PyInstaller \
  --clean \
  --noconfirm \
  --name dcf-backend \
  --add-data "app/assets${ADD_DATA_SEPARATOR}app/assets" \
  --hidden-import app.main \
  --collect-submodules app \
  --collect-data edgar \
  desktop_server.py
