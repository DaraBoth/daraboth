import { useEffect } from 'react';

const PUBLIC_VAPID_KEY = 'BGfjmqSQgx7J6HXnvhxAGSOJ2h5W7mwrWYN8Cqa0Nql5nkoyyhlc49v_x-dIckFRm0rIeAgNxgfAfekqCwX8TNo';

// Utility function to convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export default function usePushNotifications() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);

        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log("yehahhhh")
            subscribeUserToPush(registration);
          } else {
            console.log('Notification permission denied.');
          }
        });
      }).catch(error => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  const subscribeUserToPush = async (registration) => {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });
      console.log('User is subscribed to push notifications:', subscription);

      // Normally, you would send the subscription to your server to store it
      // Example: sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error('Failed to subscribe user: ', error);
    }
  };
}
