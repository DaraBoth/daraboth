// Check if service workers are supported
if ('serviceWorker' in navigator) {
    // Register the service worker
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service worker registered: ', registration.scope);
        })
        .catch(error => {
          console.error('Service worker registration failed: ', error);
        });
    });
  }
  