/**
 * Disk Management Routes
 * 
 * Defines routes for file operations in test, product, and commission directories.
 */
import express from 'express';
import { diskController } from '../controllers/disk.controller';

const router = express.Router();

// Test files routes
router.post('/test/files', diskController.uploadTestFile);
router.get('/test/files', diskController.getTestFiles);

// Product files routes
router.post('/products/files', diskController.uploadProductFile);
router.get('/products/files', diskController.getProductFiles);

// Commission files routes
router.post('/commissions/files', diskController.uploadCommissionFile);
router.get('/commissions/files', diskController.getCommissionFiles);

export default router;