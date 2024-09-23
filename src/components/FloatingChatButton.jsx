import React, { useState } from "react";
import FloatingChat from "@/components/ChatPopup"; // New Component

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <>
      <div
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer z-50"
        onClick={toggleChat}
      >
        {isChatOpen ? "❌" : "💬"}
      </div>
      {isChatOpen && <FloatingChat onClose={toggleChat} />}
    </>
  );
};

export default FloatingChatButton;
