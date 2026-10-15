<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { Check, Circle } from "lucide-vue-next";
import Input from "@/components/ui/input/Input.vue";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea.vue";
import { LEVEL_LABEL } from "@/docs/runtime";
import type { Level } from "@/docs/types";
import type { ChapterMeta } from "@/docs/types";
import { useDocsStore } from "@/stores/docs";

const docs = useDocsStore();
const searchEl = ref<InstanceType<typeof Input>>();

const groups: { level: Level; label: string }[] = [
  { level: "beginner", label: LEVEL_LABEL.beginner },
  { level: "intermediate", label: LEVEL_LABEL.intermediate },
  { level: "advanced", label: LEVEL_LABEL.advanced },
];

const overview = computed(() => docs.visibleChapters.filter((c) => c.chapter === 0));
const grouped = computed(() =>
  groups
    .map((g) => ({ ...g, items: docs.visibleChapters.filter((c) => c.level === g.level) }))
    .filter((g) => g.items.length),
);

function parts(title: string) {
  const q = docs.query.trim();
  if (!q) return [{ text: title, hit: false }];
  const i = title.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return [{ text: title, hit: false }];
  return [
    { text: title.slice(0, i), hit: false },
    { text: title.slice(i, i + q.length), hit: true },
    { text: title.slice(i + q.length), hit: false },
  ].filter((p) => p.text);
}

function current(ch: ChapterMeta) {
  return docs.view === "chapter" && docs.chapterId === ch.id;
}

watch(
  () => docs.focusSearch,
  async (v) => {
    if (!v) return;
    await nextTick();
    searchEl.value?.focus();
    docs.focusSearch = false;
  },
);
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="px-3 pb-2 pt-3">
      <Input ref="searchEl" v-model="docs.query" type="search" placeholder="搜索本书…" aria-label="搜索本书" data-testid="docs-search" />
    </div>
    <ScrollArea class="flex-1 px-1 pb-4">
      <p v-if="!docs.visibleChapters.length" class="px-3 py-6 text-center text-sm text-muted-foreground">没有匹配的章节</p>
      <button
        v-for="ch in overview"
        :key="ch.id"
        type="button"
        data-testid="chapter-link"
        :data-chapter="ch.chapter"
        class="flex h-9 w-full items-center gap-2 rounded-sm px-3 text-left text-[13px] leading-5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        :class="current(ch) && 'border-l-2 border-foreground bg-accent font-medium'"
        @click="docs.openChapter(ch.id)"
      >
        <Circle v-if="current(ch)" class="size-3.5 shrink-0 fill-foreground text-foreground" />
        <Check v-else-if="docs.isRead(ch.id)" class="size-3.5 shrink-0" />
        <Circle v-else class="size-3.5 shrink-0 text-muted-foreground" />
        <span class="min-w-0 flex-1 truncate">概览</span>
      </button>
      <section v-for="g in grouped" :key="g.level">
        <h3 class="px-3 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{{ g.label }}</h3>
        <button
          v-for="ch in g.items"
          :key="ch.id"
          type="button"
          data-testid="chapter-link"
          :data-chapter="ch.chapter"
          class="flex h-9 w-full items-center gap-2 rounded-sm px-3 text-left text-[13px] leading-5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          :class="current(ch) && 'border-l-2 border-foreground bg-accent font-medium'"
          @click="docs.openChapter(ch.id)"
        >
          <Circle v-if="current(ch)" class="size-3.5 shrink-0 fill-foreground text-foreground" />
          <Check v-else-if="docs.isRead(ch.id)" class="size-3.5 shrink-0" />
          <Circle v-else class="size-3.5 shrink-0 text-muted-foreground" />
          <span class="min-w-0 flex-1 truncate">
            <span class="mr-1 font-mono text-[11px] text-muted-foreground">{{ String(ch.chapter).padStart(2, "0") }}</span>
            <template v-for="(p, i) in parts(ch.title)" :key="i">
              <mark v-if="p.hit">{{ p.text }}</mark>
              <template v-else>{{ p.text }}</template>
            </template>
          </span>
          <span class="shrink-0 text-xs text-muted-foreground">{{ ch.minutes }} 分</span>
        </button>
      </section>
    </ScrollArea>
  </div>
</template>
