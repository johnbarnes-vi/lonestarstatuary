/**
 * Product category enumeration
 */
export declare enum ProductCategory {
    ROMAN = "ROMAN",
    GREEK = "GREEK",
    BUST = "BUST"
}
/**
 * Product stock status enumeration
 */
export declare enum ProductStockStatus {
    IN_STOCK = "IN_STOCK",
    LOW_STOCK = "LOW_STOCK",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    PRE_ORDER = "PRE_ORDER",
    DISCONTINUED = "DISCONTINUED"
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
    moldCreationDate?: Date;
    runSize: number;
    availableQuantity: number;
    soldCount: number;
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
 * Base product interface containing common fields
 */
interface ProductBase {
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
    tags?: string[];
}
/**
 * Complete product interface including metadata
 */
export interface Product extends ProductBase {
    id: string;
    images: ProductImages;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Product creation DTO
 */
export type CreateProductDTO = ProductBase & {
    images: ProductImages;
};
/**
 * Product update DTO
 */
export type UpdateProductDTO = Partial<CreateProductDTO>;
/**
 * Form data interface for handling file uploads
 */
export interface ProductFormData extends ProductBase {
    thumbnailFile?: File;
    mainImageFiles?: FileList;
    threeSixtyFiles?: FileList;
}
/**
 * Product query parameters for filtering and pagination
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
export {};
