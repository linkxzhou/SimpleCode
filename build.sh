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
need_wasm() { [ -f wasm/manifest.json ] || cmd_vendor; }

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
  info "Serving dist/ with COOP/COEP headers"
  exec yarn vite preview --host "$HOST" --port "${PORT:-4173}" --strictPort "$@"
}

cmd_test() {
  need_deps
  info "Running headless smoke test (builds if needed)"
  [ -f dist/index.html ] || cmd_build
  node tests/smoke.mjs "$@"
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
  vendor [--link]    Copy wasm runtimes from thirdparty/runno/langs into wasm/ and
                     generate wasm/manifest.json (--link: symlink instead of copy,
                     --source <dir>: alternative source directory)
  dev                Start the Vite dev server (http://localhost:5173)
  build              Type-check and build production bundle into dist/ (incl. dist/wasm)
  preview | run      Serve dist/ with COOP/COEP headers (http://localhost:4173)
  test               Headless smoke test (Playwright/Chromium) against a preview server
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
