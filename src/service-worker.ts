/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const VERSION = 'ops-pwa-v2';
const APP_SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const FONT_CACHE = `${VERSION}-fonts`;

const PRECACHE_URLS: string[] = [
  '/',
  '/index.html',
  '/assets/app.js',
  '/assets/app.css',
  '/public/manifest.json',
  '/public/icons/ops-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE, FONT_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

const cachePutSafe = async (cacheName: string, request: Request, response: Response) => {
  if (response && response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
};

const networkFirst = async (request: Request, cacheName: string) => {
  try {
    const response = await fetch(request);
    await cachePutSafe(cacheName, request, response);
    return response;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
};

const staleWhileRevalidate = async (request: Request, cacheName: string) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      void cachePutSafe(cacheName, request, response);
      return response.clone();
    })
    .catch(() => undefined);

  return cachedResponse ?? (await networkPromise) ?? fetch(request);
};

const cacheFirst = async (request: Request, cacheName: string) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  const response = await fetch(request);
  await cachePutSafe(cacheName, request, response);
  return response;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, APP_SHELL_CACHE).catch(async () => {
        const cache = await caches.open(APP_SHELL_CACHE);
        const fallback = await cache.match('/index.html');
        return fallback ?? Response.error();
      })
    );
    return;
  }

  if (requestUrl.origin === self.location.origin) {
    if (requestUrl.pathname.startsWith('/assets/')) {
      event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
      return;
    }

    if (requestUrl.pathname.startsWith('/public/icons/') || requestUrl.pathname.endsWith('manifest.json')) {
      event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
      return;
    }
  }

  if (requestUrl.pathname.startsWith('/api/') || requestUrl.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  if (
    requestUrl.hostname.includes('fonts.googleapis.com') ||
    requestUrl.hostname.includes('fonts.gstatic.com') ||
    requestUrl.hostname.includes('cdnjs.cloudflare.com')
  ) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
