// src/components/ChatPopup.jsx

import React, { useEffect, useState, useRef, memo } from "react";
// Use native fetch for streaming responses
import { toast } from "sonner";
import {
  MdMinimize,
  MdSend,
  MdDelete,
} from "react-icons/md";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import VirtualizedChatHistory from "./VirtualizedChatHistory";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

const BAN_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds
const BAN_THRESHOLD = 10; // Number of attempts before ban
const SPAM_INTERVAL = 500; // Interval in milliseconds to consider as spam
const WEBHOOK_TIMEOUT = 10 * 60 * 1000; // 10 minutes timeout for webhook

const ChatPopup = ({ onClose }) => {
  const listRef = useRef(); // Ref for the virtualized list
  const chatContainerRef = useRef(null); // container for scrolling
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
  // Persisted session id for n8n AI Agent memory
  const [sessionId, setSessionId] = useState(() => {
    try {
      return localStorage.getItem("chatSessionId") || null;
    } catch (e) {
      return null;
    }
  });
  // typing indicator derived from pendingMessages
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null); // Track hovered message for delete button
  const [pendingMessages, setPendingMessages] = useState(new Map()); // Track pending webhook responses

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

  // Auto-scroll helper
  const scrollToBottom = (behavior = "smooth") => {
    try {
      const el = chatContainerRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior });
    } catch (e) {
      // ignore
    }
  };

  // Scroll to bottom on mount
  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  // Scroll to bottom when chatHistory or pendingMessages change
  useEffect(() => {
    scrollToBottom("smooth");
  }, [chatHistory.length, pendingMessages.size]);

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

  // Helper to extract various session id keys returned by n8n
  const extractSessionIdFrom = (obj) => {
    if (!obj) return null;
    const candidates = [
      "sessionId",
      "session_id",
      "session",
      "conversationId",
      "conversation_id",
      "chatSessionId",
      "chat_session_id",
    ];
    for (const k of candidates) {
      if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k]) {
        const v = obj[k];
        if (typeof v === "string") return v;
        if (v && typeof v === "object") {
          if (typeof v.id === "string") return v.id;
          if (typeof v.sessionId === "string") return v.sessionId;
        }
      }
    }
    if (obj.meta) return extractSessionIdFrom(obj.meta);
    return null;
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
    const userMessageId = uuidv4();
    const newMessage = {
      id: userMessageId,
      role: "user",
      parts: [{ text: userMessage }],
      timestamp: moment().format("h:mm A"),
    };
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    setForm({ ...form, message: "" }); // Clear input after sending

    setLoading(true);

    // Add a placeholder message for the pending response
    const pendingMessageId = uuidv4();
    const pendingMessage = {
      id: pendingMessageId,
      role: "model",
      parts: [{ text: "Processing your request..." }],
      timestamp: moment().format("h:mm A"),
      isPending: true,
    };
    setChatHistory((prevHistory) => [...prevHistory, pendingMessage]);
    setPendingMessages(prev => new Map(prev.set(pendingMessageId, true)));

    // Call webhook with message and user_id and handle streaming response
    try {

      // Send payload matching n8n Chat Trigger expectations: include `chatInput` field
      const N8N_WEBHOOK = `https://n8n.tonlaysab.com/webhook/b214e690-dc99-4809-a3dc-01bfb2789e86/chat`;

      // Ensure a session exists for this chat. If not, create and persist one.
      let sessionToSend = sessionId;
      if (!sessionToSend) {
        sessionToSend = uuidv4();
        setSessionId(sessionToSend);
        try { localStorage.setItem("chatSessionId", sessionToSend); } catch (e) {}
      }

      // Send payload: the chatTrigger expects `chatInput` to contain the prompt
      const payload = {
        chatInput: userMessage,
        user_id: userMessageId,
        // include session under multiple keys so the workflow can pick whichever it expects
        session: sessionToSend,
        sessionId: sessionToSend,
        conversationId: sessionToSend,
      };

      // Debug: help troubleshooting when session isn't sent/recognized
      try {
        // eslint-disable-next-line no-console
        console.debug("Sending to N8N webhook", { payload, sessionToSend, storedLocal: localStorage.getItem("chatSessionId") });
      } catch (e) {}

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT);

      // POST directly to n8n webhook (n8n will return final response; if streaming is available we'll handle it)
      const response = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      // If server sends full body at once (no stream) handle it
      if (!response.body) {
        const text = await response.text();
        let responseParts = [{ text }];
        try {
          const data = JSON.parse(text);
          // Normalize arrays from n8n (e.g. [{ output: '...' }])
          const normalized = Array.isArray(data) && data.length > 0 ? data[0] : data;

          // Try to extract session id from the response and persist it
          const maybeSession = extractSessionIdFrom(normalized);
          if (maybeSession) {
            setSessionId(maybeSession);
            try { localStorage.setItem("chatSessionId", maybeSession); } catch (e) {}
          }

          if (Array.isArray(normalized.parts) && normalized.parts.length) {
            responseParts = normalized.parts.map((p) => ({ text: typeof p === "string" ? p : p.text || JSON.stringify(p) }));
          } else if (Array.isArray(normalized.messages) && normalized.messages.length) {
            responseParts = normalized.messages.map((m) => ({ text: typeof m === "string" ? m : m.text || JSON.stringify(m) }));
          } else if (typeof normalized.output === "string") {
            responseParts = [{ text: normalized.output }];
          } else if (typeof normalized.message === "string") {
            responseParts = [{ text: normalized.message }];
          }
        } catch (e) {
          // keep as plain text
        }

        const botResponse = {
          id: pendingMessageId,
          role: "model",
          parts: responseParts,
          timestamp: moment().format("h:mm A"),
          isPending: false,
        };

        setChatHistory((prevHistory) => prevHistory.map((msg) => (msg.id === pendingMessageId ? botResponse : msg)));
        clearTimeout(timeoutId);
      } else {
        // Streamed response: read chunks and update UI incrementally
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulated = "";

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (readerDone) {
            done = true;
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          // Try to interpret accumulated data as JSON first; if it fails, treat as plain text
          let responseParts = [{ text: accumulated }];
          try {
            const maybe = JSON.parse(accumulated);
            const normalized = Array.isArray(maybe) && maybe.length > 0 ? maybe[0] : maybe;

            // If the stream includes session information, persist it
            const maybeSession = extractSessionIdFrom(normalized);
            if (maybeSession) {
              setSessionId(maybeSession);
              try { localStorage.setItem("chatSessionId", maybeSession); } catch (e) {}
            }

            if (Array.isArray(normalized.parts) && normalized.parts.length > 0) {
              responseParts = normalized.parts.map((p) => ({ text: typeof p === "string" ? p : p.text || JSON.stringify(p) }));
            } else if (Array.isArray(normalized.messages) && normalized.messages.length > 0) {
              responseParts = normalized.messages.map((m) => ({ text: typeof m === "string" ? m : m.text || JSON.stringify(m) }));
            } else if (typeof normalized.output === "string") {
              responseParts = [{ text: normalized.output }];
            } else if (typeof normalized.message === "string") {
              responseParts = [{ text: normalized.message }];
            } else if (typeof maybe === "string") {
              responseParts = [{ text: maybe }];
            }
          } catch (e) {
            // not JSON, keep as plain accumulated text
          }

          setChatHistory((prevHistory) =>
            prevHistory.map((msg) =>
              msg.id === pendingMessageId ? { ...msg, parts: responseParts, isPending: true } : msg
            )
          );
        }

        // Finalize the pending message
        setChatHistory((prevHistory) =>
          prevHistory.map((msg) => (msg.id === pendingMessageId ? { ...msg, isPending: false, timestamp: moment().format("h:mm A") } : msg))
        );

        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("Webhook call failed:", error);
      
      // Show error message in chat
      const isAbort = error.name === 'AbortError' || error.message === 'Webhook timeout';
      const errorMessage = isAbort
        ? "Sorry, the request is taking longer than expected. Please try again later."
        : "Sorry, there was an issue processing your request. Please try again.";
      
      const botResponse = {
        id: pendingMessageId,
        role: "model",
        parts: [{ text: errorMessage }],
        timestamp: moment().format("h:mm A"),
        isPending: false,
      };
      
      setChatHistory((prevHistory) => 
        prevHistory.map(msg => 
          msg.id === pendingMessageId ? botResponse : msg
        )
      );
      
      toast.error("There was an issue with the request. Please try again.", {
        duration: 5000,
      });
    } finally {
      setLoading(false);
      // typing indicator is derived from pendingMessages; no explicit set here
      setPendingMessages(prev => {
        const newMap = new Map(prev);
        newMap.delete(pendingMessageId);
        return newMap;
      });
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

  const handleClearChat = () => {
    if (chatHistory.length === 0) return;
    const ok = window.confirm("Clear the entire chat history?");
    if (!ok) return;
    setChatHistory([]);
    try {
      localStorage.removeItem("chatHistory");
      localStorage.removeItem("chatSessionId");
      setSessionId(null);
    } catch (e) {
      // ignore
    }
    setPendingMessages(new Map());
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-4 left-4 right-4 sm:bottom-20 sm:right-6 z-50 flex sm:justify-end justify-center"
      >
        <div className="relative glass-primary backdrop-blur-2xl bg-gradient-to-br from-white/15 via-white/8 to-white/5 border border-white/20 rounded-3xl shadow-2xl max-w-sm w-full sm:min-w-[400px] h-[70vh] sm:h-[85vh] max-h-[85vh] flex flex-col overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#915EFF]/10 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#804dee]/10 to-transparent rounded-full blur-lg" />

          {/* Enhanced Chat Header */}
          <div className="relative glass-accent backdrop-blur-xl bg-gradient-to-r from-[#915EFF]/30 via-[#804dee]/20 to-[#915EFF]/30 border-b border-white/20 p-5 rounded-t-3xl flex justify-between items-center overflow-hidden">
            {/* Header Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#915EFF]/20 to-[#804dee]/20 opacity-50" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 glass-secondary backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/50 animate-pulse" />
              </div>
              <div>
                <h6 className="text-white text-lg font-bold">Personal Info Assistance AI</h6>
                <p className="text-white/80 text-sm">Daraboth's bot</p>
              </div>
            </div>

            <motion.button
              onClick={handleClearChat}
              title="Clear chat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 w-10 h-10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 hover:bg-white/20 transition-all duration-300 mr-2"
            >
              <MdDelete size={18} className="text-white" aria-hidden="true" />
            </motion.button>

            <motion.button
              onClick={onClose}
              title="Minimize"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="relative z-10 w-10 h-10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <MdMinimize size={20} className="text-white" aria-hidden="true" />
            </motion.button>
          </div>

          {/* Chat History Area */}
          <div ref={chatContainerRef} className="flex-grow p-2 bg-black-100/50 overflow-hidden">
            <VirtualizedChatHistory
              chatHistory={chatHistory}
              handleDeleteMessage={handleDeleteMessage}
              hoveredMessageIndex={hoveredMessageIndex}
              setHoveredMessageIndex={setHoveredMessageIndex}
              ref={listRef} // Attach the ref to the virtualized list
            />
            {/* Typing Indicator */}
            {/* {pendingMessages.size > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center mt-4"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#915EFF] to-[#804dee] text-white flex items-center justify-center mr-3 rounded-full">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <div className="bg-tertiary text-white px-4 py-2 rounded-2xl border border-secondary/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )} */}
          </div>

          {/* Enhanced Chat Input Area */}
          <div className="relative p-3 glass-secondary backdrop-blur-xl border-t border-white/20 rounded-b-3xl">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-3">
                <div className="flex-grow relative">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about me"
                    className="w-full p-4 glass-tertiary backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#915EFF]/50 focus:border-[#915EFF]/60 focus:shadow-lg focus:shadow-[#915EFF]/25 transition-all duration-300 resize-none overflow-hidden"
                    style={{
                      minHeight: '52px',
                      maxHeight: '120px',
                      height: 'auto'
                    }}
                    rows={1}
                    disabled={banEndTime && new Date() < new Date(banEndTime)}
                    onInput={(e) => {
                      // Auto-resize the textarea
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />

                  {/* Input Decorative Elements */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-[#915EFF]/40 rounded-full animate-pulse" />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 25px rgba(145, 94, 255, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-12 h-12 rounded-2xl transition-all duration-300 overflow-hidden ${
                    loading || (banEndTime && new Date() < new Date(banEndTime))
                      ? "glass-tertiary cursor-not-allowed opacity-50"
                      : "glass-button bg-gradient-to-r from-[#915EFF]/30 to-[#804dee]/20 border border-[#915EFF]/40 hover:from-[#915EFF]/40 hover:to-[#804dee]/30 shadow-lg shadow-[#915EFF]/25"
                  } text-white flex items-center justify-center`}
                  disabled={loading || (banEndTime && new Date() < new Date(banEndTime))}
                >
                  {/* Button Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#915EFF]/20 to-[#804dee]/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    {loading ? (
                      <ClipLoader size={20} color={"#ffffff"} />
                    ) : (
                      <MdSend size={22} className="text-white" aria-hidden="true" />
                    )}
                  </div>
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ChatPopup);