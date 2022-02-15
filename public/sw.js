self.addEventListener('install', function (event) {
  var CACHE_NAME = 'retrounhash__cache-v4-0-11';
  var urlsToCache = [
    '/',
    '/build/bundle.js',
    '/build/bundle.css'
  ];

  self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function (cache) {
          console.log('Opened cache');
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
