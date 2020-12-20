const CACHE_NAME = 'site-static';
const ASSETS = [
  '/',
  '/about',
  '/blogs',
  '/signup',
  '/login',
  '/logout',
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
  console.log('service worker has been activated');
});

// fetch event
self.addEventListener('fetch', e => {
  console.log('fetch event');
});
