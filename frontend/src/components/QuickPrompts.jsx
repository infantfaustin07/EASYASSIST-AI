import React from 'react';
import {
  ArrowUpRight,
  Code2,
  Cpu,
  GraduationCap,
  Lightbulb,
  Sparkles,
  BookOpen,
  Globe,
  Compass,
  Palette,
} from 'lucide-react';

const QUICK_PROMPTS = [
  {
    category: 'Science & Cosmos',
    jp: '宇宙',
    text: 'How do black holes bend time and space?',
    icon: Globe,
    color: '#e0231c',
  },
  {
    category: 'Software & Code',
    jp: '開発',
    text: 'How do LLMs and transformer self-attention work?',
    icon: Code2,
    color: '#ff5533',
  },
  {
    category: 'World History',
    jp: '歴史',
    text: 'What were the main catalysts of the Industrial Revolution?',
    icon: Compass,
    color: '#34d399',
  },
  {
    category: 'Math & Logic',
    jp: '数理',
    text: 'Explain Euler\'s identity e^(iπ) + 1 = 0 in simple terms',
    icon: Cpu,
    color: '#38bdf8',
  },
  {
    category: 'Philosophy & Thought',
    jp: '哲学',
    text: 'Compare Stoicism and Existentialism on handling adversity',
    icon: Lightbulb,
    color: '#fbbf24',
  },
  {
    category: 'Creative & Writing',
    jp: '創作',
    text: 'Write a compelling concept outline for an original sci-fi mystery',
    icon: Palette,
    color: '#a78bfa',
  },
];

export default function QuickPrompts({ onSelectPrompt, mode = 'simple', setMode }) {
  const isElaborate = mode === 'elaborate' || mode === 'detailed';

  return (
    <div className="empty-chat-state">
      <div className="empty-state-badge">
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#e0231c', boxShadow: '0 0 8px #e0231c' }} />
        <span>Universal AI Intelligence · 案内</span>
      </div>

      <h1 className="empty-state-title" style={{ fontFamily: "'Onest', sans-serif" }}>
        Ask anything about everything in the world.
      </h1>

      <p className="empty-state-subtitle" style={{ fontFamily: "'Onest', sans-serif", maxWidth: '640px', margin: '0 auto 20px' }}>
        {isElaborate
          ? '⚡ Elaborate Mode active: Comprehensive, structured breakdowns, full code snippets, and deep mechanics across every discipline.'
          : '✨ Simple Mode active: Crystal-clear, jargon-free explanations with relatable everyday analogies designed for everyone.'}
      </p>

      {/* Prominent Dual Experience Selector */}
      {setMode && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid rgba(223, 231, 224, 0.12)',
            borderRadius: '9999px',
            padding: '5px 8px',
            marginBottom: '32px',
            fontFamily: "'Onest', sans-serif",
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <button
            type="button"
            onClick={() => setMode('simple')}
            className={`mode-toggle-btn ${!isElaborate ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <Sparkles size={13} />
            <span>Simple Mode · 簡易</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('elaborate')}
            className={`mode-toggle-btn ${isElaborate ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <BookOpen size={13} />
            <span>Elaborate Mode · 詳細</span>
          </button>
        </div>
      )}

      <div className="quick-prompts-grid">
        {QUICK_PROMPTS.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              type="button"
              className="quick-prompt-card"
              onClick={() => onSelectPrompt(item.text)}
              aria-label={`${item.category}: ${item.text}`}
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              <div className="prompt-card-category" style={{ color: item.color }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} />
                  <span>{item.category}</span>
                </span>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', opacity: 0.65 }}>{item.jp}</span>
              </div>
              <div className="prompt-card-text" style={{ marginTop: '4px' }}>
                "{item.text}"
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                <span style={{ opacity: 0.8 }}>
                  {!isElaborate ? '✨ ELI5 explanation' : '⚡ Deep breakdown'}
                </span>
                <ArrowUpRight size={15} style={{ opacity: 0.7 }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
