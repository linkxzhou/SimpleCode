#!/usr/bin/env node
// Capture UI screenshots into tests/screenshots/ (uses system Chrome if Playwright's browser is missing)
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const PORT = 4319;
const BASE = `http://localhost:${PORT}`;
const OUT = new URL("./screenshots/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const server = spawn("yarn", ["vite", "preview", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
process.on("exit", () => server.kill("SIGTERM"));
for (let i = 0; i < 100; i++) { try { if ((await fetch(BASE)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 200)); }

let browser;
try { browser = await chromium.launch(); } catch { browser = await chromium.launch({ channel: "chrome" }); }
const shoot = async (page, name) => { await page.waitForTimeout(400); await page.screenshot({ path: OUT + name }); console.log(OUT + name); };

for (const scheme of ["light", "dark"]) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme, deviceScaleFactor: 1 })).newPage();
  await page.goto(BASE);
  await page.waitForSelector('[data-testid="lang-python"][data-status="ready"]', { timeout: 120000 });
  await page.click('[data-testid="lang-quickjs"]'); // show a cached language too
  await page.waitForSelector('[data-testid="lang-quickjs"][data-status="ready"]');
  await page.click('[data-testid="lang-python"]');
  await page.evaluate(() => globalThis.__simplecodeEditor.setValue('name = input("Name? ")\nprint(f"Hello, {name}!")\nprint([n * n for n in range(1, 6)])\n'));
  if (scheme === "light") {
    await shoot(page, "1-sidebar-expanded.png");
    await page.click('[data-testid="sidebar-toggle"]');
    await shoot(page, "2-sidebar-collapsed.png");
    await page.click('[data-testid="sidebar-toggle"]');
    await page.click('[data-testid="terminal-toggle"]');
    await shoot(page, "3-terminal-collapsed.png");
    await page.click('[data-testid="terminal-toggle"]');
  }
  await page.click('[data-testid="run"]');
  await page.waitForSelector('[data-testid="run-status"][data-status="run"]');
  await page.waitForTimeout(300);
  await page.click('[data-testid="terminal"]');
  await page.keyboard.type("Ada");
  await page.keyboard.press("Enter");
  await page.waitForSelector('[data-testid="run-status"][data-status="done"]');
  await shoot(page, scheme === "light" ? "4-python-run.png" : "5-python-run-dark.png");
}
await browser.close();
server.kill("SIGTERM");
