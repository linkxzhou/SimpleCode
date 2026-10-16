import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { renderNotes, type TermNote } from "../src/core/terminalLog.ts";
import { setLocale, t } from "../src/i18n/index.ts";

const mem = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => mem.get(key) ?? null,
    setItem: (key: string, value: string) => {
      mem.set(key, String(value));
    },
    removeItem: (key: string) => {
      mem.delete(key);
    },
    clear: () => mem.clear(),
    key: () => null,
    length: 0,
  },
});

const notes: TermNote[] = [
  { kind: "system", key: "downloadingRuntime", vars: { label: "Python", size: "24.6 MB" }, color: "2" },
  { kind: "raw", text: "PY-MARKER\n" },
  { kind: "system", key: "readyCached", vars: { label: "Python" }, color: "32" },
];

describe("terminal log", () => {
  beforeEach(() => setLocale("zh"));

  it("redraws system lines in the new locale and keeps program output", () => {
    const zh = renderNotes(notes, t);
    assert.match(zh, /正在下载 Python 运行时/);
    assert.match(zh, /PY-MARKER/);
    assert.match(zh, /Python 已就绪/);
    setLocale("en");
    const en = renderNotes(notes, t);
    assert.match(en, /Downloading the Python runtime/);
    assert.match(en, /Python is ready/);
    assert.match(en, /PY-MARKER/);
    assert.equal(en.includes("正在下载"), false);
    assert.equal(en.includes("已就绪"), false);
  });
});
