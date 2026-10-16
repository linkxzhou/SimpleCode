#!/usr/bin/env node
// About dialog, locale persistence, English Quick Start placeholder, progress spacing.
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = Number(process.env.UI_PORT ?? 4325);
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

async function openAbout(page) {
  await page.getByTestId("about-button").click();
  await page.getByTestId("about-dialog").waitFor();
}

await waitForServer();
const browser = await launchBrowser();
try {
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE);
  await page.getByTestId("sidebar-title").waitFor();

  await openAbout(page);
  const zh = await page.getByTestId("about-dialog").innerText();
  check(zh.includes("Linux") && zh.includes("Rust") && zh.includes("Monaco") && zh.includes("Cache API") && zh.includes("快速入门"), "about dialog in Chinese");
  await page.keyboard.press("Escape");
  await page.getByTestId("about-dialog").waitFor({ state: "hidden" });
  check(true, "about dialog closes");

  await page.getByTestId("locale-en").click();
  await openAbout(page);
  const en = await page.getByTestId("about-dialog").innerText();
  check(
    en.includes("Twelve languages") && en.includes("Linux") && en.includes("Rust") && en.includes("Monaco") && en.includes("Quick Start"),
    "about dialog in English",
  );
  await page.keyboard.press("Escape");

  await page.reload();
  await page.getByTestId("locale-en").waitFor();
  const pressed = await page.getByTestId("locale-en").getAttribute("aria-pressed");
  const stored = await page.evaluate(() => localStorage.getItem("simplecode:locale"));
  check(pressed === "true" && stored === "en", `locale persisted (${pressed}, ${stored})`);

  await page.getByTestId("learn-button").click();
  await page.getByTestId("docs-en-placeholder").waitFor();
  const placeholder = await page.getByTestId("docs-en-placeholder").innerText();
  check(placeholder.includes("English Quick Start is under construction"), "English Quick Start placeholder");
  await page.getByTestId("docs-view-zh").click();
  await page.waitForSelector('[data-testid="docs-search"], [data-testid="docs-chapter"]');
  check((await page.getByTestId("docs-en-placeholder").count()) === 0, "Chinese book replaces the placeholder");
  await page.getByTestId("docs-close").click();

  await page.getByTestId("sidebar-toggle").click();
  await page.waitForFunction(() => document.querySelector("[data-testid=sidebar]")?.getAttribute("data-collapsed") === "true");
  check((await page.getByTestId("about-button").count()) === 1, "about button remains when collapsed");
  await openAbout(page);
  check(await page.getByTestId("about-dialog").isVisible(), "about dialog opens from the collapsed sidebar");
  await page.close();

  const context = await browser.newContext();
  const progressPage = await context.newPage();
  let release = () => {};
  const held = new Promise((resolve) => {
    release = resolve;
  });
  await progressPage.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.includes("/wasm/") && !url.includes("manifest.json")) {
      await held;
      try {
        await route.abort();
      } catch {
        /* page already closed */
      }
      return;
    }
    await route.continue();
  });
  try {
    await progressPage.goto(BASE);
    const bar = progressPage.getByTestId("wasm-progress");
    await bar.waitFor({ state: "visible", timeout: 8000 });
    const margins = await bar.evaluate((el) => {
      const style = getComputedStyle(el);
      return { top: style.marginTop, bottom: style.marginBottom };
    });
    check(margins.top === "4px" && margins.bottom === "4px", `progress bar vertical margin ${margins.top} / ${margins.bottom}`);
  } finally {
    release();
    await progressPage.close().catch(() => {});
    await context.close().catch(() => {});
  }
} finally {
  await browser.close().catch(() => {});
  stop();
}

if (failed) {
  console.error(`${failed} ui chrome check(s) failed`);
  process.exit(1);
}
console.log("✓ ui chrome checks passed");
