// src/services/stripe.service.ts
import Stripe from 'stripe';
import { CreateProductDTO, UpdateProductDTO } from '@lonestar/shared';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class StripeService {
  /**
   * Creates a Stripe product with associated price
   * @param {CreateProductDTO} productData - Product data from our system
   * @returns {Promise<Stripe.Product>} Created Stripe product
   */
  async createProduct(productData: CreateProductDTO): Promise<Stripe.Product> {
    try {
      const stripeProduct = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        // Let Stripe generate the ID
        metadata: {
          sku: productData.sku,
          environment: process.env.NODE_ENV || 'development',
          category: productData.category,
          dimensions: JSON.stringify(productData.dimensions),
          weight: JSON.stringify(productData.weight),
          material: JSON.stringify(productData.material),
          edition: JSON.stringify(productData.edition)
        },
        default_price_data: {
          currency: 'usd',
          unit_amount: Math.round(productData.price * 100),
          tax_behavior: 'exclusive',
        },
        shippable: true,
        package_dimensions: {
          height: productData.dimensions.height,
          width: productData.dimensions.width,
          length: productData.dimensions.depth,
          weight: Math.round(productData.weight.value * 453.592)
        },
        statement_descriptor: productData.material.primary.substring(0, 22).toUpperCase(),
        unit_label: 'sculpture',
        active: productData.stockStatus !== 'DISCONTINUED',
        ...(process.env.NODE_ENV === 'production' && {
          images: productData.images.main
        })
      });

      return stripeProduct;
    } catch (error) {
      console.error('Error creating Stripe product:', error);
      throw new Error('Failed to create Stripe product');
    }
  }
  /**
   * Updates an existing Stripe product
   * @param {string} sku - Product SKU (used as Stripe product ID)
   * @param {UpdateProductDTO} updateData - Product update data
   * @returns {Promise<Stripe.Product>} Updated Stripe product
   */
  async updateProduct(sku: string, updateData: UpdateProductDTO): Promise<Stripe.Product> {
    try {
      // First find the product by SKU
      const existingProduct = await this.getProductBySkuFromStripe(sku);
      if (!existingProduct) {
        throw new Error(`No Stripe product found for SKU: ${sku}`);
      }

      const updateParams: Stripe.ProductUpdateParams = {
        active: updateData.stockStatus !== 'DISCONTINUED'
      };

      // Update basic fields if provided
      if (updateData.name) updateParams.name = updateData.name;
      if (updateData.description) updateParams.description = updateData.description;

      // Only update images in production
      if (process.env.NODE_ENV === 'production' && updateData.images?.main) {
        updateParams.images = updateData.images.main;
      }

      // Update metadata
      const metadata: Record<string, string> = {};
      if (updateData.category) metadata.category = updateData.category;
      if (updateData.dimensions) metadata.dimensions = JSON.stringify(updateData.dimensions);
      if (updateData.weight) metadata.weight = JSON.stringify(updateData.weight);
      if (updateData.material) metadata.material = JSON.stringify(updateData.material);
      if (updateData.edition) metadata.edition = JSON.stringify(updateData.edition);

      if (Object.keys(metadata).length > 0) {
        updateParams.metadata = metadata;
      }

      // Update price if provided
      if (updateData.price) {
        const newPrice = await stripe.prices.create({
          product: existingProduct.id,
          currency: 'usd',
          unit_amount: Math.round(updateData.price * 100),
          tax_behavior: 'exclusive'
        });

        updateParams.default_price = newPrice.id;
      }

      return await stripe.products.update(existingProduct.id, updateParams);
    } catch (error) {
      console.error('Error updating Stripe product:', error);
      throw new Error('Failed to update Stripe product');
    }
  }

  /**
   * Retrieves a Stripe product
   * @param {string} sku - Product SKU (used as Stripe product ID)
   * @returns {Promise<Stripe.Product>} Retrieved Stripe product
   */
  async getProductBySkuFromStripe(sku: string): Promise<Stripe.Product | null> {
    try {
      const products = await stripe.products.search({
        query: `metadata['sku']:'${sku}'`,
      });

      return products.data[0] || null;
    } catch (error) {
      console.error('Error finding Stripe product by SKU:', error);
      throw new Error('Failed to find Stripe product');
    }
  }

  /**
   * Archives a Stripe product
   * @param {string} sku - Product SKU (used as Stripe product ID)
   * @returns {Promise<Stripe.Product>} Archived Stripe product
   */
  async archiveProduct(sku: string): Promise<Stripe.Product> {
    try {
      const existingProduct = await this.getProductBySkuFromStripe(sku);
      if (!existingProduct) {
        throw new Error(`No Stripe product found for SKU: ${sku}`);
      }

      return await stripe.products.update(existingProduct.id, {
        active: false
      });
    } catch (error) {
      console.error('Error archiving Stripe product:', error);
      throw new Error('Failed to archive Stripe product');
    }
  }
}

export const stripeService = new StripeService();