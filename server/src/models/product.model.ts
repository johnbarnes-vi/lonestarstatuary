// src/models/product.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import {
  Product,
  ProductCategory,
  ProductStockStatus,
  ProductDimensions,
  ProductWeight,
  ProductMaterial,
  EditionInfo,
  ProductImages
} from '@lonestar/shared';

/**
 * Mongoose document interface extending Product type
 * We omit 'id' from Product and let Mongoose handle it
 */
export interface ProductDocument extends Omit<Product, 'id'>, Document { }

/**
 * Product dimensions schema
 */
const dimensionsSchema = new Schema<ProductDimensions>({
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  depth: { type: Number, required: true },
  unit: { type: String, enum: ['INCHES', 'CM'], required: true }
}, { _id: false });

/**
 * Product weight schema
 */
const weightSchema = new Schema<ProductWeight>({
  value: { type: Number, required: true },
  unit: { type: String, enum: ['LBS', 'KG'], required: true }
}, { _id: false });

/**
 * Product material schema
 */
const materialSchema = new Schema<ProductMaterial>({
  primary: { type: String, required: true },
  finish: String,
  color: String
}, { _id: false });

/**
 * Edition information schema
 */
const editionSchema = new Schema<EditionInfo>({
  isLimited: { 
    type: Boolean, 
    required: true 
  },
  moldCreationDate: Date,
  runSize: { 
    type: Number, 
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'Run size must be a whole number'
    }
  },
  availableQuantity: { 
    type: Number, 
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Available quantity must be a whole number'
    }
  },
  soldCount: { 
    type: Number, 
    required: true,
    min: 0,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Sold count must be a whole number'
    }
  }
}, { _id: false });

// Add validators to ensure data consistency
editionSchema.pre('validate', function(next) {
  // Ensure available + sold = runSize
  if (this.availableQuantity + this.soldCount !== this.runSize) {
    next(new Error('Available quantity plus sold count must equal run size'));
  }
  next();
});

/**
 * Product images schema
 */
const imagesSchema = new Schema<ProductImages>({
  thumbnail: { type: String, required: true },
  main: { type: [String], required: true },
  threeSixty: [String]
}, { _id: false });

/**
 * Main product schema
 */
const productSchema = new Schema<ProductDocument>({
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: Object.values(ProductCategory),
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  stockStatus: {
    type: String,
    enum: Object.values(ProductStockStatus),
    required: true,
    index: true
  },
  dimensions: {
    type: dimensionsSchema,
    required: true
  },
  weight: {
    type: weightSchema,
    required: true
  },
  material: {
    type: materialSchema,
    required: true
  },
  edition: {
    type: editionSchema,
    required: true
  },
  images: {
    type: imagesSchema,
    required: true
  },
  tags: {
    type: [String],
    index: true
  }
}, {
  timestamps: true,  // Adds createdAt and updatedAt
  strict: true,      // Only specified schema fields will be saved in the database
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
    virtuals: true
  },
  toObject: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
    virtuals: true
  }
});

// Add compound indexes for common queries
productSchema.index({ category: 1, stockStatus: 1 });
productSchema.index({ price: 1, category: 1 });
productSchema.index({
  name: 'text',
  description: 'text',
  'material.primary': 'text',
  tags: 'text'
}, {
  weights: {
    name: 10,
    tags: 5,
    'material.primary': 3,
    description: 1
  },
  name: 'product_search'
});

export const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);