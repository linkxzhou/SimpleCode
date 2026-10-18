<script setup lang="ts">
import { computed } from "vue";
import Input from "@/components/ui/input/Input.vue";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea.vue";
import { DIFFICULTIES, type Difficulty } from "@/docs/leetcode";
import { t } from "@/i18n";
import { useLanguageStore } from "@/stores/language";
import { useLeetCodeStore } from "@/stores/leetcode";

const leet = useLeetCodeStore();
const langs = useLanguageStore();

const diffLabel = computed(() => ({
  easy: t("diffEasy"),
  medium: t("diffMedium"),
  hard: t("diffHard"),
}));

const filters: { id: Difficulty | "all"; label: () => string; count: () => number }[] = [
  { id: "all", label: () => t("diffAll"), count: () => leet.counts.all },
  { id: "easy", label: () => t("diffEasy"), count: () => leet.counts.easy },
  { id: "medium", label: () => t("diffMedium"), count: () => leet.counts.medium },
  { id: "hard", label: () => t("diffHard"), count: () => leet.counts.hard },
];

function scrollTo(level: Difficulty) {
  document.getElementById(`leetcode-group-${level}`)?.scrollIntoView({ block: "start" });
}
function pickLang(id: string) {
  const status = langs.states[id]?.status;
  if (status !== "cached" && status !== "ready") return;
  if (id !== langs.selectedId) void langs.select(id);
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col" data-testid="leetcode-list">
    <div class="flex flex-col gap-2 border-b border-border px-3 py-2">
      <p v-if="leet.emptyReason === 'none'" class="text-sm leading-6 text-muted-foreground" data-testid="leetcode-empty" data-reason="none">
        {{ t("leetcodeEmptyNone") }}
      </p>
      <p v-else-if="leet.emptyReason === 'unusable'" class="text-sm leading-6 text-muted-foreground" data-testid="leetcode-empty" data-reason="unusable">
        {{ t("leetcodeEmptyUnusable") }}
      </p>
      <div v-else class="flex flex-wrap items-center gap-1" :aria-label="t('leetcodeLangs')">
        <span class="mr-1 text-xs text-muted-foreground">{{ t("leetcodeLangs") }}</span>
        <button
          v-for="lang in leet.candidates"
          :key="lang.id"
          type="button"
          data-testid="leetcode-lang"
          :data-lang="lang.id"
          class="h-6 rounded border border-border px-2 font-mono text-xs"
          :class="langs.selectedId === lang.id ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'"
          :aria-pressed="langs.selectedId === lang.id"
          @click="pickLang(lang.id)"
        >
          {{ lang.short }}
        </button>
      </div>
      <Input v-model="leet.query" type="search" :placeholder="t('leetcodeSearch')" :aria-label="t('leetcodeSearch')" data-testid="leetcode-search" />
      <div class="flex flex-wrap items-center gap-1">
        <button
          v-for="item in filters"
          :key="item.id"
          type="button"
          :data-testid="`leetcode-diff-${item.id}`"
          class="h-6 rounded px-2 text-xs"
          :class="leet.difficulty === item.id ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'"
          :aria-pressed="leet.difficulty === item.id"
          @click="leet.difficulty = item.id"
        >
          {{ item.label() }} {{ item.count() }}
        </button>
        <select
          v-model="leet.tag"
          data-testid="leetcode-tag"
          class="ml-auto h-6 rounded border border-border bg-background px-1 text-xs text-foreground"
          :aria-label="t('leetcodeTag')"
        >
          <option value="">{{ t("leetcodeTagAll") }}</option>
          <option v-for="(label, id) in leet.tags" :key="id" :value="id">{{ label }}</option>
        </select>
      </div>
    </div>
    <ScrollArea class="min-h-0 flex-1">
      <div class="px-3 py-3">
        <p class="text-xs font-medium text-muted-foreground">{{ t("leetcodeToc") }}</p>
        <div class="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <button v-for="level in DIFFICULTIES" :key="level" type="button" class="hover:text-foreground" @click="scrollTo(level)">
            {{ diffLabel[level] }} · {{ leet.groups.find((group) => group.level === level)?.items.length ?? 0 }}
          </button>
        </div>
        <p v-if="!leet.groups.length" class="px-1 py-6 text-center text-sm text-muted-foreground" data-testid="leetcode-no-match">
          {{ t("leetcodeNoMatch") }}
        </p>
        <section v-for="group in leet.groups" :id="`leetcode-group-${group.level}`" :key="group.level" class="pt-4">
          <h3 class="px-1 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground" :data-testid="`leetcode-heading-${group.level}`">
            {{ diffLabel[group.level] }} · {{ group.items.length }}
          </h3>
          <button
            v-for="row in group.items"
            :key="row.id"
            type="button"
            data-testid="leetcode-problem"
            :data-id="row.id"
            :data-difficulty="row.difficulty"
            class="flex h-9 w-full items-center gap-2 rounded-sm px-1 text-left text-[13px] leading-5 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            @click="leet.openProblem(row.id)"
          >
            <span class="w-10 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{{ row.id }}</span>
            <span class="min-w-0 flex-1 truncate">{{ row.title }}</span>
            <span v-if="row.premium" class="shrink-0 text-[11px] text-muted-foreground">{{ t("leetcodePremium") }}</span>
            <span class="w-10 shrink-0 text-right text-[11px] text-muted-foreground">{{ diffLabel[row.difficulty] }}</span>
          </button>
        </section>
      </div>
    </ScrollArea>
  </div>
</template>
