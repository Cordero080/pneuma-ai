import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ conversations, activeId, onSelect, onNewChat }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Toggle button - always visible */}
      <button 
        className={`sidebar-toggle ${isCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      />

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {!isCollapsed && (
          <>
            {/* New chat button - just a glowing plus */}
            <button className="new-chat-btn" onClick={onNewChat} title="New Chat">
              <svg className="plus-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Conversation list */}
            <div className="conversation-list">
              <div className="list-header">History</div>
              {conversations.length === 0 ? (
                <div className="empty-state">No conversations yet</div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    className={`conversation-item ${activeId === conv.id ? 'active' : ''}`}
                    onClick={() => onSelect(conv.id)}
                  >
                    <span className="conv-icon">💬</span>
                    <span className="conv-title">{conv.title || 'Untitled'}</span>
                    <span className="conv-date">{conv.date}</span>
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Sidebar;
