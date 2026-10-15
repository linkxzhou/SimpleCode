/** Browser TypeScript type-stripping. Sucrase is imported only when TS is run. */

export class TranspileError extends Error {
  readonly line?: number;
  readonly column?: number;
  readonly detail: string;
  constructor(summary: string, detail: string, line?: number, column?: number) {
    super(summary);
    this.name = "TranspileError";
    this.detail = detail;
    this.line = line;
    this.column = column;
  }
}

type Loc = { line?: number; column?: number };

function locOf(err: unknown): Loc | undefined {
  if (!err || typeof err !== "object" || !("loc" in err)) return undefined;
  const loc = (err as { loc?: Loc }).loc;
  return loc && typeof loc.line === "number" ? loc : undefined;
}

/** `main.ts:1:19  Unexpected token` plus the source line and a caret. */
export function formatTranspileError(code: string, err: unknown): { summary: string; detail: string; line?: number; column?: number } {
  const raw = err instanceof Error ? err.message : String(err);
  const message = raw.replace(/^Error transforming [^:]+:\s*/, "").replace(/\s*\(\d+:\d+\)\s*$/, "");
  const loc = locOf(err);
  if (!loc?.line) return { summary: message, detail: message };
  const column = Math.max(1, loc.column ?? 1);
  const src = code.split("\n")[loc.line - 1] ?? "";
  const summary = `main.ts:${loc.line}:${column}  ${message}`;
  const detail = `${summary}\n${src}\n${" ".repeat(column - 1)}^`;
  return { summary, detail, line: loc.line, column };
}

let loading: Promise<typeof import("sucrase")> | undefined;

export async function transpileTypeScript(code: string): Promise<string> {
  loading ??= import("sucrase");
  const { transform } = await loading;
  try {
    return transform(code, {
      transforms: ["typescript"],
      disableESTransforms: true,
      filePath: "main.ts",
    }).code;
  } catch (err) {
    const formatted = formatTranspileError(code, err);
    throw new TranspileError(formatted.summary, formatted.detail, formatted.line, formatted.column);
  }
}
