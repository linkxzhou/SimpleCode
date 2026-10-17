#!/usr/bin/env node
// Dist on a plain static server (no COOP/COEP, coi-serviceworker), like
// `python -m http.server`. Rust is not vendored: a local 404 must fall back to
// the pinned upstream once, show progress, and compile hello world. Switching
// away mid-download must not surface AbortError.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { chromium } from "playwright";

const PORT = Number(process.env.RUST_STATIC_PORT ?? 4521);
const ROOT = join(process.cwd(), "dist");
const BASE = `http://127.0.0.1:${PORT}`;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".woff2": "font/woff2",
  ".gz": "application/gzip",
  ".zst": "application/octet-stream",
  ".bin": "application/octet-stream",
};
const HELLO = `fn main() {
    println!("Hello from Rust {}", 6 * 7);
}
`;

const hits = { rustc: 0, bundle: 0 };

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

if (!existsSync(join(ROOT, "index.html"))) {
  fail("dist/index.html is missing — run ./build.sh build");
  process.exit(1);
}

function launchBrowser() {
  const options = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
  return chromium.launch(options).catch(() => chromium.launch({ channel: "chrome", ...options }));
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", BASE);
  const rel = decodeURIComponent(url.pathname);
  if (rel === "/wasm/rust/rustc.wasm" || rel === "/wasm/rust/sysroot-wasip1.bundle") {
    if (rel.endsWith("rustc.wasm")) hits.rustc += 1;
    else hits.bundle += 1;
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end("not found\n");
    return;
  }
  const file = normalize(join(ROOT, rel === "/" ? "index.html" : rel));
  if (!file.startsWith(ROOT + sep) && file !== ROOT) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (!existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    res.end("not found\n");
    return;
  }
  res.writeHead(200, {
    "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
const stop = () => server.close();
process.on("exit", stop);

async function openApp(browser) {
  const context = await browser.newContext({ serviceWorkers: "allow" });
  const page = await context.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(`${err.name}: ${err.message}`));
  await page.goto(BASE, { waitUntil: "domcontentloaded" }).catch((error) => {
    if (!/ERR_ABORTED|interrupted/i.test(String(error))) throw error;
  });
  await page.waitForFunction(() => crossOriginIsolated === true, null, { timeout: 20_000 });
  await page.waitForSelector('[data-testid="lang-rust"]', { timeout: 30_000 });
  return { context, page, pageErrors };
}

try {
  const browser = await launchBrowser();

  const aborted = await openApp(browser);
  await aborted.page.click('[data-testid="lang-rust"]');
  await aborted.page.waitForFunction(
    () => document.querySelector('[data-testid="lang-rust"]')?.getAttribute("data-status") === "downloading",
    null,
    { timeout: 20_000 },
  );
  await aborted.page.click('[data-testid="lang-shell"]');
  // Shell may finish (real wasm) or fail its own download (this server still
  // serves the other runtimes). Either way the Rust abort must stay quiet.
  await aborted.page.waitForFunction(
    () => {
      const status = document.querySelector('[data-testid="lang-shell"]')?.getAttribute("data-status");
      return status === "ready" || status === "error" || status === "cached";
    },
    null,
    { timeout: 60_000 },
  );
  await aborted.page.waitForTimeout(500);
  const rustAfter = await aborted.page.getAttribute('[data-testid="lang-rust"]', "data-status");
  const abortErrors = aborted.pageErrors.filter((err) => /AbortError|aborted/i.test(err));
  if (abortErrors.length || rustAfter === "downloading" || rustAfter === "error") {
    throw new Error(`language switch leaked abort status=${rustAfter} errors=${abortErrors.join(" | ")}`);
  }
  console.log("✓ switching away from Rust swallows the abort");
  await aborted.context.close();

  const session = await openApp(browser);
  const before = { rustc: hits.rustc, bundle: hits.bundle };
  await session.page.click('[data-testid="lang-rust"]');
  await session.page.waitForFunction(() => {
    globalThis.__simplecodeTerminal?.flush?.();
    const text = globalThis.__simplecodeTerminal?.transcript ?? "";
    return text.includes("正在下载") && text.includes("Rust");
  });
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline && (hits.rustc < before.rustc + 1 || hits.bundle < before.bundle + 1)) {
    await new Promise((r) => setTimeout(r, 50));
  }
  await new Promise((r) => setTimeout(r, 600));
  const localRustc = hits.rustc - before.rustc;
  const localBundle = hits.bundle - before.bundle;
  if (localRustc !== 1 || localBundle !== 1) {
    throw new Error(`local 404 was not a single request (rustc ${localRustc}, bundle ${localBundle})`);
  }
  console.log("✓ local Rust 404 falls back after one request each");

  await session.page.waitForSelector('[data-testid="lang-rust"][data-status="ready"]', { timeout: 240_000 });
  const progressSeen = await session.page.evaluate(() => {
    globalThis.__simplecodeTerminal.flush();
    return globalThis.__simplecodeTerminal.transcript.includes("正在下载");
  });
  if (!progressSeen) throw new Error("download progress was not shown");
  await session.page.evaluate((code) => globalThis.__simplecodeEditor.setValue(code), HELLO);
  await session.page.click('[data-testid="run"]');
  await session.page.waitForFunction(
    () => ["done", "failed", "crash", "terminated"].includes(document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status") ?? ""),
    null,
    { timeout: 180_000 },
  );
  const status = await session.page.getAttribute('[data-testid="run-status"]', "data-status");
  const out = await session.page.evaluate(() => globalThis.__simplecodeTerminal.transcript);
  const lateAbort = session.pageErrors.filter((err) => /AbortError|aborted/i.test(err));
  if (status !== "done" || !out.includes("Hello from Rust 42") || lateAbort.length) {
    throw new Error(`rust hello status=${status} errors=${lateAbort.join(" | ")} out=${JSON.stringify(out.slice(-400))}`);
  }
  console.log("✓ upstream Rust toolchain compiled Hello from Rust 42");
  await browser.close();
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
} finally {
  stop();
}

if (process.exitCode) process.exit(process.exitCode);
console.log("\nrust static download checks passed");
