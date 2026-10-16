#!/usr/bin/env node
// Vite dev must hand the browser the real compiler.wasm. An empty 200 — the
// response Chrome DevTools shows as 0 kB transferred — retries once, and a body
// that stays empty is an incomplete download with got/expected bytes.
import { spawn } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { chromium } from "playwright";

const PORT = Number(process.env.JAVA_DEV_PORT ?? 4517);
const BASE = `http://127.0.0.1:${PORT}`;
const lock = JSON.parse(readFileSync("scripts/sources.lock.json", "utf8"));
const REAL_BYTES = lock.java.files["compiler.wasm"].bytes;
const SHA = lock.java.files["compiler.wasm"].sha256;
const HELLO = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java " + (6 * 7));
    }
}
`;
const ISOLATION = {
  "content-type": "application/wasm",
  "cache-control": "public, max-age=86400",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-embedder-policy": "require-corp",
  "cross-origin-resource-policy": "same-origin",
};

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

if (!existsSync("wasm/java/compiler.wasm") || statSync("wasm/java/compiler.wasm").size !== REAL_BYTES) {
  fail("wasm/java/compiler.wasm is missing — run ./build.sh vendor --java");
  process.exit(1);
}

function launchBrowser() {
  const options = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
  return chromium.launch(options).catch(() => chromium.launch({ channel: "chrome" }));
}

function startDev() {
  const child = spawn("yarn", ["vite", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"], {
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
  child.log = () => log.slice(-1200);
  return child;
}

async function waitFor(url, attempts = 200) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status > 0) return res;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`server did not start: ${url}`);
}

const dev = startDev();
const stop = () => {
  try {
    dev.kill("SIGTERM");
  } catch {
    /* already gone */
  }
};
process.on("exit", stop);

try {
  await waitFor(`${BASE}/`);
  const ranged = await fetch(`${BASE}/wasm/java/compiler.wasm`, {
    headers: {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Range: "bytes=0-",
    },
  });
  const rangedBytes = (await ranged.arrayBuffer()).byteLength;
  const cache = ranged.headers.get("cache-control") ?? "";
  const rangedStatus = ranged.status;
  if (rangedStatus !== 200 || rangedBytes !== REAL_BYTES) {
    throw new Error(`range-like GET ${rangedStatus} ${rangedBytes} bytes (expected 200 ${REAL_BYTES})`);
  }
  if (!/no-cache/i.test(cache) || /max-age/i.test(cache)) {
    throw new Error(`dev compiler.wasm cache-control ${cache}`);
  }
  console.log(`✓ dev compiler.wasm ${rangedBytes} bytes, cache-control ${cache}, status ${rangedStatus}`);

  const missing = await fetch(`${BASE}/wasm/java/not-a-real-file.wasm`);
  const missingType = missing.headers.get("content-type") ?? "";
  const missingCache = missing.headers.get("cache-control") ?? "";
  const missingBody = await missing.text();
  if (missing.status !== 404 || /text\/html/i.test(missingType) || !/no-store/i.test(missingCache) || !missingBody.includes("not found")) {
    throw new Error(`missing wasm ${missing.status} ${missingType} ${missingCache}`);
  }
  console.log("✓ dev missing wasm is 404 no-store");

  const browser = await launchBrowser();
  const probe = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  probe.on("pageerror", (err) => console.log("  [pageerror]", err.message));
  await probe.goto(BASE);
  await probe.waitForSelector('[data-testid="lang-java"]');
  const probed = await probe.evaluate(async ({ bytes, sha }) => {
    const res = await fetch("/wasm/java/compiler.wasm");
    const body = new Uint8Array(await res.arrayBuffer());
    const digest = await crypto.subtle.digest("SHA-256", body);
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    const timing = performance.getEntriesByType("resource").filter((entry) => entry.name.includes("compiler.wasm")).at(-1);
    return {
      status: res.status,
      type: res.headers.get("content-type"),
      length: body.byteLength,
      sha: hex,
      transferSize: timing ? timing.transferSize : -1,
      decodedBodySize: timing ? timing.decodedBodySize : -1,
      expectedBytes: bytes,
      expectedSha: sha,
    };
  }, { bytes: REAL_BYTES, sha: SHA });
  if (probed.status !== 200 || probed.type !== "application/wasm" || probed.length !== REAL_BYTES || probed.sha !== SHA) {
    throw new Error(`browser fetch ${JSON.stringify(probed)}`);
  }
  if (probed.decodedBodySize !== 0 && probed.decodedBodySize !== REAL_BYTES && probed.decodedBodySize !== -1) {
    throw new Error(`decodedBodySize ${probed.decodedBodySize}`);
  }
  console.log(`✓ browser fetch ${probed.length} bytes sha ok (transferSize ${probed.transferSize}, decoded ${probed.decodedBodySize})`);

  let wasmHits = 0;
  await probe.route(/\/wasm\/java\/compiler\.wasm(?:\?|$)/, async (route) => {
    wasmHits += 1;
    if (wasmHits === 1) {
      await route.fulfill({ status: 200, headers: ISOLATION, body: Buffer.alloc(0) });
      return;
    }
    await route.continue();
  });
  await probe.click('[data-testid="lang-java"]');
  await probe.waitForSelector('[data-testid="lang-java"][data-status="ready"]', { timeout: 120_000 });
  if (wasmHits < 2) {
    throw new Error(`empty compiler.wasm was not retried (${wasmHits} request(s))`);
  }
  await probe.evaluate((code) => globalThis.__simplecodeEditor.setValue(code), HELLO);
  await probe.click('[data-testid="run"]');
  await probe.waitForFunction(
    () => ["done", "failed", "crash", "terminated"].includes(document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status") ?? ""),
    null,
    { timeout: 180_000 },
  );
  const status = await probe.getAttribute('[data-testid="run-status"]', "data-status");
  const out = await probe.evaluate(() => globalThis.__simplecodeTerminal.transcript);
  if (status !== "done" || !out.includes("Hello from Java 42")) {
    throw new Error(`java hello after empty retry status=${status} out=${JSON.stringify(out.slice(-500))}`);
  }
  console.log("✓ empty first body retried and ran Hello from Java 42");
  await probe.close();

  const emptyContext = await browser.newContext();
  const emptyPage = await emptyContext.newPage();
  await emptyPage.route(/\/wasm\/java\/compiler\.wasm(?:\?|$)/, (route) =>
    route.fulfill({ status: 200, headers: ISOLATION, body: Buffer.alloc(0) }),
  );
  await emptyPage.goto(BASE);
  await emptyPage.waitForSelector('[data-testid="lang-java"]');
  await emptyPage.click('[data-testid="lang-java"]');
  await emptyPage.waitForFunction(
    () => {
      const text = globalThis.__simplecodeTerminal?.transcript ?? "";
      return text.includes("下载不完整") && text.includes("得到 0 字节") && text.includes("4294850");
    },
    null,
    { timeout: 60_000 },
  );
  const failedText = await emptyPage.evaluate(() => globalThis.__simplecodeTerminal.transcript);
  if (failedText.includes("不一致")) {
    throw new Error(`empty body reported as a lock mismatch: ${failedText.slice(-400)}`);
  }
  console.log("✓ empty body reports an incomplete download with got/expected bytes");
  await browser.close();
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
  console.error(dev.log());
} finally {
  stop();
}

if (process.exitCode) process.exit(process.exitCode);
console.log("\njava dev download checks passed");
