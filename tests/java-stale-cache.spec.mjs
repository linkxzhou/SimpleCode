#!/usr/bin/env node
// Poison compiler.wasm with a cacheable HTML 200, then serve the real file.
// A reload must run Java hello instead of reporting a digest mismatch.
import { spawn } from "node:child_process";
import { createServer, request as httpRequest } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const PREVIEW = Number(process.env.STALE_PREVIEW_PORT ?? 4391);
const PROXY = Number(process.env.STALE_PROXY_PORT ?? 4392);
const DEV = Number(process.env.STALE_DEV_PORT ?? 4393);
const PREVIEW_BASE = `http://127.0.0.1:${PREVIEW}`;
const PROXY_BASE = `http://127.0.0.1:${PROXY}`;
const DEV_BASE = `http://127.0.0.1:${DEV}`;
const REAL_BYTES = 4294850;
const NEEDLE = "若页面来自 dist，还要再运行 ./build.sh build，然后刷新。";
const HELLO = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java " + (6 * 7));
    }
}
`;

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function bundleHas(needle) {
  const dir = "dist/assets";
  if (!existsSync(dir)) return false;
  return readdirSync(dir).some((name) => name.endsWith(".js") && readFileSync(join(dir, name), "utf8").includes(needle));
}

if (!existsSync("dist/index.html") || !bundleHas(NEEDLE)) {
  fail("dist is missing the Java missing-file message — run ./build.sh build");
  process.exit(1);
}
if (!existsSync("dist/wasm/java/compiler.wasm") || statSync("dist/wasm/java/compiler.wasm").size !== REAL_BYTES) {
  fail("dist/wasm/java/compiler.wasm is missing — run ./build.sh vendor --java and ./build.sh build");
  process.exit(1);
}

function launchBrowser() {
  const options = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
  return chromium.launch(options).catch(() => chromium.launch({ channel: "chrome" }));
}

function start(cmd, args) {
  const child = spawn(cmd, args, {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, CHOKIDAR_USEPOLLING: "1" },
  });
  let log = "";
  child.stdout.on("data", (chunk) => {
    log += chunk;
  });
  child.stderr.on("data", (chunk) => {
    log += chunk;
  });
  child.log = () => log.slice(-800);
  return child;
}

async function waitFor(url, attempts = 100) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status > 0) return res;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`server did not start: ${url}`);
}

async function expectMissing(url) {
  const res = await fetch(url);
  const type = res.headers.get("content-type") ?? "";
  const cache = res.headers.get("cache-control") ?? "";
  const body = await res.text();
  if (res.status !== 404 || /text\/html/i.test(type) || !/no-store/i.test(cache) || !body.includes("not found")) {
    throw new Error(`${url} → ${res.status} ${type} ${cache} ${JSON.stringify(body.slice(0, 80))}`);
  }
  console.log(`✓ 404 ${url}`);
}

const poison = { on: true };
const seen = [];
const preview = start("yarn", ["vite", "preview", "--host", "127.0.0.1", "--port", String(PREVIEW), "--strictPort"]);
const dev = start("yarn", ["vite", "--host", "127.0.0.1", "--port", String(DEV), "--strictPort"]);
const stop = () => {
  for (const child of [preview, dev]) {
    try {
      child.kill("SIGTERM");
    } catch {
      /* already gone */
    }
  }
};
process.on("exit", stop);

const proxy = createServer((req, res) => {
  const url = req.url ?? "/";
  const pathname = url.split("?")[0];
  if (pathname.endsWith("/wasm/java/compiler.wasm")) {
    seen.push(url);
    if (poison.on) {
      const body = Buffer.from("<!doctype html><html><body>missing java toolchain</body></html>");
      res.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "content-length": String(body.length),
        "cache-control": "public, max-age=86400",
        "cross-origin-opener-policy": "same-origin",
        "cross-origin-embedder-policy": "require-corp",
        "cross-origin-resource-policy": "same-origin",
      });
      res.end(body);
      return;
    }
  }
  const upstream = httpRequest(
    {
      hostname: "127.0.0.1",
      port: PREVIEW,
      path: url,
      method: req.method,
      headers: { ...req.headers, host: `127.0.0.1:${PREVIEW}` },
    },
    (up) => {
      res.writeHead(up.statusCode ?? 502, up.headers);
      up.pipe(res);
    },
  );
  upstream.on("error", (err) => {
    if (!res.headersSent) res.writeHead(502);
    res.end(String(err));
  });
  req.pipe(upstream);
});

try {
  await Promise.all([waitFor(`${PREVIEW_BASE}/`), waitFor(`${DEV_BASE}/`)]);
  await expectMissing(`${PREVIEW_BASE}/wasm/java/not-a-real-file.wasm`);
  await expectMissing(`${DEV_BASE}/wasm/java/not-a-real-file.wasm`);
  const real = await fetch(`${PREVIEW_BASE}/wasm/java/compiler.wasm`);
  const realCache = real.headers.get("cache-control") ?? "";
  if (real.status !== 200 || real.headers.get("content-type") !== "application/wasm") {
    throw new Error(`preview compiler.wasm ${real.status} ${real.headers.get("content-type")}`);
  }
  if (!/no-cache/i.test(realCache) || /max-age/i.test(realCache)) {
    throw new Error(`preview compiler.wasm cache-control ${realCache}`);
  }
  const realBytes = (await real.arrayBuffer()).byteLength;
  if (realBytes !== REAL_BYTES) throw new Error(`preview compiler.wasm ${realBytes} bytes`);
  console.log(`✓ preview compiler.wasm ${realBytes} bytes`);

  await new Promise((resolve) => proxy.listen(PROXY, "127.0.0.1", resolve));
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on("pageerror", (err) => console.log("  [pageerror]", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("  [console.error]", msg.text());
  });
  await page.goto(PROXY_BASE);
  const isolated = await page.evaluate(() => crossOriginIsolated);
  console.log(`crossOriginIsolated=${isolated}`);
  await page.waitForSelector('[data-testid="lang-java"]');
  await page.click('[data-testid="lang-java"]');
  await page.waitForFunction(
    () => (globalThis.__simplecodeTerminal?.transcript ?? "").includes("找不到 compiler.wasm"),
    null,
    { timeout: 60_000 },
  );
  const poisoned = await page.evaluate(() => globalThis.__simplecodeTerminal.transcript);
  if (!poisoned.includes("./build.sh vendor --java") || !poisoned.includes("./build.sh build")) {
    throw new Error(`missing vendor hint: ${poisoned.slice(-400)}`);
  }
  if (poisoned.includes("不一致") || poisoned.includes("无法下载")) {
    throw new Error(`digest or network error instead of missing file: ${poisoned.slice(-400)}`);
  }
  if (!seen.some((url) => url.includes("?") && url.includes("v="))) {
    throw new Error(`compiler.wasm was not requested with ?v=: ${seen.join(" ")}`);
  }
  console.log(`✓ poisoned compiler.wasm showed the vendor hint (${seen.length} request(s))`);

  poison.on = false;
  await page.reload();
  await page.waitForSelector('[data-testid="lang-java"][data-status="ready"]', { timeout: 120_000 });
  await page.evaluate((code) => globalThis.__simplecodeEditor.setValue(code), HELLO);
  await page.click('[data-testid="run"]');
  await page.waitForFunction(
    () => ["done", "failed", "crash", "terminated"].includes(document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status") ?? ""),
    null,
    { timeout: 120_000 },
  );
  const status = await page.getAttribute('[data-testid="run-status"]', "data-status");
  const out = await page.evaluate(() => globalThis.__simplecodeTerminal.transcript);
  if (status !== "done" || !out.includes("Hello from Java 42")) {
    throw new Error(`java hello status=${status} out=${JSON.stringify(out.slice(-400))}`);
  }
  console.log("✓ reload ran Hello from Java 42");
  await browser.close();
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
  console.error(preview.log());
  console.error(dev.log());
} finally {
  await new Promise((resolve) => proxy.close(() => resolve()));
  stop();
}

if (process.exitCode) process.exit(process.exitCode);
console.log("\njava stale-cache checks passed");
