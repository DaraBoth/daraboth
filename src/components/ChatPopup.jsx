import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { MdClose, MdSend, MdArrowDownward, MdDelete } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import moment from "moment";

const BAN_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds
const BAN_THRESHOLD = 10; // Number of attempts before ban
const SPAM_INTERVAL = 500; // Interval in milliseconds to consider as spam

const ChatPopup = ({ onClose }) => {
  const formRef = useRef();
  const messagesEndRef = useRef(null);
  const [form, setForm] = useState({ message: "", answer: "" });
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

  useEffect(() => {
    const lastDate = localStorage.getItem("today");
    if (!lastDate) {
      localStorage.setItem("today", new Date());
    } else if (isMoreThanADay(new Date(), new Date(lastDate))) {
      toast.success("Welcome back! 😍", { duration: 5000 });
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
          toast.success("Congratulations! You're back. Let's behave this time.", { duration: 10000 });
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
    scrollToBottom(); // Scroll to bottom when chat opens
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when new message arrives
  }, [chatHistory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (banEndTime && new Date() < new Date(banEndTime)) {
      return; // Prevent submission during ban
    }

    const userMessage = form.message.trim();
    if (!userMessage) return; // Don't submit if the message is empty

    // Immediately add the user's message to chat history and clear the input
    const newMessage = { role: "user", parts: [{ text: userMessage }], timestamp: moment().format('h:mm A') };
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
      const botResponse = { role: "model", parts: [{ text: response.data?.text }], timestamp: moment().format('h:mm A') };

      setChatHistory((prevHistory) => [...prevHistory, botResponse]);
    } catch (error) {
      toast.warning("Too many requests. Please try again later.", { duration: 3000 });
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      setShowScrollButton(false); // Hide button when scrolled to bottom
    } else {
      setShowScrollButton(true); // Show button when not at the bottom
    }
  };

  const incrementBanCount = () => {
    if (banCount < BAN_THRESHOLD) {
      setBanCount(banCount + 1);
      toast.warning("Chill daddy chill...", { duration: 3000 });
    } else {
      handleBan();
    }
  };

  const handleBan = () => {
    if (showingBannedAlert) return;
    const endTime = new Date(new Date().getTime() + BAN_DURATION);
    setBanEndTime(endTime);
    localStorage.setItem("banEndTime", endTime);
    toast.error("You are banned from asking for 3 minutes. Until this alert closes!", {
      duration: BAN_DURATION,
      onclose: () => {
        if (showingBannedAlert) return;
      },
    });
    displayBanMessages(BAN_DURATION);
    setShowingBannedAlert(true);
  };

  const displayBanMessages = (remainingBanTime) => {
    setTimeout(() => setForm({ ...form, answer: "Please wait... You are temporarily banned." }), 60 * 1000);
    setTimeout(() => setForm({ ...form, answer: "1 minute and 20 seconds more. Please wait..." }), 1.67 * 60 * 1000);
  };

  const isMoreThanADay = (dateA, dateB) => {
    const differenceInMilliseconds = dateA - dateB;
    return differenceInMilliseconds > 1000 * 60 * 60 * 24;
  };

  const handleDeleteMessage = (index) => {
    const updatedHistory = [...chatHistory];
    updatedHistory.splice(index, 1);
    setChatHistory(updatedHistory);
  };

  const handleClearAllChats = () => {
    setChatHistory([]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.8 }} 
      className="fixed bottom-24 right-5 w-[400px] md:w-[500px] md:h-[600px] bg-black-100 p-8 rounded-2xl shadow-md z-50 border border-gray-700 flex flex-col"
      style={{ maxWidth: '95%', height: '75%', maxHeight: '75%' }} // Adaptive sizing for different screens
    >
      {/* Chat Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white text-xl">Chat with Daraboth AI</h3>
        <button onClick={onClose} className="text-white hover:text-red-400">
          <MdClose size={24} />
        </button>
      </div>

      {/* Chat History Area */}
      <div
        className="flex-grow overflow-y-auto mb-4 p-3 bg-black-200 rounded-lg flex flex-col gap-2"
        onScroll={handleScroll}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`relative p-3 rounded-xl max-w-[70%] ${
              msg.role === 'user' ? 'bg-tertiary text-white self-end ml-auto' : 'bg-gray-700 text-white self-start mr-auto'
            }`}
            onMouseEnter={() => setHoveredMessageIndex(index)} // Set hover index on mouse enter
            onMouseLeave={() => setHoveredMessageIndex(null)} // Clear hover index on mouse leave
            onClick={() => setHoveredMessageIndex(index)} // For mobile: show delete button on tap
          >
            <ReactMarkdown className="prose prose-invert break-words">{msg.parts[0].text}</ReactMarkdown>
            <div className="text-xs text-gray-400 mt-1">{msg.timestamp}</div> {/* Timestamp with top margin */}
            {hoveredMessageIndex === index && ( // Show delete button only on hover or tap
              <button
                className="absolute top-1 right-2 cursor-pointer hover:text-red-500"
                onClick={() => handleDeleteMessage(index)}
              >
                <MdDelete />
              </button>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="p-2 text-sm text-gray-400">Typing...</div> // Typing indicator
        )}
        <div ref={messagesEndRef} /> {/* Ref to scroll into view */}
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          type="button"
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
          onClick={scrollToBottom}
        >
          <MdArrowDownward size={20} />
        </button>
      )}

      {/* Chat Input Area */}
      <form ref={formRef} onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <textarea
          rows={1}
          name="message"
          value={form.message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
          style={{ maxHeight: '60px' }} // Max 3 lines
        />
        <div className="flex justify-between items-center mt-2">
          <button
            type="submit"
            disabled={loading || (banEndTime && new Date() < new Date(banEndTime))}
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
          >
            {loading ? <ClipLoader size={18} color="#ffffff" /> : <MdSend size={20} />}
          </button>
          <button
            type="button"
            onClick={handleClearAllChats}
            className="bg-red-600 py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md hover:bg-red-700"
          >
            Clear All Chats
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatPopup;
