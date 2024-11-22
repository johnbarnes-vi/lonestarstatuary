// src/services/product.service.ts

import { ProductModel, ProductDocument } from '../models/product.model';
import { CreateProductDTO, UpdateProductDTO, ProductQueryParams, Product } from '@lonestar/shared';
import { stripeService } from './stripe.service';

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
    try {
      // First create the product in Stripe
      const stripeProduct = await stripeService.createProduct(productData);
      
      // Create the full product data including Stripe fields
      const productWithStripe = {
        ...productData,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripeProduct.default_price as string
      };

      // Create product in our database
      const product = new ProductModel(productWithStripe);
      await product.save();

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
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
   * Update a product
   * @param id Product ID
   * @param updateData Product update data
   * @returns Updated product or null if not found
   */
  async updateProduct(id: string, updateData: UpdateProductDTO): Promise<ProductDocument | null> {
    try {
      // First get the existing product to get the SKU
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) return null;

      // Update the product in Stripe
      const stripeProduct = await stripeService.updateProduct(
        existingProduct.sku,
        updateData
      );

      // Update Stripe-specific fields if price was updated
      const finalUpdateData = {
        ...updateData
      };

      if (updateData.price) {
        finalUpdateData.stripePriceId = stripeProduct.default_price as string;
      }

      // Update product in our database
      return ProductModel.findByIdAndUpdate(
        id,
        { $set: finalUpdateData },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete a product (soft delete)
   * @param id Product ID
   * @returns Success status
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const product = await ProductModel.findById(id);
      if (!product) return false;

      // Archive the product in Stripe
      await stripeService.archiveProduct(product.sku);

      // Soft delete in our database
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
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
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