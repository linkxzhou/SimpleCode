import { defineStore } from "pinia";
import { ref } from "vue";

export interface ToastItem {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const useToastStore = defineStore("toast", () => {
  const items = ref<ToastItem[]>([]);
  let n = 0;
  const timers = new Map<number, number>();

  function dismiss(id: number) {
    const timer = timers.get(id);
    if (timer) window.clearTimeout(timer);
    timers.delete(id);
    items.value = items.value.filter((t) => t.id !== id);
  }
  function dismissAll() {
    for (const id of [...timers.keys()]) dismiss(id);
    items.value = [];
  }
  function push(message: string, action?: { label: string; run: () => void }, ms = 8000) {
    const id = ++n;
    items.value = [...items.value, { id, message, actionLabel: action?.label, onAction: action?.run }];
    timers.set(id, window.setTimeout(() => dismiss(id), ms));
    return id;
  }
  return { items, push, dismiss, dismissAll };
});
