// src/components/ChatPopup.jsx

import React, { useEffect, useState, useRef, memo } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  MdMinimize,
  MdSend,
  MdDownload,
  MdClear,
} from "react-icons/md";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import Modal from "./Modal";
import VirtualizedChatHistory from "./VirtualizedChatHistory";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

const BAN_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds
const BAN_THRESHOLD = 10; // Number of attempts before ban
const SPAM_INTERVAL = 500; // Interval in milliseconds to consider as spam

const ChatPopup = ({ onClose }) => {
  const listRef = useRef(); // Ref for the virtualized list
  const [form, setForm] = useState({ message: "" });
  const [loading, setLoading] = useState(false);
  const [banCount, setBanCount] = useState(0);
  const [banEndTime, setBanEndTime] = useState(null);
  const [lastSpamTime, setLastSpamTime] = useState(0);
  const [showingBannedAlert, setShowingBannedAlert] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [chatHistory, setChatHistory] = useState(() => {
    const storedHistory = localStorage.getItem("chatHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null); // Track hovered message for delete button
  const [showClearModal, setShowClearModal] = useState(false); // State for confirmation modal
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false); // State for "New Messages" indicator

  useEffect(() => {
    const lastDate = localStorage.getItem("today");
    if (!lastDate) {
      localStorage.setItem("today", new Date());
    } else if (isMoreThanADay(new Date(), new Date(lastDate))) {
      toast.success("Welcome back! 😊", { duration: 5000 });
      localStorage.setItem("today", new Date());
    }

    const storedBanEndTime = localStorage.getItem("banEndTime");
    if (storedBanEndTime && new Date(storedBanEndTime) > new Date()) {
      setBanEndTime(new Date(storedBanEndTime));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (banEndTime) {
      const remainingBanTime = banEndTime.getTime() - new Date().getTime();
      if (remainingBanTime > 0) {
        const timer = setTimeout(() => {
          setBanCount(0);
          setBanEndTime(null);
          localStorage.removeItem("banEndTime");
          setShowingBannedAlert(false);
          toast.success("You're back! Let's continue our conversation. 😊", {
            duration: 10000,
          });
        }, remainingBanTime);
        displayBanMessages(remainingBanTime);
        return () => clearTimeout(timer);
      } else {
        setBanCount(0);
        setBanEndTime(null);
        localStorage.removeItem("banEndTime");
      }
    }
  }, [banEndTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (banEndTime && new Date() < new Date(banEndTime)) {
      toast.error("You're temporarily banned. Please wait.", {
        duration: 3000,
      });
      return; // Prevent submission during ban
    }

    const userMessage = form.message.trim();
    if (!userMessage) return; // Don't submit if the message is empty

    // Anti-Spam Check
    const currentTime = new Date().getTime();
    if (currentTime - lastSpamTime < SPAM_INTERVAL) {
      incrementBanCount();
      return;
    }
    setLastSpamTime(currentTime);

    // Immediately add the user's message to chat history and clear the input
    const newMessage = {
      id: uuidv4(), // Assign a unique ID
      role: "user",
      parts: [{ text: userMessage }],
      timestamp: moment().format("h:mm A"),
    };
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setForm({ ...form, message: "" }); // Clear input after sending

    setLoading(true);
    setIsTyping(true); // Show typing indicator

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://tinynotie-api.vercel.app/openai/ask",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { text: userMessage, chatHistory },
    };

    try {
      const response = await axios.request(config);
      const botResponse = {
        id: uuidv4(), // Assign a unique ID
        role: "model",
        parts: [{ text: response.data?.text }],
        timestamp: moment().format("h:mm A"),
      };

      setChatHistory((prevHistory) => [...prevHistory, botResponse]);
    } catch (error) {
      toast.warning("Too many requests. Please try again later.", {
        duration: 3000,
      });
      incrementBanCount();
    } finally {
      setLoading(false);
      setIsTyping(false); // Hide typing indicator after response
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.ctrlKey) {
      // Send message on Enter key
      event.preventDefault();
      if (!loading && form.message.trim() !== "") {
        handleSubmit(event);
      }
    } else if (event.ctrlKey && event.key === "Enter") {
      // Insert newline on Ctrl + Enter
      setForm({ ...form, message: form.message + "
" });
    }
  };

  const incrementBanCount = () => {
    if (banCount < BAN_THRESHOLD) {
      setBanCount(banCount + 1);
      toast.warning("Please slow down your requests.", { duration: 3000 });
    } else {
      handleBan();
    }
  };

  const handleBan = () => {
    if (showingBannedAlert) return;
    const endTime = new Date(new Date().getTime() + BAN_DURATION);
    setBanEndTime(endTime);
    localStorage.setItem("banEndTime", endTime);
    toast.error(
      "You've been temporarily banned for 3 minutes due to excessive requests.",
      {
        duration: BAN_DURATION,
      }
    );
    displayBanMessages(BAN_DURATION);
    setShowingBannedAlert(true);
  };

  const displayBanMessages = (remainingBanTime) => {
    setTimeout(
      () =>
        setForm((prevForm) => ({
          ...prevForm,
          message: "Please wait... You are temporarily banned.",
        })),
      1000
    );
    setTimeout(
      () =>
        setForm((prevForm) => ({
          ...prevForm,
          message: "1 minute and 20 seconds more. Please wait...",
        })),
      1000 + 1000 * 20
    );
  };

  const isMoreThanADay = (dateA, dateB) => {
    const differenceInMilliseconds = dateA - dateB;
    return differenceInMilliseconds > 1000 * 60 * 60 * 24;
  };

  const handleDeleteMessage = (id) => {
    const updatedHistory = chatHistory.filter((msg) => msg.id !== id);
    setChatHistory(updatedHistory);
  };

  const handleClearAllChats = () => {
    setShowClearModal(true); // Open confirmation modal
  };

  const confirmClearAllChats = () => {
    setChatHistory([]);
    toast.success("All chats have been cleared.", { duration: 3000 });
    setShowClearModal(false);
  };

  const cancelClearAllChats = () => {
    setShowClearModal(false);
  };

  const handleDownloadChat = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        chatHistory
          .map(
            (msg) =>
              `${msg.timestamp} - ${msg.role === "user" ? "You" : "AI"}: ${
                msg.parts[0].text
              }`
          )
          .join("
"),
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = "chat_history.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element); // Clean up after download
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-20 right-6 z-50"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-sm min-w-[350px] h-[80vh] flex flex-col">
          {/* Chat Header */}
          <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h6 className="text-lg font-semibold">Chat with Daraboth AI</h6>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <MdMinimize size={24} />
            </button>
          </div>

          {/* Chat Actions */}
          <div className="flex justify-end p-2 absolute -top-12 right-0">
            <button
              onClick={handleDownloadChat}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              title="Download Chat History"
            >
              <MdDownload size={20} />
            </button>
            <button
              onClick={handleClearAllChats}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              title="Clear All Chats"
            >
              <MdClear size={20} />
            </button>
          </div>

          {/* Chat History Area */}
          <div className="flex-grow overflow-auto p-4 bg-gray-50">
            <VirtualizedChatHistory
              chatHistory={chatHistory}
              handleDeleteMessage={handleDeleteMessage}
              hoveredMessageIndex={hoveredMessageIndex}
              setHoveredMessageIndex={setHoveredMessageIndex}
              ref={listRef} // Attach the ref to the virtualized list
            />
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center mt-2">
                <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center mr-2 rounded-full">
                  AI
                </div>
                <div className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Area */}
          <div className="p-4 bg-gray-200 border-t border-gray-300">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className={`p-2 rounded-lg ${
                    loading || (banEndTime && new Date() < new Date(banEndTime))
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white transition-colors duration-200`}
                  disabled={loading || (banEndTime && new Date() < new Date(banEndTime))}
                >
                  {loading ? (
                    <ClipLoader size={18} color={"#ffffff"} />
                  ) : (
                    <MdSend size={24} />
                  )}
                </button>
              </div>
            </form>
          </div>
          {/* Confirmation Modal for Clearing Chats */}
          <Modal
            isOpen={showClearModal}
            onClose={cancelClearAllChats}
            onConfirm={confirmClearAllChats}
            title="Confirm Clear All Chats"
            message="Are you sure you want to delete all your chat history? This action cannot be undone."
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ChatPopup);