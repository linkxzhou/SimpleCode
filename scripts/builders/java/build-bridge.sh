#!/usr/bin/env bash
# Rebuild the TeaVM stdin bridge and the tiny Scanner stub.
# Needs a host javac that accepts --release 17. The browser loads the .class files.
set -euo pipefail
cd "$(dirname "$0")/../../.."
out="$(mktemp -d)"
trap 'rm -rf "$out"' EXIT
javac --release 17 -cp src/teavm/bridge/compile -d "$out" \
  src/teavm/bridge/TConsoleInputStream.java \
  src/teavm/bridge/TScanner.java \
  src/teavm/bridge/TInputStreamReader.java
javac --release 17 --patch-module java.base=src/teavm/bridge/patch -d "$out" \
  src/teavm/bridge/patch/java/util/Scanner.java
cp "$out/org/teavm/classlib/java/lang/TConsoleInputStream.class" src/teavm/bridge/TConsoleInputStream.class
cp "$out/org/teavm/classlib/java/util/TScanner.class" src/teavm/bridge/TScanner.class
cp "$out/org/teavm/classlib/java/io/TInputStreamReader.class" src/teavm/bridge/TInputStreamReader.class
cp "$out/java/util/Scanner.class" src/teavm/bridge/Scanner.class
echo "✓ bridge classes refreshed under src/teavm/bridge/"
