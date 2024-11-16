/**
 * Disk Management Controller
 * 
 * Handles file operations for test files, product files, and commission files.
 * Provides upload verification and retrieval capabilities for each subdirectory.
 * 
 * @class DiskController
 */
import { Request, Response, RequestHandler } from 'express';
import { promises as fs } from 'fs';
import fs_sync from 'fs';
import path from 'path';
import { createUploadMiddleware } from '../config/upload';
import { getBaseUploadDir, UploadDirectory } from '../utils/uploadUtils';

class DiskController {
  /**
   * Verifies a successful file upload and prepares the response
   * 
   * @private
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {UploadDirectory} uploadType - Type of upload directory
   * @returns {void}
   * @throws {400} If no file was uploaded
   * @throws {500} If file verification fails
   */
  private verifyUpload(req: Request, res: Response, uploadType: UploadDirectory) {
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

    const fileUrl = `/uploads/${uploadType}/${req.file.filename}`;
    
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
  }

  /**
   * Gets files from a specific upload directory
   * 
   * @private
   * @param {string} directory - Directory to read files from
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   */
  private async getFilesFromDirectory(directory: UploadDirectory, res: Response) {
    try {
      const baseDir = getBaseUploadDir();
      const dirPath = path.join(baseDir, directory);
      
      // Ensure directory exists
      if (!fs_sync.existsSync(dirPath)) {
        return res.json({ files: [] });
      }

      const files = await fs.readdir(dirPath);
      
      // Filter out .gitignore and any other hidden files
      const visibleFiles = files.filter(file => !file.startsWith('.'));
      
      // Format URLs according to environment
      const fileUrls = visibleFiles.map(file => `/uploads/${directory}/${file}`);
      
      res.json({ 
        files: fileUrls,
        directory: {
          path: dirPath,
          fileCount: visibleFiles.length
        }
      });
    } catch (error) {
      console.error(`Error reading ${directory} directory:`, error);
      res.status(500).json({ 
        error: `Failed to read ${directory} directory`,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Uploads a test file
   * 
   * @route POST /api/disk/test/files
   */
  uploadTestFile: RequestHandler = (req, res, next) => {
    const testUpload = createUploadMiddleware('test');
    testUpload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload middleware failed', details: err.message });
      }
      this.verifyUpload(req, res, 'test');
    });
  };

  /**
   * Uploads a product file
   * 
   * @route POST /api/disk/products/files
   */
  uploadProductFile: RequestHandler = (req, res, next) => {
    const productUpload = createUploadMiddleware('products');
    productUpload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload middleware failed', details: err.message });
      }
      this.verifyUpload(req, res, 'products');
    });
  };

  /**
   * Uploads a commission file
   * 
   * @route POST /api/disk/commissions/files
   */
  uploadCommissionFile: RequestHandler = (req, res, next) => {
    const commissionUpload = createUploadMiddleware('commissions');
    commissionUpload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload middleware failed', details: err.message });
      }
      this.verifyUpload(req, res, 'commissions');
    });
  };

  /**
   * Gets all test files
   * 
   * @route GET /api/disk/test/files
   */
  getTestFiles: RequestHandler = async (req, res) => {
    await this.getFilesFromDirectory('test', res);
  };

  /**
   * Gets all product files
   * 
   * @route GET /api/disk/products/files
   */
  getProductFiles: RequestHandler = async (req, res) => {
    await this.getFilesFromDirectory('products', res);
  };

  /**
   * Gets all commission files
   * 
   * @route GET /api/disk/commissions/files
   */
  getCommissionFiles: RequestHandler = async (req, res) => {
    await this.getFilesFromDirectory('commissions', res);
  };
}

// Export a single instance of the controller
export const diskController = new DiskController();

// For TypeScript support in routes file
export type DiskControllerType = typeof diskController;