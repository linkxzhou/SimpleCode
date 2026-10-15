#!/usr/bin/env node
// Drawer, chapter Run, TypeScript comment, backup undo, coming soon, screenshots.
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { PNG } from "pngjs";
import { chromium } from "playwright";

const PORT = Number(process.env.LEARN_PORT ?? 4323);
const BASE = `http://127.0.0.1:${PORT}`;
const shotDir = "tests/screenshots";
const artifactDir = "/opt/cursor/artifacts";

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

function stripAnsi(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

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

function readPng(path) {
  return readFileSync(path);
}

async function showToc(page) {
  await openLearn(page);
  const back = page.getByRole("button", { name: "返回目录" });
  if (await back.count()) await back.click();
  await page.waitForSelector('[data-testid="docs-search"]');
}

let failed = 0;
function check(ok, message) {
  if (!ok) {
    failed++;
    console.log(`✗ ${message}`);
  } else console.log(`✓ ${message}`);
}

async function saveShot(page, name, locator) {
  mkdirSync(shotDir, { recursive: true });
  mkdirSync(artifactDir, { recursive: true });
  const target = locator ?? page;
  for (const dir of [shotDir, artifactDir]) {
    const path = `${dir}/${name}`;
    await target.screenshot({ path });
    const size = statSync(path).size;
    check(size > 10_000, `${name} ${size} bytes`);
  }
}

function monoRatio(path) {
  const png = PNG.sync.read(readPng(path));
  let colored = 0;
  let total = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < 16) continue;
    total++;
    const r = png.data[i];
    const g = png.data[i + 1];
    const b = png.data[i + 2];
    if (Math.abs(r - g) > 2 || Math.abs(g - b) > 2) colored++;
  }
  return total ? 1 - colored / total : 1;
}

async function setTheme(page, mode) {
  await page.evaluate((value) => localStorage.setItem("simplecode:theme", value), mode);
  await page.reload();
  await page.waitForSelector('[data-testid="learn-button"]');
}

async function openLearn(page) {
  if ((await page.getAttribute('[data-testid="learn-button"]', "aria-expanded")) !== "true") {
    await page.click('[data-testid="learn-button"]');
  }
  await page.waitForSelector('[data-testid="docs-drawer"]');
}

async function assertToolbarClear(page) {
  const boxes = await page.evaluate(() => {
    const drawer = document.querySelector('[data-testid="docs-drawer"]').getBoundingClientRect();
    return ["run", "learn-button"].map((id) => {
      const el = document.querySelector(`[data-testid="${id}"]`);
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      const intersects = !(r.right <= drawer.left || r.left >= drawer.right || r.bottom <= drawer.top || r.top >= drawer.bottom);
      return { id, intersects, covered: !!hit?.closest("[data-testid='docs-drawer']"), visible: r.width > 0 && r.height > 0 };
    });
  });
  check(
    boxes.every((b) => b.visible && !b.intersects && !b.covered),
    `toolbar stays clear of the drawer (${boxes.map((b) => `${b.id}:${b.intersects ? "overlap" : "ok"}`).join(" ")})`,
  );
}

/** Wait until this block's run reaches a terminal status. A previous example can still show "done". */
async function waitForBlock(page, block, statuses = ["done", "failed", "crash", "terminated"]) {
  const id = await block.getAttribute("data-block");
  await page.waitForFunction(
    ({ id, statuses }) => {
      const el = document.querySelector('[data-testid="run-status"]');
      const status = el?.getAttribute("data-status") ?? "";
      return el?.getAttribute("data-source") === id && statuses.includes(status);
    },
    { id, statuses },
    { timeout: 180_000 },
  );
}

try {
  await waitForServer();
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on("pageerror", (err) => console.log("  [pageerror]", err.message));
  await page.goto(BASE);
  await page.evaluate(() => localStorage.removeItem("simplecode:learn:autoStop"));
  await setTheme(page, "light");
  await page.waitForSelector('[data-testid="lang-python"]');
  await openLearn(page);
  const title = await page.textContent('[data-testid="docs-title"]');
  check(title?.includes("Python 101"), `drawer title ${title}`);
  await assertToolbarClear(page);
  await saveShot(page, "learn-drawer-light.png");
  const lightDrawer = "/tmp/learn-drawer-light-element.png";
  await page.locator('[data-testid="docs-drawer"]').screenshot({ path: lightDrawer });
  const lightRatio = monoRatio(lightDrawer);
  check(lightRatio >= 0.99, `light drawer grayscale ${(lightRatio * 100).toFixed(2)}%`);

  await setTheme(page, "dark");
  await openLearn(page);
  await assertToolbarClear(page);
  await saveShot(page, "learn-drawer-dark.png");
  const darkDrawer = "/tmp/learn-drawer-dark-element.png";
  await page.locator('[data-testid="docs-drawer"]').screenshot({ path: darkDrawer });
  const darkRatio = monoRatio(darkDrawer);
  check(darkRatio >= 0.99, `dark drawer grayscale ${(darkRatio * 100).toFixed(2)}%`);

  await setTheme(page, "light");
  await openLearn(page);
  await page.click('[data-testid="chapter-link"][data-chapter="3"]');
  await page.waitForSelector('[data-testid="docs-chapter"]');
  await saveShot(page, "learn-chapter.png", page.locator('[data-testid="docs-drawer"]'));
  const block = page.locator('[data-testid="docs-chapter"] [data-testid="doc-code-block"]').first();
  const code = await block.getAttribute("data-code");
  const expectText = await block.getAttribute("data-expect");
  check(code?.includes('input("名字？")') && expectText === "你好，Ada！", "chapter 3 opens on the greeting");
  await block.locator('[data-testid="doc-run"]').click();
  await waitForBlock(page, block);
  const status = await page.getAttribute('[data-testid="run-status"]', "data-status");
  const editorValue = await page.evaluate(() => globalThis.__simplecodeEditor.getValue());
  const transcript = stripAnsi(await page.evaluate(() => globalThis.__simplecodeTerminal.transcript));
  check(status === "done" && editorValue === code && transcript.includes(expectText), `run from doc status=${status}`);
  await saveShot(page, "learn-after-run.png");

  await page.click('[data-testid="docs-close"]');
  await page.click('[data-testid="lang-ruby"]');
  await openLearn(page);
  const rubyTitle = await page.textContent('[data-testid="docs-title"]');
  check(rubyTitle?.includes("Ruby 101") && !(await page.$('[data-testid="docs-soon"]')), `ruby book opens ${rubyTitle}`);
  await page.click('[data-testid="docs-close"]');
  await page.click('[data-testid="lang-sqlite"]');
  await openLearn(page);
  const sqlTitle = await page.textContent('[data-testid="docs-title"]');
  check(sqlTitle?.includes("SQL 101") && !(await page.$('[data-testid="docs-soon"]')), `sql book opens ${sqlTitle}`);
  await page.click('[data-testid="docs-close"]');
  await page.click('[data-testid="lang-clang"]');
  await openLearn(page);
  const cTitle = await page.textContent('[data-testid="docs-title"]');
  check(cTitle?.includes("C 101") && !cTitle?.includes("C++") && !(await page.$('[data-testid="docs-soon"]')), `c book opens ${cTitle}`);
  await page.click('[data-testid="docs-close"]');
  await page.click('[data-testid="lang-clangpp"]');
  await openLearn(page);
  const cppTitle = await page.textContent('[data-testid="docs-title"]');
  check(cppTitle?.includes("C++ 101") && !(await page.$('[data-testid="docs-soon"]')), `cpp book opens ${cppTitle}`);
  await page.click('[data-testid="docs-close"]');
  await page.click('[data-testid="lang-php-cgi"]');
  await openLearn(page);
  const phpTitle = await page.textContent('[data-testid="docs-title"]');
  check(phpTitle?.includes("PHP 101") && !(await page.$('[data-testid="docs-soon"]')), `php book opens ${phpTitle}`);
  await page.click('[data-testid="docs-close"]');
  await page.click('[data-testid="lang-lua"]');
  await openLearn(page);
  await page.waitForSelector('[data-testid="docs-soon"]');
  const soon = await page.textContent('[data-testid="docs-title"]');
  check(soon?.includes("Lua 101") && (await page.textContent('[data-testid="docs-soon"]'))?.includes("即将推出"), "lua coming soon");
  await page.click('[data-testid="docs-close"]');

  await page.click('[data-testid="lang-python"]');
  await page.waitForSelector('[data-testid="lang-python"][data-status="ready"]', { timeout: 180_000 });
  const draft = 'print("keep-me")\n';
  await page.evaluate((value) => globalThis.__simplecodeEditor.setValue(value), draft);
  await showToc(page);
  await page.click('[data-testid="chapter-link"][data-chapter="1"]');
  await page.waitForSelector('[data-testid="docs-chapter"]');
  const chapterOne = page.locator('[data-testid="doc-code-block"]').first();
  await chapterOne.locator('[data-testid="doc-run"]').click();
  await waitForBlock(page, chapterOne);
  await page.click('[data-testid="doc-undo"]');
  const restored = await page.evaluate(() => globalThis.__simplecodeEditor.getValue());
  check(restored === draft, "undo restores the editor");

  await showToc(page);
  await page.click('[data-testid="chapter-link"][data-chapter="4"]');
  await page.waitForSelector('[data-smoke="skip"] [data-testid="doc-run"]');
  const looping = page.locator('[data-smoke="skip"]').first();
  await looping.locator('[data-testid="doc-run"]').click();
  await waitForBlock(page, looping, ["run"]);
  const other = page.locator('[data-testid="doc-code-block"][data-runnable="1"]:not([data-smoke="skip"])').first();
  const otherCode = await other.getAttribute("data-code");
  await other.locator('[data-testid="doc-run"]').click();
  await page.waitForSelector('[data-testid="doc-confirm"]');
  await page.click('[data-testid="doc-confirm-yes"]');
  await waitForBlock(page, other);
  const afterStop = await page.evaluate(() => globalThis.__simplecodeEditor.getValue());
  check(afterStop === otherCode, "confirm stop runs the next example");

  await page.click('[data-testid="docs-close"]');
  await page.click('[data-testid="lang-quickjs"]');
  await page.waitForSelector('[data-testid="lang-quickjs"][data-status="ready"]', { timeout: 180_000 });
  await showToc(page);
  check((await page.textContent('[data-testid="docs-title"]'))?.includes("JavaScript 101"), "javascript book label");
  await page.click('[data-testid="chapter-link"][data-chapter="11"]');
  await page.waitForSelector('[data-lang="ts"] [data-testid="doc-run"]');
  const ts = page.locator('[data-lang="ts"]').first();
  const tsExpect = await ts.getAttribute("data-expect");
  await ts.locator('[data-testid="doc-run"]').click();
  await waitForBlock(page, ts);
  const tsEditor = await page.evaluate(() => globalThis.__simplecodeEditor.getValue());
  const tsOut = stripAnsi(await page.evaluate(() => globalThis.__simplecodeTerminal.transcript));
  const filename = await page.textContent('[data-testid="filename"]');
  check(
    tsEditor.includes("由 TypeScript 转译") && tsOut.includes(tsExpect) && filename === "main.js",
    `ts block transpiled into the editor (file=${filename}, expect=${tsExpect}, editor=${tsEditor.slice(0, 80).replaceAll("\n", " ")})`,
  );

  await page.click('[data-testid="docs-close"]');
  await page.click('[data-testid="lang-go"]');
  await page.waitForSelector('[data-testid="lang-go"][data-status="ready"]', { timeout: 180_000 });
  await showToc(page);
  await page.click('[data-testid="chapter-link"][data-chapter="9"]');
  await page.waitForSelector('[data-testid="docs-chapter"]');
  const goCount = await page.locator('[data-testid="doc-code-block"]').count();
  let goBlock = page.locator('[data-testid="doc-code-block"]').first();
  for (let i = 0; i < goCount; i++) {
    const sample = await page.locator('[data-testid="doc-code-block"]').nth(i).getAttribute("data-code");
    if (sample?.includes("make(chan int, 1)") && sample.includes("func main")) {
      goBlock = page.locator('[data-testid="doc-code-block"]').nth(i);
      break;
    }
  }
  const goCode = (await goBlock.getAttribute("data-code")) ?? "";
  const sourceLines = goCode.replace(/\n$/, "").split("\n").length;
  const renderedLines = await goBlock.locator(".line").count();
  const gap = await goBlock.locator("pre").evaluate((pre) => {
    const lines = [...pre.querySelectorAll(".line")];
    const tops = lines.map((node) => node.getBoundingClientRect().top);
    const height = lines[0]?.getBoundingClientRect().height ?? 0;
    const worst = tops.slice(1).reduce((max, top, i) => Math.max(max, Math.abs(top - tops[i] - height)), 0);
    return { height, worst };
  });
  check(renderedLines === sourceLines && gap.worst <= 1, `code lines rendered=${renderedLines} source=${sourceLines} gap=${gap.worst.toFixed(2)}`);
  await goBlock.scrollIntoViewIfNeeded();
  await saveShot(page, "learn-code-lines.png", goBlock);
  const buttons = await page.evaluate(() => {
    const text = (el) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
    const a = document.querySelector('[data-testid="run"]');
    const b = document.querySelector('[data-testid="doc-run"]');
    const sa = getComputedStyle(a);
    const sb = getComputedStyle(b);
    return {
      label: text(a) === "Run" && text(b) === "Run",
      height: sa.height === sb.height,
      fontSize: sa.fontSize === sb.fontSize,
      background: sa.backgroundColor === sb.backgroundColor,
      heightPx: sa.height,
    };
  });
  check(
    buttons.label && buttons.height && buttons.fontSize && buttons.background && buttons.heightPx === "28px",
    `run buttons match (${JSON.stringify(buttons)})`,
  );
  await saveShot(page, "learn-run-buttons.png");

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.route("**/*ruby*.wasm", async (route) => {
    await new Promise((r) => setTimeout(r, 700));
    await route.continue();
  });
  const fresh = await context.newPage();
  await fresh.goto(BASE);
  await fresh.waitForSelector('[data-testid="learn-button"]');
  await fresh.click('[data-testid="learn-button"]');
  await fresh.click('[data-testid="chapter-link"][data-chapter="0"]');
  await fresh.waitForSelector('[data-lang="ruby"] [data-testid="doc-run"]');
  const ruby = fresh.locator('[data-lang="ruby"]').first();
  await ruby.locator('[data-testid="doc-run"]').click();
  await fresh.waitForFunction(
    () => /下载/.test(document.querySelector('[data-lang="ruby"] [data-testid="doc-download"]')?.textContent ?? ""),
    null,
    { timeout: 20_000 },
  );
  check(true, "ruby download progress shows on the doc button");
  await waitForBlock(fresh, ruby);
  const rubyOut = stripAnsi(await fresh.evaluate(() => globalThis.__simplecodeTerminal.transcript));
  check(rubyOut.includes("来自 Ruby 的 42"), "cross-language ruby block");

  const overview = page;
  await overview.click('[data-testid="docs-close"]').catch(() => {});
  await browser.close();
} finally {
  stop();
}
console.log(failed ? `\n${failed} learn check(s) failed` : "\nlearn checks passed");
process.exit(failed ? 1 : 0);
