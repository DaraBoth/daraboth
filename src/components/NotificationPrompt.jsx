import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import from framer-motion for animations
import { AiOutlineBell, AiOutlineClose } from 'react-icons/ai'; // Icons from react-icons

const NotificationPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);  // State to show or hide the custom prompt

  // Check notification permission on component mount
  useEffect(() => {
    console.log(Notification.permission );
    if (Notification.permission === 'default') {
      setShowPrompt(true); // Show the custom prompt if permission is 'default'
    }
  }, []);

  // Handle Allow button click to request notification permission
  const handleAllow = () => {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === 'granted') {
          console.log('User granted notifications.');
          // Optionally, add push subscription logic here
        } else {
          console.log('User denied notifications.');
        }
        setShowPrompt(false); // Hide the custom prompt after asking
      })
      .catch((error) => {
        console.error('Notification permission request error:', error);
        setShowPrompt(false); // Hide the custom prompt even if an error occurs
      });
  };

  // Handle Dismiss button click to hide the prompt
  const handleDismiss = () => {
    setShowPrompt(false); // Hide the custom prompt if user dismisses
  };

  // If showPrompt is false, don't render the prompt
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
          <AiOutlineClose size={20} className="text-gray-600 hover:text-red-600 transition-colors" />
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
