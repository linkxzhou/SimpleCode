# Shared helpers for scripts/builders/*.sh
# Compatible with bash 3.2 (macOS /bin/bash) and BSD userland:
# shasum or sha256sum, tar -xzf, no associative arrays, no bash 4 syntax.
# shellcheck shell=bash

BUILDERS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

builders_root() {
  (cd "$BUILDERS_DIR/../.." && pwd -P)
}

# linux-x86_64 | linux-arm64 | darwin-x86_64 | darwin-arm64
# SIMPLECODE_UNAME_S / SIMPLECODE_UNAME_M override uname (tests, qemu).
host_key() {
  local os arch
  os="${SIMPLECODE_UNAME_S:-$(uname -s)}"
  arch="${SIMPLECODE_UNAME_M:-$(uname -m)}"
  case "$os" in
    Linux|linux) os="linux" ;;
    Darwin|darwin) os="darwin" ;;
    *)
      printf '✗ unsupported OS %s (need Linux or macOS)\n' "$os" >&2
      return 1
      ;;
  esac
  case "$arch" in
    x86_64|amd64|x64) arch="x86_64" ;;
    aarch64|arm64) arch="arm64" ;;
    *)
      printf '✗ unsupported CPU %s (need x86_64 or arm64)\n' "$arch" >&2
      return 1
      ;;
  esac
  printf '%s-%s\n' "$os" "$arch"
}

lock_get() {
  if ! command -v node >/dev/null 2>&1; then
    printf '✗ node is required to read %s\n' "$1" >&2
    return 1
  fi
  node "$BUILDERS_DIR/lock.mjs" "$1" "$2"
}

lock_get_optional() {
  if ! command -v node >/dev/null 2>&1; then
    printf '✗ node is required to read %s\n' "$1" >&2
    return 1
  fi
  node "$BUILDERS_DIR/lock.mjs" --optional "$1" "$2"
}

resolve_prebuilt() {
  local override="$1" lock="$2" key="$3" url=""
  if [[ -n "$override" ]]; then
    printf '%s\n' "$override"
    return 0
  fi
  url="$(lock_get_optional "$lock" "$key")" || return 1
  printf '%s\n' "$url"
}

sha256_file() {
  local file="$1" tool line
  tool="${SIMPLECODE_SHA256_TOOL:-}"
  if [[ -z "$tool" ]]; then
    if command -v sha256sum >/dev/null 2>&1; then
      tool="sha256sum"
    elif command -v shasum >/dev/null 2>&1; then
      tool="shasum"
    else
      printf '✗ need sha256sum (Linux) or shasum (macOS)\n' >&2
      return 1
    fi
  fi
  case "$tool" in
    sha256sum) line="$(sha256sum "$file")" || return 1 ;;
    shasum) line="$(shasum -a 256 "$file")" || return 1 ;;
    *)
      printf '✗ unknown SIMPLECODE_SHA256_TOOL %s\n' "$tool" >&2
      return 1
      ;;
  esac
  printf '%s\n' "${line%% *}"
}

download_verified() {
  local url="$1" sha="$2" dest="$3" got=""
  if [[ -f "$dest" ]]; then
    got="$(sha256_file "$dest")" || return 1
    if [[ "$got" == "$sha" ]]; then
      return 0
    fi
    printf 'checksum mismatch for %s, re-downloading\n' "$dest" >&2
    rm -f "$dest"
  fi
  mkdir -p "$(dirname "$dest")" || return 1
  printf '↓ %s\n' "$(basename "$dest")"
  rm -f "$dest.partial"
  curl -fL --retry 5 --retry-delay 2 -o "$dest.partial" "$url" || {
    rm -f "$dest.partial"
    return 1
  }
  got="$(sha256_file "$dest.partial")" || {
    rm -f "$dest.partial"
    return 1
  }
  if [[ "$got" != "$sha" ]]; then
    printf '✗ sha256 mismatch for %s\n  expected %s\n  actual   %s\n' "$(basename "$dest")" "$sha" "$got" >&2
    rm -f "$dest.partial"
    return 1
  fi
  mv "$dest.partial" "$dest" || return 1
}

install_prebuilt() {
  local url="$1" sha="$2" dest="$3"
  if [[ -z "$url" ]]; then
    printf '✗ no prebuilt URL configured\n' >&2
    return 1
  fi
  download_verified "$url" "$sha" "$dest" || {
    printf '✗ prebuilt download failed: %s\n' "$url" >&2
    printf '  Publish that asset (see plan/LANGUAGES.md) or set SIMPLECODE_LUA_PREBUILT_URL / SIMPLECODE_GO_PREBUILT_URL.\n' >&2
    return 1
  }
  printf '✓ prebuilt %s\n' "$(basename "$dest")"
}

# Invoke `<script> --compile <out>`. A separate process so `set -e` is honored
# (bash ignores errexit inside a function that is itself in a conditional).
build_or_prebuilt() {
  local script="$1" out="$2" url="$3" sha="$4" label="$5" status
  set +e
  bash "$script" --compile "$out"
  status=$?
  set -e
  if [[ "$status" -ne 0 ]]; then
    rm -f "$out"
    printf '✗ %s build failed; trying prebuilt wasm\n' "$label" >&2
    install_prebuilt "$url" "$sha" "$out" || return 1
  fi
  return 0
}

extract_tar() {
  local archive="$1" dest="$2"
  mkdir -p "$dest" || return 1
  # COPYFILE_* stops macOS tar from sprinkling AppleDouble files.
  COPYFILE_DISABLE=1 COPY_EXTENDED_ATTRIBUTES_DISABLE=1 tar -xzf "$archive" -C "$dest" || return 1
}

# Refuse rm -rf of a path that is not a child of the cache directory.
require_under_cache() {
  local path="$1" cache="$2"
  case "$path" in
    "$cache"/*) return 0 ;;
  esac
  printf '✗ refusing to touch %s\n' "$path" >&2
  return 1
}

job_count() {
  local n=""
  if command -v nproc >/dev/null 2>&1; then
    n="$(nproc 2>/dev/null || true)"
  elif command -v sysctl >/dev/null 2>&1; then
    n="$(sysctl -n hw.ncpu 2>/dev/null || true)"
  fi
  if [[ -z "$n" ]]; then
    n="$(getconf _NPROCESSORS_ONLN 2>/dev/null || true)"
  fi
  case "$n" in
    ""|*[!0-9]*) n="2" ;;
  esac
  printf '%s\n' "$n"
}

binary_magic() {
  local file="$1"
  node --input-type=commonjs -e 'const fs=require("fs"); const b=fs.readFileSync(process.argv[1]); if (b.length<4) process.exit(1); process.stdout.write(b.subarray(0,4).toString("hex"));' "$file"
}

# kind is chosen from the host: ELF on Linux, Mach-O on macOS.
expect_host_binary() {
  local file="$1" host="$2" magic=""
  if [[ ! -e "$file" ]]; then
    printf '✗ missing %s\n' "$file" >&2
    return 1
  fi
  magic="$(binary_magic "$file")" || return 1
  printf '%s %s\n' "$magic" "$file"
  case "$host" in
    linux-*)
      if [[ "$magic" != "7f454c46" ]]; then
        printf '✗ expected an ELF toolchain binary\n' >&2
        return 1
      fi
      ;;
    darwin-*)
      case "$magic" in
        cffaedfe|feedfacf|cafebabe|bebafeca|cefaedfe|feedface) ;;
        *)
          printf '✗ expected a Mach-O toolchain binary, got %s\n' "$magic" >&2
          return 1
          ;;
      esac
      ;;
    *)
      printf '✗ unknown host %s\n' "$host" >&2
      return 1
      ;;
  esac
}

# Return 0 when the wasm already matches the reference or this host's pin.
skip_if_current() {
  local file="$1" expect="$2" host_expect="${3:-}" got=""
  if [[ ! -f "$file" ]]; then
    return 1
  fi
  got="$(sha256_file "$file")" || return 1
  if [[ "$got" == "$expect" ]]; then
    printf '✓ %s matches %s\n' "$(basename "$file")" "${got:0:12}"
    return 0
  fi
  if [[ -n "$host_expect" && "$got" == "$host_expect" ]]; then
    printf '✓ %s matches %s (host pin)\n' "$(basename "$file")" "${got:0:12}"
    return 0
  fi
  return 1
}

# Canonical digest, else the per-host pin. Hosts without a pin keep the binary
# and warn, unless SIMPLECODE_STRICT_WASM_DIGEST=1.
verify_output() {
  local file="$1" canonical="$2" host_expect="${3:-}" got="" host="" bytes=""
  got="$(sha256_file "$file")" || return 1
  bytes="$(wc -c <"$file" | tr -d '[:space:]')"
  if [[ "$got" == "$canonical" ]]; then
    printf '✓ %s %s (%s bytes)\n' "$(basename "$file")" "${got:0:12}" "$bytes"
    return 0
  fi
  if [[ -n "$host_expect" && "$got" == "$host_expect" ]]; then
    printf '✓ %s %s (%s bytes, host pin)\n' "$(basename "$file")" "${got:0:12}" "$bytes"
    return 0
  fi
  host="$(host_key 2>/dev/null || printf '%s\n' "unknown")"
  if [[ -n "$host_expect" || "${SIMPLECODE_STRICT_WASM_DIGEST:-}" == "1" ]]; then
    printf '✗ output sha256 mismatch for %s\n  expected %s\n  actual   %s\n' "$(basename "$file")" "$canonical" "$got" >&2
    if [[ -n "$host_expect" ]]; then
      printf '  host pin %s\n' "$host_expect" >&2
    fi
    return 1
  fi
  printf '⚠ output sha256 for %s differs from the pinned reference\n  reference %s\n  actual    %s\n' "$(basename "$file")" "$canonical" "$got" >&2
  printf '  %s has no outputSha256ByHost entry; keeping this build.\n' "$host" >&2
  printf '  Pin outputSha256ByHost.%s to %s\n' "$host" "$got" >&2
  printf '  Or set SIMPLECODE_STRICT_WASM_DIGEST=1 to fail.\n' >&2
  return 0
}
