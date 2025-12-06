import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ conversations, activeId, onSelect, onNewChat, onDelete }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDelete = (e, convId) => {
    e.preventDefault(); // Prevent browser context menu
    e.stopPropagation();
    if (onDelete && confirm('Delete this session?')) {
      onDelete(convId);
    }
  };

  return (
    <>
      {/* Toggle button - vertical control strip */}
      <button 
        className={`sidebar-toggle ${isCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      />

      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {!isCollapsed && (
          <>
            {/* Panel Header - Status Section */}
            <div className="panel-header">
              <div className="status-row">
                <span className="status-light"></span>
                <span className="status-text">Orpheus</span>
              </div>
              
              {/* New chat button - command style */}
              <button className="new-chat-btn" onClick={onNewChat} title="New Session">
                <svg className="plus-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>New Session</span>
              </button>
            </div>

            {/* Conversation list - Data Stream Section */}
            <div className="conversation-list">
              <div className="list-header">Session Log</div>
              {conversations.length === 0 ? (
                <div className="empty-state">// awaiting input</div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    className={`conversation-item ${activeId === conv.id ? 'active' : ''}`}
                    onClick={() => onSelect(conv.id)}
                    onContextMenu={(e) => handleDelete(e, conv.id)}
                  >
                    <span className="conv-title">{conv.title || 'Untitled Session'}</span>
                    <span className="conv-date">{conv.date}</span>
                  </button>
                ))
              )}
            </div>

            {/* Panel Footer - System Info */}
            <div className="panel-footer">
              <span className="system-version">ORPHEUS v2.0</span>
              <span className="system-status">
                <span className="status-dot"></span>
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Sidebar;
