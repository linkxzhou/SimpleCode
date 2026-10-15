import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

/** Body character counts before this round. Acceptance is 3×. */
const BASE: Record<string, number> = {
  "python/index.md": 1029,
  "python/01-hello.md": 1029,
  "python/02-types.md": 1168,
  "python/03-strings.md": 1119,
  "python/04-control.md": 1570,
  "python/05-lists.md": 1171,
  "python/06-dicts.md": 1134,
  "python/07-functions.md": 1351,
  "python/08-exceptions.md": 1339,
  "python/09-stdlib.md": 1240,
  "python/10-oop.md": 1555,
  "python/11-iterators.md": 1478,
  "python/12-decorators.md": 1574,
  "python/13-project.md": 1457,
  "js/index.md": 960,
  "js/01-values.md": 1012,
  "js/02-strings.md": 983,
  "js/03-control.md": 1280,
  "js/04-functions.md": 1269,
  "js/05-arrays.md": 1109,
  "js/06-objects.md": 1123,
  "js/07-classes.md": 1465,
  "js/08-errors.md": 1268,
  "js/09-iterators.md": 1477,
  "js/10-promises.md": 1322,
  "js/11-typescript.md": 1194,
  "js/12-typescript-project.md": 1558,
  "go/index.md": 990,
  "go/01-vars.md": 1145,
  "go/02-types.md": 1119,
  "go/03-control.md": 1417,
  "go/04-collections.md": 1415,
  "go/05-funcs.md": 1451,
  "go/06-structs.md": 1518,
  "go/07-interfaces.md": 1506,
  "go/08-errors.md": 1456,
  "go/09-concurrency.md": 1312,
  "go/10-generics.md": 1219,
  "go/11-stdlib.md": 1621,
  "go/12-todo.md": 1455,
};

function bodyOf(text: string) {
  const parts = text.split("---");
  assert.ok(parts.length >= 3, "frontmatter");
  return parts.slice(2).join("---");
}

function proseOf(body: string) {
  return body.replace(/```[\s\S]*?```/g, "");
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

/** Books from plan/LEARN.md §17. Absolute floors, not the 3× table above. */
const ABSOLUTE = ["ruby", "sqlite", "c"];

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
});
