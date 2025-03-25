import React, { useState, useEffect, useRef } from 'react';

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [userName, setUserName] = useState('');
  const [isNamePromptVisible, setIsNamePromptVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const messageInputRef = useRef(null);

  // Function to handle setting username from input
  const setUser = () => {
    // If the name is not empty, hide the prompt and establish the WebSocket connection
    if (userName.trim() === "") {
      setErrorMessage("Name cannot be empty!");
      return;
    }
    setErrorMessage(""); // Clear any previous error message
    setIsNamePromptVisible(false);
  };

  useEffect(() => {
    if (!isNamePromptVisible) {
      // Open WebSocket connection to FastAPI backend only after the user name is set
    //   const socket = new WebSocket(`ws://localhost:8000/ws/Just%20Chat?username=${userName}`);
      const socket = new WebSocket('wss://6b0e-103-231-117-218.ngrok-free.app/ws/Just%20Chat?username=' + userName);

      socket.onmessage = (event) => {
        const messageData = event.data.split(': ');

        if (messageData[0] === "Connected to the server with user name") {
          console.log(`Connected to the server with user name: ${messageData[1]}`);
        } else {
          const senderName = messageData[0];
          const messageText = messageData.slice(1).join(': ');

          console.log(`Received message from ${senderName}: ${messageText}`);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: senderName, text: messageText },
          ]);
        }
      };

      setWs(socket);

      // Cleanup on component unmount
      return () => {
        socket.close();
      };
    }
  }, [isNamePromptVisible, userName]);

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
      {isNamePromptVisible ? (
        <div className="flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl">Enter your name</h2>
          <input
            type="text"
            className="p-2 border rounded-md"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") setUser(); // Submit on pressing Enter
            }}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <button
            className="bg-green-500 text-white p-2 rounded-md mt-2"
            onClick={setUser} // Submit on button click
          >
            Submit
          </button>
        </div>
      ) : (
        <>
        <form  onSubmit={(e) => {
            e.preventDefault(); // Prevent form submission
            sendMessage(); // Call sendMessage when Enter is pressed
          }}>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevents adding a new line
                  sendMessage();
                }
              }}
            >
              Send
            </button>
          </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatApp;
