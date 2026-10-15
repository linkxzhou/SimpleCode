#!/usr/bin/env bash
# Build Lua 5.4 as a WASI preview1 command with working pcall/error.
# setjmp/longjmp is lowered to the standard Wasm exception-handling proposal
# (wasi-sdk >= 26, -wasm-use-legacy-eh=false) and linked with -lsetjmp.
set -euo pipefail
# shellcheck source=../common.sh
source "$(dirname "$0")/../common.sh"

OUT="${1:?usage: build.sh <output.wasm>}"
mkdir -p "$(dirname "$OUT")"
OUT="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"
ROOT="$(builders_root)"
LOCK="$ROOT/scripts/sources.lock.json"
require_linux_x64

EXPECT="$(lock_get "$LOCK" lua.outputSha256)"
skip_if_current "$OUT" "$EXPECT"

CACHE="$ROOT/thirdparty/cache"
mkdir -p "$CACHE"

SDK_VER="$(lock_get "$LOCK" wasiSdk.version)"
SDK_TGZ="$CACHE/wasi-sdk-${SDK_VER}-x86_64-linux.tar.gz"
download_verified "$(lock_get "$LOCK" wasiSdk.url)" "$(lock_get "$LOCK" wasiSdk.sha256)" "$SDK_TGZ"
SDK="$CACHE/wasi-sdk-${SDK_VER}-x86_64-linux"
if [[ ! -x "$SDK/bin/clang" ]]; then
  tar -xzf "$SDK_TGZ" -C "$CACHE"
fi

LUA_VER="$(lock_get "$LOCK" lua.version)"
LUA_TGZ="$CACHE/lua-${LUA_VER}.tar.gz"
download_verified "$(lock_get "$LOCK" lua.url)" "$(lock_get "$LOCK" lua.sha256)" "$LUA_TGZ"
SRC="$CACHE/lua-${LUA_VER}"
if [[ ! -f "$SRC/src/Makefile" ]]; then
  tar -xzf "$LUA_TGZ" -C "$CACHE"
fi

cp "$(dirname "$0")/wasi_stubs.c" "$SRC/src/wasi_stubs.c"
HEADER="$(cd "$(dirname "$0")" && pwd)/wasi-lua.h"

export PATH="$SDK/bin:$PATH"
make -C "$SRC/src" clean >/dev/null
make -C "$SRC/src" -j"$(nproc)" lua \
  CC="clang --target=wasm32-wasip1" \
  AR="llvm-ar rcu" \
  RANLIB="llvm-ranlib" \
  MYCFLAGS="-mllvm -wasm-enable-sjlj -mllvm -wasm-use-legacy-eh=false -D_WASI_EMULATED_SIGNAL -D_WASI_EMULATED_PROCESS_CLOCKS -Wno-deprecated-declarations -include $HEADER" \
  MYLDFLAGS="-Wl,-z,stack-size=1048576" \
  MYLIBS="-lsetjmp -lwasi-emulated-signal -lwasi-emulated-process-clocks" \
  MYOBJS="wasi_stubs.o"

mkdir -p "$(dirname "$OUT")"
cp "$SRC/src/lua" "$OUT"
verify_output "$OUT" "$EXPECT"
