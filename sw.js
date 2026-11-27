// Sovereign Tech - High-Performance Offline PWA Service Worker (v5-sovereign-resilience)
const CACHE_NAME = 'sovereign-offline-v5';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/panel.html',
  '/panel-manifest.json',
  '/badge.html',
  '/checkout.html',
  '/sovereign-badge.js',
  '/cleaner/',
  '/cleaner/index.html',
  '/cleaner/icon-192.png',
  '/cleaner/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Some offline assets failed to pre-cache (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate: serve cached version instantly while fetching newest version in background
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Don't intercept live analytics or payment gateways
  if (url.origin.includes('counter.dev') || url.origin.includes('payhip.com') || url.origin.includes('paypal.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
