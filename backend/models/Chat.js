import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'guest-user',
      index: true,
    },
    title: {
      type: String,
      required: true,
      default: 'New Conversation',
      trim: true,
    },
    topic: {
      type: String,
      default: 'General',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const Chat = mongoose.model('Chat', ChatSchema);
