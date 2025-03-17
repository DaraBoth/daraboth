import React, { forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
import ReactMarkdown from "react-markdown";
import { MdDelete } from "react-icons/md";
import PropTypes from "prop-types";
import { Box, IconButton, Paper, Typography } from "@mui/material";

const Row = ({ index, style, data }) => {
  const {
    chatHistory,
    handleDeleteMessage,
    hoveredMessageIndex,
    setHoveredMessageIndex,
  } = data;
  const msg = chatHistory[index];

  return (
    <Box
      style={style}
      display="flex"
      alignItems="flex-start"
      justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
      onMouseEnter={() => setHoveredMessageIndex(index)}
      onMouseLeave={() => setHoveredMessageIndex(null)}
      p={1}
    >
      {/* Avatar */}
      <Box
        width={40}
        height={40}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={msg.role === "user" ? "blue" : "green"}
        color="white"
        borderRadius="50%"
        mr={2}
      >
        {msg.role === "user" ? "U" : "AI"}
      </Box>

      {/* Message Bubble */}
      <Paper
        elevation={3}
        style={{
          padding: "10px",
          borderRadius: msg.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
          backgroundColor: msg.role === "user" ? "#1976d2" : "#e0e0e0",
          color: msg.role === "user" ? "white" : "black",
          maxWidth: "75%",
          wordBreak: "break-word",
        }}
      >
        <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
        <Typography variant="caption" display="block" textAlign="right" mt={1}>
          {msg.timestamp}
        </Typography>
      </Paper>

      {/* Delete Button */}
      {hoveredMessageIndex === index && msg.role === "user" && (
        <IconButton
          size="small"
          onClick={() => handleDeleteMessage(msg.id)}
          style={{ position: "absolute", top: 8, right: 8 }}
        >
          <MdDelete size={18} color="red" />
        </IconButton>
      )}
    </Box>
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
  const height = 550; // Adjust based on container size or make it dynamic

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
