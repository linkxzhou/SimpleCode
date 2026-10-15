#!/usr/bin/env node
// Fail if docs UI or the Shiki theme introduces a chromatic color.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const roots = ["src/components/docs", "src/composables/useRunFromDoc.ts", "scripts/docs/themes.ts", "src/styles/docs.css"];
const chroma =
  /\b(?:text|bg|border|ring|from|to|via|fill|stroke|outline|decoration|shadow|caret|accent|divide)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?\b/;
const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
const hslRe = /hsla?\(\s*[\d.]+\s*,?\s*([\d.]+)%/g;
const rgbRe = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g;

function isGrayHex(raw) {
  let h = raw.toLowerCase();
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
  if (h.length === 8) h = h.slice(0, 6);
  if (h.length !== 6) return false;
  return h.slice(0, 2) === h.slice(2, 4) && h.slice(2, 4) === h.slice(4, 6);
}

function files(path, out = []) {
  let st;
  try {
    st = statSync(path);
  } catch {
    return out;
  }
  if (st.isFile()) {
    out.push(path);
    return out;
  }
  for (const name of readdirSync(path)) {
    if (name === "node_modules") continue;
    files(join(path, name), out);
  }
  return out;
}

const failures = [];
for (const root of roots) {
  for (const file of files(root)) {
    if (!/\.(vue|ts|css|mjs|js)$/.test(file)) continue;
    const text = readFileSync(file, "utf8");
    const rel = relative(process.cwd(), file);
    if (chroma.test(text)) failures.push(`${rel}: chromatic Tailwind color`);
    for (const m of text.matchAll(hexRe)) {
      if (!isGrayHex(m[1])) failures.push(`${rel}: chromatic hex ${m[0]}`);
    }
    for (const m of text.matchAll(hslRe)) {
      if (Number(m[1]) > 0) failures.push(`${rel}: saturated hsl ${m[0]}`);
    }
    for (const m of text.matchAll(rgbRe)) {
      if (!(m[1] === m[2] && m[2] === m[3])) failures.push(`${rel}: chromatic rgb ${m[0]}`);
    }
  }
}

if (failures.length) {
  console.error("✗ monochrome check failed:");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}
console.log("✓ monochrome check passed");
