import { t } from "@/i18n";
import { fetchPinned, PinnedMissing } from "./pinned-fetch";

export type AssetKind = "wasm" | "fs" | "bin";

export interface Asset {
  file: string;
  size: number;
  sha256: string;
  kind: AssetKind;
}

export interface CommandSpec {
  step?: string;
  asset?: string;
  fsPath?: string;
  binaryName: string;
  args?: string[];
  env?: Record<string, string>;
  baseFS?: string;
  /** run with isTTY (default true for the run step) */
  tty?: boolean;
}

export interface LanguageSpec {
  id: string;
  label: string;
  short: string;
  version?: string;
  syntax: string;
  fileName: string;
  license?: string;
  homepage?: string;
  /** External compiler. `weblings` compiles then runs via WASI. `teavm` compiles and runs in its own worker. `pyodide` runs CPython plus NumPy in its own worker. */
  compiler?: "weblings" | "teavm" | "pyodide";
  prepare?: CommandSpec[];
  run: CommandSpec;
  autoEOF?: boolean;
  /** "v86" runs a Linux guest. Omitted languages stay on WASIWorkerHost. */
  runtime?: "wasi" | "v86";
  /** Asset ids to download. Used instead of prepare/run when set. */
  assets?: string[];
}

export interface Manifest {
  version: number;
  generatedAt: string;
  assets: Record<string, Asset>;
  languages: LanguageSpec[];
}

export const WASM_BASE = `${import.meta.env.BASE_URL}wasm/`;

export async function loadManifest(): Promise<Manifest> {
  try {
    const bytes = await fetchPinned({ url: `${WASM_BASE}manifest.json` });
    return JSON.parse(new TextDecoder().decode(bytes)) as Manifest;
  } catch (e) {
    if (e instanceof PinnedMissing) {
      const http = /^HTTP (\d+)$/.exec(e.reason);
      if (http) throw new Error(t("manifestHttp", { status: Number(http[1]) }));
      throw new Error(t("manifestMissing", { detail: e.reason }));
    }
    if (e instanceof SyntaxError) throw new Error(t("manifestMissing", { detail: e.message }));
    throw e;
  }
}

/** All asset ids a language needs (deduped). */
export function languageAssetIds(lang: LanguageSpec): string[] {
  if (lang.assets?.length) return [...new Set(lang.assets)];
  const ids = new Set<string>();
  for (const c of [...(lang.prepare ?? []), lang.run]) {
    if (c.asset) ids.add(c.asset);
    if (c.baseFS) ids.add(c.baseFS);
  }
  return [...ids];
}

export function languageSize(m: Manifest, lang: LanguageSpec): number {
  return languageAssetIds(lang).reduce((n, id) => n + (m.assets[id]?.size ?? 0), 0);
}

export function formatMB(bytes: number): string {
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
