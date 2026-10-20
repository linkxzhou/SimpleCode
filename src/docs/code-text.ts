export type CodeKind = "code" | "comment";

export interface CodeSpan {
  kind: CodeKind;
  text: string;
}

type Style = "hash" | "ruby" | "shell" | "php" | "slash" | "sql" | "lua" | "none";

function styleOf(lang: string): Style {
  const key = lang.trim().toLowerCase();
  if (key === "python" || key === "py" || key === "numpy" || key === "np") return "hash";
  if (key === "ruby" || key === "rb") return "ruby";
  if (key === "sh" || key === "shell" || key === "bash" || key === "linux") return "shell";
  if (key === "php") return "php";
  if (
    key === "js" ||
    key === "javascript" ||
    key === "ts" ||
    key === "typescript" ||
    key === "c" ||
    key === "cpp" ||
    key === "c++" ||
    key === "go" ||
    key === "rust" ||
    key === "rs" ||
    key === "java"
  ) {
    return "slash";
  }
  if (key === "sql" || key === "sqlite") return "sql";
  if (key === "lua") return "lua";
  return "none";
}

export function isProgrammingLang(lang: string): boolean {
  return styleOf(lang) !== "none";
}

function lineStart(code: string, index: number) {
  return index === 0 || code[index - 1] === "\n";
}

/** Split source into comment spans and everything else. Strings stay in the code spans. */
export function splitCode(lang: string, code: string): CodeSpan[] {
  const style = styleOf(lang);
  const spans: CodeSpan[] = [];
  let cursor = 0;
  let index = 0;
  const n = code.length;

  const emit = (kind: CodeKind, end: number) => {
    if (end > cursor) spans.push({ kind, text: code.slice(cursor, end) });
    cursor = end;
  };

  const hashComment = () => {
    if (code[index] !== "#") return false;
    if (style !== "hash" && style !== "ruby" && style !== "shell" && style !== "php") return false;
    if (style === "shell" || style === "php") {
      const prev = index === 0 ? "" : code[index - 1];
      if (prev === "$" || prev === "{" || /[A-Za-z0-9_]/.test(prev)) return false;
    }
    return true;
  };

  while (index < n) {
    if (style === "ruby" && lineStart(code, index) && code.startsWith("=begin", index)) {
      const after = index + "=begin".length;
      if (after === n || code[after] === "\n" || code[after] === " " || code[after] === "\t") {
        emit("code", index);
        const endLine = code.indexOf("\n=end", index);
        const end = endLine < 0 ? n : endLine + "\n=end".length;
        index = end;
        emit("comment", index);
        continue;
      }
    }

    const quote = code[index];
    if (quote === '"' || quote === "'" || quote === "`") {
      const triple = (style === "hash" || style === "ruby") && (quote === '"' || quote === "'") && code.startsWith(quote + quote + quote, index);
      if (triple) {
        const end = code.indexOf(quote + quote + quote, index + 3);
        index = end < 0 ? n : end + 3;
        continue;
      }
      if (style === "sql" && quote === "'") {
        index++;
        while (index < n) {
          if (code[index] === "'") {
            if (code[index + 1] === "'") {
              index += 2;
              continue;
            }
            index++;
            break;
          }
          index++;
        }
        continue;
      }
      if ((style === "shell" || style === "ruby") && quote === "'") {
        index++;
        while (index < n && code[index] !== "'") index++;
        if (index < n) index++;
        continue;
      }
      index++;
      while (index < n) {
        if (code[index] === "\\") {
          index += 2;
          continue;
        }
        if (code[index] === quote) {
          index++;
          break;
        }
        index++;
      }
      continue;
    }

    if ((style === "slash" || style === "php" || style === "sql") && code.startsWith("/*", index)) {
      emit("code", index);
      const end = code.indexOf("*/", index + 2);
      index = end < 0 ? n : end + 2;
      emit("comment", index);
      continue;
    }

    if ((style === "slash" || style === "php") && code.startsWith("//", index)) {
      emit("code", index);
      const end = code.indexOf("\n", index);
      index = end < 0 ? n : end;
      emit("comment", index);
      continue;
    }

    if ((style === "sql" || style === "lua") && code.startsWith("--", index)) {
      emit("code", index);
      if (style === "lua" && code.startsWith("--[[", index)) {
        const end = code.indexOf("]]", index + 4);
        index = end < 0 ? n : end + 2;
        emit("comment", index);
        continue;
      }
      const end = code.indexOf("\n", index);
      index = end < 0 ? n : end;
      emit("comment", index);
      continue;
    }

    if (hashComment()) {
      emit("code", index);
      const end = code.indexOf("\n", index);
      index = end < 0 ? n : end;
      emit("comment", index);
      continue;
    }

    index++;
  }
  emit("code", n);
  return spans;
}

export function codeOutsideComments(lang: string, code: string): string {
  return splitCode(lang, code)
    .filter((span) => span.kind === "code")
    .map((span) => span.text)
    .join("");
}
