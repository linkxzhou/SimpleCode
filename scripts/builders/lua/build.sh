#!/usr/bin/env bash
# Build Lua 5.4 as a WASI preview1 command with working pcall/error.
# setjmp/longjmp is lowered to the standard Wasm exception-handling proposal
# (wasi-sdk >= 26, -wasm-use-legacy-eh=false) and linked with -lsetjmp.
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

EXPECT="$(lock_get "$LOCK" lua.outputSha256)"
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

prepare_lua_tree() {
  local ver="" url="" sha="" tgz=""
  ver="$(lock_get "$LOCK" lua.version)" || return 1
  url="$(lock_get "$LOCK" lua.url)" || return 1
  sha="$(lock_get "$LOCK" lua.sha256)" || return 1
  tgz="$CACHE/lua-${ver}.tar.gz"
  download_verified "$url" "$sha" "$tgz" || return 1
  SRC="$CACHE/lua-${ver}"
  if [[ ! -f "$SRC/src/Makefile" ]]; then
    extract_tar "$tgz" "$CACHE" || return 1
  fi
  cp -f "$SCRIPT_DIR/wasi_stubs.c" "$SRC/src/wasi_stubs.c" || return 1
  # Relative -include so the host checkout path is not baked into the wasm.
  cp -f "$SCRIPT_DIR/wasi-lua.h" "$SRC/src/wasi-lua.h" || return 1
}

compile_lua() {
  local jobs=""
  if [[ "${SIMPLECODE_BUILDER_FORCE_FAIL:-}" == "1" ]]; then
    printf '✗ forced build failure\n' >&2
    return 1
  fi
  prepare_sdk || return 1
  prepare_lua_tree || return 1
  if ! "$SDK/bin/clang" --version >/dev/null 2>&1; then
    printf '✗ %s does not run on this machine\n' "$SDK/bin/clang" >&2
    return 1
  fi
  if ! command -v make >/dev/null 2>&1; then
    printf '✗ make is required (on macOS: xcode-select --install)\n' >&2
    return 1
  fi
  jobs="$(job_count)" || return 1
  # Xcode exports SDKROOT; wasi-sdk clang would then search the macOS SDK.
  unset SDKROOT MACOSX_DEPLOYMENT_TARGET CPATH C_INCLUDE_PATH CPLUS_INCLUDE_PATH LIBRARY_PATH CCC_OVERRIDE_OPTIONS MAKEFLAGS
  PATH="$SDK/bin:$PATH" make -C "$SRC/src" clean >/dev/null || return 1
  PATH="$SDK/bin:$PATH" make -C "$SRC/src" -j"$jobs" lua \
    CC="clang --target=wasm32-wasip1" \
    AR="llvm-ar rcu" \
    RANLIB="llvm-ranlib" \
    MYCFLAGS="-mllvm -wasm-enable-sjlj -mllvm -wasm-use-legacy-eh=false -D_WASI_EMULATED_SIGNAL -D_WASI_EMULATED_PROCESS_CLOCKS -Wno-deprecated-declarations -include wasi-lua.h" \
    MYLDFLAGS="-Wl,-z,stack-size=1048576" \
    MYLIBS="-lsetjmp -lwasi-emulated-signal -lwasi-emulated-process-clocks" \
    MYOBJS="wasi_stubs.o" || return 1
  cp -f "$SRC/src/lua" "$OUT" || return 1
}

if [[ "$mode" == "compile" ]]; then
  if [[ "$host_status" -ne 0 ]]; then
    exit 1
  fi
  compile_lua || exit 1
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
  HOST_EXPECT="$(lock_get_optional "$LOCK" "lua.outputSha256ByHost.$HOST")" || exit 1
fi
if skip_if_current "$OUT" "$EXPECT" "$HOST_EXPECT"; then
  exit 0
fi

PRE_URL="$(resolve_prebuilt "${SIMPLECODE_LUA_PREBUILT_URL:-}" "$LOCK" lua.prebuiltUrl)" || exit 1
if [[ "$host_status" -ne 0 ]]; then
  printf '✗ lua cannot be built on this OS/CPU; trying prebuilt wasm\n' >&2
  install_prebuilt "$PRE_URL" "$EXPECT" "$OUT" || exit 1
  exit 0
fi
build_or_prebuilt "$0" "$OUT" "$PRE_URL" "$EXPECT" "lua" || exit 1
verify_output "$OUT" "$EXPECT" "$HOST_EXPECT" || exit 1
