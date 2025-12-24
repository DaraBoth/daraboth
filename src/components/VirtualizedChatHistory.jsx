import React, { forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
import ReactMarkdown from "react-markdown";
import { MdDelete } from "react-icons/md";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

const Row = ({ index, style, data }) => {
  const {
    chatHistory,
    handleDeleteMessage,
    hoveredMessageIndex,
    setHoveredMessageIndex,
  } = data;
  const msg = chatHistory[index];

  return (
    <motion.div
      style={style}
      className="flex items-start justify-start p-2"
      onMouseEnter={() => setHoveredMessageIndex(index)}
      onMouseLeave={() => setHoveredMessageIndex(null)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar removed: simplified message row without avatar */}

      {/* Message Bubble */}
      <div className={`relative max-w-[75%] ${
        msg.role === "user" ? "ml-auto" : ""
      }`}>
        <div className={`p-3 rounded-2xl border ${
          msg.role === "user"
            ? "bg-gradient-to-r from-[#915EFF] to-[#804dee] text-white border-[#915EFF]/20"
            : msg.isPending
            ? "bg-tertiary text-white border-secondary/20"
            : "bg-tertiary text-white border-secondary/20"
        }`}>
          {msg.isPending ? (
            <div className="flex items-center space-x-2">
              <ClipLoader size={16} color="#915EFF" />
              <span className="text-sm">Thinking...</span>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  // Custom styling for markdown elements
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold mb-2">{children}</h3>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  code: ({ children }) => (
                    <code className="bg-black-200 px-1 py-0.5 rounded text-xs font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-black-200 p-2 rounded-lg overflow-x-auto text-xs font-mono mb-2">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#915EFF] pl-3 italic text-sm mb-2">
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#915EFF] hover:text-[#804dee] underline"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {msg.parts[0].text}
              </ReactMarkdown>
            </div>
          )}
          
          <div className={`text-xs mt-2 ${
            msg.role === "user" ? "text-white/70" : "text-secondary"
          }`}>
            {msg.timestamp}
          </div>
        </div>

        {/* Delete Button */}
        {hoveredMessageIndex === index && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => handleDeleteMessage(msg.id)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <MdDelete size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

Row.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.shape({
    chatHistory: PropTypes.array.isRequired,
    handleDeleteMessage: PropTypes.func.isRequired,
    hoveredMessageIndex: PropTypes.number,
    setHoveredMessageIndex: PropTypes.func.isRequired,
  }).isRequired,
};

const VirtualizedChatHistory = forwardRef((props, ref) => {
  const {
    chatHistory,
    handleDeleteMessage,
    hoveredMessageIndex,
    setHoveredMessageIndex,
    onItemsRendered,
  } = props;

  const itemSize = 100; // Increased for better spacing
  const height = 500; // Adjust based on container size

  const itemData = {
    chatHistory,
    handleDeleteMessage,
    hoveredMessageIndex,
    setHoveredMessageIndex,
  };

  if (chatHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-secondary">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#915EFF] to-[#804dee] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">💬</span>
          </div>
          <p className="text-lg font-medium">Start a conversation</p>
          <p className="text-sm">Ask me to update this website or make changes</p>
        </div>
      </div>
    );
  }

  return (
    <List
      ref={ref}
      height={height}
      itemCount={chatHistory.length}
      itemSize={itemSize}
      itemData={itemData}
      onItemsRendered={onItemsRendered}
      className="scrollbar-thin scrollbar-thumb-[#915EFF] scrollbar-track-transparent"
    >
      {Row}
    </List>
  );
});

VirtualizedChatHistory.propTypes = {
  chatHistory: PropTypes.array.isRequired,
  handleDeleteMessage: PropTypes.func.isRequired,
  hoveredMessageIndex: PropTypes.number,
  setHoveredMessageIndex: PropTypes.func.isRequired,
  onItemsRendered: PropTypes.func,
};

VirtualizedChatHistory.displayName = "VirtualizedChatHistory";

export default VirtualizedChatHistory;
