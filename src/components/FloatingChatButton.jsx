import React, { useState } from "react";
import ChatPopup from "@/components/ChatPopup";
import { MdChat, MdClose } from "react-icons/md";

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
        aria-label="Toggle chat"
      >
        {isChatOpen ? <MdClose size={24} /> : <MdChat size={24} />}
      </button>
      {isChatOpen && <ChatPopup onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default FloatingChatButton;