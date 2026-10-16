import { ref } from "vue";
import { en, zh, type MessageKey } from "./messages.ts";

export const LOCALE_KEY = "simplecode:locale";
export type Locale = "zh" | "en";

export const messages = { zh, en };

/** Default is Chinese until `hydrateLocale` reads localStorage. */
export const locale = ref<Locale>("zh");

export function storedLocale(): Locale {
  try {
    return localStorage.getItem(LOCALE_KEY) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

export function hydrateLocale() {
  locale.value = storedLocale();
}

export function setLocale(next: Locale) {
  locale.value = next === "en" ? "en" : "zh";
  try {
    localStorage.setItem(LOCALE_KEY, locale.value);
  } catch {
    /* private mode */
  }
}

function fill(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  let out = template;
  for (const [key, value] of Object.entries(vars)) out = out.split(`{${key}}`).join(String(value));
  return out;
}

/** Reads `locale` so Vue templates and computeds refresh after a toggle. */
export function t(key: MessageKey, vars?: Record<string, string | number>): string {
  const pack = locale.value === "en" ? en : zh;
  return fill(pack[key], vars);
}
