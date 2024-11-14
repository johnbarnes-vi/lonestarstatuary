/**
 * Express Server Entry Point
 * 
 * This module serves as the main entry point for the Lone Star Statuary backend server.
 * It provides endpoints for health checking and file management operations, serving as
 * a proof-of-concept for the file upload system.
 * 
 * Environment Variables:
 * - PORT: Server port number (default: 5000)
 * - UPLOAD_DIR: Base directory for file uploads (default: '/app/uploads')
 * 
 * Endpoints:
 * - GET /api/health: Server health check
 * - POST /api/test/upload: Test file upload endpoint
 * - GET /api/test/files: List uploaded test files
 * 
 * @module src/index
 */

import express from 'express';
import { Response, Request } from 'express';
import { upload } from './config/upload';
import path from 'path';
import { promises as fs } from 'fs';  // Using promises version for better async handling
import fs_sync from 'fs';  // We still need sync version for multer setup

const app = express();

/**
 * Health Check Endpoint
 * 
 * Provides basic server health status and timestamp for monitoring purposes.
 * 
 * @route GET /api/health
 * @returns {Object} JSON object containing status message and timestamp
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    message: 'Backend is operational!',
    timestamp: new Date().toISOString()
  });
});

/**
 * Test File Upload Endpoint
 * 
 * Handles file uploads for testing purposes. Validates the upload, logs details,
 * and verifies file persistence before responding.
 * 
 * @route POST /api/test/upload
 * @param {Express.Multer.File} req.file - The uploaded file (via multer)
 * @returns {Object} JSON response with upload status and file details
 * @throws {400} If no file is uploaded
 * @throws {500} If file save verification fails
 */
app.post('/api/test/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('File upload details:', {
    originalname: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    destination: req.file.destination,
    size: req.file.size
  });

  const fileUrl = `/uploads/test/${req.file.filename}`;
  
  // Verify file exists after save
  if (!fs_sync.existsSync(req.file.path)) {
    console.error('File not found at path after upload:', req.file.path);
    return res.status(500).json({ error: 'File save failed' });
  }

  res.json({
    message: 'File uploaded successfully',
    fileUrl,
    details: {
      path: req.file.path,
      size: req.file.size
    }
  });
});

/**
 * List Test Files Endpoint
 * 
 * Retrieves a list of all files in the test upload directory and returns their URLs.
 * 
 * @route GET /api/test/files
 * @returns {Object} JSON object containing array of file URLs
 * @throws {500} If directory read operation fails
 */
app.get('/api/test/files', async (req: Request, res: Response) => {
  try {
    const testDir = path.join(process.env.UPLOAD_DIR || '/app/uploads', 'test');
    const files = await fs.readdir(testDir);
    const fileUrls = files.map(file => `/uploads/test/${file}`);
    res.json({ files: fileUrls });
  } catch (error) {
    console.error('Error reading upload directory:', error);
    res.status(500).json({ error: 'Failed to read uploads directory' });
  }
});

// Server initialization
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});