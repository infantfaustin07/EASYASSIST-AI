import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  User,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { formatTime } from '../utils/dateGrouper';

export default function ChatMessage({
  message,
  onFeedbackClick,
  onSpeak,
  isSpeaking,
  onToggleMode,
}) {
  const isUser = message.role === 'user';
  const isSimple = message.mode === 'simple';
  const [copied, setCopied] = useState(false);
  const [codeCopiedIndex, setCodeCopiedIndex] = useState(null);
  const [userRating, setUserRating] = useState(null);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleCopyCode = async (codeText, idx) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCodeCopiedIndex(idx);
      setTimeout(() => setCodeCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    if (onFeedbackClick) {
      onFeedbackClick(message._id, rating);
    }
  };

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`} style={{ fontFamily: "'Onest', sans-serif" }}>
      <div className={`message-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>
        {isUser ? <User size={18} /> : (
          isSimple ? <Sparkles size={18} color="#e0231c" /> : <BookOpen size={18} color="#ff5533" />
        )}
      </div>

      <div className="message-card">
        <div className="message-bubble">
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  if (!inline) {
                    const blockId = Math.random();
                    return (
                      <div className="code-block-wrapper">
                        <div className="code-header">
                          <span style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                            {match ? match[1] : 'code'}
                          </span>
                          <button
                            className="btn-copy-code"
                            onClick={() => handleCopyCode(codeString, blockId)}
                            title="Copy code snippet"
                          >
                            {codeCopiedIndex === blockId ? (
                              <>
                                <Check size={13} color="#34d399" />
                                <span style={{ color: '#34d399' }}>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Action bar for AI messages */}
        {!isUser && (
          <div className="message-actions" style={{ flexWrap: 'wrap', gap: '8px' }}>
            <span className="message-timestamp">
              {formatTime(message.timestamp)}
            </span>

            {/* Mode badge */}
            {isSimple ? (
              <span className="prompt-card-category" style={{ fontSize: '0.68rem', color: 'var(--accent-amber)', gap: '4px' }}>
                <Sparkles size={11} color="#e0231c" />
                <span>Simple Answer</span>
                <span style={{ opacity: 0.65 }}>簡易</span>
              </span>
            ) : (
              <span className="prompt-card-category" style={{ fontSize: '0.68rem', color: '#ff7755', gap: '4px' }}>
                <BookOpen size={11} color="#ff5533" />
                <span>Elaborate Breakdown</span>
                <span style={{ opacity: 0.65 }}>詳細</span>
              </span>
            )}

            {/* Direct Switch to Opposite Mode Button */}
            {onToggleMode && (
              <button
                type="button"
                className="action-btn"
                onClick={() => onToggleMode(message)}
                title={isSimple ? "Generate deep, elaborate technical explanation for this question" : "Generate simplified ELI5 version for this question"}
                style={{
                  background: 'rgba(224, 35, 28, 0.12)',
                  border: '1px solid rgba(224, 35, 28, 0.35)',
                  color: 'var(--bone)',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontWeight: '600',
                  fontSize: '0.74rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isSimple ? (
                  <>
                    <BookOpen size={12} color="#ff5533" />
                    <span>⚡ Elaborate this Answer (詳細)</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} color="#e0231c" />
                    <span>✨ Simplify this Answer (簡易)</span>
                  </>
                )}
              </button>
            )}

            <button
              className="action-btn"
              onClick={handleCopyText}
              title="Copy message"
            >
              {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {onSpeak && (
              <button
                className="action-btn"
                onClick={() => onSpeak(message.content)}
                title={isSpeaking ? 'Stop reading' : 'Read aloud'}
              >
                {isSpeaking ? <VolumeX size={13} color="#e0231c" /> : <Volume2 size={13} />}
                <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
            )}

            {/* Thumbs up / down feedback */}
            <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
              <button
                className={`feedback-btn ${userRating === 1 ? 'rated-pos' : ''}`}
                onClick={() => handleRating(1)}
                title="Helpful answer"
                aria-label="Helpful"
              >
                <ThumbsUp size={12} />
                <span>Helpful</span>
              </button>

              <button
                className={`feedback-btn ${userRating === -1 ? 'rated-neg' : ''}`}
                onClick={() => handleRating(-1)}
                title="Not helpful"
                aria-label="Not helpful"
              >
                <ThumbsDown size={12} />
              </button>
            </div>
          </div>
        )}

        {isUser && (
          <div className="message-actions" style={{ justifyContent: 'flex-end', gap: '8px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isSimple ? 'Simple Mode · 簡易' : 'Elaborate Mode · 詳細'}
            </span>
            <span className="message-timestamp">{formatTime(message.timestamp)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
