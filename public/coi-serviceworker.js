// Same-origin header injector so a static host can be cross-origin isolated.
// Approach matches gzuidhof/coi-serviceworker (MIT); this file is the in-repo
// implementation, not a CDN script. COEP is require-corp, same as the dev server.
// fetch() inside the worker already decompresses the body. Copying
// Content-Encoding onto the rebuilt response makes the page decode it again,
// which yields an empty buffer that DevTools shows as 0 kB transferred.
// A 200 with no body is fetched once more with cache reload.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function isolatedHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "cross-origin");
  if (headers.has("content-encoding")) {
    headers.delete("content-encoding");
    headers.delete("content-length");
  }
  return headers;
}

async function injectIsolation(request) {
  let response = await fetch(request);
  if (response.status === 0 || (response.status >= 300 && response.status < 400)) return response;
  if (response.status === 200 && response.body == null && request.cache !== "reload") {
    response = await fetch(new Request(request, { cache: "reload" }));
    if (response.status === 0 || (response.status >= 300 && response.status < 400)) return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: isolatedHeaders(response),
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") return;

  event.respondWith(injectIsolation(request).catch(() => Response.error()));
});
