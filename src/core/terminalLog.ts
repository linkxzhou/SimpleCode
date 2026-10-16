import type { MessageKey } from "@/i18n/messages.ts";

export type TermNote =
  | { kind: "raw"; text: string }
  | { kind: "system"; key: MessageKey; vars?: Record<string, string | number>; color: string };

export function renderNote(note: TermNote, translate: (key: MessageKey, vars?: Record<string, string | number>) => string): string {
  if (note.kind === "raw") return note.text;
  return `\x1b[${note.color}m[SimpleCode] ${translate(note.key, note.vars)}\x1b[0m\n`;
}

export function renderNotes(notes: readonly TermNote[], translate: (key: MessageKey, vars?: Record<string, string | number>) => string): string {
  let out = "";
  for (const note of notes) out += renderNote(note, translate);
  return out;
}
