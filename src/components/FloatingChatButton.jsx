"use client"  
import React, { useState } from "react";
import FloatingChat from "../components/ChatPopup"; // New Component
import { RainbowButton } from "./magic-ui/RainbowButton";

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <RainbowButton
          onClick={(e) => {
            e.preventDefault();
            setIsChatOpen(!isChatOpen);
          }}
        >
          {isChatOpen ? "❌" : "💬"}
        </RainbowButton>
      </div>
      {isChatOpen && <FloatingChat onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default FloatingChatButton;
