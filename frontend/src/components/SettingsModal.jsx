import React, { useState, useEffect } from 'react';
import { Settings, X, Database, Cpu, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function SettingsModal({ isOpen, onClose, onResetCompleted }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api
        .getHealth()
        .then((data) => setHealth(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all demo chats? This will clear conversations.')) {
      try {
        setResetting(true);
        await api.resetDemo();
        setResetSuccess(true);
        if (onResetCompleted) onResetCompleted();
        setTimeout(() => setResetSuccess(false), 3000);
      } catch (err) {
        alert('Reset failed: ' + err.message);
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Settings size={20} color="var(--primary)" />
            <span>System Settings & Diagnostics</span>
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h4 style={{ color: '#ffffff', marginBottom: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} color="var(--primary)" /> Storage & Backend Status
            </h4>

            {loading ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Checking backend health...</div>
            ) : health ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Backend API:</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>● Online (v{health.version})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Database:</span>
                  <span style={{ color: health.database?.isMongoConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontWeight: '600' }}>
                    {health.database?.isMongoConnected ? 'MongoDB Connected' : 'Local Fallback Storage'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>AI Provider:</span>
                  <span style={{ color: 'var(--accent-amber)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {health.aiProvider} {health.hasCustomApiKey ? '(Key Configured)' : '(Built-in Engine)'}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-rose)' }}>
                Could not reach backend API at localhost:5000.
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h4 style={{ color: '#ffffff', marginBottom: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={16} color="var(--accent-amber)" /> Hackathon Demo Reset
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
              Clear all stored conversations and feedback to reset the state for a fresh live demo presentation.
            </p>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              disabled={resetting}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
            >
              {resetSuccess ? (
                <>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span>Demo Cleared!</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} className={resetting ? 'animate-spin' : ''} />
                  <span>{resetting ? 'Resetting...' : 'Reset All Demo Data'}</span>
                </>
              )}
            </button>
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
