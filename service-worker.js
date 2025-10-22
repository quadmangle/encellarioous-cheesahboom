const CACHE_PREFIX = 'ops-online-support';
const CACHE_VERSION = 'v1';
const PRECACHE = `${CACHE_PREFIX}-precache-${CACHE_VERSION}`;
const RUNTIME = `${CACHE_PREFIX}-runtime-${CACHE_VERSION}`;
const OFFLINE_FALLBACK_PAGE = '/index.html';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/app.css',
  '/assets/app.js',
  '/manifest.json',
  '/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== PRECACHE && cacheName !== RUNTIME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const requestURL = new URL(request.url);
  if (requestURL.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (PRECACHE_URLS.includes(requestURL.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetchAndCache(request, PRECACHE))
    );
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

function handleNavigationRequest(request) {
  return fetch(request)
    .then((response) => {
      const responseClone = response.clone();
      caches
        .open(RUNTIME)
        .then((cache) => cache.put(new Request(OFFLINE_FALLBACK_PAGE), responseClone));
      return response;
    })
    .catch(async () => {
      const cached = await caches.match(OFFLINE_FALLBACK_PAGE);
      if (cached) {
        return cached;
      }

      return new Response(
        `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>Offline</title><meta name="viewport" content="width=device-width,initial-scale=1" />` +
          `<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#13162a;color:#fafbfe;margin:0;display:flex;align-items:center;justify-content:center;height:100vh;padding:2rem;text-align:center}` +
          `main{max-width:28rem}` +
          `a{color:#00c4ff;text-decoration:none;font-weight:600}` +
          `</style></head><body><main><h1>You are offline</h1><p>The Ops Online Support workspace is unavailable without a network connection. Please reconnect to continue.</p></main></body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    });
}

function fetchAndCache(request, cacheName) {
  return fetch(request)
    .then((response) => {
      if (!response || response.status !== 200) {
        return response;
      }
      const copy = response.clone();
      caches.open(cacheName).then((cache) => cache.put(request, copy));
      return response;
    })
    .catch(() => caches.match(request));
}

function staleWhileRevalidate(request) {
  return caches.match(request).then((cachedResponse) => {
    const networkFetch = fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(RUNTIME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => cachedResponse);

    return cachedResponse || networkFetch;
  });
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
