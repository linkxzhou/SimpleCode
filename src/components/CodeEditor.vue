<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { applyCommentTypography, EDITOR_FONT_SIZE, EDITOR_LINE_HEIGHT, type CommentThemeName } from "@/core/commentFont";
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
    m.onDidChangeContent(() => {
      const value = m!.getValue();
      if (value !== editorStore.get(id)) editorStore.set(id, value, { origin: "model" });
    });
    models.set(id, m);
  }
  return m;
}

function themeName(dark: boolean): CommentThemeName {
  return dark ? "simplecode-dark" : "simplecode-light";
}

onMounted(() => {
  const initial = themeName(isDark.value);
  monaco.editor.setTheme(initial);
  editor = monaco.editor.create(el.value!, {
    automaticLayout: true,
    fontFamily: '"JetBrains Mono", "SimpleCode CJK", ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: EDITOR_FONT_SIZE,
    lineHeight: EDITOR_LINE_HEIGHT,
    // ASCII lines otherwise position the cursor on the 14px grid and ignore
    // the smaller comment spans. DOM measurement keeps clicks on the glyphs.
    disableMonospaceOptimizations: true,
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
  // The .mtk stylesheet is created with the editor. Apply before the first
  // animation frame so Monaco measures the 13px comment glyphs.
  applyCommentTypography(initial);
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
// external resets (editor store) -> model. Post flush so a dialect switch lands first.
watch(
  () => {
    const l = langs.selected;
    return l ? editorStore.codes[editorStore.activeBuffer(l.id)] : undefined;
  },
  (code) => {
    const l = langs.selected;
    if (!l) return;
    const id = editorStore.activeBuffer(l.id);
    const m = models.get(id);
    if (!m || code === undefined || m.getValue() === code) {
      editorStore.consumeOrigin(id);
      return;
    }
    const origin = editorStore.consumeOrigin(id);
    if (origin === "doc" && editor) {
      m.pushEditOperations(editor.getSelections(), [{ range: m.getFullModelRange(), text: code }], () => [new monaco.Selection(1, 1, 1, 1)]);
      editor.setPosition({ lineNumber: 1, column: 1 });
      editor.revealLine(1);
    } else m.setValue(code);
  },
  { flush: "post" },
);
watch(isDark, (d) => {
  const theme = themeName(d);
  monaco.editor.setTheme(theme);
  applyCommentTypography(theme);
});

onBeforeUnmount(() => {
  editor?.dispose();
  models.forEach((m) => m.dispose());
});
</script>

<template>
  <div ref="el" data-testid="editor" class="overflow-hidden" />
</template>
