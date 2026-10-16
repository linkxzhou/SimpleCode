import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import { docsPlugin } from "./scripts/vite-plugin-docs";
import { refreshManifest } from "./scripts/write-manifest.mjs";
import { createReadStream, cpSync, existsSync, rmSync, statSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { join, resolve, sep } from "node:path";
import { resolveWasmFile, wasmPathname } from "./scripts/wasm-static.mjs";

// Dev and preview send the headers themselves, so the page is already isolated
// and does not register coi-serviceworker.js. Static hosts rely on that worker.
const isolationHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Resource-Policy": "same-origin",
};

const wasmDir = resolve(__dirname, "wasm");

function syncManifest(warn: (message: string) => void) {
  try {
    refreshManifest(resolve(__dirname));
  } catch (err) {
    warn(err instanceof Error ? err.message : String(err));
  }
}

function sendWasmNotFound(res: import("node:http").ServerResponse) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  for (const [k, v] of Object.entries(isolationHeaders)) res.setHeader(k, v);
  res.end("not found\n");
}

function contentType(file: string) {
  if (file.endsWith(".wasm")) return "application/wasm";
  if (file.endsWith(".json")) return "application/json";
  if (file.endsWith(".mjs") || file.endsWith(".js")) return "text/javascript";
  if (file.endsWith(".gz")) return "application/gzip";
  return "application/octet-stream";
}

function wasmSuffix(url: string | undefined): string {
  const suffix = url ?? "/";
  if (suffix.startsWith("/wasm/") || suffix === "/wasm" || suffix.startsWith("/wasm?")) return suffix;
  return `/wasm${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
}

/** Stream a wasm asset. `no-cache` so an empty or HTML body cannot stay fresh for a day. */
function sendWasm(req: IncomingMessage, res: ServerResponse, file: string | null) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    for (const [k, v] of Object.entries(isolationHeaders)) res.setHeader(k, v);
    res.end("method not allowed\n");
    return;
  }
  if (!file) {
    sendWasmNotFound(res);
    return;
  }
  let size = 0;
  try {
    size = statSync(file).size;
  } catch {
    sendWasmNotFound(res);
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType(file));
  res.setHeader("Content-Length", String(size));
  // No ETag and no max-age. A memory-cache hit is the "0 kB transferred" row,
  // and sirv's 304 would reuse whatever body was stored, including an empty one.
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Accept-Ranges", "none");
  for (const [k, v] of Object.entries(isolationHeaders)) res.setHeader(k, v);
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  const stream = createReadStream(file);
  let failed = false;
  stream.on("error", () => {
    if (failed) return;
    failed = true;
    stream.destroy();
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.removeHeader("Content-Length");
      res.end("read failed\n");
      return;
    }
    res.destroy();
  });
  stream.pipe(res);
}

/** Serve ./wasm in dev and copy it into dist/wasm on build. Missing /wasm paths 404. */
function wasmAssets(): Plugin {
  let outDir = "dist";
  return {
    name: "simplecode-wasm-assets",
    configResolved(c) {
      outDir = resolve(c.root, c.build.outDir);
    },
    buildStart() {
      syncManifest((message) => this.warn(message));
      if (!existsSync(join(wasmDir, "java/compiler.wasm"))) {
        this.warn("wasm/java is missing — run ./build.sh vendor --java, then rebuild dist");
      }
    },
    configureServer(server) {
      syncManifest((message) => server.config.logger.warn(message));
      // Mounted at /wasm, so req.url is the suffix (/java/compiler.wasm?v=…).
      server.middlewares.use("/wasm", (req, res) => {
        sendWasm(req, res, resolveWasmFile(wasmDir, wasmSuffix(req.url)));
      });
    },
    configurePreviewServer(server) {
      // Before sirv and the SPA fallback. Serve the file here so preview does not
      // answer with sirv's 304 (empty body, cached bytes reused).
      server.middlewares.use((req, res, next) => {
        if (!wasmPathname(req.url ?? "/")) return next();
        sendWasm(req, res, resolveWasmFile(join(outDir, "wasm"), req.url ?? "/"));
      });
    },
    closeBundle() {
      if (!existsSync(join(wasmDir, "manifest.json"))) {
        this.warn("wasm/manifest.json missing — run ./build.sh vendor");
        return;
      }
      const dest = join(outDir, "wasm");
      rmSync(dest, { recursive: true, force: true });
      cpSync(wasmDir, dest, {
        recursive: true,
        dereference: true,
        filter: (src) => !src.split(sep).includes(".rust-tmp"),
      });
    },
  };
}

export default defineConfig({
  plugins: [docsPlugin(), vue(), wasmAssets()],
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  server: { headers: isolationHeaders, watch: { ignored: ["**/thirdparty/**"] } },
  preview: { headers: isolationHeaders },
  worker: { format: "es" },
  build: { target: "es2022", chunkSizeWarningLimit: 4096 },
  optimizeDeps: { include: ["monaco-editor/esm/vs/editor/editor.worker"] },
});
