#!/usr/bin/env node
// Capture expanded/collapsed sidebar in light and dark, and fail if the rail regresses.
// Usage: node tests/sidebar-screenshots.mjs [outDir]
// Serves dist/ via `vite preview` unless BASE is already set.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const PORT = Number(process.env.PORT ?? 4319);
const BASE = process.env.BASE ?? `http://127.0.0.1:${PORT}`;
const OUT = process.argv[2] ?? new URL("./screenshots/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

let server;
if (!process.env.BASE) {
  server = spawn("yarn", ["vite", "preview", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
  process.on("exit", () => server?.kill("SIGTERM"));
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(BASE)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
    if (i === 99) throw new Error("preview server did not start");
  }
}

const grey = (value) => {
  const m = String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return true;
  if (m[4] !== undefined && Number(m[4]) === 0) return true;
  return m[1] === m[2] && m[2] === m[3];
};

let browser;
try {
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
} catch {
  browser = await chromium.launch({ channel: "chrome" });
}

const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? "✓" : "✗"} ${message}`);
  if (!ok) failures.push(message);
};

for (const scheme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: scheme,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(BASE);
  await page.waitForSelector('[data-testid="lang-python"]', { timeout: 20000 });
  await page.waitForTimeout(300);

  const expanded = await page.evaluate(() => {
    const side = document.querySelector('[data-testid="sidebar"]');
    const title = document.querySelector('[data-testid="sidebar-title"]');
    const rows = [...document.querySelectorAll("[data-testid^=lang-]")].map((el) => Math.round(el.getBoundingClientRect().height));
    const header = document.querySelector('[data-testid="sidebar"] header')?.getBoundingClientRect();
    const toolbar = document.querySelector("div.flex.h-10")?.getBoundingClientRect();
    return {
      title: title?.textContent?.trim() ?? "",
      collapsed: side?.getAttribute("data-collapsed"),
      bg: getComputedStyle(side).backgroundColor,
      text: side?.innerText ?? "",
      rows,
      headerBottom: header ? Math.round(header.bottom) : -1,
      toolbarBottom: toolbar ? Math.round(toolbar.bottom) : -1,
      colors: [...side.querySelectorAll("*")].flatMap((el) => {
        const s = getComputedStyle(el);
        return [s.color, s.backgroundColor, s.borderTopColor];
      }),
    };
  });
  check(expanded.title === "SimpleCode", `${scheme} expanded title is SimpleCode`);
  check(!expanded.text.includes("Languages"), `${scheme} expanded has no Languages label`);
  check(expanded.collapsed === "false", `${scheme} starts expanded`);
  check(expanded.rows.length === 7 && expanded.rows.every((h) => h === 40), `${scheme} language rows are 40px`);
  check(expanded.headerBottom === expanded.toolbarBottom, `${scheme} header aligns with toolbar`);
  check(expanded.colors.every(grey), `${scheme} sidebar colors are neutral grey`);
  if (scheme === "light") check(expanded.bg === "rgb(255, 255, 255)", "light sidebar background is white");
  if (scheme === "dark") check(expanded.bg === "rgb(10, 10, 10)", "dark sidebar background is near-black");

  const side = page.locator('[data-testid="sidebar"]');
  await side.screenshot({ path: `${OUT}/sidebar-expanded-${scheme}.png` });
  await page.screenshot({ path: `${OUT}/app-expanded-${scheme}.png` });

  await page.click('[data-testid="sidebar-toggle"]');
  await page.waitForTimeout(400);
  const collapsed = await page.evaluate(() => {
    const side = document.querySelector('[data-testid="sidebar"]');
    const footer = document.querySelector('[data-testid="sidebar-footer"]');
    const sideR = side.getBoundingClientRect();
    const center = sideR.x + sideR.width / 2;
    const buttons = [...footer.querySelectorAll("button")].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        label: el.getAttribute("aria-label") ?? "",
        w: r.width,
        h: r.height,
        cx: r.x + r.width / 2,
        text: el.innerText.trim(),
        overflow: el.scrollWidth > el.clientWidth + 1,
      };
    });
    return {
      collapsed: side.getAttribute("data-collapsed"),
      w: sideR.width,
      footerText: footer.innerText.trim(),
      buttons,
      center,
    };
  });
  check(collapsed.collapsed === "true", `${scheme} collapsed flag`);
  check(Math.round(collapsed.w) === 56, `${scheme} collapsed width is 56px (${collapsed.w})`);
  check(collapsed.footerText === "", `${scheme} collapsed footer has no text`);
  check(collapsed.buttons.length === 3, `${scheme} collapsed footer has 3 buttons`);
  for (const button of collapsed.buttons) {
    check(button.w === 32 && button.h === 32, `${scheme} ${button.label} is 32×32`);
    check(Math.abs(button.cx - collapsed.center) < 1, `${scheme} ${button.label} is centered`);
    check(button.text === "" && !button.overflow, `${scheme} ${button.label} has no overflow`);
  }
  await side.screenshot({ path: `${OUT}/sidebar-collapsed-${scheme}.png` });
  await page.screenshot({ path: `${OUT}/app-collapsed-${scheme}.png` });

  await page.hover('[data-testid="sidebar-theme"]');
  await page.waitForTimeout(400);
  const tip = await page.locator("[role=tooltip]").innerText().catch(() => "");
  check(tip.includes("主题"), `${scheme} theme tooltip visible (${tip})`);
  await context.close();
}

await browser.close();
server?.kill("SIGTERM");
if (failures.length) {
  console.log(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log(`\nscreenshots in ${OUT}`);
