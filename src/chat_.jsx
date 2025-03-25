import React, { useState, useEffect, useRef } from 'react';

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [userName, setUserName] = useState('');
  const messageInputRef = useRef(null);
  
  useEffect(() => {
    // Open WebSocket connection to FastAPI backend
    const socket = new WebSocket('ws://localhost:8000/ws/Just%20Chat');
    
    // Handle messages received from the server
    socket.onmessage = (event) => {
      const messageData = event.data.split(': ');
      
      // Check if the message is the "user connected" message
      if (messageData[0] === "Connected to the server with user name") {
        const userName = messageData[1];
        setUserName(userName);
        console.log(`Connected to the server with user name: ${userName}`);
      } else {
        const senderName = messageData[0];
        const messageText = messageData.slice(1).join(': ');

        console.log(`Received message from ${senderName}: ${messageText}`);

        setMessages(prevMessages => [
          ...prevMessages,
          { sender: senderName, text: messageText }
        ]);
      }
    };
    
    setWs(socket);
    
    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && message.trim()) {
      console.log(`Sending message: "${message}" as user: ${userName}`);
      ws.send(message);
      setMessage('');
      messageInputRef.current.focus();
    }
  };

  const renderMessage = (msg, idx) => {
    const displayName = msg.sender === userName ? 'You' : msg.sender;
    return (
      <div key={idx} className="bg-white p-4 rounded-lg shadow-md">
        <strong>{displayName}: </strong>{msg.text}
      </div>
    );
  };

  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-shrink-0 bg-green-500 p-4 text-white text-2xl font-bold">Just Chat</div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, idx) => renderMessage(msg, idx))}
        </div>
      </div>
      <div className="flex-shrink-0 p-4 bg-white flex items-center space-x-4 border-t">
        <input
          ref={messageInputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white p-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
