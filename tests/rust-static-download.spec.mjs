#!/usr/bin/env node
// Dist on a plain static server (no COOP/COEP, coi-serviceworker), like
// `python -m http.server`. Rust files are committed under wasm/rust/. The page
// must load them from this origin, compile hello and a stdin program, and
// never request the old demo host. Switching away mid-download must not
// surface AbortError.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { chromium } from "playwright";

const PORT = Number(process.env.RUST_STATIC_PORT ?? 4521);
const ROOT = join(process.cwd(), "dist");
const BASE = `http://127.0.0.1:${PORT}`;
const DEMO = "weblings.forest-anderson.ca";
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
  ".md": "text/plain; charset=utf-8",
};
const HELLO = `fn main() {
    println!("Hello from Rust {}", 6 * 7);
}
`;
const STDIN = `use std::io::{self, BufRead};
fn main() {
    let mut line = String::new();
    io::stdin().lock().read_line(&mut line).unwrap();
    println!("Hello, {} from Rust", line.trim());
}
`;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

if (!existsSync(join(ROOT, "index.html"))) {
  fail("dist/index.html is missing — run ./build.sh build");
  process.exit(1);
}
for (const name of ["rustc.wasm", "sysroot-wasip1.bundle"]) {
  if (!existsSync(join(ROOT, "wasm/rust", name))) {
    fail(`dist/wasm/rust/${name} is missing — the toolchain is committed`);
    process.exit(1);
  }
}

function launchBrowser() {
  const options = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
  return chromium.launch(options).catch(() => chromium.launch({ channel: "chrome", ...options }));
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", BASE);
  const rel = decodeURIComponent(url.pathname);
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
  const headers = {
    "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
    "Content-Length": String(statSync(file).size),
  };
  res.writeHead(200, headers);
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
  const remote = [];
  const localRust = [];
  page.on("pageerror", (err) => pageErrors.push(`${err.name}: ${err.message}`));
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.includes(DEMO)) {
      remote.push(url);
      return route.abort();
    }
    return route.continue();
  });
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes(DEMO)) remote.push(url);
    if (url.includes("/wasm/rust/rustc.wasm") || url.includes("/wasm/rust/sysroot-wasip1.bundle")) localRust.push(url);
  });
  await page.goto(BASE, { waitUntil: "domcontentloaded" }).catch((error) => {
    if (!/ERR_ABORTED|interrupted/i.test(String(error))) throw error;
  });
  await page.waitForFunction(() => crossOriginIsolated === true, null, { timeout: 20_000 });
  await page.waitForSelector('[data-testid="lang-rust"]', { timeout: 30_000 });
  return { context, page, pageErrors, remote, localRust };
}

async function runRust(page, code, stdin) {
  await page.evaluate((next) => globalThis.__simplecodeEditor.setValue(next), code);
  await page.click('[data-testid="run"]');
  if (stdin) {
    await page.waitForSelector('[data-testid="run-status"][data-status="run"]', { timeout: 180_000 });
    await page.waitForTimeout(300);
    await page.click('[data-testid="terminal"]');
    await page.keyboard.type(stdin);
    await page.keyboard.press("Enter");
  }
  await page.waitForFunction(
    () => ["done", "failed", "crash", "terminated"].includes(document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status") ?? ""),
    null,
    { timeout: 180_000 },
  );
  return {
    status: await page.getAttribute('[data-testid="run-status"]', "data-status"),
    out: await page.evaluate(() => globalThis.__simplecodeTerminal.transcript),
  };
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
  const bar = await aborted.page.evaluate(() => {
    const el = document.querySelector('[data-testid="lang-rust"] [data-testid="wasm-progress"]');
    if (!el) return "";
    const style = getComputedStyle(el);
    return `${style.position} ${style.bottom} ${style.height}`;
  });
  if (!bar.startsWith("absolute 0px")) throw new Error(`progress bar is not on the button's bottom edge: ${bar}`);
  await aborted.page.click('[data-testid="lang-shell"]');
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
  if (aborted.remote.length) throw new Error(`demo host was requested: ${aborted.remote.join(" ")}`);
  console.log("✓ switching away from Rust swallows the abort");
  await aborted.context.close();
  await browser.close();

  const browser2 = await launchBrowser();
  const session = await openApp(browser2);
  await session.page.click('[data-testid="lang-rust"]');
  await session.page.waitForSelector('[data-testid="lang-rust"][data-status="ready"]', { timeout: 240_000 });
  const progress = await session.page.evaluate(() => {
    const bar = document.querySelector('[data-testid="lang-rust"] [data-testid="wasm-progress"]');
    globalThis.__simplecodeTerminal.flush();
    return {
      text: globalThis.__simplecodeTerminal.transcript,
      bottom: bar ? getComputedStyle(bar).bottom : "",
    };
  });
  if (!progress.text.includes("正在下载") && !progress.text.includes("已缓存")) {
    throw new Error(`download progress was not shown: ${progress.text.slice(-200)}`);
  }
  const hello = await runRust(session.page, HELLO);
  if (hello.status !== "done" || !hello.out.includes("Hello from Rust 42")) {
    throw new Error(`rust hello status=${hello.status} out=${JSON.stringify(hello.out.slice(-400))}`);
  }
  console.log("✓ local Rust toolchain compiled Hello from Rust 42");

  const stdin = await runRust(session.page, STDIN, "Ada");
  if (stdin.status !== "done" || !stdin.out.includes("Hello, Ada from Rust")) {
    throw new Error(`rust stdin status=${stdin.status} out=${JSON.stringify(stdin.out.slice(-400))}`);
  }
  console.log("✓ local Rust toolchain read stdin");

  const origins = new Set(session.localRust.map((url) => new URL(url).origin));
  if (!session.localRust.some((url) => url.includes("/wasm/rust/rustc.wasm"))) {
    throw new Error(`rustc.wasm was not requested: ${session.localRust.join(" ")}`);
  }
  if (!session.localRust.some((url) => url.includes("/wasm/rust/sysroot-wasip1.bundle"))) {
    throw new Error(`sysroot was not requested: ${session.localRust.join(" ")}`);
  }
  if (origins.size !== 1 || !origins.has(BASE)) {
    throw new Error(`rust assets left the local origin: ${[...origins].join(" ")}`);
  }
  if (session.remote.length) throw new Error(`demo host was requested: ${session.remote.join(" ")}`);
  const lateAbort = session.pageErrors.filter((err) => /AbortError|aborted/i.test(err));
  if (lateAbort.length) throw new Error(lateAbort.join(" | "));
  console.log("✓ rust assets stayed on the local origin");
  await browser2.close();
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
} finally {
  stop();
}

if (process.exitCode) process.exit(process.exitCode);
console.log("\nrust static download checks passed");
