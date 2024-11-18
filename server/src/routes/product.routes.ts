// src/routes/product.routes.ts

import express from 'express';
import { productController } from '../controllers/product.controller';
import { checkJwt } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes (require authentication)
router.post('/', checkJwt, productController.createProduct);
router.patch('/:id', checkJwt, productController.updateProduct);
router.delete('/:id', checkJwt, productController.deleteProduct);
router.delete('/:id/hard', checkJwt, productController.hardDeleteProduct);

export default router;