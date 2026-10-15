// Ported from thirdparty/runno/packages/runtime/lib/tar.ts
import type { BinaryWASIFS } from "@runno/wasi";
import { Tarball } from "@obsidize/tar-browserify";
import { inflate } from "pako";

export function extractTarGz(binary: Uint8Array): BinaryWASIFS {
  let data: Uint8Array;
  try {
    data = inflate(binary);
  } catch {
    data = binary;
  }
  const fs: BinaryWASIFS = {};
  for (const entry of Tarball.extract(data)) {
    if (!entry.isFile()) continue;
    const name = entry.fileName.replace(/^([^/])/, "/$1");
    const t = new Date(entry.lastModified);
    fs[name] = {
      path: name,
      timestamps: { change: t, access: t, modification: t },
      mode: "binary",
      content: entry.content!,
    };
  }
  return fs;
}
