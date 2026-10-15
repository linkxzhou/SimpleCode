#!/usr/bin/env bash
# Offline checks for host selection, checksum tools, and the prebuilt fallback.
# Network extract of every toolchain: SIMPLECODE_INSPECT_TOOLCHAINS=1
# bash 3.2 compatible.
set -euo pipefail
# shellcheck source=SCRIPTDIR/common.sh
source "$(dirname "$0")/common.sh"

ROOT="$(builders_root)"
LOCK="$ROOT/scripts/sources.lock.json"
fail() {
  printf '✗ %s\n' "$1" >&2
  exit 1
}

bash -n "$BUILDERS_DIR/common.sh"
bash -n "$BUILDERS_DIR/lua/build.sh"
bash -n "$BUILDERS_DIR/go/build.sh"
bash -n "$BUILDERS_DIR/self-check.sh"

# Reject syntax macOS bash 3.2 does not have. Fixed strings, not a bash-4 regex.
reject_bash4() {
  local file="$1" token
  for token in "declare -A" "mapfile" "readarray" "coproc" "&>>"; do
    if grep -nF "$token" "$file"; then
      fail "bash 4 token in $file"
    fi
  done
  if grep -nE '\$\{[A-Za-z_][A-Za-z0-9_]*,,' "$file"; then
    fail "bash 4 case-modification in $file"
  fi
}
reject_bash4 "$BUILDERS_DIR/common.sh"
reject_bash4 "$BUILDERS_DIR/lua/build.sh"
reject_bash4 "$BUILDERS_DIR/go/build.sh"

expect_host() {
  local os="$1" arch="$2" want="$3" got=""
  got="$(SIMPLECODE_UNAME_S="$os" SIMPLECODE_UNAME_M="$arch" host_key)" || fail "host_key $os $arch"
  if [[ "$got" != "$want" ]]; then
    fail "host_key $os $arch -> $got, want $want"
  fi
}
expect_host Linux x86_64 linux-x86_64
expect_host Linux aarch64 linux-arm64
expect_host Linux arm64 linux-arm64
expect_host Darwin arm64 darwin-arm64
expect_host Darwin x86_64 darwin-x86_64
expect_host Darwin amd64 darwin-x86_64
if SIMPLECODE_UNAME_S=FreeBSD SIMPLECODE_UNAME_M=amd64 host_key >/dev/null 2>&1; then
  fail "FreeBSD should be rejected"
fi
if SIMPLECODE_UNAME_S=Linux SIMPLECODE_UNAME_M=i686 host_key >/dev/null 2>&1; then
  fail "i686 should be rejected"
fi

check_sha() {
  local sha="$1" label="$2"
  if [[ "${#sha}" -ne 64 ]]; then
    fail "$label sha length ${#sha}"
  fi
  case "$sha" in
    *[!0-9a-f]*) fail "$label sha is not hex" ;;
  esac
}

check_tool() {
  local host="$1" tool="$2" needle="$3" url="" sha=""
  url="$(lock_get "$LOCK" "toolchains.$host.$tool.url")" || fail "missing url $host $tool"
  sha="$(lock_get "$LOCK" "toolchains.$host.$tool.sha256")" || fail "missing sha $host $tool"
  case "$url" in
    *"$needle"*) ;;
    *) fail "$host $tool url $url does not contain $needle" ;;
  esac
  check_sha "$sha" "$host $tool"
}
check_tool linux-x86_64 wasiSdk "wasi-sdk-33.0-x86_64-linux.tar.gz"
check_tool linux-arm64 wasiSdk "wasi-sdk-33.0-arm64-linux.tar.gz"
check_tool darwin-arm64 wasiSdk "wasi-sdk-33.0-arm64-macos.tar.gz"
check_tool darwin-x86_64 wasiSdk "wasi-sdk-33.0-x86_64-macos.tar.gz"
check_tool linux-x86_64 go "go1.22.12.linux-amd64.tar.gz"
check_tool linux-arm64 go "go1.22.12.linux-arm64.tar.gz"
check_tool darwin-arm64 go "go1.22.12.darwin-arm64.tar.gz"
check_tool darwin-x86_64 go "go1.22.12.darwin-amd64.tar.gz"

dir="$(lock_get "$LOCK" toolchains.darwin-arm64.wasiSdk.dirname)"
if [[ "$dir" != "wasi-sdk-33.0-arm64-macos" ]]; then
  fail "darwin-arm64 dirname $dir"
fi
check_sha "$(lock_get "$LOCK" lua.outputSha256)" "lua output"
check_sha "$(lock_get "$LOCK" go.outputSha256)" "go output"
if [[ -z "$(lock_get "$LOCK" lua.prebuiltUrl)" || -z "$(lock_get "$LOCK" go.prebuiltUrl)" ]]; then
  fail "prebuilt URLs must be set"
fi

jobs="$(job_count)"
case "$jobs" in
  ""|*[!0-9]*) fail "job_count=$jobs" ;;
esac

tmp="$(mktemp -d "${TMPDIR:-/tmp}/simplecode-builders.XXXXXX")"
trap 'rm -rf "$tmp"' EXIT
printf 'abc' >"$tmp/abc"
abc_sha="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
got="$(sha256_file "$tmp/abc")"
if [[ "$got" != "$abc_sha" ]]; then
  fail "sha256sum got $got"
fi
got="$(SIMPLECODE_SHA256_TOOL=shasum sha256_file "$tmp/abc")"
if [[ "$got" != "$abc_sha" ]]; then
  fail "shasum got $got"
fi
if SIMPLECODE_SHA256_TOOL=nope sha256_file "$tmp/abc" >/dev/null 2>&1; then
  fail "unknown sha tool should fail"
fi

download_verified "file://$tmp/abc" "$abc_sha" "$tmp/abc-copy"
if [[ "$(cat "$tmp/abc-copy")" != "abc" ]]; then
  fail "download_verified did not copy"
fi
if download_verified "file://$tmp/abc" "0000000000000000000000000000000000000000000000000000000000000000" "$tmp/abc-bad"; then
  fail "bad checksum should fail"
fi
if [[ -e "$tmp/abc-bad" || -e "$tmp/abc-bad.partial" ]]; then
  fail "bad download left a file"
fi

mkdir -p "$tmp/src"
printf 'hi' >"$tmp/src/hi"
tar -czf "$tmp/a.tgz" -C "$tmp" src
extract_tar "$tmp/a.tgz" "$tmp/extracted"
if [[ "$(cat "$tmp/extracted/src/hi")" != "hi" ]]; then
  fail "extract_tar"
fi

printf 'nope' >"$tmp/wasm"
set +e
SIMPLECODE_UNAME_S=Darwin SIMPLECODE_UNAME_M=arm64 \
  verify_output "$tmp/wasm" "deadbeef" "" >"$tmp/warn.out" 2>"$tmp/warn.err"
warn_status=$?
SIMPLECODE_UNAME_S=Linux SIMPLECODE_UNAME_M=x86_64 \
  verify_output "$tmp/wasm" "deadbeef" "cafebabe" >"$tmp/fail.out" 2>"$tmp/fail.err"
fail_status=$?
SIMPLECODE_STRICT_WASM_DIGEST=1 SIMPLECODE_UNAME_S=Darwin SIMPLECODE_UNAME_M=arm64 \
  verify_output "$tmp/wasm" "deadbeef" "" >"$tmp/strict.out" 2>"$tmp/strict.err"
strict_status=$?
set -e
if [[ "$warn_status" -ne 0 ]]; then
  fail "unpinned host mismatch should warn, status $warn_status"
fi
if ! grep -q "keeping this build" "$tmp/warn.err"; then
  fail "missing digest warning"
fi
if [[ "$fail_status" -eq 0 ]]; then
  fail "pinned host mismatch should fail"
fi
if [[ "$strict_status" -eq 0 ]]; then
  fail "STRICT_WASM_DIGEST should fail"
fi
if ! SIMPLECODE_UNAME_S=Darwin SIMPLECODE_UNAME_M=arm64 verify_output "$tmp/abc" "$abc_sha" ""; then
  fail "canonical digest should pass on darwin"
fi

cat >"$tmp/fail.sh" << 'EOF'
#!/usr/bin/env bash
exit 1
EOF
build_or_prebuilt "$tmp/fail.sh" "$tmp/from-prebuilt" "file://$tmp/abc" "$abc_sha" "demo"
if [[ "$(cat "$tmp/from-prebuilt")" != "abc" ]]; then
  fail "prebuilt fallback"
fi

if [[ -f "$ROOT/wasm/lua-5.4.9.wasm" ]]; then
  SIMPLECODE_BUILDER_FORCE_FAIL=1 \
    SIMPLECODE_LUA_PREBUILT_URL="file://$ROOT/wasm/lua-5.4.9.wasm" \
    bash "$BUILDERS_DIR/lua/build.sh" "$tmp/lua.wasm"
  got="$(sha256_file "$tmp/lua.wasm")"
  if [[ "$got" != "$(lock_get "$LOCK" lua.outputSha256)" ]]; then
    fail "lua fallback digest $got"
  fi
fi

if [[ -x "$ROOT/thirdparty/cache/wasi-sdk-33.0-x86_64-linux/bin/clang" ]]; then
  SIMPLECODE_UNAME_S=Linux SIMPLECODE_UNAME_M=x86_64 bash "$BUILDERS_DIR/lua/build.sh" --inspect >"$tmp/inspect-lua"
  if ! grep -q "7f454c46" "$tmp/inspect-lua"; then
    fail "linux clang is not ELF"
  fi
fi

if command -v shellcheck >/dev/null 2>&1; then
  shellcheck -x -s bash \
    "$BUILDERS_DIR/common.sh" \
    "$BUILDERS_DIR/lua/build.sh" \
    "$BUILDERS_DIR/go/build.sh" \
    "$BUILDERS_DIR/self-check.sh"
fi

if [[ "${SIMPLECODE_INSPECT_TOOLCHAINS:-}" == "1" ]]; then
  inspect_one() {
    local os="$1" arch="$2"
    printf 'inspect %s %s\n' "$os" "$arch"
    SIMPLECODE_UNAME_S="$os" SIMPLECODE_UNAME_M="$arch" bash "$BUILDERS_DIR/lua/build.sh" --inspect
    SIMPLECODE_UNAME_S="$os" SIMPLECODE_UNAME_M="$arch" bash "$BUILDERS_DIR/go/build.sh" --inspect
  }
  inspect_one Linux x86_64
  inspect_one Linux aarch64
  inspect_one Darwin arm64
  inspect_one Darwin x86_64
fi

printf '✓ builders self-check\n'
