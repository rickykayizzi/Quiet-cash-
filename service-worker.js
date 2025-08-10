self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('quiet-cash-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './style.css',
        './app.js'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== 'quiet-cash-v1') {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});