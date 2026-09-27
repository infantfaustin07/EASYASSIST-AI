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
    const mem = process.memoryUsage();
    return res.status(200).json({
      status: 'healthy',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      service: 'EasyAssist AI Backend API',
      version: '1.0.0',
      nodeVersion: process.version,
      memory: {
        rssMb: Math.round(mem.rss / (1024 * 1024)),
        heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
      },
      database: dbStatus,
      aiProvider: process.env.AI_PROVIDER || 'gemini',
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      hasCustomApiKey: Boolean(
        (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') ||
        (process.env.AI_API_KEY && process.env.AI_API_KEY !== 'your_api_key_here')
      ),
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
