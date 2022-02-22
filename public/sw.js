self.addEventListener('install', function (event) {
  var CACHE_NAME = 'retrounhash__cache-v5-0-40';
  var urlsToCache = [
    '/',
    '/build/bundle.js',
    '/style.css',
    '/build/bundle.css'
  ];

  self.addEventListener('install', function (event) {
    
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function (cache) {
          return cache.addAll(urlsToCache);
        })
    );
  });
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
      )
  );
});
