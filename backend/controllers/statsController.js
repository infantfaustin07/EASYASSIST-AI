import { storeService } from '../services/storeService.js';
import { getDBStatus } from '../config/db.js';

export const statsController = {
  // GET /api/stats
  async getDashboardStats(req, res, next) {
    try {
      const stats = await storeService.getStats();
      return res.status(200).json({ success: true, stats });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/health
  async getHealth(req, res) {
    const dbStatus = getDBStatus();
    return res.status(200).json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'EasyAssist AI Backend API',
      version: '1.0.0',
      database: dbStatus,
      aiProvider: process.env.AI_PROVIDER || 'gemini',
      hasCustomApiKey: Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY !== 'your_api_key_here'),
    });
  },

  // POST /api/stats/reset (useful for demo resets)
  async resetDemo(req, res, next) {
    try {
      await storeService.clearAll();
      return res.status(200).json({ success: true, message: 'All demo conversations reset successfully.' });
    } catch (error) {
      next(error);
    }
  },
};
