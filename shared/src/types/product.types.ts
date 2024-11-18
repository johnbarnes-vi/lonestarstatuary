// shared/src/types/product.types.ts

/**
 * Product category enumeration
 */
export enum ProductCategory {
    ROMAN = 'ROMAN',
    GREEK = 'GREEK',
    BUST = 'BUST'
  }
  
  /**
   * Product stock status enumeration
   */
  export enum ProductStockStatus {
    IN_STOCK = 'IN_STOCK',
    LOW_STOCK = 'LOW_STOCK',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    PRE_ORDER = 'PRE_ORDER',
    DISCONTINUED = 'DISCONTINUED'
  }
  
  /**
   * Product dimensions interface
   */
  export interface ProductDimensions {
    height: number;
    width: number;
    depth: number;
    unit: 'INCHES' | 'CM';
  }
  
  /**
   * Product weight interface
   */
  export interface ProductWeight {
    value: number;
    unit: 'LBS' | 'KG';
  }
  
  /**
   * Product material specifications
   */
  export interface ProductMaterial {
    primary: string;
    finish?: string;
    color?: string;
  }
  
  /**
   * Edition tracking information
   */
  export interface EditionInfo {
    isLimited: boolean;
    totalCount?: number;
    currentNumber?: number;
    moldCreationDate?: Date;
  }
  
  /**
   * Product images interface
   */
  export interface ProductImages {
    thumbnail: string;
    main: string[];
    threeSixty?: string[];
  }
  
  /**
   * Complete product interface
   */
  export interface Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    category: ProductCategory;
    price: number;
    stockStatus: ProductStockStatus;
    dimensions: ProductDimensions;
    weight: ProductWeight;
    material: ProductMaterial;
    edition: EditionInfo;
    images: ProductImages;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date; // For soft deletes
  }
  
  /**
   * Product creation DTO
   */
  export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
  
  /**
   * Product update DTO
   */
  export type UpdateProductDTO = Partial<CreateProductDTO>;
  
  /**
   * Product query parameters
   */
  export interface ProductQueryParams {
    category?: ProductCategory;
    stockStatus?: ProductStockStatus;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: 'price' | 'createdAt' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }