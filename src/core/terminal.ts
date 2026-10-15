import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export interface InputHandler {
  onLine: (line: string) => void;
  onEOF: () => void;
  onInterrupt: () => void;
}

export const MONO_STACK = '"JetBrains Mono", "SimpleCode CJK", ui-monospace, SFMono-Regular, Menlo, monospace';

const ANSI_RE = /\x1b\[[0-9;]*m/;

function charWidth(ch: string) {
  const cp = ch.codePointAt(0) ?? 0;
  // rough East Asian wide / emoji detection
  return cp >= 0x1100 && (cp <= 0x115f || (cp >= 0x2e80 && cp <= 0xa4cf) || (cp >= 0xac00 && cp <= 0xd7a3) || (cp >= 0xf900 && cp <= 0xfaff) || (cp >= 0xfe30 && cp <= 0xfe4f) || (cp >= 0xff00 && cp <= 0xff60) || (cp >= 0xffe0 && cp <= 0xffe6) || cp >= 0x1f300)
    ? 2
    : 1;
}

/** Singleton controller around xterm.js with simple line editing for stdin. */
class TerminalController {
  term = new Terminal({
    convertEol: true,
    cursorBlink: false,
    fontFamily: MONO_STACK,
    fontSize: 13,
    lineHeight: 1.4,
    scrollback: 5000,
    allowProposedApi: false,
    // Monochrome ANSI palette: every color maps to a neutral grey
    theme: {
      background: "#00000000",
      foreground: "#e5e5e5",
      cursor: "#fafafa",
      cursorAccent: "#000000",
      selectionBackground: "#404040",
      black: "#171717",
      red: "#d4d4d4",
      green: "#fafafa",
      yellow: "#d4d4d4",
      blue: "#a3a3a3",
      magenta: "#d4d4d4",
      cyan: "#a3a3a3",
      white: "#e5e5e5",
      brightBlack: "#737373",
      brightRed: "#fafafa",
      brightGreen: "#fafafa",
      brightYellow: "#fafafa",
      brightBlue: "#d4d4d4",
      brightMagenta: "#fafafa",
      brightCyan: "#d4d4d4",
      brightWhite: "#ffffff",
    },
    allowTransparency: true,
  });
  fit = new FitAddon();
  private handler?: InputHandler;
  private buffer = "";
  private opened = false;
  /** plain-text transcript, used by tests/debugging */
  transcript = "";

  constructor() {
    this.term.loadAddon(this.fit);
    this.term.onData((d) => this.onData(d));
  }

  attach(el: HTMLElement) {
    if (!this.opened) {
      this.term.open(el);
      this.opened = true;
      // xterm measures cell size at open time; re-measure once the bundled fonts are ready
      void Promise.all([
        document.fonts.load('13px "JetBrains Mono"'),
        document.fonts.load('700 13px "JetBrains Mono"'),
        document.fonts.load('13px "SimpleCode CJK"', "中"),
      ])
        .catch(() => {})
        .then(() => {
          this.term.options.fontFamily = "monospace";
          this.term.options.fontFamily = MONO_STACK;
          this.resize();
        });
    } else if (this.term.element && this.term.element.parentElement !== el) {
      el.appendChild(this.term.element);
    }
    this.resize();
  }

  resize() {
    try {
      this.fit.fit();
    } catch {
      /* not visible */
    }
  }

  write(text: string) {
    if (this.errPending && text !== this.errPending) this.flushStderr();
    this.transcript += text;
    this.term.write(text);
  }

  /**
   * stderr is shown in a dimmer grey, but only for complete lines.
   * A trailing partial line (e.g. CPython's input() prompt, which goes to stderr on a TTY)
   * is held briefly; if nothing completes it, it is written as normal text.
   */
  private errPending = "";
  private errTimer?: ReturnType<typeof setTimeout>;
  stderr(text: string) {
    clearTimeout(this.errTimer);
    const data = this.errPending + text;
    const nl = data.lastIndexOf("\n");
    const full = nl >= 0 ? data.slice(0, nl + 1) : "";
    this.errPending = "";
    if (full) this.write(ANSI_RE.test(full) ? full : `\x1b[38;5;247m${full}\x1b[39m`);
    this.errPending = nl >= 0 ? data.slice(nl + 1) : data;
    if (this.errPending) this.errTimer = setTimeout(() => this.flushStderr(), 40);
  }

  flushStderr() {
    clearTimeout(this.errTimer);
    if (this.errPending) this.write(this.errPending);
    this.errPending = "";
  }

  /** Flush a held partial stderr line so tests can read a complete transcript. */
  flush() {
    this.flushStderr();
  }

  system(msg: string, color = "2") {
    this.write(`\x1b[${color}m[SimpleCode] ${msg}\x1b[0m\n`);
  }

  clear() {
    this.transcript = "";
    this.term.reset();
  }

  focus() {
    this.term.focus();
  }

  setInputHandler(h?: InputHandler) {
    this.handler = h;
    this.buffer = "";
    this.term.options.cursorBlink = !!h;
    if (h) this.focus();
  }

  private onData(data: string) {
    const h = this.handler;
    if (!h) return;
    this.flushStderr();
    if (data.startsWith("\x1b")) return; // ignore arrows / escape sequences
    for (const ch of data) {
      switch (ch) {
        case "\r":
        case "\n": {
          this.write("\n");
          const line = this.buffer + "\n";
          this.buffer = "";
          h.onLine(line);
          break;
        }
        case "\x7f":
        case "\b": {
          const chars = [...this.buffer];
          const last = chars.pop();
          if (last !== undefined) {
            this.buffer = chars.join("");
            const w = charWidth(last);
            this.term.write("\b \b".repeat(w));
          }
          break;
        }
        case "\x04": {
          if (this.buffer) h.onLine(this.buffer);
          this.buffer = "";
          h.onEOF();
          break;
        }
        case "\x03":
          this.write("^C\n");
          h.onInterrupt();
          return;
        default:
          if (ch >= " " || ch === "\t") {
            this.buffer += ch;
            this.term.write(ch);
          }
      }
    }
  }
}

export const terminal = new TerminalController();
// expose for e2e tests / debugging
(globalThis as unknown as { __simplecodeTerminal: TerminalController }).__simplecodeTerminal = terminal;
