// This is the main component
// Right now it just shows a placeholder text
// Next: turn this into a chat UI step by step
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import "./App.css"; // import the CSS file
import ChatBox from "./components/ChatBox/ChatBox";
import Title3D from "./components/Title3D/Title3D";
import Sidebar from "./components/Sidebar/Sidebar";
import ConsciousnessIndicator from "./components/ConsciousnessIndicator/ConsciousnessIndicator";
import ArchitectureDiagram from "./components/ArchitectureDiagram/ArchitectureDiagram";
import CreativeBreakthrough from "./components/ArchitectureDiagram/CaseStudy/CreativeBreakthrough";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Conversation history state - starts empty, fetched from backend
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  // Consciousness engine state (will be updated by backend)
  const [activeEngine, setActiveEngine] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check if we're on architecture page (including sub-pages)
  const isArchitectureView = location.pathname.startsWith('/architecture');

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("http://localhost:3000/conversations");
        const data = await res.json();
        if (data.conversations?.length > 0) {
          // Sort by ID timestamp to find most recent
          const sorted = [...data.conversations].sort((a, b) => {
            const getTimestamp = (id) => {
              const match = id?.match(/conv-(\d+)/);
              return match ? parseInt(match[1], 10) : 0;
            };
            return getTimestamp(b.id) - getTimestamp(a.id);
          });
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
           const sorted = [...remaining].sort((a, b) => {
            const getTimestamp = (id) => {
              const match = id?.match(/conv-(\d+)/);
              return match ? parseInt(match[1], 10) : 0;
            };
            return getTimestamp(b.id) - getTimestamp(a.id);
          });
          setActiveConversationId(sorted[0].id);// Select most recent
        } else {
          setActiveConversationId(null);
        }
      }
      
      return remaining;
    });
  };

  // Sort conversations for display (most recent first)
  const sortedConversations = [...conversations].sort((a, b) => {
    const getTimestamp = (id) => {
      const match = id?.match(/conv-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };
    return getTimestamp(b.id) - getTimestamp(a.id);
  });

  return (
    <div className="app-layout">
      <Sidebar 
        conversations={sortedConversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onNewChat={handleNewChat}
        onDelete={handleDeleteChat}
        onShowArchitecture={() => navigate('/architecture')}
        isArchitectureView={isArchitectureView}
        onBackToChat={() => navigate('/')}
      />
      
      {/* Route-based rendering: Architecture Diagram or Chat View */}
      <Routes>
        <Route path="/architecture" element={
          <ArchitectureDiagram onBack={() => navigate('/')} />
        } />
        <Route path="/architecture/case-study" element={
          <CreativeBreakthrough onBack={() => navigate('/architecture')} />
        } />
        <Route path="/" element={
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
        } />
        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;