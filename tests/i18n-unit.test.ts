import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beforeEach, describe, it } from "node:test";
import { en, zh, type MessageKey } from "../src/i18n/messages.ts";
import { LOCALE_KEY, hydrateLocale, locale, setLocale, t } from "../src/i18n/index.ts";

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

const NAMES = ["Python", "Ruby", "JS/TS", "SQLite", "C++", "PHP", "Lua", "Go", "Shell", "Rust", "Linux"];

describe("i18n catalog", () => {
  beforeEach(() => {
    mem.clear();
    setLocale("zh");
  });

  it("gives every Chinese key a non-empty English string", () => {
    const keys = Object.keys(zh) as MessageKey[];
    assert.deepEqual(Object.keys(en).sort(), keys.sort());
    for (const key of keys) {
      assert.equal(typeof en[key], "string");
      assert.ok(en[key].trim().length > 0, key);
    }
  });

  it("defaults to Chinese and persists English", () => {
    assert.equal(locale.value, "zh");
    assert.equal(t("quickStartNamed", { label: "Python" }), "Python 快速入门");
    assert.equal(t("backToc"), "返回目录");
    setLocale("en");
    assert.equal(localStorage.getItem(LOCALE_KEY), "en");
    assert.equal(t("aboutTitle"), "About SimpleCode");
    assert.equal(t("quickStartNamed", { label: "Python" }), "Python Quick Start");
    assert.equal(t("viewChinese"), "View the Chinese version");
    assert.equal(t("enPlaceholderTitle"), "English Quick Start is under construction");
    setLocale("zh");
    mem.set(LOCALE_KEY, "en");
    hydrateLocale();
    assert.equal(locale.value, "en");
    hydrateLocale();
    mem.delete(LOCALE_KEY);
    hydrateLocale();
    assert.equal(locale.value, "zh");
  });

  it("lists all twelve languages in the about copy", () => {
    for (const name of NAMES) {
      assert.ok(zh.aboutLanguages.includes(name), name);
      assert.ok(en.aboutLanguages.includes(name), name);
    }
    assert.match(zh.aboutLanguages, /、C、/);
    assert.match(en.aboutLanguages, /, C,/);
    assert.match(zh.aboutWasm, /Cache API/);
    assert.match(en.aboutEditor, /Monaco/);
    assert.match(zh.aboutBooks, /快速入门/);
    assert.match(en.aboutBooks, /Quick Start/);
  });
});

describe("wasm progress spacing", () => {
  it("adds 4px of vertical margin around the download bar", () => {
    const src = readFileSync(new URL("../src/components/LanguageItem.vue", import.meta.url), "utf8");
    assert.match(src, /data-testid="wasm-progress"[\s\S]{0,240}my-\[4px\]/);
  });
});
