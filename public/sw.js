// GetFit! service worker: keeps the app shell available offline.
// - Built files under /assets/ have content hashes: cache first, stored on first use.
// - Pages (navigations) and other files of this site: network first, cache as fallback.
// - Requests to other origins (Supabase, fonts, ...) and non-GET requests are
//   never touched or cached: account data always comes from the network.
const CACHE = 'getfit-shell-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isCacheable(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (url.hostname.includes('supabase') || url.pathname.startsWith('/rest/') || url.pathname.startsWith('/auth/')) {
    return false;
  }
  return true;
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(fallbackUrl ?? request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(fallbackUrl ?? request);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (!isCacheable(request)) return;
  const url = new URL(request.url);
  if (request.mode === 'navigate') {
    // Every page of the app is the same index.html (client-side routes).
    event.respondWith(networkFirst(request, '/index.html'));
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});
