#!/usr/bin/env node
// Run every runnable docs fence in the preview app and check exit status + expect.
import { spawn } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { chromium } from "playwright";
import { parseFenceInfo } from "../src/docs/fence.ts";
import { resolveRuntime } from "../src/docs/runtime.ts";

const PORT = Number(process.env.DOCS_PORT ?? 4321);
const BASE = `http://127.0.0.1:${PORT}`;
const BOOKS = ["python", "js", "go", "ruby", "sqlite", "c", "cpp", "php", "lua", "shell"];

function stripAnsi(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

function collect() {
  const cases = [];
  for (const book of BOOKS) {
    const dir = join("docs", book);
    for (const file of readdirSync(dir).filter((name) => name.endsWith(".md")).sort()) {
      const raw = readFileSync(join(dir, file), "utf8");
      const body = matter(raw).content;
      const re = /```([^\n]*)\n([\s\S]*?)```/g;
      let match;
      let index = 0;
      while ((match = re.exec(body))) {
        const parsed = parseFenceInfo(match[1]);
        const code = match[2].replace(/\n$/, "");
        const n = index++;
        if (!parsed.attrs.runnable || parsed.attrs.smoke === "skip") continue;
        const runtime = resolveRuntime(parsed.lang);
        if (!runtime) continue;
        cases.push({
          id: `${book}/${file.replace(/\.md$/, "")}#${n}`,
          runtime,
          lang: parsed.lang,
          code,
          stdin: parsed.attrs.stdin,
          stdinEOF: parsed.attrs.eof,
          expect: parsed.attrs.expect,
          exit: parsed.attrs.exit ?? 0,
        });
      }
    }
  }
  return cases;
}

const cases = collect().sort((a, b) => a.runtime.localeCompare(b.runtime) || a.id.localeCompare(b.id));
const only = process.argv.slice(2);
const selected = cases.filter((c) => !only.length || only.some((part) => c.id.includes(part) || c.runtime === part));
console.log(`docs-smoke: ${selected.length} runnable blocks`);

const server = spawn("yarn", ["vite", "preview", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"], {
  stdio: ["ignore", "pipe", "pipe"],
});
const stop = () => {
  try {
    server.kill("SIGTERM");
  } catch {
    /* already gone */
  }
};
process.on("exit", stop);

async function waitForServer() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("preview server did not start");
}

function launchBrowser() {
  const options = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
  return chromium.launch(options).catch(() => chromium.launch({ channel: "chrome" }));
}

async function prepare(page, runtime, lang) {
  const ready = await page.evaluate((id) => globalThis.__simplecodeSelect(id), runtime);
  if (!ready) throw new Error(`download failed for ${runtime}`);
  await page.waitForFunction(
    (id) => document.querySelector(`[data-testid="lang-${id}"]`)?.getAttribute("aria-current") === "true",
    runtime,
  );
  if (runtime === "quickjs") {
    const dialect = lang === "ts" || lang === "typescript" ? "ts" : "js";
    await page.click(`[data-testid="dialect-${dialect}"]`);
    const file = dialect === "ts" ? "main.ts" : "main.js";
    await page.waitForFunction((name) => document.querySelector('[data-testid="filename"]')?.textContent === name, file);
  }
}

let failed = 0;
try {
  await waitForServer();
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.setDefaultTimeout(70_000);
  page.on("pageerror", (err) => console.log("  [pageerror]", err.message));
  await page.goto(BASE);
  await page.waitForSelector('[data-testid="lang-python"]');

  for (const c of selected) {
    const t0 = Date.now();
    const limit = 60_000;
    try {
      await prepare(page, c.runtime, c.lang);
      await page.evaluate((code) => globalThis.__simplecodeEditor.setValue(code), c.code);
      const run = page.evaluate(
        (opts) => globalThis.__simplecodeRun(opts),
        { stdin: c.stdin, stdinEOF: c.stdinEOF, source: "docs-smoke" },
      );
      // page.evaluate itself has no timeout; a blocked read would stall the suite.
      run.catch(() => {});
      let timer;
      const timed = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("run timed out")), limit);
      });
      try {
        await Promise.race([run, timed]);
      } finally {
        clearTimeout(timer);
      }
      await page.waitForFunction(
        () => ["done", "failed", "crash", "terminated"].includes(document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status") ?? ""),
        null,
        { timeout: limit },
      );
      const status = await page.getAttribute('[data-testid="run-status"]', "data-status");
      const out = stripAnsi(await page.evaluate(() => globalThis.__simplecodeTerminal.transcript));
      const want = c.exit === 0 ? "done" : "failed";
      const ok = status === want && (!c.expect || out.includes(c.expect));
      if (!ok) {
        failed++;
        console.log(`✗ ${c.id} status=${status} want=${want} out=${JSON.stringify(out.trim().slice(-240))}`);
      } else {
        console.log(`✓ ${c.id} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
      }
    } catch (err) {
      failed++;
      const out = await page.evaluate(() => globalThis.__simplecodeTerminal?.transcript).catch(() => "");
      console.log(`✗ ${c.id} ${err.message.split("\n")[0]} out=${JSON.stringify(stripAnsi(out ?? "").slice(-240))}`);
      await page.reload().catch(() => {});
      await page.waitForSelector('[data-testid="lang-python"]').catch(() => {});
    }
  }
  if (!process.env.DOCS_VERBOSE && failed === 0) console.log(`✓ ${selected.length} blocks`);
  await browser.close();
} finally {
  stop();
}
console.log(failed ? `\n${failed} docs check(s) failed` : "\ndocs-smoke passed");
process.exit(failed ? 1 : 0);
