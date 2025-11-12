import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import config
import { testConnection } from './config/supabase';

// Import routes
import authRoutes from './routes/auth';
import shiftRoutes from './routes/shifts';
import timeOffRoutes from './routes/timeOff';
import userRoutes from './routes/users';
import shiftSwapRoutes from './routes/shiftSwaps';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
  })
);
app.use(morgan('dev')); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/time-off', timeOffRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shift-swaps', shiftSwapRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server and test DB connection
const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
