#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/build"
ICONSET_DIR="$BUILD_DIR/icon.iconset"
TMP_DIR="$BUILD_DIR/.icon-tmp"

mkdir -p "$BUILD_DIR" "$TMP_DIR"
rm -rf "$ICONSET_DIR"

qlmanage -t -s 1024 -o "$TMP_DIR" "$BUILD_DIR/icon.svg" >/dev/null 2>&1
mv "$TMP_DIR/icon.svg.png" "$BUILD_DIR/icon.png"

mkdir -p "$ICONSET_DIR"
for size in 16 32 128 256 512; do
  sips -z "$size" "$size" "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_${size}x${size}.png" >/dev/null
  double=$((size * 2))
  sips -z "$double" "$double" "$BUILD_DIR/icon.png" --out "$ICONSET_DIR/icon_${size}x${size}@2x.png" >/dev/null
done

iconutil -c icns "$ICONSET_DIR" -o "$BUILD_DIR/icon.icns"

python3 - "$BUILD_DIR/icon.png" "$BUILD_DIR/icon.ico" <<'PY'
import struct
import sys
from pathlib import Path

png_path = Path(sys.argv[1])
ico_path = Path(sys.argv[2])
png = png_path.read_bytes()

header = struct.pack("<HHH", 0, 1, 1)
directory = struct.pack("<BBBBHHII", 0, 0, 0, 0, 1, 32, len(png), 6 + 16)
ico_path.write_bytes(header + directory + png)
PY

rm -rf "$ICONSET_DIR" "$TMP_DIR"
