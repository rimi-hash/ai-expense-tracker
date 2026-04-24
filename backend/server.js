/**
 * Backend Server Entry Point
 * 
 * This is the main file that starts the Express server.
 * Think of it as the "brain" of your backend.
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================
// Middleware are functions that process requests before they reach your routes

// CORS: Allows frontend (different domain) to communicate with backend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================
/**
 * Why MongoDB?
 * - Document-based (flexible schema)
 * - Great for expense data (nested structures)
 * - Easy to scale
 * - JS-friendly
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Quick timeout for testing
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB not available: ${error.message}`);
    console.warn(`📝 Running in DEVELOPMENT MODE (in-memory storage)`);
    console.warn(`💡 To use permanent storage, configure MONGODB_URI in .env`);
    console.warn(`🌐 Visit: https://www.mongodb.com/cloud/atlas (free tier available)\n`);
    // Continue without database for development
    return null;
  }
};

// ============================================
// IMPORT ROUTES
// ============================================
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const insightRoutes = require('./routes/insights');
const chatRoutes = require('./routes/chat');
const predictionRoutes = require('./routes/prediction');

// ============================================
// BASIC ROUTES (FOR TESTING)
// ============================================

// Health check endpoint - useful for monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running ✅',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 AI Expense Tracker Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      expenses: '/api/expenses',
      insights: '/api/insights',
      chat: '/api/chat'
    }
  });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/prediction', predictionRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - when route doesn't exist
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database first
  await connectDB();

  // Start listening for requests
  app.listen(PORT, () => {
    console.log(`\n🎯 Server started on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log('\n💡 Press Ctrl+C to stop the server\n');
  });
};

// Start the server
startServer();

module.exports = app;
