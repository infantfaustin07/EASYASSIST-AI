import React from 'react';
import { X, Sparkles, Target, CheckCircle2 } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', fontFamily: "'Onest', sans-serif" }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ fontFamily: "'Onest', sans-serif" }}>
            <Sparkles size={20} color="#e0231c" />
            <span>About EasyAssist AI</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '0.15em', fontWeight: 400 }}>案内</span>
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>
            <strong>EasyAssist AI</strong> is engineered to eliminate cognitive friction.
            Instead of dense, academic jargon, it delivers clear explanations, tangible analogies, concrete examples, and practical guidance.
          </p>

          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(224, 35, 28, 0.08)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(224, 35, 28, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: 'var(--accent-amber)', marginBottom: '4px', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.12em' }}>
              <Target size={16} /> Core Mission
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>
              Where complex ideas become clear and simple.
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '12px', fontSize: '0.9rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Capabilities & Features
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                'Dual-mode answering (Simple / Detailed)',
                'Interactive voice dictation & speech',
                'Multi-topic domain expertise',
                'Syntax-highlighted code blocks',
                'Date-grouped conversation history',
                'Resilient local & MongoDB storage',
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={15} color="#e0231c" style={{ flexShrink: 0 }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
            Powered by ThreeUI Kage Aesthetics, React, Node.js, Express, and MongoDB.
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
