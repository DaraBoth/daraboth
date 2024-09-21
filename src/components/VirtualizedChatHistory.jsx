// src/components/VirtualizedChatHistory.jsx

import React, { forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
import ReactMarkdown from "react-markdown";
import { MdDelete } from "react-icons/md";
import clsx from "clsx";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Row = ({ index, style, data }) => {
  const {
    chatHistory,
    handleDeleteMessage,
    hoveredMessageIndex,
    setHoveredMessageIndex,
  } = data;
  const msg = chatHistory[index];

  return (
    <div
      style={style}
      className={`relative flex items-start py-2 px-4 ${
        msg.role === "user" ? "justify-end" : "justify-start"
      }`}
      onMouseEnter={() => setHoveredMessageIndex(index)}
      onMouseLeave={() => setHoveredMessageIndex(null)}
    >
      {/* Avatar */}
      <div
        className={clsx(
          "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-2",
          msg.role === "user" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
        )}
      >
        {msg.role === "user" ? "U" : "AI"}
      </div>

      {/* Message Bubble */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "max-w-full p-4 rounded-lg shadow-md cursor-pointer",
          msg.role === "user"
            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-br-none"
            : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 dark:bg-gray-600 dark:text-gray-100 rounded-bl-none"
        )}
      >
        <ReactMarkdown className="prose prose-sm dark:prose-invert break-words">
          {msg.parts[0].text}
        </ReactMarkdown>
        <div className="text-xs text-gray-200 dark:text-gray-400 mt-2 text-right">
          {msg.timestamp}
        </div>
      </motion.div>

      {/* Delete Button */}
      {hoveredMessageIndex === index && msg.role === "user" && (
        <button
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          onClick={() => handleDeleteMessage(msg.id)}
          aria-label="Delete Message"
        >
          <MdDelete size={18} />
        </button>
      )}
    </div>
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

  const itemSize = 80; // Adjust based on message size
  const height = 400; // Adjust based on container size or make it dynamic

  const itemData = {
    chatHistory,
    handleDeleteMessage,
    hoveredMessageIndex,
    setHoveredMessageIndex,
  };

  return (
    <List
      height={height}
      itemCount={chatHistory.length}
      itemSize={itemSize}
      width="100%"
      itemData={itemData}
      overscanCount={5}
      ref={ref}
      onItemsRendered={onItemsRendered}
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

export default VirtualizedChatHistory;
