import React, { useState } from "react";
import ChatPopup from "./ChatPopup";
import { MdChat, MdClose } from "react-icons/md";
import { motion } from "framer-motion";

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 20px 40px rgba(145, 94, 255, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 rounded-2xl glass-button backdrop-blur-xl bg-gradient-to-br from-[#915EFF]/30 via-[#804dee]/20 to-[#915EFF]/30 border border-[#915EFF]/40 text-white shadow-lg shadow-[#915EFF]/25 transition-all duration-300 overflow-hidden group"
          aria-label="Toggle chat"
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/20 to-[#804dee]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Icon Container */}
          <motion.div
            animate={{ rotate: isChatOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative z-10 flex items-center justify-center w-full h-full"
          >
            {isChatOpen ? <MdClose size={28} /> : <MdChat size={28} />}
          </motion.div>

          {/* Floating Particles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-[#915EFF] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#804dee] rounded-full"
          />
        </motion.button>

        {/* Notification Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isChatOpen ? 0 : 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center border-2 border-white/30 backdrop-blur-sm"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </motion.div>
      </motion.div>

      {/* Enhanced Chat Popup */}
      {isChatOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <ChatPopup onClose={() => setIsChatOpen(false)} />
        </motion.div>
      )}
    </>
  );
};

export default FloatingChatButton;