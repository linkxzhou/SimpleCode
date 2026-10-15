/** Monochrome Shiki themes. Every color is grayscale (R = G = B). */

const lightFg = "#0A0A0A";
const darkFg = "#FAFAFA";

export const lightTheme = {
  name: "simplecode-mono-light",
  type: "light" as const,
  colors: {
    "editor.background": "#00000000",
    "editor.foreground": lightFg,
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#737373", fontStyle: "italic" } },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.other",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.declaration",
      ],
      settings: { foreground: lightFg, fontStyle: "bold" },
    },
    { scope: ["keyword.operator"], settings: { foreground: "#737373" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: lightFg } },
    {
      scope: ["entity.name.type", "entity.name.class", "support.type", "support.class", "entity.name.namespace"],
      settings: { foreground: "#262626" },
    },
    { scope: ["string", "string.template"], settings: { foreground: "#525252" } },
    { scope: ["constant.numeric", "constant.language", "constant.character"], settings: { foreground: "#404040" } },
    { scope: ["punctuation", "meta.brace"], settings: { foreground: "#737373" } },
    { scope: ["variable.parameter"], settings: { foreground: lightFg, fontStyle: "italic" } },
    { scope: ["invalid", "invalid.illegal"], settings: { foreground: lightFg, fontStyle: "underline" } },
  ],
};

export const darkTheme = {
  name: "simplecode-mono-dark",
  type: "dark" as const,
  colors: {
    "editor.background": "#00000000",
    "editor.foreground": darkFg,
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#A3A3A3", fontStyle: "italic" } },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.other",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.declaration",
      ],
      settings: { foreground: darkFg, fontStyle: "bold" },
    },
    { scope: ["keyword.operator"], settings: { foreground: "#8A8A8A" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: darkFg } },
    {
      scope: ["entity.name.type", "entity.name.class", "support.type", "support.class", "entity.name.namespace"],
      settings: { foreground: "#E5E5E5" },
    },
    { scope: ["string", "string.template"], settings: { foreground: "#C4C4C4" } },
    { scope: ["constant.numeric", "constant.language", "constant.character"], settings: { foreground: "#D4D4D4" } },
    { scope: ["punctuation", "meta.brace"], settings: { foreground: "#8A8A8A" } },
    { scope: ["variable.parameter"], settings: { foreground: darkFg, fontStyle: "italic" } },
    { scope: ["invalid", "invalid.illegal"], settings: { foreground: darkFg, fontStyle: "underline" } },
  ],
};
