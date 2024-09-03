import React from 'react';

const FloatingChatButton = ({ onClick }) => {
  return (
    <div
      className="fixed bottom-28 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer z-50"
      onClick={onClick}
    >
      💬
    </div>
  );
};

export default FloatingChatButton;
