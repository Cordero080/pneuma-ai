// This is the main component
// Right now it just shows a placeholder text
// Next: turn this into a chat UI step by step
import { useState, useEffect } from "react";
import "./App.css"; // import the CSS file
import ChatBox from "./components/ChatBox";
import Title3D from "./components/Title3D";
import Sidebar from "./components/Sidebar";
import ConsciousnessIndicator from "./components/ConsciousnessIndicator";

function App() {
  // Conversation history state - starts empty, fetched from backend
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  // Consciousness engine state (will be updated by backend)
  const [activeEngine, setActiveEngine] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("http://localhost:3000/conversations");
        const data = await res.json();
        if (data.conversations?.length > 0) {
          //Sort by date to find most recent
          const sorted = [...data.conversations].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
          );
          setConversations(data.conversations);
          setActiveConversationId(sorted[0].id);// Select most recent
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    setConversations(prev => [
      { id: newId, title: "New conversation", date: "Now" },
      ...prev
    ]);
    setActiveConversationId(newId);
  };
// CHANGED: After deletion, select MOST RECENT conversation
  const handleDeleteChat = async (convId) => {
    // Try to delete from backend
    try {
      await fetch(`http://localhost:3000/conversations/${convId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error("Failed to delete from backend:", error);
    }
    
    // Update local state
    setConversations(prev => {
      const remaining = prev.filter(c => c.id !== convId);
      
      // If we deleted the active conversation, switch to first available
      if (activeConversationId === convId) {
        if (remaining.length > 0) {
           // Sort remaining to find most recent
           const sorted = [...remaining].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
          );
          setActiveConversationId(sorted[0].id);// Select most recent
        } else {
          setActiveConversationId(null);
        }
      }
      
      return remaining;
    });
  };

  // Sort conversations for display (most recent first)
  const sortedConversations = [...conversations].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="app-layout">
      <Sidebar 
        conversations={sortedConversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onNewChat={handleNewChat}
        onDelete={handleDeleteChat}
      />
      <div className="app-container">
        <Title3D />
        <ConsciousnessIndicator 
          activeEngine={activeEngine}
          isProcessing={isProcessing}
        />
        <ChatBox 
          onProcessingChange={setIsProcessing}
          onEngineChange={setActiveEngine}
          conversationId={activeConversationId}
          onNewConversation={(id) => setActiveConversationId(id)}
        />
      </div>
    </div>
  );
}

export default App;