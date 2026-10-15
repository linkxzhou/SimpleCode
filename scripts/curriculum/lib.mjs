import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function dedent(text) {
  const raw = String(text).replace(/^\n/, "").replace(/\s+$/, "");
  const lines = raw.split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[ ]*/)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(cut)).join("\n");
}

function escapeAttr(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}

/** fenced code block. `norun` wins over run. Unknown languages stay non-runnable. */
export function fence(lang, code, attrs = {}) {
  const bits = [lang];
  if (attrs.norun) bits.push("norun");
  else if (attrs.run !== false) bits.push("run");
  for (const key of ["stdin", "expect", "title", "smoke", "file", "group"]) {
    if (attrs[key] !== undefined && attrs[key] !== "") bits.push(`${key}="${escapeAttr(attrs[key])}"`);
  }
  if (attrs.exit !== undefined) bits.push(`exit="${attrs.exit}"`);
  if (attrs.eof === false) bits.push('eof="false"');
  return "```" + bits.join(" ") + "\n" + dedent(code) + "\n```";
}

export function note(text, kind = "note") {
  return `::: ${kind}\n${dedent(text)}\n:::`;
}

export function answer(title, body) {
  return `::: answer ${title}\n${dedent(body)}\n:::`;
}

export function yamlQuote(value) {
  return JSON.stringify(String(value));
}

export function chapter(meta, body) {
  const lines = [
    "---",
    `language: ${meta.language}`,
    `chapter: ${meta.chapter}`,
    `title: ${yamlQuote(meta.title)}`,
  ];
  if (meta.level) lines.push(`level: ${meta.level}`);
  lines.push(`minutes: ${meta.minutes}`, "goals:");
  for (const goal of meta.goals) lines.push(`  - ${yamlQuote(goal)}`);
  if (meta.runtime) lines.push(`runtime: ${meta.runtime}`);
  lines.push("sources:");
  for (const src of meta.sources) lines.push(`  - ${src}`);
  lines.push('updated: "2026-10-15"', "---", "", dedent(body).trim(), "");
  return lines.join("\n");
}

export function writeBook(root, book, pages) {
  const dir = join(root, "docs", book);
  mkdirSync(dir, { recursive: true });
  for (const page of pages) {
    const file = join(dir, page.file);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, page.body.endsWith("\n") ? page.body : page.body + "\n");
  }
}

export function page(meta, body) {
  const file = meta.file ?? (meta.chapter === 0 ? "index.md" : `${String(meta.chapter).padStart(2, "0")}-${meta.slug}.md`);
  return { file, body: chapter({ ...meta, language: meta.language }, body) };
}
