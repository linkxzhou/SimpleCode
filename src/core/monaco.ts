// Monaco bundled locally (no CDN). Only the base editor worker is needed because
// all languages use Monarch tokenizers (basic-languages).
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/editor/editor.all";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution";
import "monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/sql/sql.contribution";
import "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution";
import "monaco-editor/esm/vs/basic-languages/php/php.contribution";
import "monaco-editor/esm/vs/basic-languages/lua/lua.contribution";
import "monaco-editor/esm/vs/basic-languages/go/go.contribution";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

(self as unknown as { MonacoEnvironment: monaco.Environment }).MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
};

monaco.editor.defineTheme("simplecode-light", {
  base: "vs",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#ffffff",
    "editorLineNumber.foreground": "#a1a1aa",
    "editorLineNumber.activeForeground": "#18181b",
    "editor.lineHighlightBackground": "#f4f4f5",
    "editor.lineHighlightBorder": "#00000000",
  },
});
monaco.editor.defineTheme("simplecode-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#09090b",
    "editorLineNumber.foreground": "#52525b",
    "editorLineNumber.activeForeground": "#e4e4e7",
    "editor.lineHighlightBackground": "#18181b",
    "editor.lineHighlightBorder": "#00000000",
  },
});

export { monaco };
