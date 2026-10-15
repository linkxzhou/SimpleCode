import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { samples } from "@/samples";

const key = (id: string) => `simplecode:code:${id}`;
const DIALECT_KEY = "simplecode:quickjs:dialect";
const LEGACY_QUICKJS = "simplecode:code:quickjs";

export type JsDialect = "js" | "ts";

export function bufferId(langId: string, dialect: JsDialect) {
  return langId === "quickjs" ? `quickjs:${dialect}` : langId;
}

export function syntaxFor(langId: string, syntax: string, dialect: JsDialect) {
  if (langId !== "quickjs") return syntax;
  return dialect === "ts" ? "typescript" : "javascript";
}

export function fileNameFor(langId: string, fileName: string, dialect: JsDialect) {
  if (langId !== "quickjs") return fileName;
  return dialect === "ts" ? "main.ts" : "main.js";
}

export const useEditorStore = defineStore("editor", () => {
  const codes = reactive<Record<string, string>>({});
  const stored = localStorage.getItem(DIALECT_KEY);
  const dialect = ref<JsDialect>(stored === "ts" ? "ts" : "js");
  watch(dialect, (d) => localStorage.setItem(DIALECT_KEY, d));

  function activeBuffer(langId: string) {
    return bufferId(langId, dialect.value);
  }

  function get(id: string) {
    if (!(id in codes)) {
      let saved = localStorage.getItem(key(id));
      if (saved === null && id === "quickjs:js") {
        const legacy = localStorage.getItem(LEGACY_QUICKJS);
        if (legacy !== null) {
          saved = legacy;
          localStorage.setItem(key(id), legacy);
          localStorage.removeItem(LEGACY_QUICKJS);
        }
      }
      codes[id] = saved ?? samples[id] ?? "";
    }
    return codes[id];
  }
  function set(id: string, code: string) {
    codes[id] = code;
    localStorage.setItem(key(id), code);
  }
  function reset(id: string) {
    localStorage.removeItem(key(id));
    codes[id] = samples[id] ?? "";
  }
  return { codes, dialect, activeBuffer, get, set, reset };
});
