import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { getDBStatus } from '../config/db.js';
import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import { Feedback } from '../models/Feedback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Local in-memory fallback store
let localStore = {
  users: [
    {
      _id: 'guest-user',
      name: 'Hackathon Visitor',
      email: 'visitor@easyassist.ai',
      createdAt: new Date().toISOString(),
    },
  ],
  chats: [],
  messages: [],
  feedbacks: [],
  metrics: {
    latencies: [420, 380, 510, 395],
  },
};

// Initialize persistent file store if directory doesn't exist
const initLocalStore = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf-8');
      localStore = { ...localStore, ...JSON.parse(data) };
    } else {
      saveLocalStore();
    }
  } catch (err) {
    console.error('Error initializing local file store:', err.message);
  }
};

const saveLocalStore = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(localStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local store:', err.message);
  }
};

initLocalStore();

export const storeService = {
  // CHATS
  async createChat({ userId = 'guest-user', title = 'New Conversation', topic = 'General' } = {}) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      const chat = await Chat.create({ userId, title, topic });
      return chat.toObject();
    }

    const newChat = {
      _id: uuidv4(),
      userId,
      title,
      topic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStore.chats.unshift(newChat);
    saveLocalStore();
    return newChat;
  },

  async getChats({ userId = 'guest-user', search = '' } = {}) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      const query = { userId };
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
      const chats = await Chat.find(query).sort({ updatedAt: -1 }).lean();
      return chats;
    }

    let chats = [...localStore.chats];
    if (userId) {
      chats = chats.filter((c) => c.userId === userId);
    }
    if (search) {
      const s = search.toLowerCase();
      chats = chats.filter((c) => c.title.toLowerCase().includes(s));
    }
    return chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  async getChatById(chatId) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      const chat = await Chat.findById(chatId).lean();
      return chat;
    }
    return localStore.chats.find((c) => c._id === chatId) || null;
  },

  async updateChatTitle(chatId, title, topic) {
    const { isMongoConnected } = getDBStatus();
    const update = { title, updatedAt: new Date() };
    if (topic) update.topic = topic;

    if (isMongoConnected) {
      const updated = await Chat.findByIdAndUpdate(chatId, update, { new: true }).lean();
      return updated;
    }

    const chat = localStore.chats.find((c) => c._id === chatId);
    if (chat) {
      chat.title = title;
      if (topic) chat.topic = topic;
      chat.updatedAt = new Date().toISOString();
      saveLocalStore();
    }
    return chat;
  },

  async deleteChat(chatId) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      await Chat.findByIdAndDelete(chatId);
      await Message.deleteMany({ chatId });
      await Feedback.deleteMany({ chatId });
      return true;
    }

    localStore.chats = localStore.chats.filter((c) => c._id !== chatId);
    localStore.messages = localStore.messages.filter((m) => m.chatId !== chatId);
    localStore.feedbacks = localStore.feedbacks.filter((f) => f.chatId !== chatId);
    saveLocalStore();
    return true;
  },

  // MESSAGES
  async addMessage({ chatId, role, content, mode = 'simple' }) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      const message = await Message.create({ chatId, role, content, mode });
      await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });
      return message.toObject();
    }

    const newMessage = {
      _id: uuidv4(),
      chatId,
      role,
      content,
      mode,
      timestamp: new Date().toISOString(),
    };
    localStore.messages.push(newMessage);

    const chat = localStore.chats.find((c) => c._id === chatId);
    if (chat) {
      chat.updatedAt = new Date().toISOString();
    }
    saveLocalStore();
    return newMessage;
  },

  async getMessages(chatId) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      const messages = await Message.find({ chatId }).sort({ timestamp: 1 }).lean();
      return messages;
    }

    return localStore.messages
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },

  // FEEDBACK
  async saveFeedback({ chatId, messageId, rating, comment = '' }) {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      // Upsert feedback
      const feedback = await Feedback.findOneAndUpdate(
        { chatId, messageId },
        { rating, comment, createdAt: new Date() },
        { upsert: true, new: true }
      ).lean();
      return feedback;
    }

    const existingIdx = localStore.feedbacks.findIndex(
      (f) => f.chatId === chatId && f.messageId === messageId
    );
    const feedbackItem = {
      _id: uuidv4(),
      chatId,
      messageId,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      localStore.feedbacks[existingIdx] = feedbackItem;
    } else {
      localStore.feedbacks.push(feedbackItem);
    }
    saveLocalStore();
    return feedbackItem;
  },

  recordLatency(ms) {
    if (!localStore.metrics) localStore.metrics = { latencies: [] };
    localStore.metrics.latencies.push(ms);
    if (localStore.metrics.latencies.length > 50) {
      localStore.metrics.latencies.shift();
    }
    saveLocalStore();
  },

  // DASHBOARD STATS
  async getStats() {
    const { isMongoConnected } = getDBStatus();
    let totalQuestions = 0;
    let totalChats = 0;
    let positiveFeedback = 0;
    let negativeFeedback = 0;
    const topicsSet = new Set(['Education', 'Programming', 'Mathematics', 'Science', 'Technology', 'Everyday Questions']);

    if (isMongoConnected) {
      totalQuestions = await Message.countDocuments({ role: 'user' });
      totalChats = await Chat.countDocuments();
      positiveFeedback = await Feedback.countDocuments({ rating: 1 });
      negativeFeedback = await Feedback.countDocuments({ rating: -1 });

      const distinctTopics = await Chat.distinct('topic');
      distinctTopics.forEach((t) => {
        if (t) topicsSet.add(t);
      });
    } else {
      totalQuestions = localStore.messages.filter((m) => m.role === 'user').length;
      totalChats = localStore.chats.length;
      positiveFeedback = localStore.feedbacks.filter((f) => f.rating === 1).length;
      negativeFeedback = localStore.feedbacks.filter((f) => f.rating === -1).length;

      localStore.chats.forEach((c) => {
        if (c.topic) topicsSet.add(c.topic);
      });
    }

    const totalFeedback = positiveFeedback + negativeFeedback;
    const satisfactionRate = totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 100;

    const latencies = localStore.metrics?.latencies || [420];
    const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);

    return {
      questionsAnswered: totalQuestions,
      chatsCount: totalChats,
      topicsCount: topicsSet.size,
      topicsList: Array.from(topicsSet),
      feedback: {
        positive: positiveFeedback,
        negative: negativeFeedback,
        total: totalFeedback,
        satisfactionRate: `${satisfactionRate}%`,
      },
      avgResponseTimeMs: avgLatency,
      storageMode: isMongoConnected ? 'MongoDB' : 'Local Persistent Storage',
    };
  },

  async clearAll() {
    const { isMongoConnected } = getDBStatus();
    if (isMongoConnected) {
      await Chat.deleteMany({});
      await Message.deleteMany({});
      await Feedback.deleteMany({});
    }
    localStore.chats = [];
    localStore.messages = [];
    localStore.feedbacks = [];
    saveLocalStore();
    return true;
  },
};
