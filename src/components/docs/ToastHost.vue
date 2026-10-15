<script setup lang="ts">
import { useToastStore } from "@/stores/toast";

const toast = useToastStore();
function act(id: number, fn?: () => void) {
  fn?.();
  toast.dismiss(id);
}
</script>

<template>
  <div class="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2" aria-live="polite">
    <div
      v-for="t in toast.items"
      :key="t.id"
      class="pointer-events-auto flex items-center gap-3 rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground shadow"
      role="status"
    >
      <span class="min-w-0 flex-1">{{ t.message }}</span>
      <button v-if="t.actionLabel" type="button" class="shrink-0 underline underline-offset-2" data-testid="doc-undo" @click="act(t.id, t.onAction)">
        {{ t.actionLabel }}
      </button>
    </div>
  </div>
</template>
