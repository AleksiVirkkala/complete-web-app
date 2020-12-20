// install service worker
self.addEventListener('install', e => {
  console.log('service worker has been installed');
  console.log(e);
});

// activate service worker
self.addEventListener('activate', e => {
  console.log('service worker has been activated');
  console.log(e);
});
