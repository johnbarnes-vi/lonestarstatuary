// src/components/admin/products/useProductManagement.ts

import { useState, useCallback } from 'react';
import { useUserContext } from '../../../contexts/UserContext';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ProductCategory,
  ProductStockStatus
} from '@lonestar/shared';

/**
 * Product form state interface
 */
interface ProductFormData extends Omit<CreateProductDTO, 'images'> {
  thumbnailFile?: File;
  mainImageFiles?: FileList;
  threeSixtyFiles?: FileList;
}

/**
 * Hook for managing product-related state and operations
 */
export const useProductManagement = () => {
  const { fetchWithAuth } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    description: '',
    category: ProductCategory.ROMAN,
    price: 0,
    stockStatus: ProductStockStatus.IN_STOCK,
    dimensions: { height: 0, width: 0, depth: 0, unit: 'INCHES' },
    weight: { value: 0, unit: 'LBS' },
    material: {
      primary: '',
      finish: '',
      color: ''
    },
    edition: { isLimited: false }
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  const uploadProductImages = async () => {
    const imageUrls = {
      thumbnail: '',
      main: [] as string[],
      threeSixty: [] as string[]
    };

    const uploadFile = async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/disk/products/files', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      return data.fileUrl;
    };

    if (productFormData.thumbnailFile) {
      imageUrls.thumbnail = await uploadFile(productFormData.thumbnailFile);
    }

    if (productFormData.mainImageFiles) {
      for (let i = 0; i < productFormData.mainImageFiles.length; i++) {
        const url = await uploadFile(productFormData.mainImageFiles[i]);
        imageUrls.main.push(url);
      }
    }

    if (productFormData.threeSixtyFiles) {
      for (let i = 0; i < productFormData.threeSixtyFiles.length; i++) {
        const url = await uploadFile(productFormData.threeSixtyFiles[i]);
        imageUrls.threeSixty.push(url);
      }
    }

    return imageUrls;
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await uploadProductImages();

      const productData: CreateProductDTO = {
        ...productFormData,
        images: {
          thumbnail: imageUrls.thumbnail || '',
          main: imageUrls.main || [],
          threeSixty: imageUrls.threeSixty || []
        },
        material: {
          ...productFormData.material,
          primary: productFormData.material.primary.trim()
        }
      };

      const response = await fetchWithAuth('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to create product');
      }

      await fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);

    try {
      const imageUrls = await uploadProductImages();

      const updateData: UpdateProductDTO = {
        ...productFormData,
        ...(imageUrls.thumbnail && { images: imageUrls })
      };

      const response = await fetchWithAuth(`/api/products/${selectedProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update product');

      await fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      const response = await fetchWithAuth(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete product');
      await fetchProducts();
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductFormData({
      sku: '',
      name: '',
      description: '',
      category: ProductCategory.ROMAN,
      price: 0,
      stockStatus: ProductStockStatus.IN_STOCK,
      dimensions: { height: 0, width: 0, depth: 0, unit: 'INCHES' },
      weight: { value: 0, unit: 'LBS' },
      material: { primary: '' },
      edition: { isLimited: false }
    });
    setSelectedProduct(null);
    setIsEditing(false);
  };

  return {
    loading,
    products,
    selectedProduct,
    isEditing,
    searchTerm,
    productFormData,
    setSearchTerm,
    setProductFormData,
    setSelectedProduct,
    setIsEditing,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    resetForm,
    fetchProducts
  };
};