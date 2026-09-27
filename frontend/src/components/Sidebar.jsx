import React, { useState } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Settings,
  Info,
  Sparkles,
  X,
  Layers,
} from 'lucide-react';
import { groupChatsByDate } from '../utils/dateGrouper';

export default function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  searchQuery,
  setSearchQuery,
  isOpen,
  onClose,
  onOpenSettings,
  onOpenAbout,
  onNavigateHome,
}) {
  const [chatToDelete, setChatToDelete] = useState(null);

  const groupedChats = groupChatsByDate(chats);

  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      onDeleteChat(chatToDelete._id);
      setChatToDelete(null);
    }
  };

  const renderGroup = (title, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div key={title} className="history-group">
        <div className="history-group-title">{title}</div>
        {items.map((chat) => (
          <div
            key={chat._id}
            className={`history-item ${chat._id === currentChatId ? 'active' : ''}`}
            onClick={() => {
              onSelectChat(chat._id);
              if (onClose) onClose();
            }}
          >
            <div className="history-item-content">
              <MessageSquare size={16} />
              <span className="history-item-title">{chat.title}</span>
            </div>

            <button
              type="button"
              className="history-item-delete"
              onClick={(e) => {
                e.stopPropagation();
                setChatToDelete(chat);
              }}
              title="Delete conversation"
              aria-label={`Delete ${chat.title}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button
            type="button"
            onClick={onNavigateHome}
            className="brand-logo"
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            title="Return to 3D Sanctuary Landing Page"
          >
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: "'Onest', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--bone)' }}>EasyAssist</span>
              <span style={{ fontSize: '0.66rem', letterSpacing: '0.18em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>案内 · SANCTUARY</span>
            </div>
          </button>

          {isOpen && (
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="sidebar-actions">
          <button
            type="button"
            className="btn-new-chat"
            onClick={() => {
              onNewChat();
              if (onClose) onClose();
            }}
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>

          <div className="search-box">
            <Search className="search-icon" size={15} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search conversations"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="sidebar-history">
          {chats.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
              Your conversations will appear here.
            </div>
          ) : (
            <>
              {renderGroup('Today · 今日', groupedChats.Today)}
              {renderGroup('Yesterday · 昨日', groupedChats.Yesterday)}
              {renderGroup('Earlier · 過去', groupedChats.Previous)}
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-footer-btn"
            onClick={onOpenSettings}
          >
            <Settings size={17} />
            <span>Settings & API</span>
          </button>

          <button
            type="button"
            className="sidebar-footer-btn"
            onClick={onOpenAbout}
          >
            <Info size={17} />
            <span>About EasyAssist</span>
          </button>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="modal-overlay" onClick={() => setChatToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: 'var(--accent-rose)' }}>
                <Trash2 size={18} /> Delete Conversation
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setChatToDelete(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              Are you sure you want to delete <strong>"{chatToDelete.title}"</strong>? This will permanently remove its message history.
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setChatToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDeleteConfirm}
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
