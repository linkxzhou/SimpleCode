// Decide whether a /wasm request is a real file. Missing paths must 404.
// Falling through to the SPA serves index.html as 200 and the browser caches it.
import { existsSync, statSync } from "node:fs";
import { join, normalize, sep } from "node:path";

export function wasmPathname(url) {
  const raw = String(url ?? "/").split("?")[0];
  let path = raw;
  try {
    path = decodeURIComponent(raw);
  } catch {
    path = raw;
  }
  if (path !== "/wasm" && !path.startsWith("/wasm/")) return null;
  return path;
}

/** `requestPath` is the URL path, including a leading /wasm when not mounted. */
export function resolveWasmFile(root, requestPath) {
  const pathname = wasmPathname(requestPath) ?? requestPath;
  const rel = String(pathname).replace(/^\/wasm\/?/, "").replace(/^\/+/, "");
  if (!rel || rel.endsWith("/")) return null;
  const rootNorm = normalize(root);
  const file = normalize(join(rootNorm, rel));
  if (file !== rootNorm && !file.startsWith(rootNorm + sep)) return null;
  if (!existsSync(file) || !statSync(file).isFile()) return null;
  return file;
}
