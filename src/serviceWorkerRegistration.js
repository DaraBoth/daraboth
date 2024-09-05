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
            subscribeUserToPush(registration);  // Subscribe user to push notifications
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

// Public VAPID key from your push notification service (replace with your actual VAPID key)
const PUBLIC_VAPID_KEY = 'BGfjmqSQgx7J6HXnvhxAGSOJ2h5W7mwrWYN8Cqa0Nql5nkoyyhlc49v_x-dIckFRm0rIeAgNxgfAfekqCwX8TNo';

// Helper function to convert the VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// Function to generate a UUID for the device
function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

// Function to subscribe the user to push notifications
function subscribeUserToPush(registration) {
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
  };

  registration.pushManager.subscribe(subscribeOptions)
    .then((pushSubscription) => {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));

      // Generate a unique device ID if not already generated
      const deviceId = getOrCreateDeviceId();

      // Capture user agent and other device info
      const deviceInfo = {
        deviceId: deviceId,
        userAgent: navigator.userAgent,  // Device user agent
        subscription: pushSubscription   // Push subscription object
      };

      // Send device info and subscription to your backend
      sendDeviceInfoToBackend(deviceInfo);
    })
    .catch((error) => {
      console.error('Failed to subscribe the user: ', error);
    });
}

// Function to get or create a unique device ID and store it in localStorage
function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = generateUUID();  // Generate a new UUID
    localStorage.setItem('device_id', deviceId);
    console.log('Generated new device ID:', deviceId);
  } else {
    console.log('Existing device ID found:', deviceId);
  }
  return deviceId;
}

// Function to send the device information to the backend
function sendDeviceInfoToBackend(deviceInfo) {
  fetch('https://tinynotie-api.vercel.app/openai/subscribe', {  // Replace with your actual backend endpoint URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deviceInfo),
  })
    .then(response => {
      if (response.ok) {
        console.log('Device info and subscription sent to server successfully.');
      } else {
        console.error('Failed to send device info to server.');
      }
    })
    .catch(error => console.error('Error sending device info to server:', error));
}
