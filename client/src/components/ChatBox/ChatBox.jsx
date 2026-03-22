import { useState, useEffect, useRef, memo, useCallback, useMemo } from "react";
import "./ChatBox.css";
import { API_ENDPOINTS, API_BASE_URL } from "../../config/api";
import SoundWave from "../SoundWave/SoundWave";

// User text color options
const USER_COLORS = {
  magenta: {
    color: "#ff44dd",
    glow: "rgba(255, 68, 221, 0.4)",
    border: "rgba(255, 68, 221, 0.6)",
  },
  white: {
    color: "#ffffff",
    glow: "rgba(255, 255, 255, 0.3)",
    border: "rgba(255, 255, 255, 0.5)",
  },
  blue: {
    color: "#00d4ff",
    glow: "rgba(0, 212, 255, 0.4)",
    border: "rgba(0, 212, 255, 0.6)",
  },
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
    className={playing ? "speaker-playing" : ""}
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

// Memoized message row — only re-renders when its own props change
const MessageRow = memo(function MessageRow({
  msg,
  index,
  playingMessageIndex,
  playMessage,
}) {
  const userStyle =
    msg.sender === "user"
      ? {
          "--user-text-color": USER_COLORS[msg.color || "magenta"].color,
          "--user-glow-color": USER_COLORS[msg.color || "magenta"].glow,
        }
      : undefined;

  const bubbleStyle =
    msg.sender === "user"
      ? {
          "--user-text-color": USER_COLORS[msg.color || "magenta"].color,
          "--user-glow-color": USER_COLORS[msg.color || "magenta"].glow,
          "--user-border-color": USER_COLORS[msg.color || "magenta"].border,
          color: USER_COLORS[msg.color || "magenta"].color,
        }
      : undefined;

  const formattedTime = useMemo(() => {
    if (!msg.timestamp) return "";
    return new Date(msg.timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, [msg.timestamp]);

  const isPlaying = playingMessageIndex === index;

  return (
    <div className={`message-row ${msg.sender}`}>
      <span className={`timestamp-node ${msg.sender}`} style={userStyle}>
        <span className="timestamp-dot"></span>
        <span className="timestamp-text">{formattedTime}</span>
      </span>
      <div
        className={`message-bubble ${msg.sender === "user" ? "user" : "ai"} ${isPlaying ? "speaking" : ""}`}
        style={bubbleStyle}
      >
        {msg.sender === "ai" && <div className="aurora-shader"></div>}
        <span className="message-text">{msg.text}</span>
        {msg.sender === "ai" && (
          <div className="message-audio-controls">
            <SoundWave isPlaying={isPlaying} barCount={5} />
            <button
              className={`speaker-btn ${isPlaying ? "playing" : ""}`}
              onClick={() => playMessage(msg.text, index)}
              title={isPlaying ? "Stop" : "Listen"}
            >
              <SpeakerIcon playing={isPlaying} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

function ChatBox({
  onProcessingChange,
  onEngineChange,
  conversationId,
  onNewConversation,
}) {
  // Fullscreen toggle state
  const [isFullscreen, setIsFullscreen] = useState(false);
  /*
    messages: array that stores all chat messages
    setMessages: function to update the messages array
  */
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hey Pablo, I'm Pneuma. Talk to me. ",
      timestamp: new Date().toISOString(),
    },
  ]);

  // Track which conversation is currently loaded
  const [loadedConversationId, setLoadedConversationId] = useState(null);

  // Load conversation when conversationId changes
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;

      // If same conversation, don't reload
      if (conversationId === loadedConversationId) return;

      // Don't wipe messages while a response is streaming
      if (isStreaming.current) return;

      // If it's a new conversation (starts with 'conv-'), try to load it
      // If it doesn't exist on server yet, start fresh
      try {
        const res = await fetch(
          `${API_BASE_URL}/conversations/${conversationId}`,
        );
        if (res.ok) {
          const data = await res.json();
          isLoadingConversation.current = true;
          if (data.messages?.length > 0) {
            setMessages(data.messages);
          } else {
            // Conversation exists but has no messages - start fresh
            setMessages([
              { sender: "ai", text: "Hey Pablo, I'm Pneuma. Talk to me. " },
            ]);
          }
        } else {
          // Conversation doesn't exist on server - it's a new one, start fresh
          isLoadingConversation.current = true;
          setMessages([
            { sender: "ai", text: "Hey Pablo, I'm Pneuma. Talk to me. " },
          ]);
        }
        setLoadedConversationId(conversationId);
      } catch (error) {
        console.error("Failed to load conversation:", error);
        // On error, start fresh
        isLoadingConversation.current = true;
        setMessages([
          { sender: "ai", text: "Hey Pablo, I'm Pneuma. Talk to me. " },
        ]);
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
  const [userColor, setUserColor] = useState("magenta");

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
  const playMessage = useCallback(
    async (text, index) => {
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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          console.error("TTS request failed");
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

        audio.onerror = (e) => {
          console.error("Audio playback error:", e);
          setPlayingMessageIndex(null);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        };

        // Await play() - browsers can reject it
        await audio.play().catch((err) => {
          console.error("Audio play failed:", err);
          setPlayingMessageIndex(null);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        });
      } catch (error) {
        console.error("TTS error:", error);
        setPlayingMessageIndex(null);
      }
    },
    [playingMessageIndex],
  );

  /*
    autoResizeTextarea: adjusts textarea height based on content
  */
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = 150; // Max ~5 lines
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    }
  };

  /*
    resetTextareaHeight: resets textarea to single line
  */
  const resetTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  // Track if scroll should be instant (first render or conversation load)
  const isFirstRender = useRef(true);
  const isLoadingConversation = useRef(false);
  // Prevent loadConversation from wiping messages while a stream is active
  const isStreaming = useRef(false);
  // Whether the user has scrolled up away from the bottom
  const userScrolledUp = useRef(false);
  const messagesContainerRef = useRef(null);

  /*
    scrollToBottom: scrolls to the bottom of messages
    - instant on first load or conversation switch (no disorienting animation)
    - smooth on new messages
  */
  const scrollToBottom = (instant = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: instant ? "instant" : "smooth",
    });
  };

  // Track scroll position and restore it on container resize
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Distance from bottom, kept up-to-date by the scroll handler
    let distanceFromBottom = 0;

    const handleScroll = () => {
      distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      // Consider "at bottom" if within 80px
      userScrolledUp.current = distanceFromBottom > 80;
    };

    // On resize, restore the same distance-from-bottom so the view doesn't jump
    const observer = new ResizeObserver(() => {
      const target =
        container.scrollHeight - container.clientHeight - distanceFromBottom;
      container.scrollTop = Math.max(0, target);
    });

    container.addEventListener("scroll", handleScroll, { passive: true });
    observer.observe(container);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  /*
    useEffect: scroll to bottom when messages change
    - skips auto-scroll if the user has scrolled up (let them read)
    - always scrolls on first render, conversation load, or when user sends a message
  */
  useEffect(() => {
    if (isFirstRender.current || isLoadingConversation.current) {
      // First render or conversation load: instant, no animation
      scrollToBottom(true);
      isFirstRender.current = false;
      isLoadingConversation.current = false;
    } else if (!userScrolledUp.current) {
      // New chunk or message: only scroll if user is already at the bottom
      scrollToBottom(false);
    }
  }, [messages]);

  /*
    handleSend():
    Runs when you click "Send" or press Enter.
    1. Adds user message immediately.
    2. Opens SSE stream to /chat — text appears word-by-word as Claude generates it.
    3. On "done" event, finalizes the message with engine metadata.
  */
  async function handleSend() {
    if (!input.trim()) return;

    const messageText = input.trim();
    setInput("");
    resetTextareaHeight();
    userScrolledUp.current = false; // re-lock to bottom for new response

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: messageText,
        timestamp: new Date().toISOString(),
        color: userColor,
      },
    ]);

    onProcessingChange?.(true);
    const engines = ["memory", "archetype", "reflection", "synthesis"];
    let engineIndex = 0;
    const engineCycle = setInterval(() => {
      onEngineChange?.(engines[engineIndex % engines.length]);
      engineIndex++;
    }, 200);

    // Add a placeholder AI message that we'll build up chunk by chunk
    const aiMsgIndex = { current: null };
    setMessages((prev) => {
      aiMsgIndex.current = prev.length;
      return [
        ...prev,
        {
          sender: "ai",
          text: "",
          timestamp: new Date().toISOString(),
          streaming: true,
        },
      ];
    });

    try {
      isStreaming.current = true;
      const response = await fetch(API_ENDPOINTS.chat, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let event;
          try {
            event = JSON.parse(line.slice(6));
          } catch {
            continue;
          }

          if (event.type === "chunk") {
            setMessages((prev) => {
              const next = [...prev];
              const idx = aiMsgIndex.current;
              if (idx !== null && next[idx]) {
                next[idx] = { ...next[idx], text: next[idx].text + event.text };
              }
              return next;
            });
          } else if (event.type === "reset") {
            // Eval triggered regeneration — clear the in-progress message
            setMessages((prev) => {
              const next = [...prev];
              const idx = aiMsgIndex.current;
              if (idx !== null && next[idx]) {
                next[idx] = { ...next[idx], text: "" };
              }
              return next;
            });
          } else if (event.type === "done") {
            isStreaming.current = false;
            clearInterval(engineCycle);
            onEngineChange?.(event.engine || null);
            // Mark streaming complete
            setMessages((prev) => {
              const next = [...prev];
              const idx = aiMsgIndex.current;
              if (idx !== null && next[idx]) {
                next[idx] = { ...next[idx], streaming: false };
              }
              return next;
            });
            setTimeout(() => {
              onEngineChange?.(null);
              onProcessingChange?.(false);
            }, 1500);
          } else if (event.type === "error") {
            isStreaming.current = false;
            clearInterval(engineCycle);
            setMessages((prev) => {
              const next = [...prev];
              const idx = aiMsgIndex.current;
              if (idx !== null && next[idx]) {
                next[idx] = {
                  ...next[idx],
                  text: event.reply || "Something went sideways.",
                  streaming: false,
                };
              }
              return next;
            });
            onProcessingChange?.(false);
            onEngineChange?.(null);
          }
        }
      }
    } catch (error) {
      isStreaming.current = false;
      console.error("Error talking to backend:", error);
      clearInterval(engineCycle);
      onProcessingChange?.(false);
      onEngineChange?.(null);
      setMessages((prev) => {
        const next = [...prev];
        const idx = aiMsgIndex.current;
        if (idx !== null && next[idx]) {
          next[idx] = {
            ...next[idx],
            text: "Error: Could not reach server.",
            streaming: false,
          };
        }
        return next;
      });
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
      className={`chat-wrapper${isFullscreen ? " fullscreen" : ""}`}
      style={{
        "--user-text-color": USER_COLORS[userColor].color,
        "--user-glow-color": USER_COLORS[userColor].glow,
        "--user-border-color": USER_COLORS[userColor].border,
      }}
    >
      <div className="chat-container">
        {/* FULLSCREEN TOGGLE BUTTON */}
        <button
          className={`fullscreen-toggle${isFullscreen ? " active" : ""}`}
          onClick={() => setIsFullscreen((f) => !f)}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Chat"}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {isFullscreen ? (
              <>
                <polyline points="4 14 4 20 10 20" />
                <polyline points="20 10 20 4 14 4" />
                <line x1="14" y1="10" x2="20" y2="4" />
                <line x1="4" y1="20" x2="10" y2="14" />
              </>
            ) : (
              <>
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </>
            )}
          </svg>
        </button>

        {/* COLOR PICKER */}
        <div className="color-picker">
          <span className="color-label">YOUR COLOR</span>
          <div className="color-options">
            <button
              className={`color-btn magenta ${userColor === "magenta" ? "active" : ""}`}
              onClick={() => setUserColor("magenta")}
              title="Magenta"
            />
            <button
              className={`color-btn white ${userColor === "white" ? "active" : ""}`}
              onClick={() => setUserColor("white")}
              title="White"
            />
            <button
              className={`color-btn blue ${userColor === "blue" ? "active" : ""}`}
              onClick={() => setUserColor("blue")}
              title="Electric Blue"
            />
          </div>
        </div>

        {/* MESSAGE LIST */}
        <div className="messages-container" ref={messagesContainerRef}>
          {messages.map((msg, index) => (
            <MessageRow
              key={index}
              msg={msg}
              index={index}
              playingMessageIndex={playingMessageIndex}
              playMessage={playMessage}
            />
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
              textShadow: `0 0 8px ${USER_COLORS[userColor]?.glow}, 0 0 15px ${USER_COLORS[userColor]?.glow}`,
            }}
          />
          <button className="send-button" onClick={handleSend}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="btn-scan"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
