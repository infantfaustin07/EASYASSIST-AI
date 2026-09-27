import React, { useRef, useEffect } from 'react';
import { Send, X, Mic, MicOff, Sparkles, BookOpen } from 'lucide-react';

export default function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
  isListening,
  onToggleMic,
  speechSupported,
  mode,
  setMode,
}) {
  const textareaRef = useRef(null);
  const isElaborate = mode === 'elaborate' || mode === 'detailed';

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  const handleClear = () => {
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  return (
    <div className="chat-input-area">
      <div className="chat-input-container">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isElaborate ? "Ask a complex topic for deep, elaborate breakdown..." : "Ask me anything simply..."}
          disabled={isLoading}
          aria-label="Ask a question"
        />

        <div className="chat-input-toolbar">
          <div className="toolbar-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {speechSupported && (
              <button
                type="button"
                className={`input-tool-btn ${isListening ? 'recording' : ''}`}
                onClick={onToggleMic}
                title={isListening ? 'Stop voice listening' : 'Voice input (Speech to text)'}
                aria-label="Voice input"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            {input.length > 0 && (
              <button
                type="button"
                className="input-tool-btn"
                onClick={handleClear}
                title="Clear input"
                aria-label="Clear input"
              >
                <X size={16} />
              </button>
            )}

            {/* Quick Interactive Mode Switcher */}
            {setMode && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(223, 231, 224, 0.05)',
                  borderRadius: '9999px',
                  padding: '2px',
                  border: '1px solid rgba(223, 231, 224, 0.08)',
                  fontFamily: "'Onest', sans-serif",
                }}
              >
                <button
                  type="button"
                  onClick={() => setMode('simple')}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: !isElaborate ? 'var(--primary)' : 'transparent',
                    color: !isElaborate ? '#ffffff' : 'var(--text-dim)',
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                    boxShadow: !isElaborate ? '0 2px 10px rgba(224, 35, 28, 0.4)' : 'none',
                  }}
                  title="Simple Mode: Beginner-friendly, plain words, short steps, examples"
                >
                  <Sparkles size={11} />
                  <span>Simple · 簡易</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('elaborate')}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: isElaborate ? 'var(--primary)' : 'transparent',
                    color: isElaborate ? '#ffffff' : 'var(--text-dim)',
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
                    boxShadow: isElaborate ? '0 2px 10px rgba(224, 35, 28, 0.4)' : 'none',
                  }}
                  title="Elaborate Mode: Comprehensive in-depth explanation with technical depth, architecture, and edge cases"
                >
                  <BookOpen size={11} />
                  <span>Elaborate · 詳細</span>
                </button>
              </div>
            )}
          </div>

          <div className="toolbar-right">
            <button
              type="button"
              className="btn-send"
              disabled={!input.trim() || isLoading}
              onClick={onSend}
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="input-hint">
        Active: <strong>{!isElaborate ? 'Simple Mode (簡易)' : 'Elaborate Mode (詳細)'}</strong> · Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for a new line
      </div>
    </div>
  );
}
