import { useState, useRef } from 'react';
import './Sidebar.css';

function Sidebar({ conversations, activeId, onSelect, onNewChat, onDelete }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const lastClickedIndex = useRef(null);

  // Handle click with shift for multi-select
  const handleItemClick = (e, convId, index) => {
    if (e.shiftKey && lastClickedIndex.current !== null) {
      // Shift+click: select range
      const start = Math.min(lastClickedIndex.current, index);
      const end = Math.max(lastClickedIndex.current, index);
      const newSelected = new Set(selectedIds);
      for (let i = start; i <= end; i++) {
        newSelected.add(conversations[i].id);
      }
      setSelectedIds(newSelected);
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd+click: toggle single selection
      const newSelected = new Set(selectedIds);
      if (newSelected.has(convId)) {
        newSelected.delete(convId);
      } else {
        newSelected.add(convId);
      }
      setSelectedIds(newSelected);
      lastClickedIndex.current = index;
    } else {
      // Regular click: clear selection and select conversation
      setSelectedIds(new Set());
      lastClickedIndex.current = index;
      onSelect(convId);
    }
  };

  // Handle right-click for delete
  const handleContextMenu = (e, convId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If right-clicked item is not in selection, select only that one
    if (!selectedIds.has(convId)) {
      setSelectedIds(new Set([convId]));
    }
    
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (onDelete) {
      selectedIds.forEach(id => onDelete(id));
    }
    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Clear selection when clicking elsewhere
  const handleListClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedIds(new Set());
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
                <span className="status-text">Pneuma</span>
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
            <div className="conversation-list" onClick={handleListClick}>
              <div className="list-header">
                Session Log
                {selectedIds.size > 0 && (
                  <span className="selection-count">({selectedIds.size} selected)</span>
                )}
              </div>
              {conversations.length === 0 ? (
                <div className="empty-state">// awaiting input</div>
              ) : (
                conversations.map((conv, index) => (
                  <button
                    key={conv.id}
                    className={`conversation-item ${activeId === conv.id ? 'active' : ''} ${selectedIds.has(conv.id) ? 'selected' : ''}`}
                    onClick={(e) => handleItemClick(e, conv.id, index)}
                    onContextMenu={(e) => handleContextMenu(e, conv.id)}
                  >
                    <span className="conv-title">{conv.title || 'Untitled Session'}</span>
                    <span className="conv-date">{conv.date}</span>
                  </button>
                ))
              )}
              
              {/* Delete Confirmation Modal - inline in sidebar */}
              {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                  <div className="delete-confirm-modal">
                    <div className="delete-confirm-icon">⚠</div>
                    <div className="delete-confirm-text">
                      Delete {selectedIds.size === 1 ? 'this session' : `${selectedIds.size} sessions`}?
                    </div>
                    <div className="delete-confirm-buttons">
                      <button className="delete-btn cancel" onClick={cancelDelete}>
                        Cancel
                      </button>
                      <button className="delete-btn confirm" onClick={confirmDelete}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Panel Footer - System Info */}
            <div className="panel-footer">
              <span className="system-version">PNEUMA v2.0</span>
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
