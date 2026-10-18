<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRunFromDoc } from "@/composables/useRunFromDoc";
import { terminal } from "@/core/terminal";
import { loadSolution, outputsMatch } from "@/docs/leetcode";
import { locale, t } from "@/i18n";
import { useLanguageStore } from "@/stores/language";
import { useLeetCodeStore } from "@/stores/leetcode";
import { useRunStore } from "@/stores/run";
import { useStudyStore } from "@/stores/study";

const DOC_LANG: Record<string, string> = {
  python: "python",
  ruby: "ruby",
  quickjs: "javascript",
  clang: "c",
  clangpp: "cpp",
  lua: "lua",
  go: "go",
  rust: "rust",
  java: "java",
};

const leet = useLeetCodeStore();
const study = useStudyStore();
const langs = useLanguageStore();
const run = useRunStore();
const fromDoc = useRunFromDoc();
const code = ref("");
const match = ref<"yes" | "no" | "">("");

const problem = computed(() => leet.problem);
const runtimeId = computed(() => langs.selectedId);
const solution = computed(() => (problem.value && runtimeId.value ? problem.value.solutions[runtimeId.value] : undefined));
const revealed = computed(() => (problem.value && runtimeId.value ? study.isRevealed(problem.value.id, runtimeId.value) : false));
const diffLabel = computed(() => {
  const level = problem.value?.difficulty;
  if (level === "easy") return t("diffEasy");
  if (level === "medium") return t("diffMedium");
  if (level === "hard") return t("diffHard");
  return "";
});
const tagLine = computed(() => {
  const row = problem.value;
  if (!row) return "";
  return row.tags.map((id) => leet.tags[id] ?? id).join(" · ");
});

watch(
  () => [problem.value?.id, runtimeId.value, revealed.value] as const,
  async ([id, runtime, open]) => {
    match.value = "";
    if (!id || !runtime || !open || !solution.value) {
      code.value = "";
      return;
    }
    code.value = await loadSolution(id, solution.value.file);
  },
);

watch(locale, () => {
  void leet.reloadEdition();
});

function sampleNote(index: number) {
  const row = problem.value;
  if (!row) return "";
  if (locale.value === "en") return row.notes[index] ?? "";
  return row.samples[index]?.note ?? "";
}

async function runSample() {
  const row = problem.value;
  const sample = row?.samples[0];
  if (!row || !sample) return;
  await run.run({ stdin: sample.stdin, stdinEOF: true, source: `leetcode:${row.id}` });
  const ok = outputsMatch(terminal.transcript, sample.stdin, sample.stdout);
  match.value = ok ? "yes" : "no";
  if (ok) study.markSolved(row.id);
}

async function loadAndRun() {
  const row = problem.value;
  const sample = row?.samples[0];
  const runtime = runtimeId.value;
  if (!row || !sample || !runtime || !code.value) return;
  const result = await fromDoc.runFromDoc(code.value, DOC_LANG[runtime] ?? runtime, {
    blockId: `leetcode:${row.id}`,
    stdin: sample.stdin,
    stdinEOF: true,
    keepDrawerOpen: true,
    confirmStop: () => Promise.resolve(window.confirm(t("confirmStop"))),
  });
  if (result.type !== "finished") return;
  const ok = outputsMatch(terminal.transcript, sample.stdin, sample.stdout);
  match.value = ok ? "yes" : "no";
}

function toggleSolution() {
  const row = problem.value;
  const runtime = runtimeId.value;
  if (!row || !runtime) return;
  study.toggleReveal(row.id, runtime);
}

const actionButtonClass =
  "inline-flex h-7 shrink-0 items-center rounded border border-border px-2 py-0 text-xs leading-none hover:bg-accent";
const actionNoticeClass =
  "m-0 inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded border border-border bg-muted/40 px-2 py-0 text-xs leading-none text-muted-foreground";
</script>

<template>
  <div v-if="problem" class="flex min-h-0 flex-1 flex-col" data-testid="leetcode-problem-page" :data-id="problem.id">
    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
      <p class="text-xs text-muted-foreground">
        {{ diffLabel }}<span v-if="tagLine"> · {{ tagLine }}</span>
        <span v-if="problem.premium"> · {{ t("leetcodePremium") }}</span>
      </p>
      <p class="mt-3 text-sm leading-6" data-testid="leetcode-summary">{{ problem.summary }}</p>
      <div v-for="(sample, index) in problem.samples" :key="index" class="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p class="mb-1 text-xs text-muted-foreground">{{ t("leetcodeSampleIn") }}</p>
          <pre class="overflow-x-auto rounded border border-border bg-muted/40 p-2 font-mono text-xs leading-5 whitespace-pre">{{ sample.stdin }}</pre>
        </div>
        <div>
          <p class="mb-1 text-xs text-muted-foreground">{{ t("leetcodeSampleOut") }}</p>
          <pre class="overflow-x-auto rounded border border-border bg-muted/40 p-2 font-mono text-xs leading-5 whitespace-pre">{{ sample.stdout }}</pre>
        </div>
        <p v-if="sampleNote(index)" class="col-span-2 text-xs leading-5 text-muted-foreground">{{ sampleNote(index) }}</p>
      </div>
      <p class="mt-4 flex flex-wrap gap-3 text-sm">
        <a :href="problem.links.cn" target="_blank" rel="noreferrer" class="underline underline-offset-2">{{ t("leetcodeLinkCn") }}</a>
        <a :href="problem.links.en" target="_blank" rel="noreferrer" class="underline underline-offset-2">{{ t("leetcodeLinkEn") }}</a>
      </p>
      <div class="mt-4 flex flex-wrap items-center gap-2" data-testid="leetcode-actions">
        <button
          v-if="solution"
          type="button"
          data-testid="leetcode-reveal"
          :class="actionButtonClass"
          :aria-expanded="revealed"
          @click="toggleSolution"
        >
          {{ revealed ? t("leetcodeHideSolution") : t("leetcodeShowSolution") }}
        </button>
        <p v-else :class="actionNoticeClass" data-testid="leetcode-no-solution">{{ t("leetcodeNoSolution") }}</p>
        <button type="button" data-testid="leetcode-run-sample" :class="actionButtonClass" @click="runSample">
          {{ t("leetcodeRunSample") }}
        </button>
        <button
          v-if="solution && revealed"
          type="button"
          data-testid="leetcode-load-run"
          :class="actionButtonClass"
          @click="loadAndRun"
        >
          {{ t("leetcodeLoadRun") }}
        </button>
      </div>
      <p v-if="match === 'yes'" class="mt-2 text-sm text-muted-foreground" data-testid="leetcode-match">{{ t("expectMatch") }}</p>
      <p v-else-if="match === 'no'" class="mt-2 text-sm text-muted-foreground" data-testid="leetcode-match">{{ t("expectDiffer") }}</p>
      <div v-if="solution && revealed" class="mt-4" data-testid="leetcode-solution">
        <p class="mb-1 text-xs text-muted-foreground">
          <template v-if="solution.shareAlike">{{ t("leetcodeCreditSa") }}</template>
          <template v-else>{{ t("leetcodeCreditMit", { repo: solution.sourceRepo }) }}</template>
          ·
          <a :href="solution.sourceUrl" target="_blank" rel="noreferrer" class="underline underline-offset-2">{{ solution.license }}</a>
        </p>
        <pre class="overflow-x-auto rounded border border-border p-3 font-mono text-xs leading-5 whitespace-pre">{{ code }}</pre>
      </div>
    </div>
  </div>
</template>
