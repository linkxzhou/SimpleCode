<script setup lang="ts">
import { computed } from "vue";
import { RotateCcw, Square, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import StudyModeSwitch from "./study/StudyModeSwitch.vue";
import RunButton from "./RunButton.vue";
import { useLanguageStore } from "@/stores/language";
import { useRunStore } from "@/stores/run";
import { fileNameFor, useEditorStore } from "@/stores/editor";
import { t } from "@/i18n";

const langs = useLanguageStore();
const run = useRunStore();
const editor = useEditorStore();
const isMac = navigator.platform.toLowerCase().includes("mac");
const mod = isMac ? "⌘" : "Ctrl";

const downloading = computed(() => langs.selectedState?.status === "downloading");
const ready = computed(() => ["ready", "cached"].includes(langs.selectedState?.status ?? ""));
const fileName = computed(() => {
  const l = langs.selected;
  if (!l) return "";
  return fileNameFor(l.id, l.fileName, editor.dialect);
});
const jsTs = computed(() => langs.selected?.id === "quickjs");

function reset() {
  const l = langs.selected;
  if (!l) return;
  const name = l.id === "quickjs" ? (editor.dialect === "ts" ? "TypeScript" : "JavaScript") : l.label;
  if (confirm(t("resetConfirm", { name }))) editor.reset(editor.activeBuffer(l.id));
}
</script>

<template>
  <div class="flex h-[var(--editor-toolbar-h)] shrink-0 items-center gap-1 border-b border-border px-3" data-testid="editor-toolbar">
    <span class="flex-1 truncate font-mono text-xs text-muted-foreground" data-testid="filename">{{ fileName }}</span>
    <div
      v-if="jsTs"
      class="flex h-7 items-center rounded-md border border-border p-0.5"
      role="group"
      :aria-label="t('dialectGroup')"
      data-testid="dialect-toggle"
    >
      <button
        type="button"
        data-testid="dialect-js"
        class="h-6 rounded px-2 font-mono text-xs"
        :class="editor.dialect === 'js' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'"
        :aria-pressed="editor.dialect === 'js'"
        title="JavaScript"
        @click="editor.dialect = 'js'"
      >
        JS
      </button>
      <button
        type="button"
        data-testid="dialect-ts"
        class="h-6 rounded px-2 font-mono text-xs"
        :class="editor.dialect === 'ts' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'"
        :aria-pressed="editor.dialect === 'ts'"
        :title="t('tsTitle')"
        @click="editor.dialect = 'ts'"
      >
        TS
      </button>
    </div>
    <StudyModeSwitch />
    <template v-if="downloading && langs.selected">
      <Button variant="ghost" size="xs" @click="langs.cancel(langs.selected.id)"><X />{{ t("cancelDownload") }}</Button>
    </template>
    <Tooltip>
      <TooltipTrigger as-child>
        <span>
          <RunButton test-id="run" :disabled="!langs.selected || run.running || downloading" :running="run.running" :status="run.status" @click="run.run()" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{{ ready || downloading ? t("runShortcut", { mod }) : t("runWillDownload") }}</TooltipContent>
    </Tooltip>
    <Button v-if="run.running" variant="ghost-destructive" size="xs" data-testid="stop" @click="run.stop()"><Square />Stop</Button>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="icon" class="h-7 w-7" :aria-label="t('resetSample')" @click="reset"><RotateCcw /></Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{{ t("resetSample") }}</TooltipContent>
    </Tooltip>
  </div>
</template>
