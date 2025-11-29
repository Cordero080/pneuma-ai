import { useState } from "react";
import axios from "axios";          // Used to send requests to the backend
import "./ChatBox.css";

function ChatBox() {
  /*
    messages: array that stores all chat messages
    setMessages: function to update the messages array
  */
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hey Pablo, I’m Orpheus. Talk to me. " }
  ]);

  /*
    input: value of the text box
    setInput: function to update the text box value
  */
  const [input, setInput] = useState("");

  /*
    handleSend():
    Runs when you click "Send" or press Enter.
    1. Adds user's message to chat immediately.
    2. Sends the message to the backend using Axios.
    3. Adds backend reply to chat when it returns.
  */
  async function handleSend() {
    if (!input.trim()) return;    // Prevent sending empty messages

    // STEP 1 — Create the user message
    const userMessage = { sender: "user", text: input };

    // STEP 2 — Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);

    try {
      // STEP 3 — Send message to backend (POST request)
      const response = await axios.post("http://localhost:3000/chat", {
        message: input,
      });

      // STEP 4 — Create AI reply from backend data
      const aiMessage = {
        sender: "ai",
        text: response.data.reply,   // backend sends { reply: "..." }
      };

      // STEP 5 — Add AI message to chat
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error talking to backend:", error);

      // OPTIONAL — show an error message in chat
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: Could not reach server." }
      ]);
    }

    // STEP 6 — Clear input field
    setInput("");
  }

  /*
    handleKeyDown:
    Allows pressing Enter to send message
  */
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        
        {/* MESSAGE LIST */}
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* INPUT + SEND BUTTON */}
        <div className="input-container">
          <input
            className="chat-input"
            type="text"
            placeholder="Talk to Orpheus..."
            value={input}
            onChange={(e) => setInput(e.target.value)}  // update input state
            onKeyDown={handleKeyDown}                   // send on Enter
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
