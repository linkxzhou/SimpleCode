<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { useDocsStore } from "@/stores/docs";
import { t } from "@/i18n";

const docs = useDocsStore();
const index = computed(() => docs.chapters.findIndex((c) => c.id === docs.chapterId));
const prev = computed(() => (index.value > 0 ? docs.chapters[index.value - 1] : undefined));
const next = computed(() => (index.value >= 0 ? docs.chapters[index.value + 1] : undefined));

function label(chapter: number, title: string) {
  return chapter === 0 ? t("overviewNamed", { title }) : `${String(chapter).padStart(2, "0")} ${title}`;
}
</script>

<template>
  <div class="flex shrink-0 items-center justify-between gap-2 border-t border-border px-3 py-2">
    <Button type="button" variant="outline" size="xs" class="max-w-[46%] truncate" :disabled="!prev" @click="prev && docs.openChapter(prev.id)">
      <span class="truncate">‹ {{ prev ? label(prev.chapter, prev.title) : t("prevChapter") }}</span>
    </Button>
    <Button type="button" variant="outline" size="xs" class="max-w-[46%] truncate" :disabled="!next" @click="next && docs.openChapter(next.id)">
      <span class="truncate">{{ next ? label(next.chapter, next.title) : t("nextChapter") }} ›</span>
    </Button>
  </div>
</template>
