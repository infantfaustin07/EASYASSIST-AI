import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    index: true,
  },
  messageId: {
    type: String,
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    enum: [1, -1], // 1 for helpful, -1 for not helpful
    required: true,
  },
  comment: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Feedback = mongoose.model('Feedback', FeedbackSchema);
