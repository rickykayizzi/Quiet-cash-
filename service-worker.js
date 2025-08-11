const CACHE_NAME = 'quiet-cash-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

/** Install and cache assets */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/** Activate and clean old caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/** Fetch — serve cached first, then network */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request).catch(() => {
        // Optional: return a fallback offline page
      });
    })
  );
});

/** Background Sync */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  console.log('Background sync triggered for transactions.');
  // Add logic to send queued offline transactions to the server
}

/** Periodic Sync */
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-data') {
    event.waitUntil(fetchLatestData());
  }
});

async function fetchLatestData() {
  console.log('Periodic sync triggered.');
  // Fetch latest app data and update caches here
}

/** Push Notifications */
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Quiet Cash', {
      body: data.body || 'You have a new update!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png'
    })
  );
});