import { resolveRuntime } from "./runtime.ts";

export interface FenceAttrs {
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

export interface ParsedFence {
  lang: string;
  attrs: FenceAttrs;
  /** Attributes other than the known keys, for tests and forward compatibility. */
  extra: Record<string, string | boolean>;
}

const KNOWN = new Set(["run", "norun", "stdin", "expect", "title", "file", "group", "eof", "smoke", "exit"]);

function unescapeValue(s: string): string {
  return s.replace(/\\([\\ntr"])/g, (_, c: string) => {
    switch (c) {
      case "\\":
        return "\\";
      case "n":
        return "\n";
      case "t":
        return "\t";
      case "r":
        return "\r";
      case '"':
        return '"';
      default:
        return c;
    }
  });
}

function asString(v: string | boolean | undefined): string | undefined {
  return typeof v === "string" ? v : undefined;
}

/** Parse a markdown fence info string: `python run stdin="Ada\\n" expect="hi"`. */
export function parseFenceInfo(info: string): ParsedFence {
  const src = info.trim();
  const langMatch = /^(\S+)/.exec(src);
  const lang = langMatch?.[1] ?? "";
  let i = lang.length;
  const raw: Record<string, string | boolean> = {};
  while (i < src.length) {
    while (src[i] === " " || src[i] === "\t") i++;
    if (i >= src.length) break;
    const slice = src.slice(i);
    const m = /^([A-Za-z_][\w-]*)(?:=(?:"((?:\\.|[^"\\])*)"|(\S+)))?/.exec(slice);
    if (!m) {
      const junk = /^\S+/.exec(slice);
      i += junk ? junk[0].length : 1;
      continue;
    }
    const key = m[1];
    if (m[2] !== undefined) raw[key] = unescapeValue(m[2]);
    else if (m[3] !== undefined) raw[key] = unescapeValue(m[3]);
    else raw[key] = true;
    i += m[0].length;
  }

  const extra: Record<string, string | boolean> = {};
  for (const [k, v] of Object.entries(raw)) if (!KNOWN.has(k)) extra[k] = v;

  const norun = raw.norun === true;
  const multi = typeof raw.file === "string" || typeof raw.group === "string";
  const runtime = lang ? resolveRuntime(lang) : undefined;
  let runnable = false;
  let reason: string | undefined;
  if (norun) reason = "仅供阅读";
  else if (multi) reason = "多文件示例请在本地运行";
  else if (!runtime) reason = "不可运行";
  else runnable = true;

  let eof = true;
  if (raw.eof === false || raw.eof === "false" || raw.eof === "0") eof = false;

  let exit: number | undefined;
  if (typeof raw.exit === "string" && raw.exit !== "" && !Number.isNaN(Number(raw.exit))) exit = Number(raw.exit);

  return {
    lang,
    extra,
    attrs: {
      runnable,
      stdin: asString(raw.stdin),
      expect: asString(raw.expect),
      title: asString(raw.title),
      file: asString(raw.file),
      group: asString(raw.group),
      eof,
      smoke: asString(raw.smoke),
      exit,
      reason: runnable ? undefined : reason,
    },
  };
}
