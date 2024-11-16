/**
 * File Upload Configuration Module
 * 
 * This module provides factory functions for creating file upload middleware
 * for the Lone Star Statuary application. It handles directory setup and
 * configures multer storage for multiple upload directories, with type-safe 
 * configuration and built-in security features.
 * 
 * Security Notes:
 * - File size limits are enforced at the nginx level
 * - Filenames are sanitized to prevent directory traversal
 * - Directory structure is created with appropriate permissions
 * - Upload destinations are type-constrained to prevent injection
 * 
 * @module config/upload
 */

import multer from 'multer';
import { promises as fs } from 'fs';  // Using promises version
import fs_sync from 'fs';  // We still need sync version for multer setup
import { getUploadPath, getAllUploadPaths, UploadDirectory } from '../utils/uploadUtils';

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
    const dirs = getAllUploadPaths();
    
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
 * Creates a Multer disk storage configuration for file uploads
 * 
 * This function configures both the destination path and filename generation
 * for uploaded files, ensuring proper file organization and naming safety.
 * 
 * @param {UploadDirectory} uploadDir - Target subdirectory ('test', 'products', or 'commissions')
 * @returns {multer.StorageEngine} Configured Multer storage engine
 * 
 * Features:
 * - Dynamic directory path generation
 * - Timestamp-prefixed filenames
 * - Filename sanitization
 * 
 * Security:
 * - Prevents directory traversal via uploadDir type constraint
 * - Sanitizes filenames to prevent injection
 * - Maintains original file extension
 * 
 * @example
 * const storage = createStorage('products');
 * // Uploaded file 'my file.jpg' becomes: /app/uploads/products/1679529443127-my_file.jpg
 */
const createStorage = (uploadDir: UploadDirectory) => {
    return multer.diskStorage({
        /**
         * Determines the upload destination path
         * 
         * @param {Express.Request} req - Express request object
         * @param {Express.Multer.File} file - File being uploaded
         * @param {function} cb - Callback to set the destination
         */
        destination: (req, file, cb) => {
            const finalPath = getUploadPath(uploadDir);
            cb(null, finalPath);
        },

        /**
         * Generates a safe filename for the uploaded file
         * 
         * @param {Express.Request} req - Express request object
         * @param {Express.Multer.File} file - File being uploaded
         * @param {function} cb - Callback to set the filename
         * 
         * Format: timestamp-sanitized_original_name
         * Example: 1679529443127-my_image.jpg
         */
        filename: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            cb(null, fileName);
        }
    });
};

/**
 * Factory function to create multer middleware for different upload directories
 * 
 * Creates a configured multer middleware instance for a specific upload directory.
 * Each instance handles file uploads to its designated directory with appropriate
 * naming and security measures.
 * 
 * @param {UploadDirectory} uploadDir - Target directory for uploads
 * @returns {multer.Multer} Configured multer middleware
 * 
 * @example
 * const productUpload = createUploadMiddleware('products');
 * router.post('/upload', productUpload.single('file'), handleUpload);
 */
export const createUploadMiddleware = (uploadDir: UploadDirectory) => {
    return multer({
        storage: createStorage(uploadDir)
    });
};