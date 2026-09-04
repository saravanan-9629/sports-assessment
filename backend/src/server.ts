import express from 'express';
import cors from 'cors';
import { CONFIG } from './config/config';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import coachRoutes from './routes/coachRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI-Powered Sports Talent Assessment Backend',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start Server
const start = async () => {
  await connectDB();
  app.listen(CONFIG.PORT, () => {
    console.log(`🚀 Sports Talent Backend listening on http://localhost:${CONFIG.PORT}`);
  });
};

start();
