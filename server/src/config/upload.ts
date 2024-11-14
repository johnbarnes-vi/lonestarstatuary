/**
 * File Upload Configuration Module
 * 
 * This module configures file upload functionality for the Lone Star Statuary application.
 * It handles the setup of upload directories and configures multer storage for file uploads.
 * The module supports multiple upload directories for different types of content (test files,
 * product images, and commission files) and implements basic file naming security.
 * 
 * Environment Variables:
 * - UPLOAD_DIR: Base directory for file uploads (default: '/app/uploads')
 * 
 * Security Notes:
 * - File size limits are enforced at the nginx level
 * - Filenames are sanitized to prevent directory traversal
 * - Directory structure is created with appropriate permissions
 * 
 * @module config/upload
 */

import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';  // Using promises version
import fs_sync from 'fs';  // We still need sync version for multer setup

/**
 * Creates required upload directories if they don't exist.
 * 
 * This function ensures that all necessary upload directories are present before
 * the application starts accepting file uploads. It creates three subdirectories:
 * - test: For development and testing purposes
 * - products: For product images and 3D models
 * - commissions: For customer-submitted commission files
 * 
 * @async
 * @throws {Error} If directory creation fails
 * @returns {Promise<void>}
 */
const createUploadDirs = async () => {
    const baseDir = process.env.UPLOAD_DIR || '/app/uploads';
    const dirs = [
        path.join(baseDir, 'test'),
        path.join(baseDir, 'products'),
        path.join(baseDir, 'commissions')
    ];

    for (const dir of dirs) {
        if (!fs_sync.existsSync(dir)) {
            await fs.mkdir(dir, { recursive: true });
        }
    }
};

// Initialize upload directories
createUploadDirs().catch(err => {
    console.error('Failed to create upload directories:', err);
    process.exit(1);  // Exit if we can't create essential directories
});

/**
 * Multer disk storage configuration.
 * 
 * Configures how uploaded files are stored on disk, including:
 * - Destination directory determination
 * - Filename generation with timestamp and sanitization
 * 
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
    /**
     * Determines the destination directory for uploaded files.
     * Currently points all uploads to the test directory.
     * 
     * @param {Express.Request} req - Express request object
     * @param {Express.Multer.File} file - Uploaded file information
     * @param {function} cb - Callback function
     */
    destination: (req, file, cb) => {
        const baseDir = process.env.UPLOAD_DIR || '/app/uploads';
        const uploadDir = path.join(baseDir, 'test'); // For our test endpoint
        cb(null, uploadDir);
    },

    /**
     * Generates a secure filename for the uploaded file.
     * Adds timestamp prefix and sanitizes the original filename.
     * 
     * @param {Express.Request} req - Express request object
     * @param {Express.Multer.File} file - Uploaded file information
     * @param {function} cb - Callback function
     */
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        cb(null, fileName);
    }
});

/**
 * Configured multer middleware instance.
 * Uses the defined storage configuration and relies on nginx for size limits.
 * 
 * @type {multer.Multer}
 */
export const upload = multer({
    storage,
    // size limits determined in nginx config
});