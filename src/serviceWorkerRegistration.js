// Check if service workers are supported
if ("serviceWorker" in navigator) {
  // Register the service worker
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js") // This refers to the public/sw.js file
      .then((registration) => {
        console.log("Service worker registered: ", registration.scope);
      })
      .catch((error) => {
        console.error("Service worker registration failed: ", error);
      });
  });
}
