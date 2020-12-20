const CACHE_NAME = 'site-static-v3';
const ASSETS = [
  '/',
  '/about',
  '/signup',
  '/login',
  '/logout',
  '/blogs',
  '/blogs/create',
  '/js/app.js',
  '/css/styles.css',
  '/img/post.png',
  '/img/trashcan.svg'
];
// install service worker
self.addEventListener('install', e => {
  console.log('service worker has been installed');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
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
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
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
      return cacheRes && !cacheRes.redirected ? cacheRes : fetch(e.request);
    })
  );
});
