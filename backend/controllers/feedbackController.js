import { storeService } from '../services/storeService.js';

export const feedbackController = {
  // POST /api/feedback
  async submitFeedback(req, res, next) {
    try {
      const { chatId, messageId, rating, comment = '' } = req.body;

      if (!chatId || !messageId) {
        return res.status(400).json({ error: 'chatId and messageId are required.' });
      }

      if (rating !== 1 && rating !== -1) {
        return res.status(400).json({ error: 'Rating must be 1 (helpful) or -1 (not helpful).' });
      }

      const feedback = await storeService.saveFeedback({
        chatId,
        messageId,
        rating,
        comment: comment.trim(),
      });

      const stats = await storeService.getStats();

      return res.status(200).json({
        success: true,
        message: 'Thank you for your feedback! This helps EasyAssist AI learn and improve.',
        feedback,
        currentStats: stats.feedback,
      });
    } catch (error) {
      next(error);
    }
  },
};
