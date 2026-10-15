#!/usr/bin/env bash
# Build wasi-sh, a single-process WASI preview1 shell (MIT, source in this directory).
# bash 3.2 / macOS userland. Toolchain picked from sources.lock.json via uname.
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

EXPECT="$(lock_get "$LOCK" shell.outputSha256)"
set +e
HOST="$(host_key)"
host_status=$?
set -e

prepare_sdk() {
  local url="" sha="" dir="" tgz=""
  printf 'toolchain host %s\n' "$HOST"
  mkdir -p "$CACHE" || return 1
  url="$(lock_get "$LOCK" "toolchains.$HOST.wasiSdk.url")" || return 1
  sha="$(lock_get "$LOCK" "toolchains.$HOST.wasiSdk.sha256")" || return 1
  dir="$(lock_get "$LOCK" "toolchains.$HOST.wasiSdk.dirname")" || return 1
  tgz="$CACHE/$(basename "$url")"
  download_verified "$url" "$sha" "$tgz" || return 1
  if [[ -z "$dir" || "$dir" == "." || "$dir" == ".." ]]; then
    printf '✗ bad wasi-sdk dirname\n' >&2
    return 1
  fi
  SDK="$CACHE/$dir"
  require_under_cache "$SDK" "$CACHE" || return 1
  if [[ ! -x "$SDK/bin/clang" ]]; then
    rm -rf "$SDK"
    extract_tar "$tgz" "$CACHE" || return 1
  fi
  if [[ ! -x "$SDK/bin/clang" ]]; then
    printf '✗ missing %s after extracting %s\n' "$SDK/bin/clang" "$tgz" >&2
    return 1
  fi
}

compile_shell() {
  local work=""
  if [[ "${SIMPLECODE_BUILDER_FORCE_FAIL:-}" == "1" ]]; then
    printf '✗ forced build failure\n' >&2
    return 1
  fi
  prepare_sdk || return 1
  if ! "$SDK/bin/clang" --version >/dev/null 2>&1; then
    printf '✗ %s does not run on this machine\n' "$SDK/bin/clang" >&2
    return 1
  fi
  # Compile a copy named wasi-sh.c so the checkout path is not baked in.
  work="$(mktemp -d "${TMPDIR:-/tmp}/wasi-sh.XXXXXX")" || return 1
  cp -f "$SCRIPT_DIR/wasi-sh.c" "$work/wasi-sh.c" || return 1
  unset SDKROOT MACOSX_DEPLOYMENT_TARGET CPATH C_INCLUDE_PATH CPLUS_INCLUDE_PATH LIBRARY_PATH CCC_OVERRIDE_OPTIONS
  (
    cd "$work" || exit 1
    "$SDK/bin/clang" --target=wasm32-wasip1 -O2 -Wall -Wextra -Werror \
      -fno-ident -fno-asynchronous-unwind-tables -Wl,--strip-all \
      -o "$OUT" wasi-sh.c
  ) || {
    rm -rf "$work"
    return 1
  }
  rm -rf "$work"
}

if [[ "$mode" == "compile" ]]; then
  if [[ "$host_status" -ne 0 ]]; then
    exit 1
  fi
  compile_shell || exit 1
  exit 0
fi

if [[ "$mode" == "inspect" ]]; then
  if [[ "$host_status" -ne 0 ]]; then
    exit 1
  fi
  prepare_sdk || exit 1
  printf 'host=%s\n' "$HOST"
  expect_host_binary "$SDK/bin/clang" "$HOST" || exit 1
  exit 0
fi

HOST_EXPECT=""
if [[ "$host_status" -eq 0 ]]; then
  HOST_EXPECT="$(lock_get_optional "$LOCK" "shell.outputSha256ByHost.$HOST")" || exit 1
fi
if skip_if_current "$OUT" "$EXPECT" "$HOST_EXPECT"; then
  exit 0
fi

PRE_URL="$(resolve_prebuilt "${SIMPLECODE_SHELL_PREBUILT_URL:-}" "$LOCK" shell.prebuiltUrl)" || exit 1
if [[ "$host_status" -ne 0 ]]; then
  printf '✗ shell cannot be built on this OS/CPU; trying prebuilt wasm\n' >&2
  install_prebuilt "$PRE_URL" "$EXPECT" "$OUT" || exit 1
  exit 0
fi
build_or_prebuilt "$0" "$OUT" "$PRE_URL" "$EXPECT" "shell" || exit 1
verify_output "$OUT" "$EXPECT" "$HOST_EXPECT" || exit 1
