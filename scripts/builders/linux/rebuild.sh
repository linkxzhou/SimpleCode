#!/usr/bin/env bash
# Optional Linux/Docker path for a from-scratch i686 Buildroot image.
# ./build.sh vendor does not call this script. The bytes it ships are the
# pinned prebuilt at linux.bzimage in scripts/sources.lock.json
# (https://i.copy.sh/buildroot-bzimage68.bin, kernel 6.8.12, Buildroot 2024.05.2,
# BusyBox 1.36.1). A from-scratch tree will not match that digest.
#
# Building Buildroot on macOS is not supported. On Linux, or from macOS via
# Docker, the outline below is the replacement path. Re-lock bzimage and
# regenerate linux-state.zst before pointing vendor at the new file.
#
#   docker run --rm -it -v "$PWD:/work" -w /work ubuntu:24.04 bash scripts/builders/linux/rebuild.sh --fetch
#
# --fetch only downloads the pinned Buildroot 2026.08 tarball and checks sha256.
# It does not compile. Compiling needs a defconfig (BR2_i386, static BusyBox,
# 9p/virtio, ttyS0 autologin, no network) and a Linux host with the usual
# Buildroot dependencies (gcc, make, ncurses, bc, rsync, wget, cpio).
set -euo pipefail
# shellcheck source=SCRIPTDIR/../common.sh
source "$(dirname "$0")/../common.sh"

ROOT="$(builders_root)"
LOCK="$ROOT/scripts/sources.lock.json"
CACHE="$ROOT/thirdparty/cache/linux"
mkdir -p "$CACHE"

url="$(lock_get "$LOCK" linux.buildrootUrl)"
sha="$(lock_get "$LOCK" linux.buildrootSha256)"
tarball="$CACHE/$(basename "$url")"

case "${1:-}" in
  --fetch)
    download_verified "$url" "$sha" "$tarball"
    printf 'fetched %s\n' "$tarball"
    printf 'This tarball is Buildroot 2026.08. The shipped guest is the pinned 6.8 demo image, not the output of this tree.\n'
    ;;
  *)
    printf 'Shipped image: pinned linux.bzimage (Buildroot 2024.05.2 / Linux 6.8.12 / BusyBox 1.36.1).\n'
    printf 'From-scratch builds are a different artifact. On Linux or Docker:\n'
    printf '  bash %s --fetch\n' "$0"
    printf 'Then configure an i686 Buildroot with 9p, console=ttyS0, and no network, and replace the pin.\n'
    ;;
esac
