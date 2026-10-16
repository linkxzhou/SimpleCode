// Shared ring buffer. The Java worker blocks in Atomics.wait; this thread only stores and notifies.
const CAP = 65536;

export interface StdinPipe {
  sab: SharedArrayBuffer;
  push(text: string): void;
  end(): void;
  close(): void;
}

export function openStdin(): StdinPipe {
  const sab = new SharedArrayBuffer(16 + CAP);
  const ctrl = new Int32Array(sab, 0, 4);
  const data = new Uint8Array(sab, 16, CAP);
  let closed = false;

  const pushBytes = (bytes: Uint8Array, index: number): Promise<void> => {
    let i = index;
    while (i < bytes.length) {
      if (closed) return Promise.resolve();
      const w = Atomics.load(ctrl, 0);
      const r = Atomics.load(ctrl, 1);
      let used = w - r;
      if (used < 0) used += CAP;
      const free = CAP - 1 - used;
      if (free <= 0) {
        const seq = Atomics.load(ctrl, 3);
        const wait = Atomics.waitAsync(ctrl, 3, seq);
        if (wait.async) return wait.value.then(() => pushBytes(bytes, i));
        continue;
      }
      const n = Math.min(free, bytes.length - i);
      for (let k = 0; k < n; k++) data[(w + k) % CAP] = bytes[i + k];
      Atomics.store(ctrl, 0, (w + n) % CAP);
      Atomics.add(ctrl, 3, 1);
      Atomics.notify(ctrl, 3);
      i += n;
    }
    return Promise.resolve();
  };

  return {
    sab,
    push(text: string) {
      if (closed || !text) return;
      void pushBytes(new TextEncoder().encode(text), 0);
    },
    end() {
      if (closed) return;
      Atomics.store(ctrl, 2, 1);
      Atomics.add(ctrl, 3, 1);
      Atomics.notify(ctrl, 3);
    },
    close() {
      closed = true;
      Atomics.store(ctrl, 2, 1);
      Atomics.add(ctrl, 3, 1);
      Atomics.notify(ctrl, 3);
    },
  };
}

let active: StdinPipe | undefined;

export function beginJavaStdin(opts: { stdin?: string; stdinEOF?: boolean }): StdinPipe {
  active?.close();
  const pipe = openStdin();
  active = pipe;
  if (opts.stdin !== undefined) {
    pipe.push(opts.stdin);
    if (opts.stdinEOF !== false) pipe.end();
  }
  return pipe;
}

export function pushJavaStdin(text: string) {
  active?.push(text);
}

export function pushJavaEOF() {
  active?.end();
}

export function clearJavaStdin() {
  active?.close();
  active = undefined;
}
