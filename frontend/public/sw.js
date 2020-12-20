const STATIC_CACHE = 'site-static-v1';
const DYNAMIC_CACHE = 'dynamic-static-v1';
const CACHE_SIZE_LIMIT = 15;

const ASSETS = [
  '/',
  '/about',
  '/signup',
  '/login',
  //'/logout',
  //'/blogs',
  //'/blogs/create',
  '/js/app.js',
  '/css/styles.css',
  '/img/post.png',
  '/img/trashcan.svg',
  '/fallback'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) cache.delete(keys[0]).then(() => limitCacheSize(name, size));
    });
  });
};

// install service worker
self.addEventListener('install', e => {
  console.log('service worker has been installed');
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('caching shell assets');
      cache.addAll(ASSETS);
    })
  );
});

// activate service worker
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      console.log(keys);
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE).map(key => caches.delete(key))
      );
    })
  );
  console.log('service worker has been activated');
});

// fetch event
self.addEventListener('fetch', e => {
  console.log('fetch event');
  e.respondWith(
    caches.match(e.request).then(cacheRes => {
      console.log('in match');
      console.log(e);
      console.log(cacheRes);
      return cacheRes && !cacheRes.redirected
        ? cacheRes
        : fetch(e.request)
            .then(fetchRes => {
              return caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(e.request.url, fetchRes.clone());
                limitCacheSize(DYNAMIC_CACHE, CACHE_SIZE_LIMIT);
                return fetchRes;
              });
            })
            .catch(() => {
              if (e.request.url.indexOf('.') !== -1) return caches.match('/fallback');
            });
    })
  );
});
