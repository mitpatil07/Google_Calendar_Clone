import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import eventRoutes from './routes/event.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

/**
 * Load Environment Variables
 * Must be called before any code that uses process.env
 */
dotenv.config();


const app: Application = express();

/**
 * Middleware Configuration
 */

// Body Parser - Parse JSON request bodies
app.use(express.json());

// Body Parser - Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true, // Allow cookies and auth headers
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

/**
 * Health Check Endpoint
 * Useful for monitoring and deployment platforms
 */
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 * All event-related routes mounted under /api/events
 */
app.use('/api/events', eventRoutes);

/**
 * Error Handling Middleware
 * Must be defined AFTER all routes
 */
app.use(notFoundHandler);  // Catches undefined routes
app.use(errorHandler);     // Catches all errors

/**
 * Server Startup
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start Express server after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${corsOptions.origin}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

/**
 * Graceful Shutdown
 * Handle SIGTERM and SIGINT for clean shutdowns
 */
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;