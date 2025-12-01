import { useState, useEffect, useRef } from "react";
import axios from "axios";          // Used to send requests to the backend
import "./ChatBox.css";

// User text color options
const USER_COLORS = {
  magenta: { color: '#ff44dd', glow: 'rgba(255, 68, 221, 0.4)', border: 'rgba(255, 68, 221, 0.6)' },
  white: { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.3)', border: 'rgba(255, 255, 255, 0.5)' },
  blue: { color: '#00d4ff', glow: 'rgba(0, 212, 255, 0.4)', border: 'rgba(0, 212, 255, 0.6)' }
};

function ChatBox({ onProcessingChange, onEngineChange }) {
  /*
    messages: array that stores all chat messages
    setMessages: function to update the messages array
  */
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hey Pablo, I'm Orpheus. Talk to me. " }
  ]);

  /*
    input: value of the text box
    setInput: function to update the text box value
  */
  const [input, setInput] = useState("");

  /*
    userColor: selected color theme for user messages
  */
  const [userColor, setUserColor] = useState('magenta');

  /*
    messagesEndRef: reference to scroll to bottom of messages
  */
  const messagesEndRef = useRef(null);

  /*
    textareaRef: reference for auto-resizing textarea
  */
  const textareaRef = useRef(null);

  /*
    autoResizeTextarea: adjusts textarea height based on content
  */
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const maxHeight = 150; // Max ~5 lines
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }
  };

  /*
    resetTextareaHeight: resets textarea to single line
  */
  const resetTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
    }
  };

  /*
    scrollToBottom: smoothly scrolls to the bottom of messages
  */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /*
    useEffect: scroll to bottom when messages change
  */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /*
    handleSend():
    Runs when you click "Send" or press Enter.
    1. Adds user's message to chat immediately.
    2. Sends the message to the backend using Axios.
    3. Adds backend reply to chat when it returns.
  */
  async function handleSend() {
    if (!input.trim()) return;    // Prevent sending empty messages

    // STEP 1 — Capture the message and clear input immediately
    const messageText = input.trim();
    setInput("");
    resetTextareaHeight();

    // STEP 2 — Create the user message
    const userMessage = { sender: "user", text: messageText };

    // STEP 3 — Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);

    try {
      // STEP 3 — Show processing state and cycle through engines
      onProcessingChange?.(true);
      const engines = ['memory', 'archetype', 'reflection', 'synthesis'];
      let engineIndex = 0;
      const engineCycle = setInterval(() => {
        onEngineChange?.(engines[engineIndex % engines.length]);
        engineIndex++;
      }, 200);

      // STEP 4 — Send message to backend (POST request)
      const response = await axios.post("http://localhost:3000/chat", {
        message: messageText,
      });

      // STEP 5 — Stop cycling and show final engine state
      clearInterval(engineCycle);
      onEngineChange?.(response.data.engine || null);

      // STEP 6 — Create AI reply from backend data
      const aiMessage = {
        sender: "ai",
        text: response.data.reply,   // backend sends { reply: "..." }
      };

      // STEP 7 — Add AI message to chat
      setMessages((prev) => [...prev, aiMessage]);

      // STEP 8 — Clear engine state after a moment
      setTimeout(() => {
        onEngineChange?.(null);
        onProcessingChange?.(false);
      }, 1500);

    } catch (error) {
      console.error("Error talking to backend:", error);
      onProcessingChange?.(false);
      onEngineChange?.(null);

      // OPTIONAL — show an error message in chat
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: Could not reach server." }
      ]);
    }
  }

  /*
    handleKeyDown:
    Enter sends message, Shift+Enter adds new line
  */
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  /*
    handleInputChange:
    Updates input and resizes textarea
  */
  function handleInputChange(event) {
    setInput(event.target.value);
    autoResizeTextarea();
  }

  return (
    <div 
      className="chat-wrapper"
      style={{
        '--user-text-color': USER_COLORS[userColor].color,
        '--user-glow-color': USER_COLORS[userColor].glow,
        '--user-border-color': USER_COLORS[userColor].border
      }}
    >
      <div className="chat-container">
        
        {/* COLOR PICKER */}
        <div className="color-picker">
          <span className="color-label">YOUR COLOR</span>
          <div className="color-options">
            <button 
              className={`color-btn magenta ${userColor === 'magenta' ? 'active' : ''}`}
              onClick={() => setUserColor('magenta')}
              title="Magenta"
            />
            <button 
              className={`color-btn white ${userColor === 'white' ? 'active' : ''}`}
              onClick={() => setUserColor('white')}
              title="White"
            />
            <button 
              className={`color-btn blue ${userColor === 'blue' ? 'active' : ''}`}
              onClick={() => setUserColor('blue')}
              title="Electric Blue"
            />
          </div>
        </div>
        
        {/* MESSAGE LIST */}
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {/* Aurora shader for Orpheus messages */}
              {msg.sender === "ai" && <div className="aurora-shader"></div>}
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT + SEND BUTTON */}
        <div className="input-container">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Talk to Orpheus..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button className="send-button" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
