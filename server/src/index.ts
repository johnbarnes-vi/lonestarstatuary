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
 * 
 * Route Modules:
 * - /api/admin: Administrative endpoints (health check, etc.)
 * - /api/users: User Management endpoints (populate user-roles, etc.)
 * - /api/disk: File management endpoints (upload, list)
 * 
 * @module src/index
 */

import express from 'express';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';
import diskRoutes from './routes/disk.routes';
import { getBaseUploadDir } from './utils/uploadUtils';
//import { User } from '@lonestar/shared'; // Importing types from shared resource

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// In development, serve uploaded files directly
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(getBaseUploadDir(), {
    // Set Cache-Control header
    maxAge: '1d',
    // Add security headers
    setHeaders: (res, path) => {
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('X-Frame-Options', 'DENY');
    }
  }));
}

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/disk', diskRoutes);

// Server initialization
const port = process.env.PORT || 5000;
app.listen(port, () => {
  const uploadDir = getBaseUploadDir();
  console.log(`Server running on port ${port}`);
  console.log(`Upload directory: ${uploadDir}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});