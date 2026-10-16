import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

/** Body character counts before the essay rewrite. Acceptance stays 3× until that book moves to ESSAY. */
const BASE: Record<string, number> = {
};

/** Books still on the §17 absolute floors. None remain after the essay rewrite. */
const ABSOLUTE: string[] = [];

/** plan/LEARN.md §19. Short tutorial sections, Runoob-style. The 2500-character essay rule is retired. */
const TUTORIAL = ["go", "python", "js", "ruby", "sqlite", "c", "cpp", "php", "lua", "shell", "linux"];

function bodyOf(text: string) {
  const parts = text.split("---");
  assert.ok(parts.length >= 3, "frontmatter");
  return parts.slice(2).join("---");
}

function proseOf(body: string) {
  return body.replace(/```[\s\S]*?```/g, "");
}

function hanCount(prose: string) {
  return [...prose].filter((ch) => /\p{Script=Han}/u.test(ch)).length;
}

function runnableCount(body: string) {
  const re = /```([^\n]*)\n/g;
  let n = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body))) {
    const info = match[1];
    if (/\bnorun\b/.test(info)) continue;
    if (/\brun\b/.test(info)) n++;
  }
  return n;
}

describe("chapter length", () => {
  for (const [file, before] of Object.entries(BASE)) {
    it(file, () => {
      const text = readFileSync(`docs/${file}`, "utf8");
      const body = bodyOf(text);
      const overview = file.endsWith("/index.md");
      assert.ok(body.length >= before * 3, `body ${body.length} < ${before * 3}`);
      const prose = proseOf(body).length;
      assert.ok(prose >= (overview ? 900 : 1500), `prose ${prose}`);
      for (const heading of ["常见错误", "最佳实践", "小结", "练习"]) {
        assert.ok(body.includes(`## ${heading}`), heading);
      }
      assert.ok((body.match(/::: answer/g) ?? []).length >= 2, "answers");
      assert.ok(runnableCount(body) >= (overview ? 3 : 5), `runnable ${runnableCount(body)}`);
      const minutes = Number(text.match(/^minutes:\s*(\d+)/m)?.[1]);
      assert.ok(minutes >= (overview ? 12 : 18), `minutes ${minutes}`);
    });
  }

  for (const book of ABSOLUTE) {
    const files = readdirSync(`docs/${book}`).filter((name) => name.endsWith(".md")).sort();
    for (const name of files) {
      const file = `${book}/${name}`;
      it(file, () => {
        const text = readFileSync(`docs/${file}`, "utf8");
        const body = bodyOf(text);
        const overview = name === "index.md";
        assert.ok(body.length >= (overview ? 2800 : 3200), `body ${body.length}`);
        const prose = proseOf(body).length;
        assert.ok(prose >= (overview ? 900 : 1500), `prose ${prose}`);
        for (const heading of ["常见错误", "最佳实践", "小结", "练习"]) {
          assert.ok(body.includes(`## ${heading}`), heading);
        }
        assert.ok((body.match(/::: answer/g) ?? []).length >= 2, "answers");
        assert.ok(runnableCount(body) >= (overview ? 3 : 5), `runnable ${runnableCount(body)}`);
        const minutes = Number(text.match(/^minutes:\s*(\d+)/m)?.[1]);
        assert.ok(minutes >= (overview ? 12 : 18), `minutes ${minutes}`);
      });
    }
  }

  for (const book of TUTORIAL) {
    const files = readdirSync(`docs/${book}`).filter((name) => name.endsWith(".md")).sort();
    assert.ok(files.length >= 20, `${book} chapters ${files.length}`);
    for (const name of files) {
      const file = `${book}/${name}`;
      it(file, () => {
        const text = readFileSync(`docs/${file}`, "utf8");
        const body = bodyOf(text);
        const prose = proseOf(body);
        const headings = prose.match(/^### .+$/gm) ?? [];
        assert.ok(headings.length >= 3, `sections ${headings.length}`);
        const intro = prose.split(/^### /m)[0] ?? "";
        assert.ok(hanCount(intro) <= 180, `intro han ${hanCount(intro)}`);
        const parts = prose.split(/^### /m).slice(1);
        for (const part of parts) {
          const han = hanCount(part);
          assert.ok(han > 0 && han <= 400, `section han ${han}`);
        }
        assert.ok(runnableCount(body) >= 2, `runnable ${runnableCount(body)}`);
        assert.ok(!body.includes("## 常见错误") && !body.includes("## 最佳实践"), "template headings");
      });
    }
  }

  it("chapters do not share a 60-character run", () => {
    const seen = new Map<string, string>();
    for (const book of TUTORIAL) {
      const files = readdirSync(`docs/${book}`).filter((name) => name.endsWith(".md"));
      for (const name of files) {
        const file = `${book}/${name}`;
        const han = proseOf(bodyOf(readFileSync(`docs/${file}`, "utf8"))).replace(/[^\p{Script=Han}]/gu, "");
        for (let i = 0; i + 60 <= han.length; i++) {
          const frag = han.slice(i, i + 60);
          const prev = seen.get(frag);
          assert.ok(!prev || prev === file, `shared prose ${prev} ${file}`);
          if (!prev) seen.set(frag, file);
        }
      }
    }
  });
});
