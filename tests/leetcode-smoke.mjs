#!/usr/bin/env node
// Run shipped LeetCode solutions in the preview app.
// Default: Python core. Java needs SIMPLECODE_JAVA_LEETCODE=1.
// Rust needs SIMPLECODE_RUST_LEETCODE=1.
// SIMPLECODE_LEETCODE_LANGS=python,go limits the default list.
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const PORT = Number(process.env.LEETCODE_PORT ?? 4324);
const BASE = `http://127.0.0.1:${PORT}`;
const FILE = {
  python: "python.py",
  ruby: "ruby.rb",
  quickjs: "javascript.js",
  clang: "c.c",
  clangpp: "cpp.cpp",
  lua: "lua.lua",
  go: "go.go",
  rust: "rust.rs",
  java: "java.java",
};

function stripAnsi(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

function selectedLangs() {
  const fromEnv = process.env.SIMPLECODE_LEETCODE_LANGS?.split(",").map((part) => part.trim()).filter(Boolean);
  let langs = fromEnv?.length ? fromEnv : ["python", "ruby", "quickjs", "clang", "clangpp", "lua", "go"];
  if (process.env.SIMPLECODE_JAVA_LEETCODE === "1" && !langs.includes("java")) langs.push("java");
  if (process.env.SIMPLECODE_RUST_LEETCODE === "1" && !langs.includes("rust")) langs.push("rust");
  if (process.env.SIMPLECODE_JAVA_LEETCODE !== "1") langs = langs.filter((lang) => lang !== "java");
  if (process.env.SIMPLECODE_RUST_LEETCODE !== "1") langs = langs.filter((lang) => lang !== "rust");
  return langs.filter((lang) => FILE[lang]);
}

function collect(langs) {
  const index = JSON.parse(readFileSync("docs/leetcode/index.json", "utf8"));
  const cases = [];
  for (const row of index) {
    if (row.tier !== "core") continue;
    const folder = String(row.id).padStart(4, "0");
    const body = JSON.parse(readFileSync(join("docs/leetcode/problems", folder, "problem.json"), "utf8"));
    for (const runtime of langs) {
      const file = FILE[runtime];
      const path = join("docs/leetcode/problems", folder, file);
      if (!existsSync(path)) continue;
      const sample = body.samples[0];
      cases.push({
        id: `${folder}/${runtime}`,
        runtime,
        code: readFileSync(path, "utf8").replace(/\n$/, ""),
        stdin: sample.stdin,
        stdout: sample.stdout.replace(/\n+$/, ""),
      });
    }
  }
  return cases;
}

const langs = selectedLangs();
const only = process.argv.slice(2);
const cases = collect(langs).filter((item) => !only.length || only.some((part) => item.id.includes(part) || item.runtime === part));
console.log(`leetcode-smoke: ${cases.length} solutions (${langs.join(", ") || "none"})`);
if (!cases.length) {
  console.error("leetcode-smoke: no solutions for the selected languages");
  process.exit(1);
}

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

let failed = 0;
try {
  await waitForServer();
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.setDefaultTimeout(70_000);
  page.on("pageerror", (err) => console.log("  [pageerror]", err.message));
  await page.goto(BASE);
  await page.waitForSelector('[data-testid="lang-python"]');

  for (const item of cases) {
    const t0 = Date.now();
    const limit = 60_000;
    try {
      const ready = await page.evaluate((id) => globalThis.__simplecodeSelect(id), item.runtime);
      if (!ready) throw new Error(`download failed for ${item.runtime}`);
      await page.evaluate((code) => globalThis.__simplecodeEditor.setValue(code), item.code);
      const run = page.evaluate(
        (opts) => globalThis.__simplecodeRun(opts),
        { stdin: item.stdin, stdinEOF: true, source: "leetcode-smoke" },
      );
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
      const status = await page.getAttribute('[data-testid="run-status"]', "data-status");
      const out = stripAnsi(await page.evaluate(() => globalThis.__simplecodeTerminal.transcript));
      const ok = status === "done" && out.includes(item.stdout);
      if (!ok) {
        failed++;
        console.log(`✗ ${item.id} status=${status} out=${JSON.stringify(out.trim().slice(-240))}`);
      } else if (process.env.LEETCODE_VERBOSE) {
        console.log(`✓ ${item.id} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
      }
    } catch (err) {
      failed++;
      const out = await page.evaluate(() => globalThis.__simplecodeTerminal?.transcript).catch(() => "");
      console.log(`✗ ${item.id} ${err.message.split("\n")[0]} out=${JSON.stringify(stripAnsi(out ?? "").slice(-240))}`);
      await page.reload().catch(() => {});
      await page.waitForSelector('[data-testid="lang-python"]').catch(() => {});
    }
  }
  if (failed === 0) console.log(`✓ ${cases.length} leetcode solutions`);
  await browser.close();
} finally {
  stop();
}
console.log(failed ? `\n${failed} leetcode check(s) failed` : "\nleetcode-smoke passed");
process.exit(failed ? 1 : 0);
