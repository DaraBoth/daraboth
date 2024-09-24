"use client"  
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import from framer-motion for animations
import { AiOutlineBell, AiOutlineClose } from "react-icons/ai"; // Icons from react-icons

const PUBLIC_VAPID_KEY = 'BGfjmqSQgx7J6HXnvhxAGSOJ2h5W7mwrWYN8Cqa0Nql5nkoyyhlc49v_x-dIckFRm0rIeAgNxgfAfekqCwX8TNo';

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false); // State to show or hide the custom prompt
  const isPWA = window.matchMedia("(display-mode: standalone)").matches;
  if (!isPWA || !("Notification" in window)) return;

  useEffect(() => {
    // Register service worker when component mounts
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log("Service worker registered: ", registration.scope);
          checkNotificationPermission(registration); // Check and request permission
        })
        .catch((error) => {
          console.error("Service worker registration failed: ", error);
        });
    }
  }, []);

  const checkNotificationPermission = (registration) => {
    if (Notification.permission === "default") {
      setShowPrompt(true); // Show custom prompt if permission is 'default'
    } else if (Notification.permission === "granted") {
      subscribeUserToPush(registration);  // Subscribe user to push notifications
    }
  };

  const handleAllow = () => {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("User granted notifications.");
          navigator.serviceWorker.ready.then((registration) => {
            subscribeUserToPush(registration); // Subscribe user to push notifications
          });
        } else {
          console.log("User denied notifications.");
        }
        setShowPrompt(false);
      })
      .catch((error) => {
        console.error("Notification permission request error:", error);
        setShowPrompt(false);
      });
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Function to convert VAPID key to Uint8Array
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

    console.log("Subscribing to push notifications with options:", subscribeOptions);

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

        console.log('Device info to be sent to backend:', deviceInfo);

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
    console.log('Sending device info to backend:', deviceInfo);  // Debugging log
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
          console.error('Failed to send device info to server.', response.statusText);
        }
      })
      .catch(error => console.error('Error sending device info to server:', error));
  }

  if (!showPrompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-5 right-5 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-50 w-80 max-w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <AiOutlineBell size={24} className="text-blue-500" />
        <button onClick={handleDismiss}>
          <AiOutlineClose
            size={20}
            className="text-gray-600 hover:text-red-600 transition-colors"
          />
        </button>
      </div>
      <p className="text-gray-700 text-sm">
        Would you like to enable notifications to stay updated?
      </p>
      <div className="flex mt-4 justify-end">
        <button
          onClick={handleAllow}
          className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-blue-600 transition-colors"
        >
          Allow Notifications
        </button>
        <button
          onClick={handleDismiss}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          No Thanks
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationPrompt;
