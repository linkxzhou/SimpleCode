<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { monaco } from "@/core/monaco";
import { useLanguageStore } from "@/stores/language";
import { syntaxFor, useEditorStore } from "@/stores/editor";
import { useRunStore } from "@/stores/run";
import { useTheme } from "@/composables/useTheme";

const el = ref<HTMLDivElement>();
const langs = useLanguageStore();
const editorStore = useEditorStore();
const run = useRunStore();
const { isDark } = useTheme();
let editor: monaco.editor.IStandaloneCodeEditor | undefined;
const models = new Map<string, monaco.editor.ITextModel>();

function modelFor(id: string, syntax: string) {
  let m = models.get(id);
  if (!m) {
    m = monaco.editor.createModel(editorStore.get(id), syntax);
    m.onDidChangeContent(() => editorStore.set(id, m!.getValue()));
    models.set(id, m);
  }
  return m;
}

onMounted(() => {
  editor = monaco.editor.create(el.value!, {
    automaticLayout: true,
    fontFamily: '"JetBrains Mono", "SimpleCode CJK", ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 14,
    lineHeight: 22,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    padding: { top: 12 },
    renderLineHighlight: "line",
    tabSize: 4,
    theme: isDark.value ? "simplecode-dark" : "simplecode-light",
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
  });
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => void run.run());
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Period, () => run.stop());
  (globalThis as unknown as { __simplecodeEditor: typeof editor }).__simplecodeEditor = editor;
});

watch(
  () => [langs.selected?.id, editorStore.dialect] as const,
  () => {
    const l = langs.selected;
    if (!l || !editor) return;
    editor.setModel(modelFor(editorStore.activeBuffer(l.id), syntaxFor(l.id, l.syntax, editorStore.dialect)));
  },
  { immediate: true, flush: "post" },
);
// external resets (editor store) -> model
watch(
  () => {
    const l = langs.selected;
    return l ? editorStore.codes[editorStore.activeBuffer(l.id)] : undefined;
  },
  (code) => {
    const l = langs.selected;
    const m = l && models.get(editorStore.activeBuffer(l.id));
    if (m && code !== undefined && m.getValue() !== code) m.setValue(code);
  },
);
watch(isDark, (d) => monaco.editor.setTheme(d ? "simplecode-dark" : "simplecode-light"));

onBeforeUnmount(() => {
  editor?.dispose();
  models.forEach((m) => m.dispose());
});
</script>

<template>
  <div ref="el" data-testid="editor" class="overflow-hidden" />
</template>
