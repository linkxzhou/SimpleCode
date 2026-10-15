export function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Drop the newline Shiki inserts between `.line` spans. Empty source lines stay empty spans. */
export function collapseShikiLines(html: string): string {
  return html.replace(/\n+(?=<span class="line")/g, "");
}
