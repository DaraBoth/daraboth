import React, { useState } from "react";
import ChatPopup from "@/components/ChatPopup";
import { MdChat, MdClose } from "react-icons/md";
import { motion } from "framer-motion";

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 z-50 p-4 rounded-full bg-gradient-to-r from-[#915EFF] to-[#804dee] text-white shadow-2xl hover:shadow-[#915EFF]/25 focus:outline-none focus:ring-2 focus:ring-[#915EFF]/50 focus:ring-opacity-50 transition-all duration-300 ease-in-out border border-white/10 backdrop-blur-sm"
        aria-label="Toggle chat"
      >
        <motion.div
          animate={{ rotate: isChatOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isChatOpen ? <MdClose size={24} /> : <MdChat size={24} />}
        </motion.div>
      </motion.button>
      {isChatOpen && <ChatPopup onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default FloatingChatButton;