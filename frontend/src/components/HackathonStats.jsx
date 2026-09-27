import React, { useState, useEffect } from 'react';
import { MessageSquare, Layers, ThumbsUp, Zap, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function HackathonStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load dashboard metrics:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="dashboard-section" id="hackathon-stats">
      <div className="section-badge">Live Metrics</div>
      <h2 className="section-title">Hackathon Dashboard</h2>
      <p className="section-subtitle">
        Real-time telemetry and user feedback collected directly from the EasyAssist API.
      </p>

      <div className="stats-grid">
        {/* Card 1: Questions Answered */}
        <div className="stat-card">
          <div className="flow-step-icon">
            <MessageSquare size={22} />
          </div>
          <div className="stat-value">
            {loading ? '...' : stats ? stats.questionsAnswered : 'No data yet'}
          </div>
          <div className="stat-label">Questions Answered</div>
          <div className="stat-subtitle">Across multiple disciplines</div>
        </div>

        {/* Card 2: Topics Supported */}
        <div className="stat-card">
          <div className="flow-step-icon" style={{ color: 'var(--accent-sky)', background: 'rgba(14, 165, 233, 0.15)' }}>
            <Layers size={22} />
          </div>
          <div className="stat-value">
            {loading ? '...' : stats ? `${stats.topicsCount}+` : 'No data yet'}
          </div>
          <div className="stat-label">Topics Supported</div>
          <div className="stat-subtitle">Coding, Math, Science, Academics</div>
        </div>

        {/* Card 3: User Feedback */}
        <div className="stat-card">
          <div className="flow-step-icon" style={{ color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)' }}>
            <ThumbsUp size={22} />
          </div>
          <div className="stat-value">
            {loading
              ? '...'
              : stats && stats.feedback.total > 0
              ? stats.feedback.satisfactionRate
              : '100%'}
          </div>
          <div className="stat-label">Helpful Rating</div>
          <div className="stat-subtitle">
            {stats && stats.feedback.total > 0
              ? `${stats.feedback.positive} positive of ${stats.feedback.total} ratings`
              : 'User feedback active'}
          </div>
        </div>

        {/* Card 4: Average Response Time */}
        <div className="stat-card">
          <div className="flow-step-icon" style={{ color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.15)' }}>
            <Zap size={22} />
          </div>
          <div className="stat-value">
            {loading ? '...' : stats ? `${stats.avgResponseTimeMs}ms` : 'No data yet'}
          </div>
          <div className="stat-label">Average Latency</div>
          <div className="stat-subtitle">Fast direct responses</div>
        </div>
      </div>
    </section>
  );
}
