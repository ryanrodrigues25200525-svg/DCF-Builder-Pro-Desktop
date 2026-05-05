#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STANDALONE_DIR="$ROOT_DIR/frontend/.next/standalone"

if [ ! -d "$STANDALONE_DIR/node_modules" ]; then
  echo "Missing Next.js standalone node_modules. Run npm run build:frontend first." >&2
  exit 1
fi

rm -rf "$STANDALONE_DIR/standalone_modules"
mkdir -p "$STANDALONE_DIR/standalone_modules"
cp -R "$STANDALONE_DIR/node_modules/." "$STANDALONE_DIR/standalone_modules/"
