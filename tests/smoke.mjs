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
  { id: "quickjs", name: "js", dialect: "js", code: 'console.log("Hello from JS", 6 * 7)', expect: "Hello from JS 42" },
  {
    id: "quickjs",
    name: "ts",
    dialect: "ts",
    code: 'interface Result { label: string; value: number }\nconst row: Result = { label: "TS", value: 6 * 7 };\nconsole.log("Hello from", row.label, row.value);\n',
    expect: "Hello from TS 42",
    screenshot: "ts-run.png",
  },
  {
    id: "quickjs",
    name: "ts-error",
    dialect: "ts",
    code: "const n: number = ;\n",
    expect: ["转译失败", "Unexpected token"],
    statuses: ["failed"],
  },
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
  {
    id: "rust",
    code: 'fn main() {\n    println!("Hello from Rust {}", 6 * 7);\n}\n',
    expect: "Hello from Rust 42",
    monaco: "rust",
    fileName: "main.rs",
  },
  {
    id: "rust",
    name: "error",
    code: "fn main() {\n    let n: i32 = ;\n}\n",
    expect: ["编译失败", "error"],
    statuses: ["failed"],
    fileName: "main.rs",
  },
  {
    id: "rust",
    name: "stdin",
    code: 'use std::io::{self, BufRead};\nfn main() {\n    let mut line = String::new();\n    io::stdin().lock().read_line(&mut line).unwrap();\n    println!("Hello, {} from Rust", line.trim());\n}\n',
    stdin: "Ada",
    expect: "Hello, Ada from Rust",
    fileName: "main.rs",
  },
  {
    id: "rust",
    name: "fs",
    code: 'use std::fs;\nfn main() {\n    fs::write("/memo.txt", "pass").unwrap();\n    let text = fs::read_to_string("/memo.txt").unwrap();\n    println!("{text}");\n}\n',
    expect: "pass",
    fileName: "main.rs",
  },
  {
    id: "shell",
    code: 'read name\necho "Hello, $name from Shell"\necho pipe | cat\n',
    stdin: "Ada",
    expect: ["Hello, Ada from Shell", "pipe"],
    screenshot: "shell-run.png",
    monaco: "shell",
    fileName: "main.sh",
  },
  {
    id: "linux",
    code: "echo hello-from-linux\nls --color=never -1 /mnt\n",
    expect: ["hello-from-linux", "main.sh"],
    fileName: "main.sh",
    monaco: "shell",
    exitCode: "0",
  },
  {
    id: "linux",
    name: "exit",
    code: "echo nope\nexit 3\n",
    expect: "nope",
    statuses: ["failed"],
    exitCode: "3",
  },
  {
    id: "linux",
    name: "marker",
    code: "echo secret > /tmp/marker && echo wrote\n",
    expect: "wrote",
    exitCode: "0",
  },
  {
    id: "linux",
    name: "isolate",
    code: "ls /tmp/marker || echo absent\n",
    expect: "absent",
    exitCode: "0",
  },
].filter((c) => !only.length || only.includes(c.id) || only.includes(c.name));

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
      if (c.fileName) {
        await page.waitForFunction((name) => document.querySelector('[data-testid="filename"]')?.textContent === name, c.fileName);
      }
      if (c.monaco) {
        const mode = await page.evaluate(() => globalThis.__simplecodeEditor.getModel().getLanguageId());
        if (mode !== c.monaco) throw new Error(`monaco mode ${mode}, want ${c.monaco}`);
      }
      if (c.dialect) {
        await page.click(`[data-testid="dialect-${c.dialect}"]`);
        const file = c.dialect === "ts" ? "main.ts" : "main.js";
        await page.waitForFunction((name) => document.querySelector('[data-testid="filename"]')?.textContent === name, file);
      }
      const tl = Date.now();
      await page.evaluate((code) => globalThis.__simplecodeEditor.setValue(code), c.code);
      if (c.dialect) {
        const mode = await page.evaluate(() => globalThis.__simplecodeEditor.getModel().getLanguageId());
        const want = c.dialect === "ts" ? "typescript" : "javascript";
        if (mode !== want) throw new Error(`monaco mode ${mode}, want ${want}`);
      }
      if (c.name === "ts") {
        await page.click('[data-testid="dialect-js"]');
        await page.waitForFunction(() => document.querySelector('[data-testid="filename"]')?.textContent === "main.js");
        const jsState = await page.evaluate(() => ({
          value: globalThis.__simplecodeEditor.getValue(),
          mode: globalThis.__simplecodeEditor.getModel().getLanguageId(),
        }));
        if (jsState.mode !== "javascript" || jsState.value.includes("interface Result")) throw new Error("JS buffer was overwritten by TS");
        await page.click('[data-testid="dialect-ts"]');
        await page.waitForFunction(() => document.querySelector('[data-testid="filename"]')?.textContent === "main.ts");
        const tsState = await page.evaluate(() => ({
          value: globalThis.__simplecodeEditor.getValue(),
          mode: globalThis.__simplecodeEditor.getModel().getLanguageId(),
        }));
        if (tsState.mode !== "typescript" || !tsState.value.includes("interface Result")) throw new Error("TS buffer did not keep its draft");
      }
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
      const exitCode = await page.getAttribute('[data-testid="run-status"]', "data-exit");
      const out = await page.evaluate(() => globalThis.__simplecodeTerminal.transcript);
      const expects = Array.isArray(c.expect) ? c.expect : [c.expect];
      const statuses = c.statuses ?? ["done"];
      const ok = statuses.includes(status) && expects.every((part) => out.includes(part)) && (c.exitCode == null || exitCode === c.exitCode);
      if (!ok) failed++;
      const label = (c.name ? `${c.id}/${c.name}` : c.id).padEnd(16);
      console.log(`${ok ? "✓" : "✗"} ${label} load ${((tl - t0) / 1000).toFixed(1)}s run ${((Date.now() - tl) / 1000).toFixed(1)}s status=${status} out=${JSON.stringify(out.replace(/\x1b\[[0-9;]*m/g, "").trim().slice(-160))}`);
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
      const label = (c.name ? `${c.id}/${c.name}` : c.id).padEnd(16);
      console.log(`✗ ${label} ${e.message.split("\n")[0]} out=${JSON.stringify(out?.slice(-200))}`);
    }
  }
  // reload: languages should come from Cache API
  const keys = await page.evaluate(async () => (await (await caches.open("simplecode-wasm-v1")).keys()).map((r) => r.url.split("/").pop()));
  console.log("cached:", keys.join(" "));
  await page.reload();
  await page.waitForSelector('[data-testid="lang-python"]');
  if (cases.some((c) => c.dialect === "ts")) {
    await page.click('[data-testid="lang-quickjs"]');
    await page.waitForFunction(() => document.querySelector('[data-testid="filename"]')?.textContent === "main.ts");
    const pressed = await page.getAttribute('[data-testid="dialect-ts"]', "aria-pressed");
    if (pressed !== "true") {
      failed++;
      console.log("✗ dialect was not remembered after reload");
    } else console.log("dialect remembered: ts");
  }
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
