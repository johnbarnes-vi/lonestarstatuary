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
 * - /api/test: File management endpoints (upload, list)
 * 
 * @module src/index
 */

import express from 'express';
import adminRoutes from './routes/admin.routes';
import diskRoutes from './routes/disk.routes';

const app = express();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/disk', diskRoutes);

// Server initialization
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});