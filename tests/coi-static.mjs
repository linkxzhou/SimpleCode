#!/usr/bin/env node
// Serve dist/ with no COOP/COEP, like python -m http.server, and check the
// service worker isolates the page and a stdin program runs.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { chromium } from "playwright";

const PORT = Number(process.env.COI_PORT ?? 4341);
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

if (!existsSync(join(ROOT, "index.html"))) {
  console.error("dist/index.html missing — run ./build.sh build");
  process.exit(1);
}

function launchBrowser() {
  const options = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
  return chromium.launch(options).catch(() => chromium.launch({ channel: "chrome" }));
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
    res.writeHead(404);
    res.end();
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

let failed = 0;
function check(ok, message) {
  if (!ok) {
    failed++;
    console.log(`✗ ${message}`);
  } else console.log(`✓ ${message}`);
}

try {
  const head = await fetch(BASE);
  const coop = head.headers.get("cross-origin-opener-policy");
  const coep = head.headers.get("cross-origin-embedder-policy");
  check(coop == null && coep == null, `static server sends no isolation headers (COOP=${coop} COEP=${coep})`);

  const browser = await launchBrowser();
  const context = await browser.newContext({ serviceWorkers: "allow" });
  const page = await context.newPage({ viewport: { width: 1280, height: 800 } });
  const loads = [];
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame() && frame.url().startsWith(BASE)) loads.push(frame.url());
  });
  page.on("pageerror", (error) => console.log("  [pageerror]", error.message));
  page.on("console", (message) => {
    if (message.type() === "error") console.log("  [console.error]", message.text());
  });

  await page.goto(BASE, { waitUntil: "domcontentloaded" }).catch((error) => {
    if (!/ERR_ABORTED|interrupted/i.test(String(error))) throw error;
  });
  await page.waitForFunction(() => crossOriginIsolated === true, null, { timeout: 20_000 });
  const isolated = await page.evaluate(() => crossOriginIsolated);
  check(isolated === true, "crossOriginIsolated is true");
  check(loads.length > 0 && loads.length <= 2, `single reload to enter isolation (${loads.length} loads)`);

  const before = loads.length;
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => crossOriginIsolated === true, null, { timeout: 20_000 });
  check(loads.length === before + 1, `already isolated page does not reload again (${loads.length - before})`);

  await page.waitForSelector('[data-testid="lang-python"]');
  await page.click('[data-testid="lang-python"]');
  await page.waitForSelector('[data-testid="lang-python"]:is([data-status="ready"],[data-status="error"])', { timeout: 180_000 });
  check((await page.getAttribute('[data-testid="lang-python"]', "data-status")) === "ready", "python runtime downloaded from the static server");
  await page.evaluate(() => globalThis.__simplecodeEditor.setValue('name = input()\nprint(f"Hello, {name} from Python")'));
  await page.click('[data-testid="run"]');
  await page.waitForSelector('[data-testid="run-status"][data-status="run"]', { timeout: 60_000 });
  await page.waitForTimeout(300);
  await page.click('[data-testid="terminal"]');
  await page.keyboard.type("Ada");
  await page.keyboard.press("Enter");
  await page.waitForFunction(
    () => ["done", "failed", "crash", "terminated"].includes(document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status") ?? ""),
    null,
    { timeout: 120_000 },
  );
  const status = await page.getAttribute('[data-testid="run-status"]', "data-status");
  const out = await page.evaluate(() => globalThis.__simplecodeTerminal.transcript);
  check(status === "done" && out.includes("Hello, Ada from Python"), `python stdin status=${status} out=${JSON.stringify(out.slice(-160))}`);

  await browser.close();
} finally {
  stop();
}

console.log(failed ? `\n${failed} coi check(s) failed` : "\ncoi static checks passed");
process.exit(failed ? 1 : 0);
