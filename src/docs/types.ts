export type Level = "beginner" | "intermediate" | "advanced";

export interface ChapterMeta {
  id: string;
  book: string;
  slug: string;
  language: string;
  chapter: number;
  title: string;
  level?: Level;
  minutes: number;
  goals: string[];
  sources: string[];
  updated: string;
  runtime?: string;
}

export interface BookIndex {
  id: string;
  chapters: ChapterMeta[];
}

export interface CodeBlockData {
  id: string;
  lang: string;
  code: string;
  html: string;
  runnable: boolean;
  stdin?: string;
  expect?: string;
  title?: string;
  file?: string;
  group?: string;
  eof: boolean;
  smoke?: string;
  exit?: number;
  reason?: string;
}

export type Segment =
  | { type: "html"; html: string }
  | { type: "code"; block: CodeBlockData }
  | { type: "callout"; kind: "tip" | "note" | "warning"; segments: Segment[] }
  | { type: "answer"; title: string; segments: Segment[] };

export interface ChapterDoc {
  meta: ChapterMeta;
  segments: Segment[];
}

export interface SearchDoc {
  id: string;
  book: string;
  title: string;
  headings: string;
  text: string;
}
