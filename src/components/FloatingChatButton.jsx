import React, { useState } from "react";
import ChatPopup from "@/components/ChatPopup"; // Updated import
import { Fab } from "@mui/material";
import { MdChat, MdClose } from "react-icons/md";

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{ position: "fixed", bottom: 16, right: 16, zIndex: 50 }}
      >
        {isChatOpen ? <MdClose /> : <MdChat />}
      </Fab>
      {isChatOpen && <ChatPopup onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default FloatingChatButton;
