// Cold-boot the pinned bzImage under v86 and save a shell-prompt snapshot.
// Node only. Do not set window or navigator: v86 then takes the browser audio path.
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const opt = {};
for (let i = 2; i < process.argv.length; i += 2) {
  opt[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
}
for (const key of ["lib", "wasm", "bios", "vga", "bzimage", "out", "zstd"]) {
  if (!opt[key]) {
    console.error(`missing --${key}`);
    process.exit(2);
  }
}

globalThis.document = {
  createElement: () => ({ style: {}, appendChild() {}, setAttribute() {}, addEventListener() {}, getContext: () => null }),
  documentElement: { style: {} },
  body: { appendChild() {}, removeChild() {} },
  getElementById: () => null,
  addEventListener() {},
  removeEventListener() {},
};
globalThis.location = { href: "http://localhost/", protocol: "http:" };

const { V86 } = await import(pathToFileURL(opt.lib).href);

function ab(path) {
  const b = readFileSync(path);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

const CMDLINE = "tsc=reliable mitigations=off random.trust_cpu=on console=ttyS0 quiet";
const MEM = 64 * 1024 * 1024;
const VGA = 2 * 1024 * 1024;

function start(extra) {
  let text = "";
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const emulator = new V86({
    wasm_path: opt.wasm,
    memory_size: MEM,
    vga_memory_size: VGA,
    bios: { buffer: ab(opt.bios) },
    vga_bios: { buffer: ab(opt.vga) },
    autostart: true,
    disable_keyboard: true,
    disable_mouse: true,
    disable_speaker: true,
    uart1: true,
    cmdline: CMDLINE,
    filesystem: {},
    ...extra,
  });
  emulator.add_listener("serial0-output-byte", (byte) => {
    text += decoder.decode(Uint8Array.of(byte & 0xff), { stream: true });
  });
  const waitFor = (re, ms) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`timeout\n${text.slice(-400)}`)), ms);
      const tick = () => {
        if (re.test(text)) {
          clearTimeout(timer);
          resolve(text);
        }
      };
      emulator.add_listener("serial0-output-byte", tick);
      tick();
    });
  return { emulator, waitFor, dump: () => text.replace(/\r/g, "") };
}

const level = opt.level || "19";

async function checkRestore(label, file) {
  const restored = start({ initial_state: { buffer: ab(file) } });
  const t1 = Date.now();
  await new Promise((resolve) => restored.emulator.add_listener("emulator-loaded", resolve));
  await restored.emulator.create_file("main.sh", new TextEncoder().encode("echo snapshot-ok\nuname -r\n"));
  await restored.emulator.create_file("stdin.txt", new Uint8Array());
  restored.emulator.serial_send_bytes(0, new TextEncoder().encode("sh /mnt/main.sh < /mnt/stdin.txt; echo __SC_EXIT:$?\n"));
  await restored.waitFor(/__SC_EXIT:0/, 20000);
  const runSec = (Date.now() - t1) / 1000;
  const dumped = restored.dump();
  if (!dumped.includes("snapshot-ok")) {
    console.error(dumped.slice(-500));
    process.exit(1);
  }
  console.log(`linux ${label} restore+run ${runSec.toFixed(2)}s`);
  await restored.emulator.stop();
}

const cold = start({ bzimage: { buffer: ab(opt.bzimage) } });
const t0 = Date.now();
await cold.waitFor(/~% /, 30000);
const coldSec = (Date.now() - t0) / 1000;
const state = await cold.emulator.save_state();
const rawPath = `${opt.out}.raw`;
writeFileSync(rawPath, Buffer.from(state));
await cold.emulator.stop();
console.log(`linux cold boot ${coldSec.toFixed(2)}s, raw state ${state.byteLength} bytes`);

await checkRestore("raw", rawPath);

const compressed = spawnSync(opt.zstd, ["-"+level, "-f", "-q", "-o", opt.out, rawPath], { stdio: "inherit" });
if (compressed.status !== 0) process.exit(compressed.status ?? 1);
rmSync(rawPath);
const zst = readFileSync(opt.out);
console.log(`linux state zstd-${level} ${zst.length} bytes`);

await checkRestore("zstd", opt.out);
setTimeout(() => process.exit(0), 20);
