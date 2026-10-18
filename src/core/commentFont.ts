// Monaco token rules have no fontSize. Comment colors are given their own
// theme entry so the generated .mtkN class is unique, then CSS shrinks that
// class by 1px. The class index changes when the theme changes.

export const EDITOR_FONT_SIZE = 14;
export const EDITOR_LINE_HEIGHT = 22;

export const COMMENT_THEME_COLOR = {
  "simplecode-light": "008000",
  "simplecode-dark": "608B4E",
} as const;

export type CommentThemeName = keyof typeof COMMENT_THEME_COLOR;

export function commentFontSize(editorFontSize: number): number {
  return editorFontSize - 1;
}

/** `.mtkN` whose color rule is exactly this #RRGGBB comment color. */
export function findCommentTokenClass(css: string, hex: string): string | null {
  const wanted = `#${hex}`.toLowerCase();
  for (const match of css.matchAll(/\.mtk(\d+)\s*\{[^}]*\bcolor:\s*([^;}]+)/g)) {
    if (match[2].trim().toLowerCase() === wanted) return `mtk${match[1]}`;
  }
  return null;
}

export function commentTypographyCss(tokenClass: string): string {
  const size = commentFontSize(EDITOR_FONT_SIZE);
  return `.monaco-editor .view-lines span.${tokenClass} { font-size: ${size}px; line-height: ${EDITOR_LINE_HEIGHT}px; }`;
}

const STYLE_ID = "simplecode-comment-font";

export function applyCommentTypography(theme: CommentThemeName): void {
  if (typeof document === "undefined") return;
  const css = [...document.querySelectorAll("style.monaco-colors")].map((node) => node.textContent ?? "").join("\n");
  const tokenClass = findCommentTokenClass(css, COMMENT_THEME_COLOR[theme]);
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = tokenClass ? commentTypographyCss(tokenClass) : "";
}
