const API_BASE = '/api';

export const api = {
  // Send chat message
  async sendMessage({ chatId, message, mode = 'simple', history = [], userId = 'guest-user' }) {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message, mode, history, userId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "I'm having trouble connecting right now. Please try again in a moment.");
    }
    return data;
  },

  // Get list of conversations
  async getChats({ userId = 'guest-user', search = '' } = {}) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE}/chats?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch conversations.');
    }
    return data.chats || [];
  },

  // Get chat by ID with messages
  async getChatById(chatId) {
    const response = await fetch(`${API_BASE}/chats/${chatId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to load conversation.');
    }
    return data;
  },

  // Explicitly create a new chat
  async createChat({ userId = 'guest-user', title = 'New Conversation', topic = 'General' } = {}) {
    const response = await fetch(`${API_BASE}/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, topic }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to initialize conversation.');
    }
    return data.chat;
  },

  // Delete chat
  async deleteChat(chatId) {
    const response = await fetch(`${API_BASE}/chats/${chatId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete conversation.');
    }
    return true;
  },

  // Submit feedback
  async submitFeedback({ chatId, messageId, rating, comment = '' }) {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, messageId, rating, comment }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit feedback.');
    }
    return data;
  },

  // Fetch hackathon stats
  async getStats() {
    const response = await fetch(`${API_BASE}/stats`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to load system metrics.');
    }
    return data.stats;
  },

  // Fetch system health
  async getHealth() {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch health status.');
    }
    return data;
  },

  // Reset demo conversations
  async resetDemo() {
    const response = await fetch(`${API_BASE}/stats/reset`, {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset demo data.');
    }
    return data;
  },
};
