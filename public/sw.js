/* EptSsc service worker: makes the app installable and keeps visited
   pages, scripts and public study data available offline. */
const VERSION = "v1";
const STATIC = `static-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;
const PRECACHE = ["/offline.html", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Public study data from the API (never anything signed-in). */
function isPublicApi(url, request) {
  if (request.headers.get("Authorization")) return false;
  return /\/(flashcards|pyqs)(\/|\?|$)/.test(url.pathname) && !url.pathname.includes("study-deck");
}

async function networkFirst(request, fallbackToOffline) {
  const cache = await caches.open(RUNTIME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackToOffline) return (await caches.match("/offline.html")) ?? Response.error();
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(STATIC)).put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    // Hashed build files never change: serve them from the cache first.
    if (url.pathname.startsWith("/_next/static/") || /\.(png|svg|ico|woff2?)$/.test(url.pathname)) {
      event.respondWith(cacheFirst(request));
      return;
    }
    // Pages and page data: fresh when online, the saved copy when offline.
    event.respondWith(networkFirst(request, request.mode === "navigate"));
    return;
  }

  if (isPublicApi(url, request)) {
    event.respondWith(networkFirst(request, false));
  }
});
