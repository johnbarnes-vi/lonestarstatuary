// src/controllers/product.controller.ts

import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { CreateProductDTO, UpdateProductDTO, ProductQueryParams } from '@lonestar/shared';

/**
 * Controller handling product-related HTTP requests
 */
export const productController = {
  /**
   * Create a new product
   * @route POST /api/products
   */
  async createProduct(req: Request<{}, {}, CreateProductDTO>, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(400).json({ 
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get all products with filtering
   * @route GET /api/products
   */
  async getProducts(req: Request<{}, {}, {}, ProductQueryParams>, res: Response) {
    try {
      const products = await productService.getProducts(req.query);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Update a product
   * @route PATCH /api/products/:id
   */
  async updateProduct(
    req: Request<{ id: string }, {}, UpdateProductDTO>,
    res: Response
  ) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(400).json({ 
        error: 'Failed to update product',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Delete a product (soft delete)
   * @route DELETE /api/products/:id
   */
  async deleteProduct(req: Request<{ id: string }>, res: Response) {
    try {
      const success = await productService.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ 
        error: 'Failed to delete product',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Hard delete a product (admin only)
   * @route DELETE /api/products/:id/hard
   */
  async hardDeleteProduct(req: Request<{ id: string }>, res: Response) {
    try {
      const success = await productService.hardDeleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product permanently deleted' });
    } catch (error) {
      console.error('Error permanently deleting product:', error);
      res.status(500).json({ 
        error: 'Failed to permanently delete product',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};