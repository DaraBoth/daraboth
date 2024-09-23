import React, { useState } from "react";
import FloatingChat from "@/components/ChatPopup"; // New Component

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <div
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer z-50"
        onClick={(e) => {
          e.preventDefault();
          setIsChatOpen(!isChatOpen);
        }}
      >
        {isChatOpen ? "❌" : "💬"}
      </div>
      {isChatOpen && <FloatingChat onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default FloatingChatButton;
