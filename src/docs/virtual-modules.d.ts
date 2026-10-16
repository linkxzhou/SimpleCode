declare module "virtual:docs-index" {
  import type { BookIndex, ChapterDoc, SearchDoc } from "@/docs/types";
  export const books: BookIndex[];
  export const booksEn: BookIndex[];
  export const searchDocs: SearchDoc[];
  export const searchDocsEn: SearchDoc[];
  export function loadChapter(id: string): Promise<ChapterDoc>;
}
