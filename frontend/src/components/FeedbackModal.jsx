import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ThumbsUp, ThumbsDown, X, MessageSquareHeart } from 'lucide-react';

const POSITIVE_TAGS = ['Simple & Clear', 'Great Example', 'Beginner Friendly', 'Accurate'];
const NEGATIVE_TAGS = ['Too Complex', 'Too Short', 'Not Relevant', 'Needs Code'];

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 1,
  messageId,
}) {
  const [rating, setRating] = useState(initialRating);
  const [selectedTag, setSelectedTag] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullComment = selectedTag
      ? `[${selectedTag}] ${comment}`.trim()
      : comment.trim();

    if (rating === 1) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (e) {
        // Safe fallback if canvas is not available
      }
    }

    await onSubmit(messageId, rating, fullComment);
    setIsSubmitting(false);
    onClose();
  };

  const currentTags = rating === 1 ? POSITIVE_TAGS : NEGATIVE_TAGS;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <MessageSquareHeart size={20} color="var(--primary)" />
            <span>Was this answer useful?</span>
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', padding: '6px 0' }}>
            <button
              type="button"
              className={`feedback-btn ${rating === 1 ? 'rated-pos' : ''}`}
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              onClick={() => {
                setRating(1);
                setSelectedTag('');
              }}
            >
              <ThumbsUp size={16} />
              <span>Helpful</span>
            </button>

            <button
              type="button"
              className={`feedback-btn ${rating === -1 ? 'rated-neg' : ''}`}
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              onClick={() => {
                setRating(-1);
                setSelectedTag('');
              }}
            >
              <ThumbsDown size={16} />
              <span>Needs Improvement</span>
            </button>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
              Quick Tag (Optional):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {currentTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`chip-btn ${selectedTag === tag ? 'active' : ''}`}
                  style={{
                    backgroundColor: selectedTag === tag ? 'var(--primary-light)' : undefined,
                    borderColor: selectedTag === tag ? 'var(--primary)' : undefined,
                    color: selectedTag === tag ? 'var(--text-main)' : undefined,
                  }}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
              Additional Comments (Optional):
            </div>
            <textarea
              className="chat-textarea"
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                minHeight: '75px',
              }}
              placeholder="Tell us what you liked or how we can make answers even simpler..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ marginTop: '6px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-new-chat"
              style={{ width: 'auto', padding: '9px 20px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
