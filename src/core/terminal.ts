import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export interface InputHandler {
  onLine: (line: string) => void;
  onEOF: () => void;
  onInterrupt: () => void;
}

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
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 13,
    lineHeight: 1.4,
    scrollback: 5000,
    allowProposedApi: false,
    theme: {
      background: "#00000000",
      foreground: "#e4e4e7",
      cursor: "#e4e4e7",
      cursorAccent: "#000000",
      selectionBackground: "#3f3f46",
      black: "#18181b",
      red: "#f87171",
      green: "#4ade80",
      yellow: "#facc15",
      blue: "#60a5fa",
      magenta: "#c084fc",
      cyan: "#22d3ee",
      white: "#e4e4e7",
      brightBlack: "#71717a",
      brightRed: "#fca5a5",
      brightGreen: "#86efac",
      brightYellow: "#fde047",
      brightBlue: "#93c5fd",
      brightMagenta: "#d8b4fe",
      brightCyan: "#67e8f9",
      brightWhite: "#fafafa",
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
    this.transcript += text;
    this.term.write(text);
  }

  stderr(text: string) {
    this.write(ANSI_RE.test(text) ? text : `\x1b[31m${text}\x1b[0m`);
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
