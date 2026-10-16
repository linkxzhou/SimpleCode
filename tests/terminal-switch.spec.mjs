#!/usr/bin/env node
// Programming-language switches rebind the terminal. UI locale redraws system lines.
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.TERM_PORT ?? 4327);
const BASE = `http://127.0.0.1:${PORT}`;

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
function check(ok, message) {
  if (!ok) {
    failed++;
    console.log(`✗ ${message}`);
  } else console.log(`✓ ${message}`);
}

async function transcript(page) {
  return page.evaluate(() => {
    globalThis.__simplecodeTerminal.flush();
    return globalThis.__simplecodeTerminal.transcript;
  });
}

async function inputMode(page) {
  return page.evaluate(() => globalThis.__simplecodeTerminal.inputMode());
}

async function statusOf(page, id) {
  return page.getAttribute(`[data-testid="lang-${id}"]`, "data-status");
}

await waitForServer();
const browser = await launchBrowser();
const pageErrors = [];
try {
  const page = await (await browser.newContext()).newPage();
  page.on("pageerror", (err) => pageErrors.push(String(err)));
  await page.goto(BASE);
  await page.waitForSelector('[data-testid="lang-python"][data-status="ready"]', { timeout: 180_000 });

  const zh = await transcript(page);
  check(zh.includes("正在下载"), `Chinese download line is on screen (${zh.slice(0, 80)})`);
  await page.getByTestId("locale-en").click();
  await page.waitForFunction(() => globalThis.__simplecodeTerminal.transcript.includes("Downloading the Python runtime"));
  const en = await transcript(page);
  check(en.includes("is ready") && !en.includes("正在下载"), "English redraws download and ready lines");
  await page.getByTestId("locale-zh").click();
  await page.waitForFunction(() => globalThis.__simplecodeTerminal.transcript.includes("正在下载"));
  check(true, "Chinese system lines return");

  await page.evaluate(() => globalThis.__simplecodeEditor.setValue('print("PY-MARKER", flush=True)\ninput("ask? ")\n'));
  await page.click('[data-testid="run"]');
  await page.waitForFunction(() => {
    globalThis.__simplecodeTerminal.flush();
    const text = globalThis.__simplecodeTerminal.transcript;
    const status = document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status");
    return text.includes("PY-MARKER") && text.includes("ask?") && status === "run";
  });
  await page.click('[data-testid="lang-go"]');
  await page.waitForFunction(() => document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status") !== "run");
  const afterGo = await transcript(page);
  const modeAfterGo = await inputMode(page);
  check(!afterGo.includes("PY-MARKER") && !afterGo.includes("ask?"), "Python output is gone after switching to Go");
  check(modeAfterGo === "none", `stdin detached after Go switch (${modeAfterGo})`);
  check((await page.getAttribute('[data-testid="run-status"]', "data-status")) !== "run", "run indicator leaves the Python session");
  await page.waitForSelector('[data-testid="lang-go"][data-status="ready"]', { timeout: 180_000 });

  let releaseLua = () => {};
  const holdLua = new Promise((resolve) => {
    releaseLua = resolve;
  });
  await page.route("**/lua-5.4.9.wasm*", async (route) => {
    await holdLua;
    try {
      await route.abort();
    } catch {
      /* request already gone */
    }
  });
  await page.click('[data-testid="lang-lua"]');
  await page.waitForFunction(() => globalThis.__simplecodeTerminal.transcript.includes("Lua"));
  await page.click('[data-testid="lang-shell"]');
  releaseLua();
  await page.waitForSelector('[data-testid="lang-shell"][data-status="ready"]', { timeout: 120_000 });
  const mid = await transcript(page);
  const luaStatus = await statusOf(page, "lua");
  check(luaStatus !== "downloading", `Lua is not stuck downloading (${luaStatus})`);
  check(!mid.includes("Lua 已就绪") && !mid.includes("Lua is ready") && !mid.includes("已取消下载 Lua") && !mid.includes("Canceled the Lua download"), "aborted Lua download does not finish on the Shell terminal");
  await page.unroute("**/lua-5.4.9.wasm*").catch(() => {});

  await page.click('[data-testid="lang-linux"]');
  await page.click('[data-testid="lang-go"]');
  await page.click('[data-testid="lang-python"]');
  await page.click('[data-testid="lang-shell"]');
  await page.waitForSelector('[data-testid="lang-shell"][data-status="ready"]', { timeout: 60_000 });
  await page.waitForFunction(() => document.querySelector('[data-testid="lang-shell"]')?.getAttribute("aria-current") === "true");
  const rapid = await transcript(page);
  check(!rapid.includes("~%"), "rapid switch leaves no Linux prompt");
  check(!rapid.includes("PY-OK") && !rapid.includes("PY-MARKER"), "rapid switch leaves no Python output");
  check((await inputMode(page)) === "none", "rapid switch leaves the keyboard unbound");
  check((await page.getAttribute('[data-testid="lang-shell"]', "aria-current")) === "true", "Shell stays selected");

  await page.click('[data-testid="lang-linux"]');
  await page.waitForSelector('[data-testid="lang-linux"][data-status="ready"]', { timeout: 180_000 });
  check((await inputMode(page)) === "passthrough", "Linux serial owns the keyboard after boot");
  await page.evaluate(() => globalThis.__simplecodeEditor.setValue("sleep 30\n"));
  await page.click('[data-testid="run"]');
  await page.waitForSelector('[data-testid="run-status"][data-status="run"]', { timeout: 60_000 });
  await page.click('[data-testid="lang-python"]');
  await page.waitForFunction(() => {
    const status = document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status");
    return status !== "run" && status !== "preparing" && status !== "compile" && status !== "link";
  });
  const leftLinux = await transcript(page);
  check((await inputMode(page)) === "none", "leaving Linux detaches serial input");
  check((await page.getAttribute('[data-testid="run-status"]', "data-status")) !== "run", "Linux sleep does not keep the run indicator");
  check(!leftLinux.includes("~%") && !leftLinux.includes("PY-MARKER"), "Linux screen is cleared for Python");
  await page.evaluate(() => globalThis.__simplecodeEditor.setValue('print("PY-OK", flush=True)\n'));
  await page.click('[data-testid="run"]');
  await page.waitForFunction(() => {
    globalThis.__simplecodeTerminal.flush();
    return globalThis.__simplecodeTerminal.transcript.includes("PY-OK");
  });
  const py = await transcript(page);
  check(py.includes("PY-OK") && !py.includes("~%"), "Python runs on a terminal that no longer carries the Linux serial console");
} finally {
  await browser.close().catch(() => {});
  stop();
}

const unexpected = pageErrors.filter((err) => !/AbortError|aborted|Canceled|cancelled/i.test(err));
check(unexpected.length === 0, unexpected.length ? `page errors: ${unexpected.join(" | ")}` : "no unexpected page errors");

if (failed) {
  console.error(`${failed} terminal switch check(s) failed`);
  process.exit(1);
}
console.log("✓ terminal switch checks passed");
