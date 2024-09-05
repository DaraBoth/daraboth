// Check if service workers are supported
if ("serviceWorker" in navigator) {
  // Register the service worker
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js") // This refers to the public/sw.js file
      .then((registration) => {
        console.log("Service worker registered: ", registration.scope);
        // Request permission for notifications
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted.");
            subscribeUserToPush(registration);
          } else {
            console.log("Notification permission denied.");
          }
        });
      })
      .catch((error) => {
        console.error("Service worker registration failed: ", error);
      });
  });
}

const PUBLIC_VAPID_KEY = 'BGfjmqSQgx7J6HXnvhxAGSOJ2h5W7mwrWYN8Cqa0Nql5nkoyyhlc49v_x-dIckFRm0rIeAgNxgfAfekqCwX8TNo';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function subscribeUserToPush(registration) {
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
  };

  registration.pushManager.subscribe(subscribeOptions)
    .then((pushSubscription) => {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      // Here you would typically send the subscription to your server to store it
    })
    .catch((error) => {
      console.error('Failed to subscribe the user: ', error);
    });
}
