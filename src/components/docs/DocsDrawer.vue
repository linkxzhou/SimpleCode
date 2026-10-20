<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import DocsHeader from "./DocsHeader.vue";
import ChapterList from "./ChapterList.vue";
import ChapterView from "./ChapterView.vue";
import LeetCodeList from "@/components/study/LeetCodeList.vue";
import LeetCodeProblem from "@/components/study/LeetCodeProblem.vue";
import { useDocsStore } from "@/stores/docs";
import { useLeetCodeStore } from "@/stores/leetcode";
import { useStudyStore } from "@/stores/study";
import { bookName, locale, t } from "@/i18n";
import { BOOK_LABEL } from "@/docs/runtime";

const docs = useDocsStore();
const study = useStudyStore();
const leet = useLeetCodeStore();
const leetMode = computed(() => study.mode === "leetcode");
const headerTitle = computed(() => {
  if (!leetMode.value) return docs.title;
  const row = leet.problem;
  return row ? `${row.id}. ${row.title}` : t("leetcodeTitle");
});
const showBack = computed(() => (leetMode.value ? !!leet.problem : docs.view === "chapter"));
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

watch(locale, (value) => {
  if (value === "en") docs.preferChinese = false;
});

watch(
  () => docs.open,
  (open) => {
    document.body.style.overflow = open && mobile.value ? "hidden" : "";
    if (!open) {
      const id = study.mode === "leetcode" ? "study-mode-leetcode" : "study-mode-learn";
      document.querySelector<HTMLButtonElement>(`[data-testid=${id}]`)?.focus();
    }
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
      :aria-label="t('closeTutorial')"
      @click="docs.close()"
    />
    <Transition name="doc-drawer">
      <div
        v-if="docs.open"
        id="docs-drawer"
        data-testid="docs-drawer"
        role="dialog"
        :aria-modal="mobile ? 'true' : 'false'"
        :aria-label="leetMode ? headerTitle : t('tutorialLabel', { title: docs.title })"
        :data-mode="study.mode"
        class="doc-drawer fixed z-40 flex flex-col bg-background shadow-sm"
        :class="mobile ? 'inset-x-0 bottom-0 top-[var(--editor-toolbar-h)] rounded-t-lg border-t border-border' : 'bottom-0 right-0 top-[var(--editor-toolbar-h)] border-l border-border'"
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
          :title="headerTitle"
          :show-back="showBack"
          :show-search="!leetMode && docs.view === 'chapter'"
          @back="leetMode ? leet.backToList() : docs.backToToc()"
          @close="docs.close()"
          @search="docs.openSearch()"
        />
        <div
          v-if="!leetMode && docs.bookChoices.length > 1"
          class="flex shrink-0 gap-1 border-b border-border px-2 py-1"
          data-testid="docs-books"
          role="group"
          :aria-label="t('quickStart')"
        >
          <button
            v-for="id in docs.bookChoices"
            :key="id"
            type="button"
            class="h-6 rounded px-2 text-xs"
            :class="docs.bookId === id ? 'bg-accent font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'"
            :data-testid="`docs-book-${id}`"
            :aria-pressed="docs.bookId === id"
            @click="docs.chooseBook(id)"
          >
            {{ bookName(id, BOOK_LABEL[id]) }}
          </button>
        </div>
        <div class="flex min-h-0 flex-1 flex-col">
          <LeetCodeProblem v-if="leetMode && leet.problem" />
          <LeetCodeList v-else-if="leetMode" />
          <div v-else-if="docs.gap" class="flex flex-1 flex-col items-start gap-3 px-5 py-8" data-testid="docs-en-placeholder" :data-gap="docs.gap">
            <p class="text-sm font-medium">{{ t("enPlaceholderTitle") }}</p>
            <p class="text-sm leading-6 text-muted-foreground">{{ docs.gap === "chapter" ? t("enPlaceholderChapter") : t("enPlaceholderBody") }}</p>
            <Button type="button" size="sm" data-testid="docs-view-zh" @click="docs.revealChinese()">{{ t("viewChinese") }}</Button>
          </div>
          <div v-else-if="docs.pending" class="flex flex-1 flex-col gap-2 px-5 py-8" data-testid="docs-soon">
            <p class="text-sm font-medium">{{ t("comingSoon") }}</p>
            <p class="text-sm leading-6 text-muted-foreground">{{ t("comingSoonBody") }}</p>
          </div>
          <ChapterList v-else-if="docs.view === 'toc'" class="min-h-0 flex-1" />
          <ChapterView v-else class="min-h-0 flex-1" />
        </div>
        <p class="sr-only" aria-live="polite">{{ docs.live }}</p>
      </div>
    </Transition>
  </Teleport>
</template>
