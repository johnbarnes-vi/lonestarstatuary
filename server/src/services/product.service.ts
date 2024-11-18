// src/services/product.service.ts

import { ProductModel, ProductDocument } from '../models/product.model';
import { CreateProductDTO, UpdateProductDTO, ProductQueryParams, Product } from '@lonestar/shared';

/**
 * Service class for handling product-related database operations
 */
class ProductService {
  /**
   * Create a new product
   * @param productData Product creation data
   * @returns Created product
   */
  async createProduct(productData: CreateProductDTO): Promise<ProductDocument> {
    const product = new ProductModel(productData);
    await product.save();
    return product;
  }

  /**
   * Get all products with optional filtering
   * @param queryParams Optional filtering and pagination parameters
   * @returns Array of products
   */
  async getProducts(queryParams: ProductQueryParams = {}): Promise<ProductDocument[]> {
    const {
      category,
      stockStatus,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = queryParams;

    // Build query
    const query: any = {};

    if (category) query.category = category;
    if (stockStatus) query.stockStatus = stockStatus;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sort: { [key: string]: 'asc' | 'desc' } = {
      [sortBy]: sortOrder
    };

    return ProductModel
      .find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Get a single product by ID
   * @param id Product ID
   * @returns Product document or null if not found
   */
  async getProductById(id: string): Promise<ProductDocument | null> {
    return ProductModel.findById(id);
  }

  /**
   * Update a product
   * @param id Product ID
   * @param updateData Product update data
   * @returns Updated product or null if not found
   */
  async updateProduct(id: string, updateData: UpdateProductDTO): Promise<ProductDocument | null> {
    return ProductModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete a product (soft delete)
   * @param id Product ID
   * @returns Success status
   */
  async deleteProduct(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          deletedAt: new Date(),
          stockStatus: 'DISCONTINUED'
        } 
      }
    );
    return !!result;
  }

  /**
   * Hard delete a product (for admin use only)
   * @param id Product ID
   * @returns Success status
   */
  async hardDeleteProduct(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }
}

export const productService = new ProductService();