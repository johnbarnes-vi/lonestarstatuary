/**
 * Disk Management Routes
 * 
 * Defines routes for file operations in test, product, and commission directories.
 */
import express from 'express';
import { diskController } from '../controllers/disk.controller';
import { checkJwt } from '../middleware/authMiddleware';

const router = express.Router();

// Test files routes
router.post('/test/files', checkJwt, diskController.uploadTestFile);
router.get('/test/files', checkJwt, diskController.getTestFiles);

// Product files routes
router.post('/products/files', checkJwt, diskController.uploadProductFile);
router.get('/products/files', checkJwt, diskController.getProductFiles);

// Commission files routes
router.post('/commissions/files', checkJwt, diskController.uploadCommissionFile);
router.get('/commissions/files', checkJwt, diskController.getCommissionFiles);

export default router;