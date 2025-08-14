import React from 'react';

const Chat = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      height: '400px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #eee',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        fontWeight: 'bold'
      }}>
        My Custom Chat
      </div>
      <div style={{ flexGrow: 1, padding: '10px', overflowY: 'auto' }}>
        {/* Chat messages will go here */}
        <p>Hello! Welcome to the chat.</p>
        <p>How can I help you today?</p>
      </div>
      <div style={{
        padding: '10px',
        borderTop: '1px solid #eee',
        display: 'flex'
      }}>
        <input
          type="text"
          placeholder="Type a message..."
          style={{ flexGrow: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button style={{
          marginLeft: '10px',
          padding: '8px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
