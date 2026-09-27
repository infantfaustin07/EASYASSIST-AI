import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

export default function ModeToggle({ mode, setMode }) {
  const isElaborate = mode === 'elaborate' || mode === 'detailed';

  return (
    <div
      className="mode-toggle-container"
      role="radiogroup"
      aria-label="Answer Mode"
      style={{ fontFamily: "'Onest', sans-serif" }}
    >
      <button
        type="button"
        role="radio"
        aria-checked={!isElaborate}
        className={`mode-toggle-btn ${!isElaborate ? 'active' : ''}`}
        onClick={() => setMode('simple')}
        title="Simple Mode: Beginner-friendly, plain words, short steps, examples"
      >
        <Sparkles size={13} />
        <span>Simple Mode</span>
        <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', opacity: 0.75 }}>簡易</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={isElaborate}
        className={`mode-toggle-btn ${isElaborate ? 'active' : ''}`}
        onClick={() => setMode('elaborate')}
        title="Elaborate Mode: Deep, comprehensive breakdown with technical architecture, formulas, code, and edge cases"
      >
        <BookOpen size={13} />
        <span>Elaborate Mode</span>
        <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', opacity: 0.75 }}>詳細</span>
      </button>
    </div>
  );
}
