// src/components/ChatPopup.jsx

import React, { useEffect, useState, useRef, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  MdClose,
  MdSend,
  MdArrowDownward,
  MdDownload,
  MdClear,
} from "react-icons/md";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import { Tooltip } from "react-tooltip";
import Modal from "./Modal";
import VirtualizedChatHistory from "./VirtualizedChatHistory";
import { v4 as uuidv4 } from "uuid";

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

  useEffect(() => {
    // Auto-scroll to bottom when a new message is added
    if (chatHistory.length > 0 && listRef.current) {
      listRef.current.scrollToItem(chatHistory.length - 1, "end");
    }
  }, [chatHistory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (banEndTime && new Date() < new Date(banEndTime)) {
      toast.error("You're temporarily banned. Please wait.", { duration: 3000 });
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
      setForm({ ...form, message: form.message + "\n" });
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      setShowScrollButton(false); // Hide button when scrolled to bottom
      setShowNewMessageIndicator(false); // Hide new message indicator if at bottom
    } else {
      setShowScrollButton(true); // Show button when not at bottom
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
              `${msg.timestamp} - ${
                msg.role === "user" ? "You" : "AI"
              }: ${msg.parts[0].text}`
          )
          .join("\n"),
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = "chat_history.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element); // Clean up after download
  };

  // Easing function for smooth scroll (optional)
  const easeOutCubic = (t) => (--t) * t * t + 1;

  // Enhanced handler for items rendered with smooth scroll
  const handleItemsRendered = useCallback(
    ({ visibleStartIndex, visibleStopIndex }) => {
      if (chatHistory.length > 0 && visibleStopIndex >= chatHistory.length - 1) {
        if (listRef.current) {
          listRef.current.scrollToItem(chatHistory.length - 1, "end");
        }
        setShowNewMessageIndicator(false); // Hide indicator if at bottom
      } else {
        setShowNewMessageIndicator(true); // Show indicator if not at bottom
      }
    },
    [chatHistory.length]
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-5 right-5 w-full max-w-lg md:max-w-xl lg:max-w-2xl h-[75vh] bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg z-50 border border-gray-300 dark:border-gray-700 flex flex-col"
        style={{
          maxWidth: "95%",
          height: "75%",
          maxHeight: "75%",
        }} // Adaptive sizing for different screens
      >
        {/* Chat Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg md:text-xl">
            Chat with Daraboth AI
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
            aria-label="Close Chat"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Chat Actions */}
        <div className="flex justify-end mb-2 space-x-2">
          <button
            onClick={handleDownloadChat}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
            data-tooltip-id="download-tooltip"
          >
            <MdDownload size={20} />
          </button>
          <button
            onClick={handleClearAllChats}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
            data-tooltip-id="clear-tooltip"
          >
            <MdClear size={20} />
          </button>
          {/* Render Tooltip Components */}
          <Tooltip id="download-tooltip" place="top" variant="dark">
            Download Chat History
          </Tooltip>
          <Tooltip id="clear-tooltip" place="top" variant="dark">
            Clear All Chats
          </Tooltip>
        </div>

        {/* Chat History Area */}
        <div
          className="flex-grow overflow-y-auto mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
          onScroll={handleScroll}
        >
          <VirtualizedChatHistory
            chatHistory={chatHistory}
            handleDeleteMessage={handleDeleteMessage}
            hoveredMessageIndex={hoveredMessageIndex}
            setHoveredMessageIndex={setHoveredMessageIndex}
            ref={listRef} // Attach the ref to the virtualized list
            onItemsRendered={handleItemsRendered} // Attach handler
          />
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center mt-2">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mr-2">
                AI
              </div>
              <div className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 p-3 rounded-lg rounded-bl-none flex items-center space-x-2">
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: 0,
                    }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: 0.2,
                    }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: 0.4,
                    }}
                  />
                </div>
                <span>Typing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll to Bottom Button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              type="button"
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
              onClick={() => {
                if (listRef.current) {
                  listRef.current.scrollToItem(chatHistory.length - 1, "end");
                }
              }}
              aria-label="Scroll to Bottom"
            >
              <MdArrowDownward size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* New Messages Indicator */}
        <AnimatePresence>
          {showNewMessageIndicator && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
              onClick={() => {
                if (listRef.current) {
                  listRef.current.scrollToItem(chatHistory.length - 1, "end");
                }
                setShowNewMessageIndicator(false);
              }}
              aria-label="Scroll to New Messages"
            >
              New Messages
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Input Area */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <textarea
            rows={1}
            name="message"
            value={form.message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="bg-gray-200 dark:bg-gray-600 py-3 px-4 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500 transition"
            style={{ maxHeight: "100px" }} // Max 5 lines
          />
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={
                loading || (banEndTime && new Date() < new Date(banEndTime))
              }
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send Message"
            >
              {loading ? (
                <ClipLoader size={18} color="#ffffff" />
              ) : (
                <MdSend size={20} />
              )}
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowClearModal(true)}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-md transition-colors"
                aria-label="Clear All Chats"
                data-tooltip-id="clear-tooltip"
              >
                <MdClear size={20} />
              </button>
              <button
                type="button"
                onClick={handleDownloadChat}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md transition-colors"
                aria-label="Download Chat History"
                data-tooltip-id="download-tooltip"
              >
                <MdDownload size={20} />
              </button>
            </div>
            {/* Tooltip components are already rendered above */}
          </div>
        </form>

        {/* Confirmation Modal for Clearing Chats */}
        <Modal
          isOpen={showClearModal}
          onClose={cancelClearAllChats}
          onConfirm={confirmClearAllChats}
          title="Confirm Clear All Chats"
          message="Are you sure you want to delete all your chat history? This action cannot be undone."
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ChatPopup);
