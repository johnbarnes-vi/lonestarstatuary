// src/index.ts
/**
 * Express Server Entry Point
 * 
 * This module serves as the main entry point for the Lone Star Statuary backend server.
 * Routes are modularized into separate files for better organization and maintainability.
 * 
 * Environment Variables:
 * - PORT: Server port number (default: 5000)
 * - UPLOAD_DIR: Base directory for file uploads (default: '/app/uploads')
 * - MONGODB_URI: MongoDB connection string
 * 
 * Route Modules:
 * - /api/admin: Administrative endpoints (health check, etc.)
 * - /api/users: User Management endpoints (populate user-roles, etc.)
 * - /api/disk: File management endpoints (upload, list)
 * 
 * @module src/index
 */

import express from 'express';
import mongoose from 'mongoose';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import diskRoutes from './routes/disk.routes';
import { getBaseUploadDir } from './utils/uploadUtils';
import { connectDatabase } from './config/database';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Connect to MongoDB
connectDatabase().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Middleware to handle JSON bodies
app.use(express.json());

// In development, serve uploaded files directly
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(getBaseUploadDir(), {
    maxAge: '1d',
    setHeaders: (res, path) => {
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('X-Frame-Options', 'DENY');
    }
  }));
}

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/disk', diskRoutes);

// Graceful shutdown handler
const gracefulShutdown = async () => {
  console.log('Received shutdown signal. Starting graceful shutdown...');
  
  try {
    // Close database connection
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully.');
    
    // Exit process
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Listen for shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Server initialization
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Upload directory: ${getBaseUploadDir()}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});