import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Guest User',
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'guest@easyassist.ai',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', UserSchema);
