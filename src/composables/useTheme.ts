import { ref, watchEffect } from "vue";

export type ThemeMode = "system" | "light" | "dark";
const KEY = "simplecode:theme";
const mode = ref<ThemeMode>((localStorage.getItem(KEY) as ThemeMode) || "system");
const isDark = ref(false);
const mq = window.matchMedia("(prefers-color-scheme: dark)");

function apply() {
  isDark.value = mode.value === "dark" || (mode.value === "system" && mq.matches);
  document.documentElement.classList.toggle("dark", isDark.value);
}
mq.addEventListener("change", apply);
watchEffect(() => {
  localStorage.setItem(KEY, mode.value);
  apply();
});

export function useTheme() {
  const cycle = () => {
    mode.value = mode.value === "system" ? "light" : mode.value === "light" ? "dark" : "system";
  };
  return { mode, isDark, cycle };
}
