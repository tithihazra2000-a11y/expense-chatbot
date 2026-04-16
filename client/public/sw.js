// ── FILE 2: public/sw.js ───────────────────────────────────────────────────────
// Place this in your client/public/ folder
 
const CACHE_NAME = "spendsmart-v1";
const STATIC_ASSETS = ["/", "/index.html"];
 
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});
 
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});
 
self.addEventListener("fetch", (event) => {
  // Network first for API calls
  if (event.request.url.includes("onrender.com")) {
    event.respondWith(
      fetch(event.request).catch(() => new Response("[]", { headers: { "Content-Type": "application/json" } }))
    );
    return;
  }
  // Cache first for static assets
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});