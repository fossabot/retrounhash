self.addEventListener('install', function (event) {
  var CACHE_NAME = 'densewaire__cache-v2-0-1';
  var urlsToCache = [
    '/',
    '/build/bundle.js',
    '/build/bundle.css',
    '/global.css',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    '/favicon.ico',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://kit.fontawesome.com/409aa3527c.js'
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
