import React from 'react';

const FloatingChatButton = ({ isChatOpen, onClick }) => {
  return (
    <div
      className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer z-50"
      onClick={onClick}
    >
      {isChatOpen ? "❌" : "💬"}
    </div>
  );
};

export default FloatingChatButton;
