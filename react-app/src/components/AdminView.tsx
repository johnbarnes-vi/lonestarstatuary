// src/components/AdminView.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { HealthCheck } from './admin/health/HealthCheck';
import { TestFileManager } from './admin/test-files/TestFileManager';
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
 * Administrative panel component providing system health checks and file management
 * 
 * @component
 * @returns {JSX.Element} Rendered admin panel
 */
const AdminView: React.FC = () => {
    const { fetchWithAuth, user } = useUserContext();
    const [loading, setLoading] = useState(false);

    // Product management state
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
            primary: '',  // This was the missing required field
            finish: '',
            color: ''
        },
        edition: { isLimited: false }
    });

    // Product management functions
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

    /**
     * Fetches existing products on component mount
     */
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); 

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First, upload images
            const imageUrls = await uploadProductImages();

            // Then create product with image URLs
            const productData: CreateProductDTO = {
                ...productFormData,
                images: {
                    thumbnail: imageUrls.thumbnail || '',  // Ensure we have a value
                    main: imageUrls.main || [],           // Ensure we have an array
                    threeSixty: imageUrls.threeSixty || [] // Ensure we have an array
                },
                material: {
                    ...productFormData.material,
                    primary: productFormData.material.primary.trim() // Ensure no whitespace
                }
            };

            console.log('Submitting product data:', productData); // Debug log

            const response = await fetchWithAuth('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to create product');
            }

            await fetchProducts(); // Refresh product list
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
            // Upload any new images
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

            await fetchProducts(); // Refresh product list
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
            await fetchProducts(); // Refresh product list
        } catch (err) {
            console.error(err instanceof Error ? err.message : 'Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    const uploadProductImages = async () => {
        const imageUrls = {
            thumbnail: '',
            main: [] as string[],
            threeSixty: [] as string[]
        };

        // Helper function to upload a single file
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

        // Upload thumbnail
        if (productFormData.thumbnailFile) {
            imageUrls.thumbnail = await uploadFile(productFormData.thumbnailFile);
        }

        // Upload main images
        if (productFormData.mainImageFiles) {
            for (let i = 0; i < productFormData.mainImageFiles.length; i++) {
                const url = await uploadFile(productFormData.mainImageFiles[i]);
                imageUrls.main.push(url);
            }
        }

        // Upload 360° view images
        if (productFormData.threeSixtyFiles) {
            for (let i = 0; i < productFormData.threeSixtyFiles.length; i++) {
                const url = await uploadFile(productFormData.threeSixtyFiles[i]);
                imageUrls.threeSixty.push(url);
            }
        }

        return imageUrls;
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

    return (
        <>
            <div className="mb-4">
                <p className="text-gray-600">
                    Welcome back, {user?.name}!
                </p>
            </div>

            {/* Health Check Section */}
            <HealthCheck />

            {/* Test-file Section */}
            <TestFileManager />


            {/* Product Management Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Product Management
                </h2>

                {/* Search and Filter */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Product List */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">SKU</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products
                                .filter(p =>
                                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map(product => (
                                    <tr key={product.id}>
                                        <td className="border px-4 py-2">{product.sku}</td>
                                        <td className="border px-4 py-2">{product.name}</td>
                                        <td className="border px-4 py-2">{product.category}</td>
                                        <td className="border px-4 py-2">${product.price}</td>
                                        <td className="border px-4 py-2">{product.stockStatus}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setProductFormData(product);
                                                    setIsEditing(true);
                                                }}
                                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Product Form */}
                <form
                    onSubmit={isEditing ? handleUpdateProduct : handleCreateProduct}
                    className="mt-8 space-y-4"
                >
                    <h3 className="text-lg font-semibold">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h3>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="SKU"
                            value={productFormData.sku}
                            onChange={e => setProductFormData({ ...productFormData, sku: e.target.value })}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            value={productFormData.name}
                            onChange={e => setProductFormData({ ...productFormData, name: e.target.value })}
                            className="p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Material Information */}
                    <div className="space-y-4 border-t pt-4 mt-4">
                        <h4 className="font-medium">Material Information</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Primary Material*</label>
                                <input
                                    type="text"
                                    value={productFormData.material.primary}
                                    onChange={e => setProductFormData({
                                        ...productFormData,
                                        material: {
                                            ...productFormData.material,
                                            primary: e.target.value
                                        }
                                    })}
                                    className="mt-1 p-2 border rounded w-full"
                                    placeholder="e.g., Cast Marble"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Finish</label>
                                <input
                                    type="text"
                                    value={productFormData.material.finish || ''}
                                    onChange={e => setProductFormData({
                                        ...productFormData,
                                        material: {
                                            ...productFormData.material,
                                            finish: e.target.value
                                        }
                                    })}
                                    className="mt-1 p-2 border rounded w-full"
                                    placeholder="e.g., Polished"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input
                                    type="text"
                                    value={productFormData.material.color || ''}
                                    onChange={e => setProductFormData({
                                        ...productFormData,
                                        material: {
                                            ...productFormData.material,
                                            color: e.target.value
                                        }
                                    })}
                                    className="mt-1 p-2 border rounded w-full"
                                    placeholder="e.g., White"
                                />
                            </div>
                        </div>
                    </div>

                    <textarea
                        placeholder="Description"
                        value={productFormData.description}
                        onChange={e => setProductFormData({ ...productFormData, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />

                    {/* Category and Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            value={productFormData.category}
                            onChange={e => setProductFormData({
                                ...productFormData,
                                category: e.target.value as ProductCategory
                            })}
                            className="p-2 border rounded"
                            required
                        >
                            {Object.values(ProductCategory).map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={productFormData.stockStatus}
                            onChange={e => setProductFormData({
                                ...productFormData,
                                stockStatus: e.target.value as ProductStockStatus
                            })}
                            className="p-2 border rounded"
                            required
                        >
                            {Object.values(ProductStockStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <input
                        type="number"
                        placeholder="Price"
                        value={productFormData.price}
                        onChange={e => setProductFormData({
                            ...productFormData,
                            price: parseFloat(e.target.value)
                        })}
                        className="p-2 border rounded"
                        min="0"
                        step="0.01"
                        required
                    />

                    {/* Images */}
                    <div className="space-y-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                            <input
                                type="file"
                                onChange={e => setProductFormData({
                                    ...productFormData,
                                    thumbnailFile: e.target.files?.[0]
                                })}
                                accept="image/*"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Main Images</label>
                            <input
                                type="file"
                                multiple
                                onChange={e => setProductFormData({
                                    ...productFormData,
                                    mainImageFiles: e.target.files || undefined
                                })}
                                accept="image/*"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">360° View Images</label>
                            <input
                                type="file"
                                multiple
                                onChange={e => setProductFormData({
                                    ...productFormData,
                                    threeSixtyFiles: e.target.files || undefined
                                })}
                                accept="image/*"
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminView;