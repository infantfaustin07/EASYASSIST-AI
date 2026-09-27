import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import chatRoutes from './routes/chatRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { chatRateLimiter, generalRateLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env if present
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (with automatic fallback to local store if MongoDB not running)
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS setup
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development ports, null origins, or matched client URL
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in development demo mode
    }
  },
  credentials: true,
}));

// Body parsing with limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply rate limiting
app.use('/api/', generalRateLimiter);
app.use('/api/chat', chatRateLimiter);

// Mount API Routes
app.use('/api', chatRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', statsRoutes);

// Root & Health routes
app.get('/', (req, res) => {
  res.json({
    name: 'EasyAssist AI API',
    status: 'online',
    mission: 'Making AI answers simple enough for everyone to understand.',
    documentation: '/api/health',
  });
});

app.get('/health', (req, res) => {
  res.redirect('/api/health');
});

// Centralized Error Handling
app.use(errorHandler);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 EasyAssist AI backend running on http://localhost:${PORT}`);
  console.log(`📡 Client allowed: ${allowedOrigin}`);
  console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'gemini'}`);
});
