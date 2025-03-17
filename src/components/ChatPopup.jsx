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
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Paper,
  Tooltip,
  AppBar,
  Toolbar,
} from "@mui/material";
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
      setForm({ ...form, message: form.message + "\n" });
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        style={{ position: "fixed", bottom: "80px", right: "24px", zIndex: 50 }}
      >
        <Paper elevation={3} style={{ maxWidth: "450px", minWidth: "350px",height: "80vh", display: "flex", flexDirection: "column",  }}>
          {/* Chat Header */}
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Chat with Daraboth AI
              </Typography>
              <IconButton onClick={onClose} color="inherit">
                <MdMinimize size={24} />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Chat Actions */}
          <Box 
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
              position: "absolute",
              top: -45,
              right: 0,
            }}
          >
            <Tooltip title="Download Chat History" color="primary">
              <IconButton onClick={handleDownloadChat}>
                <MdDownload size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear All Chats" color="primary">
              <IconButton onClick={handleClearAllChats}>
                <MdClear size={20} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Chat History Area */}
          <Box flexGrow={1} overflow="auto" p={1} bgcolor="#f5f5f5">
            <VirtualizedChatHistory
              chatHistory={chatHistory}
              handleDeleteMessage={handleDeleteMessage}
              hoveredMessageIndex={hoveredMessageIndex}
              setHoveredMessageIndex={setHoveredMessageIndex}
              ref={listRef} // Attach the ref to the virtualized list
            />
            {/* Typing Indicator */}
            {isTyping && (
              <Box display="flex" alignItems="center" mt={2}>
                <Box width={40} height={40} bgcolor="green" color="white" display="flex" alignItems="center" justifyContent="center" mr={2}>
                  AI
                </Box>
                <Box bgcolor="gray" color="white" p={2} borderRadius={4}>
                  Typing...
                </Box>
              </Box>
            )}
          </Box>

          {/* Chat Input Area */}
          <Box p={1} bgcolor="#e0e0e0">
            <form onSubmit={handleSubmit}>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  fullWidth
                  multiline
                  rows={1}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  variant="outlined"
                />
                <Button
                  type="submit"
                  variant="text"
                  color="primary"
                  disabled={loading || (banEndTime && new Date() < new Date(banEndTime))}
                  sx={{
                    height:"100%"
                  }}
                >
                  {loading ? <ClipLoader size={18} color={"#ffffff"} /> : <MdSend />}
                </Button>
              </Box>
            </form>
          </Box>
          {/* Confirmation Modal for Clearing Chats */}
          <Modal
            isOpen={showClearModal}
            onClose={cancelClearAllChats}
            onConfirm={confirmClearAllChats}
            title="Confirm Clear All Chats"
            message="Are you sure you want to delete all your chat history? This action cannot be undone."
          />
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ChatPopup);
