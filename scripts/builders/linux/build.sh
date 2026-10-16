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

# v86 restores a zstd frame in place. Prefer a zstd already on PATH (macOS
# Homebrew or Linux packages). Otherwise compile the pinned 1.5.7 source
# with the host cc. The CLI is a build tool; the browser uses v86's own zstd.
ensure_zstd() {
  if command -v zstd >/dev/null 2>&1; then
    ZSTD_BIN="$(command -v zstd)"
    return 0
  fi
  local bin="$CACHE/zstd" url="" sha="" tar="" src="" jobs=""
  if [[ -x "$bin" ]]; then
    ZSTD_BIN="$bin"
    return 0
  fi
  if ! command -v cc >/dev/null 2>&1 || ! command -v make >/dev/null 2>&1; then
    printf '✗ zstd is not installed, and cc/make are missing. Install zstd, or install a C compiler so %s can build it.\n' "$0" >&2
    return 1
  fi
  url="$(lock_get "$LOCK" linux.zstd.url)"
  sha="$(lock_get "$LOCK" linux.zstd.sha256)"
  tar="$CACHE/zstd-1.5.7.tar.gz"
  download_verified "$url" "$sha" "$tar"
  src="$CACHE/zstd-src"
  rm -rf "$src"
  mkdir -p "$src"
  tar -xzf "$tar" -C "$src" --strip-components=1
  jobs="$(getconf _NPROCESSORS_ONLN 2>/dev/null || echo 2)"
  make -C "$src" -j"$jobs" zstd
  cp "$src/programs/zstd" "$bin"
  chmod +x "$bin"
  rm -rf "$src"
  ZSTD_BIN="$bin"
}

ensure_zstd
LEVEL="$(lock_get "$LOCK" linux.zstd.level)"

printf '%s' \
  "$(lock_get "$LOCK" linux.v86Wasm.sha256)|$(lock_get "$LOCK" linux.lib.sha256)|$(lock_get "$LOCK" linux.seabios.sha256)|$(lock_get "$LOCK" linux.vgabios.sha256)|$(lock_get "$LOCK" linux.bzimage.sha256)|zstd-$LEVEL" \
  > "$CACHE/inputs.txt"
STAMP="$(sha256_file "$CACHE/inputs.txt")"
STATE="$DIR/linux-state.zst"
# The raw snapshot used to live beside this file and would be copied into dist/.
rm -f "$DIR/linux-state.bin"
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
  --zstd "$ZSTD_BIN" \
  --level "$LEVEL" \
  --out "$STATE"

printf '%s\n' "$STAMP" > "$CACHE/state.stamp"
