if ('serviceWorker' in navigator) {
  console.log('onono');
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => console.log('registered'))
    .catch(() => console.log('registration failed'));
}
