import { sep } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { renderDocs, type RenderedDocs } from "./docs/render";

const INDEX_ID = "virtual:docs-index";
const INDEX_RES = "\0virtual:docs-index";
const CHAPTER_ID = "virtual:docs-chapter/";
const CHAPTER_RES = "\0virtual:docs-chapter/";

function moduleSource(cache: RenderedDocs): string {
  const loaders = Object.keys(cache.chapters)
    .map((id) => `  ${JSON.stringify(id)}: () => import(${JSON.stringify(CHAPTER_ID + id)})`)
    .join(",\n");
  return `export const books = ${jsString(cache.books)};
export const booksEn = ${jsString(cache.booksEn)};
export const searchDocs = ${jsString(cache.searchDocs)};
export const searchDocsEn = ${jsString(cache.searchDocsEn)};
const loaders = {
${loaders}
};
export async function loadChapter(id) {
  const load = loaders[id];
  if (!load) throw new Error("unknown chapter " + id);
  const mod = await load();
  return mod.chapter;
}
`;
}

function chapterSource(cache: RenderedDocs, id: string): string {
  const chapter = cache.chapters[id];
  if (!chapter) throw new Error(`unknown docs chapter ${id}`);
  return `export const chapter = ${jsString(chapter)};\n`;
}

function jsString(value: unknown): string {
  return JSON.stringify(value).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

/** Build-time docs index, schema check, and per-chapter prerender (Shiki). */
export function docsPlugin(): Plugin {
  const root = fileURLToPath(new URL("..", import.meta.url));
  let cache: RenderedDocs | undefined;
  const loadCache = async () => {
    if (!cache) cache = await renderDocs(root);
    return cache;
  };
  return {
    name: "simplecode-docs",
    async buildStart() {
      cache = undefined;
      await loadCache();
    },
    configureServer(server) {
      const reload = (file: string) => {
        if (!file.includes(`${sep}docs${sep}`)) return;
        cache = undefined;
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.add(root + "docs");
      server.watcher.on("change", reload);
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);
    },
    resolveId(id) {
      if (id === INDEX_ID) return INDEX_RES;
      if (id.startsWith(CHAPTER_ID)) return "\0" + id;
    },
    async load(id) {
      if (id === INDEX_RES) return moduleSource(await loadCache());
      if (id.startsWith(CHAPTER_RES)) return chapterSource(await loadCache(), id.slice(CHAPTER_RES.length));
    },
  };
}
