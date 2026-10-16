// Same-origin header injector so a static host can be cross-origin isolated.
// Approach matches gzuidhof/coi-serviceworker (MIT); this file is the in-repo
// implementation, not a CDN script. COEP is require-corp, same as the dev server.
// Bodies are streamed through unchanged so wasm size checks stay valid.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 0 || (response.status >= 300 && response.status < 400)) return response;
        const headers = new Headers(response.headers);
        headers.set("Cross-Origin-Embedder-Policy", "require-corp");
        headers.set("Cross-Origin-Opener-Policy", "same-origin");
        headers.set("Cross-Origin-Resource-Policy", "cross-origin");
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      })
      .catch(() => Response.error()),
  );
});
