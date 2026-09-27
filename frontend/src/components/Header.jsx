import React from 'react';
import { Menu, ArrowLeft, Sparkles, Orbit } from 'lucide-react';
import ModeToggle from './ModeToggle';

export default function Header({
  mode,
  setMode,
  onToggleMobileMenu,
  onNavigateHome,
}) {
  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle sidebar menu"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          onClick={onNavigateHome}
          className="action-btn"
          title="Return to 3D Landing Page"
          style={{
            padding: '7px 14px',
            border: '1px solid rgba(223, 231, 224, 0.12)',
            borderRadius: '9999px',
            background: 'rgba(223, 231, 224, 0.04)',
            color: 'var(--bone)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontFamily: "'Onest', sans-serif",
            letterSpacing: '0.04em',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(224, 35, 28, 0.5)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(223, 231, 224, 0.12)';
            e.currentTarget.style.color = 'var(--bone)';
          }}
        >
          <ArrowLeft size={14} color="#e0231c" />
          <span>3D Sanctuary</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.12em' }}>概要</span>
        </button>

        <div className="chat-header-title">
          <div className="chat-title-text" style={{ fontFamily: "'Onest', sans-serif" }}>
            <span>EasyAssist AI</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-dim)', letterSpacing: '0.18em' }}>明解</span>
            <div className="chat-status-pill">
              <span className="status-dot" />
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>
    </header>
  );
}
