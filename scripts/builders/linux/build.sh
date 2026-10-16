#!/usr/bin/env bash
# Vendor the in-browser Linux guest.
# bash 3.2 / macOS userland. Same bytes on Linux and macOS: pinned downloads,
# then a Node snapshot. Buildroot is not compiled here (see rebuild.sh).
set -euo pipefail
# shellcheck source=SCRIPTDIR/../common.sh
source "$(dirname "$0")/../common.sh"

if [[ -z "${1:-}" ]]; then
  printf 'usage: %s <output-file-inside-wasm>\n' "$0" >&2
  exit 2
fi

ROOT="$(builders_root)"
LOCK="$ROOT/scripts/sources.lock.json"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
DIR="$(cd "$(dirname "$1")" && pwd -P)"
CACHE="$ROOT/thirdparty/cache/linux"
mkdir -p "$CACHE" "$DIR"

fetch() {
  local key="$1" name="$2" url="" sha="" dest=""
  url="$(lock_get "$LOCK" "linux.$key.url")"
  sha="$(lock_get "$LOCK" "linux.$key.sha256")"
  dest="$CACHE/$name"
  download_verified "$url" "$sha" "$dest"
  cp -f "$dest" "$DIR/$name"
}

fetch v86Wasm v86.wasm
fetch lib libv86.mjs
fetch seabios seabios.bin
fetch vgabios vgabios.bin
fetch bzimage linux-bzimage.bin

printf '%s' \
  "$(lock_get "$LOCK" linux.v86Wasm.sha256)|$(lock_get "$LOCK" linux.lib.sha256)|$(lock_get "$LOCK" linux.seabios.sha256)|$(lock_get "$LOCK" linux.vgabios.sha256)|$(lock_get "$LOCK" linux.bzimage.sha256)" \
  > "$CACHE/inputs.txt"
STAMP="$(sha256_file "$CACHE/inputs.txt")"
STATE="$DIR/linux-state.bin"
if [[ -f "$CACHE/state.stamp" && "$(cat "$CACHE/state.stamp")" == "$STAMP" && -s "$STATE" ]]; then
  printf 'linux snapshot unchanged (%s)\n' "${STAMP:0:12}"
  exit 0
fi

node "$SCRIPT_DIR/snapshot.mjs" \
  --lib "$DIR/libv86.mjs" \
  --wasm "$DIR/v86.wasm" \
  --bios "$DIR/seabios.bin" \
  --vga "$DIR/vgabios.bin" \
  --bzimage "$DIR/linux-bzimage.bin" \
  --out "$STATE"

printf '%s\n' "$STAMP" > "$CACHE/state.stamp"
