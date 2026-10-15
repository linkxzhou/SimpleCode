# Shared helpers for scripts/builders/*.sh
# shellcheck shell=bash

builders_root() {
  cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd
}

require_linux_x64() {
  if [[ "$(uname -s)" != "Linux" || "$(uname -m)" != "x86_64" ]]; then
    echo "✗ builders need Linux x86_64 (pinned wasi-sdk and Go tarballs are linux-amd64)" >&2
    exit 1
  fi
}

lock_get() {
  local lock="$1" key="$2"
  python3 - "$lock" "$key" <<'PY'
import json, sys
cur = json.load(open(sys.argv[1]))
for part in sys.argv[2].split("."):
    cur = cur[part]
sys.stdout.write(str(cur))
PY
}

download_verified() {
  local url="$1" sha="$2" dest="$3"
  if [[ -f "$dest" ]]; then
    local got
    got="$(sha256sum "$dest" | awk '{print $1}')"
    if [[ "$got" == "$sha" ]]; then
      return 0
    fi
    echo "checksum mismatch for $dest, re-downloading" >&2
    rm -f "$dest"
  fi
  mkdir -p "$(dirname "$dest")"
  echo "↓ $(basename "$dest")"
  curl -fL --retry 5 --retry-delay 2 -o "$dest.partial" "$url"
  echo "$sha  $dest.partial" | sha256sum -c -
  mv "$dest.partial" "$dest"
}

sha256_file() {
  sha256sum "$1" | awk '{print $1}'
}

# Exit 0 when the wasm is already the pinned digest.
skip_if_current() {
  local file="$1" expect="$2"
  if [[ -f "$file" ]] && [[ "$(sha256_file "$file")" == "$expect" ]]; then
    echo "✓ $(basename "$file") matches ${expect:0:12}"
    exit 0
  fi
}

verify_output() {
  local file="$1" expect="$2"
  local got
  got="$(sha256_file "$file")"
  if [[ "$got" != "$expect" ]]; then
    echo "✗ output sha256 mismatch for $(basename "$file")" >&2
    echo "  expected $expect" >&2
    echo "  actual   $got" >&2
    exit 1
  fi
  echo "✓ $(basename "$file") ${got:0:12} ($(wc -c <"$file" | tr -d ' ') bytes)"
}
