<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import DocsHeader from "./DocsHeader.vue";
import ChapterList from "./ChapterList.vue";
import ChapterView from "./ChapterView.vue";
import { useDocsStore } from "@/stores/docs";

const docs = useDocsStore();
const mobile = ref(window.matchMedia("(max-width: 767px)").matches);
const mq = window.matchMedia("(max-width: 767px)");
function onMq() {
  mobile.value = mq.matches;
}

function onResizeStart(e: PointerEvent) {
  if (mobile.value) return;
  const startX = e.clientX;
  const startW = docs.width;
  const move = (ev: PointerEvent) => docs.setWidth(startW + (startX - ev.clientX));
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

watch(
  () => docs.open,
  (open) => {
    document.body.style.overflow = open && mobile.value ? "hidden" : "";
    if (!open) document.querySelector<HTMLButtonElement>("[data-testid=learn-button]")?.focus();
  },
);

onMounted(() => mq.addEventListener("change", onMq));
onBeforeUnmount(() => {
  mq.removeEventListener("change", onMq);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <button
      v-if="docs.open && mobile"
      type="button"
      class="fixed inset-0 z-30 bg-foreground/20"
      aria-label="关闭教程"
      @click="docs.close()"
    />
    <Transition name="doc-drawer">
      <div
        v-if="docs.open"
        id="docs-drawer"
        data-testid="docs-drawer"
        role="dialog"
        :aria-modal="mobile ? 'true' : 'false'"
        :aria-label="`${docs.title} 教程`"
        class="doc-drawer fixed z-40 flex flex-col bg-background shadow-sm"
        :class="mobile ? 'inset-x-0 bottom-0 h-[92vh] rounded-t-lg border-t border-border' : 'inset-y-0 right-0 border-l border-border'"
        :data-side="mobile ? 'bottom' : 'right'"
        :style="mobile ? undefined : { width: `min(${docs.width}px, 92vw)` }"
      >
        <div
          v-if="!mobile"
          class="absolute left-0 top-0 z-10 h-full w-1.5 cursor-col-resize hover:bg-foreground/20"
          aria-hidden="true"
          @pointerdown="onResizeStart"
        />
        <DocsHeader
          :title="docs.title"
          :show-back="docs.view === 'chapter'"
          @back="docs.backToToc()"
          @close="docs.close()"
          @search="docs.openSearch()"
        />
        <div class="flex min-h-0 flex-1 flex-col">
          <div v-if="docs.pending" class="flex flex-1 flex-col gap-2 px-5 py-8" data-testid="docs-soon">
            <p class="text-sm font-medium">即将推出</p>
            <p class="text-sm leading-6 text-muted-foreground">{{ docs.title }} 还在编写。目前可以阅读 Python、JavaScript 和 Go。</p>
          </div>
          <ChapterList v-else-if="docs.view === 'toc'" class="min-h-0 flex-1" />
          <ChapterView v-else class="min-h-0 flex-1" />
        </div>
        <p class="sr-only" aria-live="polite">{{ docs.live }}</p>
      </div>
    </Transition>
  </Teleport>
</template>
