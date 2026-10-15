export type RuntimeId = "python" | "ruby" | "quickjs" | "sqlite" | "clang" | "clangpp" | "php-cgi" | "lua" | "go";

export type DocLang =
  | "python"
  | "py"
  | "ruby"
  | "rb"
  | "js"
  | "javascript"
  | "ts"
  | "typescript"
  | "sql"
  | "sqlite"
  | "c"
  | "cpp"
  | "c++"
  | "php"
  | "lua"
  | "go";

export const DOC_LANG_TO_RUNTIME: Record<DocLang, RuntimeId> = {
  python: "python",
  py: "python",
  ruby: "ruby",
  rb: "ruby",
  js: "quickjs",
  javascript: "quickjs",
  ts: "quickjs",
  typescript: "quickjs",
  sql: "sqlite",
  sqlite: "sqlite",
  c: "clang",
  cpp: "clangpp",
  "c++": "clangpp",
  php: "php-cgi",
  lua: "lua",
  go: "go",
};

export const BOOKS = ["python", "ruby", "js", "sqlite", "c", "cpp", "php", "lua", "go"] as const;
export type BookId = (typeof BOOKS)[number];

/** Books with a full curriculum in this release. Other ids stay in the map and show “即将推出”. */
export const SHIPPED_BOOKS = ["python", "js", "go", "ruby", "sqlite"] as const;

export const RUNTIME_TO_BOOK: Record<RuntimeId, BookId> = {
  python: "python",
  ruby: "ruby",
  quickjs: "js",
  sqlite: "sqlite",
  clang: "c",
  clangpp: "cpp",
  "php-cgi": "php",
  lua: "lua",
  go: "go",
};

export const BOOK_TO_RUNTIME: Record<BookId, RuntimeId> = {
  python: "python",
  ruby: "ruby",
  js: "quickjs",
  sqlite: "sqlite",
  c: "clang",
  cpp: "clangpp",
  php: "php-cgi",
  lua: "lua",
  go: "go",
};

export const BOOK_LABEL: Record<BookId, string> = {
  python: "Python",
  ruby: "Ruby",
  js: "JavaScript",
  sqlite: "SQL",
  c: "C",
  cpp: "C++",
  php: "PHP",
  lua: "Lua",
  go: "Go",
};

export const LEVEL_LABEL = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
} as const;

const RUNTIME_LABEL: Record<RuntimeId, string> = {
  python: "Python",
  ruby: "Ruby",
  quickjs: "JavaScript",
  sqlite: "SQL",
  clang: "C",
  clangpp: "C++",
  "php-cgi": "PHP",
  lua: "Lua",
  go: "Go",
};

export function resolveRuntime(lang: string): RuntimeId | undefined {
  const key = lang.trim().toLowerCase() as DocLang;
  return DOC_LANG_TO_RUNTIME[key];
}

export function runtimeLabel(id: RuntimeId): string {
  return RUNTIME_LABEL[id];
}

export function isBookId(id: string): id is BookId {
  return (BOOKS as readonly string[]).includes(id);
}
