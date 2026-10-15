#!/usr/bin/env bash
# Build the Yaegi interpreter as a WASI preview1 command (GOOS=wasip1).
# The Go toolchain is the pinned tarball for this OS/CPU, never the host's go.
# bash 3.2 / macOS userland.
set -euo pipefail
# shellcheck source=SCRIPTDIR/../common.sh
source "$(dirname "$0")/../common.sh"

mode="build"
case "${1:-}" in
  --compile|--inspect)
    mode="${1#--}"
    shift
    ;;
esac

ROOT="$(builders_root)"
LOCK="$ROOT/scripts/sources.lock.json"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
CACHE="$ROOT/thirdparty/cache"
OUT=""
if [[ "$mode" != "inspect" ]]; then
  if [[ -z "${1:-}" ]]; then
    printf 'usage: %s [--compile|--inspect] <output.wasm>\n' "$0" >&2
    exit 2
  fi
  OUT="$1"
  mkdir -p "$(dirname "$OUT")"
  OUT="$(cd "$(dirname "$OUT")" && pwd -P)/$(basename "$OUT")"
fi

EXPECT="$(lock_get "$LOCK" go.outputSha256)"
set +e
HOST="$(host_key)"
host_status=$?
set -e

prepare_go() {
  local ver="" url="" sha="" tgz="" stage=""
  printf 'toolchain host %s\n' "$HOST"
  mkdir -p "$CACHE" || return 1
  ver="$(lock_get "$LOCK" go.version)" || return 1
  url="$(lock_get "$LOCK" "toolchains.$HOST.go.url")" || return 1
  sha="$(lock_get "$LOCK" "toolchains.$HOST.go.sha256")" || return 1
  tgz="$CACHE/$(basename "$url")"
  download_verified "$url" "$sha" "$tgz" || return 1
  if [[ -z "$ver" || -z "$HOST" ]]; then
    printf '✗ bad Go toolchain path\n' >&2
    return 1
  fi
  GOROOT="$CACHE/go${ver}-${HOST}"
  require_under_cache "$GOROOT" "$CACHE" || return 1
  if [[ ! -x "$GOROOT/bin/go" ]]; then
    rm -rf "$GOROOT"
    stage="$CACHE/tmp-go-${HOST}"
    require_under_cache "$stage" "$CACHE" || return 1
    rm -rf "$stage"
    mkdir -p "$stage" || return 1
    extract_tar "$tgz" "$stage" || return 1
    if [[ ! -d "$stage/go" ]]; then
      printf '✗ %s did not contain a go/ directory\n' "$tgz" >&2
      return 1
    fi
    mv "$stage/go" "$GOROOT" || return 1
    rm -rf "$stage"
  fi
  if [[ ! -x "$GOROOT/bin/go" ]]; then
    printf '✗ missing %s after extracting %s\n' "$GOROOT/bin/go" "$tgz" >&2
    return 1
  fi
}

compile_go() {
  if [[ "${SIMPLECODE_BUILDER_FORCE_FAIL:-}" == "1" ]]; then
    printf '✗ forced build failure\n' >&2
    return 1
  fi
  prepare_go || return 1
  if ! "$GOROOT/bin/go" version >/dev/null 2>&1; then
    printf '✗ %s does not run on this machine\n' "$GOROOT/bin/go" >&2
    return 1
  fi
  export GOROOT
  export PATH="$GOROOT/bin:$PATH"
  export GO111MODULE=on
  export GOPROXY="${GOPROXY:-https://proxy.golang.org,direct}"
  export GOSUMDB="${GOSUMDB:-sum.golang.org}"
  export GOMODCACHE="$CACHE/gomod"
  export GOCACHE="$CACHE/gocache-${HOST}"
  export CGO_ENABLED=0
  export GOOS=wasip1
  export GOARCH=wasm
  export GOTOOLCHAIN=local
  unset GOFLAGS GOROOT_FINAL GOENV
  mkdir -p "$GOMODCACHE" "$GOCACHE" || return 1
  (
    cd "$SCRIPT_DIR" || exit 1
    "$GOROOT/bin/go" build -mod=readonly -buildvcs=false -trimpath -ldflags="-s -w -buildid=" -o "$OUT" .
  ) || return 1
}

if [[ "$mode" == "compile" ]]; then
  if [[ "$host_status" -ne 0 ]]; then
    exit 1
  fi
  compile_go || exit 1
  exit 0
fi

if [[ "$mode" == "inspect" ]]; then
  if [[ "$host_status" -ne 0 ]]; then
    exit 1
  fi
  prepare_go || exit 1
  printf 'host=%s\n' "$HOST"
  expect_host_binary "$GOROOT/bin/go" "$HOST" || exit 1
  exit 0
fi

HOST_EXPECT=""
if [[ "$host_status" -eq 0 ]]; then
  HOST_EXPECT="$(lock_get_optional "$LOCK" "go.outputSha256ByHost.$HOST")" || exit 1
fi
if skip_if_current "$OUT" "$EXPECT" "$HOST_EXPECT"; then
  exit 0
fi

PRE_URL="$(resolve_prebuilt "${SIMPLECODE_GO_PREBUILT_URL:-}" "$LOCK" go.prebuiltUrl)" || exit 1
if [[ "$host_status" -ne 0 ]]; then
  printf '✗ go cannot be built on this OS/CPU; trying prebuilt wasm\n' >&2
  install_prebuilt "$PRE_URL" "$EXPECT" "$OUT" || exit 1
  exit 0
fi
build_or_prebuilt "$0" "$OUT" "$PRE_URL" "$EXPECT" "go" || exit 1
verify_output "$OUT" "$EXPECT" "$HOST_EXPECT" || exit 1
