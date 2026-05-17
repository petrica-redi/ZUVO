/**
 * Sastipe service worker.
 *
 * Strategy
 * - Precache: app shell, icons, manifest, offline fallback.
 * - Navigations: network-first, fall back to cached page or /offline.html.
 * - GET assets (same-origin, basic): stale-while-revalidate, capped cache.
 * - API (`/api/*`), POST/PUT/DELETE: never cached, never intercepted.
 * - Cross-origin & opaque responses: passthrough.
 */
const CACHE_VERSION = "sastipe-v3";
const RUNTIME_CACHE = "sastipe-runtime-v1";
const OFFLINE_URL = "/offline.html";
const MAX_RUNTIME_ENTRIES = 60;

const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
  "/icon-maskable-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          const response = await fetch(url, { cache: "reload" });
          if (response.ok) await cache.put(url, response);
        }),
      ),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  const overflow = keys.length - maxEntries;
  for (let i = 0; i < overflow; i++) {
    await cache.delete(keys[i]);
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // API routes are always live; never cached.
  if (url.pathname.startsWith("/api/")) return;

  // Cross-origin: let the network handle it.
  if (url.origin !== self.location.origin) return;

  // Navigations: network first, cache fallback, offline page final fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const copy = fresh.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return fresh;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;
          const home = await caches.match("/");
          if (home) return home;
          return new Response("Offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        }
      })(),
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok && response.type === "basic") {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then(async (cache) => {
              await cache.put(request, clone);
              await trimCache(RUNTIME_CACHE, MAX_RUNTIME_ENTRIES);
            });
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
