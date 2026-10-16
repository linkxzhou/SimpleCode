// In-browser Linux guest (v86) beside WASIWorkerHost.
// The VM stays on the main thread: v86's browser yield path expects `window`
// and spawns its own timer worker. A dedicated worker has no `window` and is
// the wrong path for this build of libv86.
import { t } from "@/i18n";
import { terminal } from "./terminal";
import { getLoaded } from "./wasmLoader";

const MEM = 64 * 1024 * 1024;
const VGA = 2 * 1024 * 1024;
const CMDLINE = "tsc=reliable mitigations=off random.trust_cpu=on console=ttyS0 quiet";

export class LinuxKilled extends Error {
  constructor() {
    super(t("terminated"));
    this.name = "LinuxKilled";
  }
}

interface V86Emu {
  add_listener(event: string, listener: (arg: number) => void): void;
  stop(): Promise<void>;
  destroy(): Promise<void>;
  create_file(name: string, data: Uint8Array): Promise<void>;
  serial_send_bytes(port: number, data: Uint8Array): void;
}

type V86Ctor = new (options: Record<string, unknown>) => V86Emu;

interface Parts {
  wasmUrl: string;
  libUrl: string;
  bios: ArrayBuffer;
  vga: ArrayBuffer;
  state: ArrayBuffer;
}

function toBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return copy;
}

class LinuxMachine {
  private parts?: Parts;
  private ctor?: V86Ctor;
  private emu?: V86Emu;
  private gen = 0;
  private killed = false;
  private scriptMode = false;
  private scriptBuf = "";
  private pending = "";
  private tail = "";
  private decoder = new TextDecoder("utf-8", { fatal: false });
  private waiter?: { resolve: (code: number) => void; reject: (err: Error) => void };
  private bootWait?: { finish: (err?: Error) => void };
  private timer?: ReturnType<typeof setTimeout>;
  private closing: Promise<void> = Promise.resolve();
  private sink: (text: string) => void = (text) => terminal.write(text);

  private armSink() {
    this.sink = (text) => terminal.write(text);
  }

  get booted() {
    return !!this.emu;
  }

  async bootFromAssets() {
    const wasm = getLoaded("v86-wasm");
    const lib = getLoaded("v86-lib");
    const bios = getLoaded("linux-bios");
    const vga = getLoaded("linux-vgabios");
    const state = getLoaded("linux-state");
    if (!wasm?.url || !lib?.url || !bios?.bytes || !vga?.bytes || !state?.bytes) {
      throw new Error(t("linuxIncomplete"));
    }
    this.parts = {
      wasmUrl: wasm.url,
      libUrl: lib.url,
      bios: toBuffer(bios.bytes),
      vga: toBuffer(vga.bytes),
      state: toBuffer(state.bytes),
    };
    if (this.emu && !this.killed) return;
    this.armSink();
    this.killed = false;
    const gen = ++this.gen;
    this.scriptMode = false;
    await this.spawn(gen);
    if (gen !== this.gen || this.killed) throw new LinuxKilled();
    this.send("\n");
    await this.waitFor(gen, /~% /, 20000);
    if (gen !== this.gen || this.killed) throw new LinuxKilled();
  }

  /** Fresh snapshot, 9p script, exit status from the guest sentinel. */
  async runScript(code: string, stdin: string): Promise<number> {
    if (!this.parts) throw new Error(t("linuxNotDownloaded"));
    this.armSink();
    this.killed = false;
    const gen = ++this.gen;
    this.scriptMode = true;
    this.scriptBuf = "";
    this.pending = "";
    try {
      await this.spawn(gen);
      if (gen !== this.gen || !this.emu) throw new LinuxKilled();
      const enc = new TextEncoder();
      await this.emu.create_file("main.sh", enc.encode(code));
      await this.emu.create_file("stdin.txt", enc.encode(stdin));
      if (gen !== this.gen) throw new LinuxKilled();
      const exitCode = await new Promise<number>((resolve, reject) => {
        this.waiter = { resolve, reject };
        this.timer = setTimeout(() => {
          if (this.waiter) this.failWait(new Error(t("linuxRunTimeout")));
        }, 30000);
        this.emu?.serial_send_bytes(0, enc.encode("stty -echo; sh /mnt/main.sh < /mnt/stdin.txt; echo __SC_EXIT:$?; stty echo\n"));
      });
      return exitCode;
    } finally {
      if (this.gen === gen) this.scriptMode = false;
    }
  }

  send(data: string) {
    if (!this.emu) return;
    if (this.scriptMode && !data.includes("\x03")) return;
    const text = data.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    this.emu.serial_send_bytes(0, new TextEncoder().encode(text));
  }

  shutdown() {
    this.killed = true;
    this.gen++;
    this.scriptMode = false;
    this.failWait(new LinuxKilled());
    this.bootWait?.finish(new LinuxKilled());
    this.sink = () => {};
    const emu = this.emu;
    this.emu = undefined;
    this.retire(emu);
  }

  private failWait(err: Error) {
    clearTimeout(this.timer);
    const waiter = this.waiter;
    this.waiter = undefined;
    waiter?.reject(err);
  }

  private finish(code: number) {
    const rest = this.pending.replace(/\r/g, "");
    this.pending = "";
    this.scriptMode = false;
    if (rest && !hidden(rest)) this.sink(rest);
    clearTimeout(this.timer);
    const waiter = this.waiter;
    this.waiter = undefined;
    waiter?.resolve(code);
  }

  private retire(emu?: V86Emu) {
    if (!emu) return;
    this.closing = this.closing.then(() => emu.destroy().then(() => undefined, () => undefined));
  }

  private async loadCtor(libUrl: string) {
    if (this.ctor) return this.ctor;
    const mod = (await import(/* @vite-ignore */ libUrl)) as { default?: V86Ctor; V86?: V86Ctor };
    const ctor = mod.default ?? mod.V86;
    if (typeof ctor !== "function") throw new Error(t("linuxNoV86"));
    this.ctor = ctor;
    return ctor;
  }

  private async spawn(gen: number) {
    const old = this.emu;
    this.emu = undefined;
    this.retire(old);
    await this.closing;
    if (gen !== this.gen || this.killed) throw new LinuxKilled();
    const parts = this.parts;
    if (!parts) throw new Error(t("linuxNotDownloaded"));
    const Ctor = await this.loadCtor(parts.libUrl);
    if (gen !== this.gen || this.killed) throw new LinuxKilled();
    this.decoder = new TextDecoder("utf-8", { fatal: false });
    this.tail = "";
    let loaded = false;
    const emulator = new Ctor({
      wasm_path: parts.wasmUrl,
      memory_size: MEM,
      vga_memory_size: VGA,
      bios: { buffer: parts.bios.slice(0) },
      vga_bios: { buffer: parts.vga.slice(0) },
      // parts.state is the zstd frame from vendor. v86 detects the frame magic
      // and decompresses with the zstd already linked into v86.wasm.
      initial_state: { buffer: parts.state.slice(0) },
      autostart: true,
      disable_keyboard: true,
      disable_mouse: true,
      disable_speaker: true,
      uart1: true,
      cmdline: CMDLINE,
      filesystem: {},
    });
    emulator.add_listener("emulator-loaded", () => {
      loaded = true;
    });
    emulator.add_listener("serial0-output-byte", (byte) => {
      if (gen !== this.gen) return;
      const text = this.decoder.decode(Uint8Array.of(byte & 0xff), { stream: true });
      if (text) this.onSerial(text);
    });
    if (gen !== this.gen) {
      this.retire(emulator);
      throw new LinuxKilled();
    }
    this.emu = emulator;
    await new Promise<void>((resolve, reject) => {
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const finish = (err?: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (this.bootWait?.finish === finish) this.bootWait = undefined;
        if (err) reject(err);
        else resolve();
      };
      timer = setTimeout(() => finish(new Error(t("linuxBootTimeout"))), 20000);
      this.bootWait = { finish };
      if (loaded || gen !== this.gen || this.killed) finish(gen !== this.gen || this.killed ? new LinuxKilled() : undefined);
      else emulator.add_listener("emulator-loaded", () => finish());
    });
    if (gen !== this.gen || this.killed) throw new LinuxKilled();
  }

  private onSerial(chunk: string) {
    this.tail = (this.tail + chunk).slice(-4096);
    if (!this.scriptMode) {
      this.sink(chunk.replace(/\r/g, ""));
      return;
    }
    this.scriptBuf += chunk;
    this.pending += chunk;
    let nl = this.pending.indexOf("\n");
    while (nl >= 0) {
      const line = this.pending.slice(0, nl + 1).replace(/\r/g, "");
      this.pending = this.pending.slice(nl + 1);
      if (!hidden(line)) this.sink(line);
      nl = this.pending.indexOf("\n");
    }
    const found = [...this.scriptBuf.matchAll(/__SC_EXIT:(\d+)/g)];
    if (found.length && this.waiter) this.finish(Number(found[found.length - 1][1]));
  }

  private waitFor(gen: number, re: RegExp, ms: number) {
    if (gen !== this.gen) return Promise.reject(new LinuxKilled());
    if (re.test(this.tail)) return Promise.resolve();
    const prev = this.sink;
    return new Promise<void>((resolve, reject) => {
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const wrapper = (text: string) => {
        prev(text);
        if (gen !== this.gen) finish(new LinuxKilled());
        else if (re.test(this.tail)) finish();
      };
      const finish = (err?: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (this.bootWait?.finish === finish) this.bootWait = undefined;
        if (this.sink === wrapper) this.sink = prev;
        if (err) reject(err);
        else resolve();
      };
      this.bootWait = { finish };
      timer = setTimeout(() => finish(new Error(t("linuxPromptTimeout", { tail: this.tail.slice(-180) }))), ms);
      this.sink = wrapper;
    });
  }
}

function hidden(line: string) {
  const plain = line.replace(/\x1b\[[0-9;]*m/g, "");
  if (plain.includes("__SC_EXIT:")) return true;
  if (plain.includes("stty -echo") && plain.includes("/mnt/main.sh")) return true;
  return false;
}

export const linuxMachine = new LinuxMachine();

export function attachLinuxConsole() {
  terminal.setPassthrough({ onData: (data) => linuxMachine.send(data) });
}

export async function bootLinux() {
  await linuxMachine.bootFromAssets();
  attachLinuxConsole();
}
