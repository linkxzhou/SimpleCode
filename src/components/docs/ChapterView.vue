<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Badge } from "@/components/ui/badge";
import { t } from "@/i18n";
import { useDocsStore } from "@/stores/docs";
import ChapterPager from "./ChapterPager.vue";
import DocSegments from "./DocSegments.vue";

const docs = useDocsStore();
const scroller = ref<HTMLElement>();
let timer: number | undefined;

const doc = computed(() => (docs.chapterId ? docs.cache[docs.chapterId] : undefined));
const meta = computed(() => doc.value?.meta ?? docs.current);

function arm() {
  window.clearTimeout(timer);
  const id = docs.chapterId;
  if (!id) return;
  timer = window.setTimeout(() => docs.markRead(id), 30_000);
  requestAnimationFrame(() => {
    const el = scroller.value;
    if (el && el.scrollHeight <= el.clientHeight + 48) docs.markRead(id);
  });
}
function onScroll(e: Event) {
  const el = e.target as HTMLElement;
  const id = docs.chapterId;
  if (!id) return;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) docs.markRead(id);
}

watch(() => docs.chapterId, () => arm());
onMounted(arm);
onBeforeUnmount(() => window.clearTimeout(timer));
</script>

<template>
  <div class="flex h-full min-h-0 flex-col" data-testid="docs-chapter">
    <div ref="scroller" class="doc-scroll min-h-0 flex-1 overflow-auto px-5 py-4" @scroll="onScroll">
        <p v-if="docs.loading && !doc" class="text-sm text-muted-foreground">{{ t("loading") }}</p>
        <p v-else-if="docs.loadError" class="text-sm" role="alert">{{ docs.loadError }}</p>
        <template v-else-if="meta">
          <h1 class="text-xl font-semibold leading-7 tracking-tight">{{ meta.title }}</h1>
          <p class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Badge v-if="meta.level === 'beginner'">{{ t("levelBeginner") }}</Badge>
            <Badge v-else-if="meta.level === 'intermediate'">{{ t("levelIntermediate") }}</Badge>
            <Badge v-else-if="meta.level === 'advanced'">{{ t("levelAdvanced") }}</Badge>
            <span>{{ t("aboutMinutes", { n: meta.minutes }) }}</span>
          </p>
          <div v-if="doc" class="mt-4">
            <DocSegments :segments="doc.segments" :book="meta.book" />
          </div>
        </template>
    </div>
    <ChapterPager />
  </div>
</template>
