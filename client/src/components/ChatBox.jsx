import { useState, useEffect, useRef } from "react";
import axios from "axios";          // Used to send requests to the backend
import "./ChatBox.css";
import { API_ENDPOINTS } from "../config/api";
import SoundWave from "./SoundWave";

// User text color options
const USER_COLORS = {
  magenta: { color: '#ff44dd', glow: 'rgba(255, 68, 221, 0.4)', border: 'rgba(255, 68, 221, 0.6)' },
  white: { color: '#ffffff', glow: 'rgba(255, 255, 255, 0.3)', border: 'rgba(255, 255, 255, 0.5)' },
  blue: { color: '#00d4ff', glow: 'rgba(0, 212, 255, 0.4)', border: 'rgba(0, 212, 255, 0.6)' }
};

// Speaker icon SVG component
const SpeakerIcon = ({ playing }) => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={playing ? 'speaker-playing' : ''}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    {playing ? (
      <>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    ) : (
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    )}
  </svg>
);

function ChatBox({ onProcessingChange, onEngineChange, conversationId, onNewConversation }) {
  /*
    messages: array that stores all chat messages
    setMessages: function to update the messages array
  */
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hey Pablo, I'm Pneuma. Talk to me. ", timestamp: new Date().toISOString() }
  ]);
  
  // Track which conversation is currently loaded
  const [loadedConversationId, setLoadedConversationId] = useState(null);
  
  // Load conversation when conversationId changes
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;
      
      // If same conversation, don't reload
      if (conversationId === loadedConversationId) return;
      
      // If it's a new conversation (starts with 'conv-'), try to load it
      // If it doesn't exist on server yet, start fresh
      try {
        const res = await fetch(`http://localhost:3000/conversations/${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages?.length > 0) {
            setMessages(data.messages);
          } else {
            // Conversation exists but has no messages - start fresh
            setMessages([{ sender: "ai", text: "Hey Pablo, I'm Pneuma. Talk to me. " }]);
          }
        } else {
          // Conversation doesn't exist on server - it's a new one, start fresh
          setMessages([{ sender: "ai", text: "Hey Pablo, I'm Pneuma. Talk to me. " }]);
        }
        setLoadedConversationId(conversationId);
      } catch (error) {
        console.error('Failed to load conversation:', error);
        // On error, start fresh
        setMessages([{ sender: "ai", text: "Hey Pablo, I'm Pneuma. Talk to me. " }]);
        setLoadedConversationId(conversationId);
      }
    };
    loadConversation();
  }, [conversationId, loadedConversationId]);

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
    playingMessageIndex: tracks which message is currently being spoken
  */
  const [playingMessageIndex, setPlayingMessageIndex] = useState(null);
  const audioRef = useRef(null);

  /*
    playMessage: sends text to TTS endpoint and plays audio
  */
  const playMessage = async (text, index) => {
    // If already playing this message, stop it
    if (playingMessageIndex === index && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingMessageIndex(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      setPlayingMessageIndex(index);
      
      const response = await fetch(API_ENDPOINTS.tts, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('TTS request failed');
        setPlayingMessageIndex(null);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingMessageIndex(null);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setPlayingMessageIndex(null);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setPlayingMessageIndex(null);
    }
  };

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

    // STEP 2 — Create the user message with color
    const userMessage = { sender: "user", text: messageText, timestamp: new Date().toISOString(), color: userColor };

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
      const response = await axios.post(API_ENDPOINTS.chat, {
        message: messageText,
      });

      // STEP 5 — Stop cycling and show final engine state
      clearInterval(engineCycle);
      onEngineChange?.(response.data.engine || null);

      // STEP 6 — Create AI reply from backend data
      const aiMessage = {
        sender: "ai",
        text: response.data.reply,   // backend sends { reply: "..." }
        timestamp: new Date().toISOString(),
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
            <div key={index} className={`message-row ${msg.sender}`}>
              {/* Timestamp node - outside bubble, expands on hover */}
              <span 
                className={`timestamp-node ${msg.sender}`}
                style={msg.sender === 'user' ? {
                  '--user-text-color': USER_COLORS[msg.color || 'magenta'].color,
                  '--user-glow-color': USER_COLORS[msg.color || 'magenta'].glow
                } : undefined}
              >
                <span className="timestamp-dot"></span>
                <span className="timestamp-text">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleString('en-US', { 
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  }) : ''}
                </span>
              </span>
              <div
                className={`message-bubble ${msg.sender === "user" ? "user" : "ai"} ${playingMessageIndex === index ? 'speaking' : ''}`}
                style={msg.sender === 'user' ? {
                  '--user-text-color': USER_COLORS[msg.color || 'magenta'].color,
                  '--user-glow-color': USER_COLORS[msg.color || 'magenta'].glow,
                  '--user-border-color': USER_COLORS[msg.color || 'magenta'].border,
                  color: USER_COLORS[msg.color || 'magenta'].color
                } : undefined}
              >
                {/* Aurora shader for Pneuma messages */}
                {msg.sender === "ai" && <div className="aurora-shader"></div>}
                <span className="message-text">{msg.text}</span>
                {/* Sound wave + Speaker button for AI messages */}
                {msg.sender === "ai" && (
                  <div className="message-audio-controls">
                    <SoundWave isPlaying={playingMessageIndex === index} barCount={5} />
                    <button 
                      className={`speaker-btn ${playingMessageIndex === index ? 'playing' : ''}`}
                      onClick={() => playMessage(msg.text, index)}
                      title={playingMessageIndex === index ? "Stop" : "Listen"}
                    >
                      <SpeakerIcon playing={playingMessageIndex === index} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT + SEND BUTTON */}
        <div className="input-container">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Talk to Pneuma..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{
              color: USER_COLORS[userColor]?.color,
              textShadow: `0 0 8px ${USER_COLORS[userColor]?.glow}, 0 0 15px ${USER_COLORS[userColor]?.glow}`
            }}
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
