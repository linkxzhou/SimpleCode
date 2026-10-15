#!/usr/bin/env bash
# Build the Yaegi interpreter as a WASI preview1 command (GOOS=wasip1).
# The Go toolchain is downloaded and checksum-pinned; the host's Go is not used.
set -euo pipefail
# shellcheck source=../common.sh
source "$(dirname "$0")/../common.sh"

OUT="${1:?usage: build.sh <output.wasm>}"
mkdir -p "$(dirname "$OUT")"
OUT="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"
ROOT="$(builders_root)"
LOCK="$ROOT/scripts/sources.lock.json"
require_linux_x64

EXPECT="$(lock_get "$LOCK" go.outputSha256)"
skip_if_current "$OUT" "$EXPECT"

CACHE="$ROOT/thirdparty/cache"
mkdir -p "$CACHE"
GO_VER="$(lock_get "$LOCK" go.version)"
GO_TGZ="$CACHE/go${GO_VER}.linux-amd64.tar.gz"
download_verified "$(lock_get "$LOCK" go.url)" "$(lock_get "$LOCK" go.sha256)" "$GO_TGZ"
GOROOT="$CACHE/go${GO_VER}"
if [[ ! -x "$GOROOT/bin/go" ]]; then
  rm -rf "$GOROOT" "$CACHE/go"
  tar -xzf "$GO_TGZ" -C "$CACHE"
  mv "$CACHE/go" "$GOROOT"
fi

export GOROOT
export PATH="$GOROOT/bin:$PATH"
export GO111MODULE=on
export GOPROXY="${GOPROXY:-https://proxy.golang.org,direct}"
export GOSUMDB="${GOSUMDB:-sum.golang.org}"
export GOMODCACHE="$CACHE/gomod"
export GOCACHE="$CACHE/gocache"
export CGO_ENABLED=0
export GOOS=wasip1
export GOARCH=wasm
unset GOFLAGS

mkdir -p "$(dirname "$OUT")"
(
  cd "$(dirname "$0")"
  go build -mod=readonly -buildvcs=false -trimpath -ldflags="-s -w -buildid=" -o "$OUT" .
)
verify_output "$OUT" "$EXPECT"
