#!/usr/bin/env bash
# Grabs one VNC frame from the QEMU started by run-iso.sh.
# Usage: tools/console/capture.sh <name>   -> src/assets/screenshots/iso/<name>.png
set -euo pipefail
OUT=${OUT:-$(dirname "$0")/../../src/assets/screenshots/iso}
mkdir -p "$OUT"
vncdo -s 127.0.0.1::5909 capture "$OUT/$1.png"
echo "$OUT/$1.png"
