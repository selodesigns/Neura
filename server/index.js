import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import aiRoutes from './routes/ai.js';
import analyticsRoutes from './routes/analytics.js';

// Import middleware
import { authMiddleware } from './middleware/auth.js';

// Import WebSocket handler
import { setupWebSocket } from './websocket/index.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neura')
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch((err) => console.error('✗ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const { llmProvider } = await import('./config/llm.js');
  const llmHealth = await llmProvider.checkHealth();
  const llmInfo = llmProvider.getInfo();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    llm: {
      provider: llmInfo.provider,
      model: llmInfo.model,
      available: llmHealth.available,
      error: llmHealth.error,
    },
  });
});

// WebSocket setup
setupWebSocket(io);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
