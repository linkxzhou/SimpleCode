#!/usr/bin/env node
// Headless smoke test: starts `vite preview`, checks COOP/COEP, runs hello-world per language.
import { spawn } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { chromium } from "playwright";

const PORT = Number(process.env.PORT ?? 4317);
const BASE = `http://localhost:${PORT}`;
const only = process.argv.slice(2);

const cases = [
  { id: "python", code: 'name = input()\nprint(f"Hello, {name} from Python")', stdin: "Ada", expect: "Hello, Ada from Python" },
  { id: "quickjs", code: 'console.log("Hello from QuickJS", 6 * 7)', expect: "Hello from QuickJS 42" },
  { id: "clang", code: '#include <stdio.h>\nint main(void){ int n; scanf("%d", &n); printf("Hello from C %d\\n", n * 2); return 0; }', stdin: "21", expect: "Hello from C 42" },
  { id: "clangpp", code: '#include <iostream>\nint main(){ std::cout << "Hello from C++ " << 6 * 7 << std::endl; }', expect: "Hello from C++ 42" },
  { id: "ruby", code: 'puts "Hello from Ruby #{6 * 7}"', expect: "Hello from Ruby 42" },
  { id: "sqlite", code: "CREATE TABLE t(x);\nINSERT INTO t VALUES (42);\nSELECT 'Hello from SQLite ' || x FROM t;", expect: "Hello from SQLite 42" },
  { id: "php-cgi", code: '<?php echo "Hello from PHP " . (6 * 7) . "\\n";', expect: "Hello from PHP 42" },
  {
    id: "lua",
    code: 'local name = io.read("*l")\nlocal ok = pcall(function() error("boom") end)\nprint(string.format("Hello, %s from Lua %s", name, ok and "fail" or "pcall"))',
    stdin: "Ada",
    expect: "Hello, Ada from Lua pcall",
    screenshot: "lua-run.png",
  },
  {
    id: "go",
    code: 'package main\nimport ("bufio"; "fmt"; "os"; "strings")\nfunc main() {\n  in := bufio.NewReader(os.Stdin)\n  name, _ := in.ReadString(\'\\n\')\n  fmt.Printf("Hello, %s from Go %d\\n", strings.TrimSpace(name), 6*7)\n}\n',
    stdin: "Ada",
    expect: "Hello, Ada from Go 42",
    screenshot: "go-run.png",
  },
].filter((c) => !only.length || only.includes(c.id));

const server = spawn("yarn", ["vite", "preview", "--port", String(PORT), "--strictPort"], { stdio: ["ignore", "pipe", "pipe"] });
const stop = () => { try { server.kill("SIGTERM"); } catch {} };
process.on("exit", stop);

async function waitForServer() {
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch(BASE); if (r.ok) return r; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("preview server did not start");
}

let failed = 0;
try {
  const res = await waitForServer();
  const coop = res.headers.get("cross-origin-opener-policy");
  const coep = res.headers.get("cross-origin-embedder-policy");
  console.log(`headers: COOP=${coop} COEP=${coep}`);
  if (coop !== "same-origin" || coep !== "require-corp") { console.log("✗ isolation headers missing"); failed++; }
  const w = await fetch(`${BASE}/wasm/sqlite.wasm`, { method: "HEAD" });
  console.log(`wasm: ${w.status} ${w.headers.get("content-type")} COEP=${w.headers.get("cross-origin-embedder-policy")}`);

  // Use bundled Playwright browser if present, else CHROME_PATH, else system Chrome
  let browser;
  try {
    browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  } catch {
    browser = await chromium.launch({ channel: "chrome" });
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const shotDir = "tests/screenshots";
  const artifactDir = "/opt/cursor/artifacts";
  mkdirSync(shotDir, { recursive: true });
  mkdirSync(artifactDir, { recursive: true });
  page.on("console", (m) => m.type() !== "log" && console.log(`  [console.${m.type()}]`, m.text()));
  page.on("pageerror", (e) => console.log("  [pageerror]", e.message));
  await page.goto(BASE);
  const isolated = await page.evaluate(() => crossOriginIsolated);
  console.log(`crossOriginIsolated=${isolated}`);
  await page.waitForSelector('[data-testid="lang-python"]');

  for (const c of cases) {
    const t0 = Date.now();
    try {
      await page.click(`[data-testid="lang-${c.id}"]`);
      await page.waitForSelector(`[data-testid="lang-${c.id}"]:is([data-status="ready"],[data-status="error"])`, { timeout: 180_000 });
      if ((await page.getAttribute(`[data-testid="lang-${c.id}"]`, "data-status")) !== "ready") throw new Error("download failed");
      const tl = Date.now();
      await page.evaluate((code) => globalThis.__simplecodeEditor.setValue(code), c.code);
      await page.click('[data-testid="run"]');
      if (c.stdin) {
        await page.waitForSelector('[data-testid="run-status"][data-status="run"]', { timeout: 60_000 });
        await page.waitForTimeout(300);
        await page.click('[data-testid="terminal"]');
        await page.keyboard.type(c.stdin);
        await page.keyboard.press("Enter");
      }
      await page.waitForFunction(
        () => ["done", "failed", "crash", "terminated"].includes(document.querySelector('[data-testid="run-status"]')?.getAttribute("data-status") ?? ""),
        null,
        { timeout: 120_000 },
      );
      const status = await page.getAttribute('[data-testid="run-status"]', "data-status");
      const out = await page.evaluate(() => globalThis.__simplecodeTerminal.transcript);
      const ok = status === "done" && out.includes(c.expect);
      if (!ok) failed++;
      console.log(`${ok ? "✓" : "✗"} ${c.id.padEnd(8)} load ${((tl - t0) / 1000).toFixed(1)}s run ${((Date.now() - tl) / 1000).toFixed(1)}s status=${status} out=${JSON.stringify(out.replace(/\x1b\[[0-9;]*m/g, "").trim().slice(-160))}`);
      if (c.screenshot) {
        const paths = [`${shotDir}/${c.screenshot}`, `${artifactDir}/${c.screenshot}`];
        for (const path of paths) {
          await page.screenshot({ path });
          if (statSync(path).size < 10_000) {
            failed++;
            console.log(`  ✗ screenshot too small: ${path}`);
          }
        }
        console.log(`  screenshot ${paths.join(" ")}`);
      }
    } catch (e) {
      failed++;
      const out = await page.evaluate(() => globalThis.__simplecodeTerminal?.transcript).catch(() => "");
      console.log(`✗ ${c.id.padEnd(8)} ${e.message.split("\n")[0]} out=${JSON.stringify(out?.slice(-200))}`);
    }
  }
  // reload: languages should come from Cache API
  const keys = await page.evaluate(async () => (await (await caches.open("simplecode-wasm-v1")).keys()).map((r) => r.url.split("/").pop()));
  console.log("cached:", keys.join(" "));
  await page.reload();
  await page.waitForSelector('[data-testid="lang-python"]');
  await page.waitForTimeout(1500);
  const statuses = await page.$$eval("[data-testid^=lang-]", (els) => els.map((e) => `${e.dataset.testid.slice(5)}=${e.dataset.status}`));
  console.log("after reload:", statuses.join(" "));
  const box = async (sel) => page.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`; });
  console.log(`layout expanded: sidebar=${await box('[data-testid="sidebar"]')} editor=${await box('[data-testid="editor"]')} terminal=${await box('[data-testid="terminal"]')}`);
  await page.screenshot({ path: "tests/screenshot.png" });
  await page.click('[data-testid="sidebar-toggle"]');
  await page.waitForTimeout(400);
  console.log(`layout collapsed: sidebar=${await box('[data-testid="sidebar"]')} editor=${await box('[data-testid="editor"]')}`);
  await page.screenshot({ path: "tests/screenshot-collapsed.png" });
  await browser.close();
} finally {
  stop();
}
console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
