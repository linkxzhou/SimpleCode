#!/usr/bin/env bash
# SimpleCode build helper
set -euo pipefail
cd "$(dirname "$0")"

HOST="${HOST:-localhost}"
PORT="${PORT:-}"

c_bold=$'\033[1m'; c_dim=$'\033[2m'; c_green=$'\033[32m'; c_red=$'\033[31m'; c_off=$'\033[0m'
info() { echo "${c_bold}▸ $*${c_off}"; }
die() { echo "${c_red}✗ $*${c_off}" >&2; exit 1; }

need_deps() { [ -d node_modules ] || cmd_install; }
# Fingerprint whatever binaries are on disk. Missing files (exit 2) trigger a
# full vendor; a bad file fails instead of being rebuilt over a warning.
need_wasm() {
  if node scripts/write-manifest.mjs; then
    return 0
  fi
  local status=$?
  if [ "$status" -eq 2 ]; then
    cmd_vendor
    return 0
  fi
  exit "$status"
}
sync_dist_wasm() {
  [ -d dist ] || return 0
  rm -rf dist/wasm
  cp -RL wasm dist/wasm
}

cmd_install() {
  command -v yarn >/dev/null || die "yarn not found (try: corepack enable)"
  info "Installing dependencies (yarn)"
  yarn install
}

cmd_vendor() {
  info "Vendoring wasm binaries → wasm/"
  node scripts/vendor-wasm.mjs "$@"
}

cmd_dev() {
  need_deps; need_wasm
  info "Starting dev server (COOP/COEP enabled)"
  exec yarn vite --host "$HOST" ${PORT:+--port "$PORT"} "$@"
}

cmd_build() {
  need_deps; need_wasm
  info "Type-checking"
  yarn vue-tsc --noEmit
  info "Building → dist/"
  yarn vite build "$@"
  echo "${c_green}✓ build complete:${c_off} $(du -sh dist | cut -f1) in dist/"
}

cmd_preview() {
  need_deps
  [ -f dist/index.html ] || cmd_build
  need_wasm
  info "Syncing wasm/ into dist/wasm"
  sync_dist_wasm
  info "Serving dist/ with COOP/COEP headers"
  exec yarn vite preview --host "$HOST" --port "${PORT:-4173}" --strictPort "$@"
}

cmd_test() {
  need_deps
  local docs_only=0 smoke_only=0
  local args=()
  for a in "$@"; do
    case "$a" in
      --docs) docs_only=1 ;;
      --smoke) smoke_only=1 ;;
      *) args+=("$a") ;;
    esac
  done
  info "Docs unit tests"
  node --experimental-strip-types --test tests/docs-unit.test.ts tests/docs-length.test.ts tests/manifest-refresh.test.mjs
  info "Monochrome check"
  node scripts/check-mono.mjs
  if [ "$docs_only" = 1 ]; then
    [ -f dist/index.html ] || cmd_build
    node --experimental-strip-types tests/docs-smoke.mjs "${args[@]}"
    return
  fi
  if [ "$smoke_only" = 1 ]; then
    [ -f dist/index.html ] || cmd_build
    node tests/smoke.mjs "${args[@]}"
    return
  fi
  info "Running headless smoke test (builds if needed)"
  [ -f dist/index.html ] || cmd_build
  node tests/smoke.mjs "${args[@]}"
  node --experimental-strip-types tests/docs-smoke.mjs
  node tests/learn.spec.mjs
}

cmd_clean() {
  info "Removing dist/ and Vite cache"
  rm -rf dist node_modules/.vite
  if [ "${1:-}" = "--all" ]; then
    info "Removing node_modules/ and wasm/ binaries"
    rm -rf node_modules wasm
  fi
}

cmd_help() {
  cat <<USAGE
${c_bold}SimpleCode build helper${c_off}

Usage: ./build.sh <command> [args]

  install            Install dependencies with yarn
  vendor [--link]    Copy wasm runtimes from thirdparty/runno/langs into wasm/,
                     build Lua and Go (scripts/builders; Linux or macOS, x86_64 or arm64), and
                     write wasm/manifest.json from those files (--link: symlink Runno files,
                     --source <dir>: alternative Runno directory).
                     manifest.json is generated and not committed.
  dev                Start the Vite dev server (http://localhost:5173)
  build              Type-check and build production bundle into dist/ (incl. dist/wasm)
  preview | run      Serve dist/ with COOP/COEP headers (http://localhost:4173)
  test [--docs|--smoke]  Headless tests. Default: unit + mono + smoke + docs-smoke + learn UI.
                     --docs runs the tutorial smoke test; --smoke runs the language hello-world smoke test.
  clean [--all]      Remove dist/ (and node_modules/, wasm/ with --all)
  help               Show this help

Environment: HOST (default localhost), PORT
USAGE
}

cmd="${1:-help}"; shift || true
case "$cmd" in
  install) cmd_install "$@" ;;
  vendor) cmd_vendor "$@" ;;
  dev) cmd_dev "$@" ;;
  build) cmd_build "$@" ;;
  preview|run|serve) cmd_preview "$@" ;;
  test|smoke) cmd_test "$@" ;;
  clean) cmd_clean "$@" ;;
  help|-h|--help) cmd_help ;;
  *) cmd_help; die "unknown command: $cmd" ;;
esac
