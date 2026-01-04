import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CloseIcon, ExpandIcon, CollapseIcon, FileIcon } from './Icons';
import highlightCode from './syntaxHighlight';
import './Modal.css';

// Global z-index counter for modal stacking
let globalZIndex = 1000;

/**
 * Popover Modal Component
 * 
 * Features:
 * - Appears as small popover beside clicked element
 * - Can be expanded to full centered view
 * - Multiple modals can be open simultaneously
 * - Draggable by header
 * - Resizable by corner handle
 * - Click to bring to front
 * - Syntax highlighted code blocks
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  icon: IconComponent,
  layer, 
  children, 
  isNested = false,
  anchorEl = null,
  initialExpanded = false,
  modalId = null
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [zIndex, setZIndex] = useState(globalZIndex);
  const [position, setPosition] = useState({ top: 100, left: 100 });
  const [size, setSize] = useState({ width: 420, height: 450 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  
  const modalRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Calculate initial position based on anchor element
  useEffect(() => {
    if (isOpen && anchorEl && !isExpanded && !hasBeenDragged) {
      const rect = anchorEl.getBoundingClientRect();
      const modalWidth = size.width;
      const modalHeight = size.height;
      const padding = 20;
      
      let left = rect.right + padding;
      let top = rect.top;
      
      if (left + modalWidth > window.innerWidth - padding) {
        left = rect.left - modalWidth - padding;
      }
      
      if (left < padding) {
        left = Math.max(padding, (window.innerWidth - modalWidth) / 2);
      }
      
      if (top + modalHeight > window.innerHeight - padding) {
        top = window.innerHeight - modalHeight - padding;
      }
      
      if (top < padding) {
        top = padding;
      }
      
      setPosition({ top, left });
    }
  }, [isOpen, anchorEl, isExpanded, hasBeenDragged, size.width, size.height]);

  // Bring to front when opened
  useEffect(() => {
    if (isOpen) {
      globalZIndex++;
      setZIndex(globalZIndex);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasBeenDragged(false);
      setSize({ width: 420, height: 450 });
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Bring modal to front on click
  const bringToFront = useCallback(() => {
    globalZIndex++;
    setZIndex(globalZIndex);
  }, []);

  // Drag handlers
  const handleDragStart = useCallback((e) => {
    if (isExpanded) return;
    e.preventDefault();
    
    bringToFront();
    setIsDragging(true);
    setHasBeenDragged(true);
    
    const rect = modalRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, [isExpanded, bringToFront]);

  const handleDrag = useCallback((e) => {
    if (!isDragging) return;
    
    const newLeft = e.clientX - dragOffset.current.x;
    const newTop = e.clientY - dragOffset.current.y;
    
    // Keep within bounds
    const maxLeft = window.innerWidth - 100;
    const maxTop = window.innerHeight - 50;
    
    setPosition({
      left: Math.max(0, Math.min(maxLeft, newLeft)),
      top: Math.max(0, Math.min(maxTop, newTop))
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Resize handlers
  const handleResizeStart = useCallback((e) => {
    if (isExpanded) return;
    e.preventDefault();
    e.stopPropagation();
    
    bringToFront();
    setIsResizing(true);
    
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    };
  }, [isExpanded, bringToFront, size]);

  const handleResize = useCallback((e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStart.current.x;
    const deltaY = e.clientY - resizeStart.current.y;
    
    const newWidth = Math.max(300, resizeStart.current.width + deltaX);
    const newHeight = Math.max(200, resizeStart.current.height + deltaY);
    
    setSize({
      width: Math.min(window.innerWidth - 40, newWidth),
      height: Math.min(window.innerHeight - 40, newHeight)
    });
  }, [isResizing]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Global mouse event listeners for drag/resize
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResize, handleResizeEnd]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      ref={modalRef}
      className={`modal-container ${isExpanded ? 'expanded' : 'popover'} ${isNested ? 'nested' : ''} layer-${layer || 'default'} ${isDragging ? 'dragging' : ''}`}
      style={!isExpanded ? { 
        top: position.top, 
        left: position.left,
        width: size.width,
        height: size.height,
        zIndex
      } : undefined}
      onClick={(e) => {
        e.stopPropagation();
        bringToFront();
      }}
      onMouseDown={bringToFront}
    >
      <div 
        className="modal-header"
        onMouseDown={handleDragStart}
        style={{ cursor: isExpanded ? 'default' : 'move' }}
      >
        <div className="modal-title-area">
          {IconComponent && (
            <span className="modal-icon">
              <IconComponent />
            </span>
          )}
          <h2>{title}</h2>
          {layer && <span className={`modal-layer-badge ${layer}`}>{layer}</span>}
        </div>
        <div className="modal-controls" onMouseDown={(e) => e.stopPropagation()}>
          <button 
            className="modal-control-btn expand-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse to popover' : 'Expand to fullscreen'}
          >
            {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
          </button>
          <button className="modal-control-btn close-btn" onClick={onClose} title="Close">
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className="modal-body">
        {children}
      </div>
      {/* Resize handle - only in popover mode */}
      {!isExpanded && (
        <div 
          className="modal-resize-handle"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );

  if (isExpanded) {
    return (
      <div className={`modal-overlay ${isNested ? 'nested' : ''}`} onClick={onClose} style={{ zIndex }}>
        {modalContent}
      </div>
    );
  }

  return modalContent;
};

// ============================================
// MODAL SUB-COMPONENTS
// ============================================

export const ModalSection = ({ title, children }) => (
  <div className="modal-section">
    {title && <h3>{title}</h3>}
    {children}
  </div>
);

export const ModalFilePath = ({ path }) => (
  <div className="modal-file-path">
    <span className="file-icon"><FileIcon /></span>
    {path}
  </div>
);

export const ModalCodeBlock = ({ children }) => {
  const codeString = typeof children === 'string' ? children : String(children);
  const highlightedCode = highlightCode(codeString);
  
  return (
    <pre className="modal-code-block">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
};

export const ModalFlow = ({ steps }) => (
  <div className="modal-flow">
    {steps.map((step, i) => (
      <div className="modal-flow-step" key={i}>
        <span className="modal-flow-number">{i + 1}</span>
        <div className="modal-flow-content">
          <strong>{step.title}</strong>
          <p>{step.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

export const ModalLink = ({ onClick, children }) => (
  <span className="modal-link" onClick={onClick}>{children}</span>
);

export const ModalInfoCard = ({ title, desc, icon, onClick }) => {
  // Handle both SVG components and emoji strings
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <span className="card-icon"><IconComponent /></span>;
    }
    return <span className="card-emoji">{icon}</span>;
  };
  
  return (
    <div className="modal-info-card" onClick={onClick}>
      <h4>
        {renderIcon()}
        {title}
        <span className="card-arrow">→</span>
      </h4>
      <p>{desc}</p>
    </div>
  );
};

export const ModalExample = ({ label = "Example", children }) => (
  <div className="modal-example">
    <div className="modal-example-label">{label}</div>
    <div className="modal-example-content">{children}</div>
  </div>
);

export const ModalDesc = ({ children, style }) => (
  <p className="modal-desc" style={style}>{children}</p>
);

export const ModalTagGrid = ({ children }) => (
  <div className="modal-tag-grid">{children}</div>
);

export const ModalTag = ({ name, desc, score, onClick }) => (
  <div className="modal-tag" onClick={onClick}>
    <span className="tag-name">{name}</span>
    {desc && <span className="tag-desc">{desc}</span>}
    {score && <span className="tag-score">{score}</span>}
  </div>
);

export const ModalPrompt = ({ children }) => (
  <div className="modal-prompt-display">{children}</div>
);

export const ModalInfoGrid = ({ children }) => (
  <div className="modal-info-grid">{children}</div>
);

export default Modal;
