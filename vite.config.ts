import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import { docsPlugin } from "./scripts/vite-plugin-docs";
import { refreshManifest } from "./scripts/write-manifest.mjs";
import { createReadStream, cpSync, existsSync, rmSync, statSync } from "node:fs";
import { join, normalize, resolve, sep } from "node:path";

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

/** Serve ./wasm in dev and copy it into dist/wasm on build. */
function wasmAssets(): Plugin {
  let outDir = "dist";
  return {
    name: "simplecode-wasm-assets",
    configResolved(c) {
      outDir = resolve(c.root, c.build.outDir);
    },
    buildStart() {
      syncManifest((message) => this.warn(message));
    },
    configureServer(server) {
      syncManifest((message) => server.config.logger.warn(message));
      server.middlewares.use("/wasm", (req, res, next) => {
        const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
        const file = normalize(join(wasmDir, url));
        if (!file.startsWith(wasmDir) || !existsSync(file) || !statSync(file).isFile()) return next();
        const type = file.endsWith(".wasm")
          ? "application/wasm"
          : file.endsWith(".json")
            ? "application/json"
            : file.endsWith(".mjs") || file.endsWith(".js")
              ? "text/javascript"
              : file.endsWith(".gz")
                ? "application/gzip"
                : "application/octet-stream";
        res.setHeader("Content-Type", type);
        res.setHeader("Content-Length", String(statSync(file).size));
        res.setHeader("Cache-Control", file.endsWith(".json") ? "no-cache" : "public, max-age=86400");
        for (const [k, v] of Object.entries(isolationHeaders)) res.setHeader(k, v);
        createReadStream(file).pipe(res);
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
  server: { headers: isolationHeaders },
  preview: { headers: isolationHeaders },
  worker: { format: "es" },
  build: { target: "es2022", chunkSizeWarningLimit: 4096 },
  optimizeDeps: { include: ["monaco-editor/esm/vs/editor/editor.worker"] },
});
