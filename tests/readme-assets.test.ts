import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { describe, it } from "node:test";
import { isKnownDocsDir } from "../scripts/docs/tree.ts";

const root = process.cwd();
const readmes = ["README.md", "README.en.md", "docs/GITHUB_META.md"];
const screenshotNames = [
  "editor-run.png",
  "languages.png",
  "quickstart.png",
  "leetcode-list.png",
  "leetcode-solution.png",
  "english.png",
];

function markdownImages(source: string): string[] {
  const out: string[] = [];
  const inline = /!\[[^\]]*]\(\s*<?([^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;
  for (const match of source.matchAll(inline)) {
    const href = match[1];
    if (!href || /^(?:https?:|data:|mailto:)/i.test(href)) continue;
    out.push(href);
  }
  const html = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi;
  for (const match of source.matchAll(html)) {
    const href = match[1];
    if (!href || /^(?:https?:|data:)/i.test(href)) continue;
    out.push(href);
  }
  return out;
}

function repoPath(fromFile: string, href: string): string {
  const decoded = decodeURIComponent(href.split("#")[0]?.split("?")[0] ?? href);
  const abs = decoded.startsWith("/")
    ? resolve(root, `.${decoded}`)
    : resolve(dirname(join(root, fromFile)), decoded);
  const rel = relative(root, abs);
  assert.equal(rel.startsWith("..") || rel === "", false, `${fromFile} image ${href} leaves the repository`);
  return rel.split(sep).join("/");
}

describe("README images", () => {
  it("resolve on disk and stay outside the docs schema and the Vite public dir", () => {
    const linked: string[] = [];
    for (const file of readmes) {
      for (const href of markdownImages(readFileSync(file, "utf8"))) {
        const rel = repoPath(file, href);
        const abs = join(root, rel);
        assert.equal(existsSync(abs) && statSync(abs).isFile(), true, `${file} links to missing ${rel}`);
        const top = rel.split("/")[0];
        assert.notEqual(top, "docs", `${rel} is a docs/ directory, so the docs schema treats it as a book`);
        assert.notEqual(top, "public", `${rel} is in public/, so Vite copies it into dist`);
        linked.push(rel);
      }
    }
    for (const name of screenshotNames) {
      const rel = `assets/screenshots/${name}`;
      const hits = linked.filter((item) => item === rel);
      assert.equal(hits.length, 2, `README.md and README.en.md both link ${rel}`);
    }
  });
});

describe("docs directories", () => {
  it("allows only books, editions, and private folders", () => {
    for (const name of readdirSync("docs")) {
      if (!statSync(join("docs", name)).isDirectory()) continue;
      assert.equal(isKnownDocsDir(name), true, `未知文档目录 docs/${name}`);
    }
  });
});
