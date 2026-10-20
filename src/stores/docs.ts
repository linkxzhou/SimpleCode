import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import MiniSearch from "minisearch";
import { books, booksEn, loadChapter, searchDocs, searchDocsEn } from "virtual:docs-index";
import { chapterSlug, englishGap } from "@/docs/edition";
import type { ChapterDoc } from "@/docs/types";
import { BOOK_LABEL, isBookId, RUNTIME_BOOKS, RUNTIME_TO_BOOK, type BookId, type RuntimeId } from "@/docs/runtime";
import { bookName, locale, t } from "@/i18n";
import { useLanguageStore } from "./language";

const PROGRESS_KEY = "simplecode:learn:progress";
const POSITION_KEY = "simplecode:learn:positions";
const WIDTH_KEY = "simplecode:learn:width";

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const useDocsStore = defineStore("docs", () => {
  const langs = useLanguageStore();
  const open = ref(false);
  const bookId = ref<BookId | undefined>();
  const chapterId = ref<string>();
  const view = ref<"toc" | "chapter">("toc");
  const query = ref("");
  const width = ref(clampWidth(Number(localStorage.getItem(WIDTH_KEY)) || defaultWidth()));
  const progress = ref<Record<string, string[]>>(loadJson(PROGRESS_KEY, {}));
  const positions = ref<Record<string, string>>(loadJson(POSITION_KEY, {}));
  const cache = ref<Record<string, ChapterDoc>>({});
  const loading = ref(false);
  const loadError = ref<string>();
  const focusSearch = ref(false);
  const live = ref("");
  const preferChinese = ref(false);
  const useEnglish = computed(() => locale.value === "en" && !preferChinese.value);
  const catalog = computed(() => (useEnglish.value ? booksEn : books));

  const bookIds = books.map((b) => b.id);
  const pendingId = ref<BookId | undefined>();
  const book = computed(() => catalog.value.find((b) => b.id === bookId.value));
  const chapters = computed(() => book.value?.chapters ?? []);
  const pending = computed(() => (pendingId.value ? !bookIds.includes(pendingId.value) : false));
  const title = computed(() => {
    const id = bookId.value ?? pendingId.value;
    return id ? t("quickStartNamed", { label: bookName(id, BOOK_LABEL[id]) }) : t("quickStart");
  });
  const bookChoices = computed(() => RUNTIME_BOOKS[langs.selectedId as RuntimeId] ?? []);
  const current = computed(() => chapters.value.find((c) => c.id === chapterId.value));
  const gap = computed(() =>
    englishGap({
      edition: useEnglish.value ? "en" : "zh",
      slugs: booksEn.find((b) => b.id === bookId.value)?.chapters.map((c) => c.slug) ?? [],
      slug: chapterId.value ? chapterSlug(chapterId.value) : undefined,
      viewingChapter: view.value === "chapter",
    }),
  );

  let mini: MiniSearch<{ id: string; title: string; headings: string; text: string }> | undefined;
  function matches(id: string): boolean {
    const q = query.value.trim();
    if (!q) return true;
    const corpus = useEnglish.value ? searchDocsEn : searchDocs;
    if (!mini) {
      mini = new MiniSearch({
        fields: ["title", "headings", "text"],
        storeFields: ["id"],
        searchOptions: { prefix: true, fuzzy: 0.2, combineWith: "OR" },
      });
      mini.addAll(corpus);
    }
    const nq = q.toLowerCase();
    const doc = corpus.find((d) => d.id === id);
    if (doc && `${doc.title}\n${doc.headings}\n${doc.text}`.toLowerCase().includes(nq)) return true;
    try {
      return mini.search(q).some((r) => r.id === id);
    } catch {
      return false;
    }
  }

  const visibleChapters = computed(() => chapters.value.filter((c) => matches(c.id)));

  function persistProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress.value));
  }
  function persistPositions() {
    localStorage.setItem(POSITION_KEY, JSON.stringify(positions.value));
  }

  function goBook(id: BookId, preferChapter: boolean, slug?: string) {
    bookId.value = id;
    query.value = "";
    const list = catalog.value.find((b) => b.id === id)?.chapters ?? [];
    const wanted = slug ?? (positions.value[id] ? chapterSlug(positions.value[id]) : undefined);
    const found = wanted ? list.find((c) => c.slug === wanted) : undefined;
    if (preferChapter && found) {
      chapterId.value = found.id;
      view.value = "chapter";
      void ensureChapter(found.id);
    } else if (preferChapter && wanted && useEnglish.value) {
      chapterId.value = `en/${id}/${wanted}`;
      view.value = "chapter";
    } else {
      view.value = "toc";
    }
  }

  function focusBook(id: BookId, preferChapter: boolean) {
    if (!bookIds.includes(id)) {
      bookId.value = undefined;
      chapterId.value = undefined;
      pendingId.value = id;
      view.value = "toc";
      query.value = "";
      live.value = t("comingSoonLive", { label: BOOK_LABEL[id] });
      return;
    }
    pendingId.value = undefined;
    if (bookId.value !== id || view.value !== "chapter") goBook(id, preferChapter);
  }

  function chooseBook(id: BookId) {
    if (!bookIds.includes(id)) return;
    pendingId.value = undefined;
    goBook(id, false);
  }

  function show() {
    const mapped = RUNTIME_TO_BOOK[langs.selectedId as keyof typeof RUNTIME_TO_BOOK];
    if (!mapped || !isBookId(mapped)) return;
    open.value = true;
    focusBook(mapped, true);
  }
  function close() {
    open.value = false;
    preferChinese.value = false;
    live.value = t("closedTutorial");
  }
  function revealChinese() {
    const slug = chapterId.value ? chapterSlug(chapterId.value) : undefined;
    const id = bookId.value;
    const prefer = view.value === "chapter";
    preferChinese.value = true;
    if (id) goBook(id, prefer, slug);
  }

  watch(useEnglish, () => {
    mini = undefined;
    if (!open.value || !bookId.value) return;
    const slug = chapterId.value ? chapterSlug(chapterId.value) : undefined;
    goBook(bookId.value, view.value === "chapter", slug);
  });
  function toggle() {
    if (open.value) close();
    else show();
  }

  async function openChapter(id: string) {
    chapterId.value = id;
    view.value = "chapter";
    if (bookId.value) {
      positions.value = { ...positions.value, [bookId.value]: id };
      persistPositions();
    }
    const meta = chapters.value.find((c) => c.id === id);
    live.value = meta ? t("reading", { title: meta.title }) : "";
    await ensureChapter(id);
  }
  function backToToc() {
    view.value = "toc";
  }
  function openSearch() {
    view.value = "toc";
    focusSearch.value = true;
  }
  async function ensureChapter(id: string) {
    if (cache.value[id]) return cache.value[id];
    loading.value = true;
    loadError.value = undefined;
    try {
      const doc = await loadChapter(id);
      cache.value = { ...cache.value, [id]: doc };
      return doc;
    } catch (e) {
      loadError.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }
  function markRead(id: string) {
    const b = bookId.value;
    if (!b) return;
    const cur = progress.value[b] ?? [];
    if (cur.includes(id)) return;
    progress.value = { ...progress.value, [b]: [...cur, id] };
    persistProgress();
  }
  function isRead(id: string) {
    const b = bookId.value;
    return !!b && (progress.value[b] ?? []).includes(id);
  }
  function setWidth(px: number) {
    width.value = clampWidth(px);
    localStorage.setItem(WIDTH_KEY, String(width.value));
  }
  function adjacent(dir: -1 | 1) {
    if (view.value !== "chapter" || !chapterId.value) return;
    const list = chapters.value;
    const i = list.findIndex((c) => c.id === chapterId.value);
    const next = list[i + dir];
    if (next) void openChapter(next.id);
  }
  function prev() {
    adjacent(-1);
  }
  function next() {
    adjacent(1);
  }

  watch(
    () => langs.selectedId,
    (id) => {
      if (!open.value || langs.selectionOrigin === "doc") return;
      const mapped = RUNTIME_TO_BOOK[id as keyof typeof RUNTIME_TO_BOOK];
      if (mapped && isBookId(mapped)) focusBook(mapped, true);
    },
  );

  return {
    open,
    bookId,
    chapterId,
    view,
    query,
    width,
    loading,
    loadError,
    focusSearch,
    live,
    bookIds,
    pending,
    preferChinese,
    gap,
    book,
    chapters,
    visibleChapters,
    title,
    bookChoices,
    chooseBook,
    current,
    cache,
    show,
    close,
    revealChinese,
    toggle,
    openChapter,
    backToToc,
    openSearch,
    ensureChapter,
    markRead,
    isRead,
    setWidth,
    prev,
    next,
  };
});

function defaultWidth() {
  if (typeof window === "undefined") return 560;
  return Math.min(560, Math.round(window.innerWidth * 0.45));
}
function clampWidth(px: number) {
  if (!Number.isFinite(px)) return 560;
  return Math.min(760, Math.max(400, Math.round(px)));
}
