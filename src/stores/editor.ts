import { defineStore } from "pinia";
import { reactive } from "vue";
import { samples } from "@/samples";

const key = (id: string) => `simplecode:code:${id}`;

export const useEditorStore = defineStore("editor", () => {
  const codes = reactive<Record<string, string>>({});

  function get(id: string) {
    if (!(id in codes)) codes[id] = localStorage.getItem(key(id)) ?? samples[id] ?? "";
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
  return { codes, get, set, reset };
});
