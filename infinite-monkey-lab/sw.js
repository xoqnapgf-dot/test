/* Keep APP_VERSION in sync with app.js FALLBACK_VERSION before publishing an update. */
const APP_VERSION = "1.0.0";
const CACHE_NAME = `infinite-monkey-lab-v${APP_VERSION}`;
const CACHE_PREFIX = "infinite-monkey-lab-";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./styles.css",
  "./core.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./sw.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "GET_VERSION") return;
  const reply = { version: APP_VERSION };
  if (event.ports && event.ports[0]) event.ports[0].postMessage(reply);
  else if (event.source) event.source.postMessage(reply);
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.ok && requestUrl.origin === self.location.origin) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      if (request.mode === "navigate") {
        const appShell = await cache.match(new URL("./index.html", self.registration.scope).href);
        if (appShell) return appShell;
      }
      return new Response("离线状态下没有找到此文件。", {
        status: 503,
        statusText: "Offline",
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  })());
});
