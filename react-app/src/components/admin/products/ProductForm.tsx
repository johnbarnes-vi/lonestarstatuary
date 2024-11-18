// src/components/admin/products/ProductForm.tsx

import React from 'react';
import { ProductCategory, ProductStockStatus } from '@lonestar/shared';

interface ProductFormProps {
    loading: boolean;
    isEditing: boolean;
    productFormData: any; // Using any for brevity, should use proper type
    setProductFormData: (data: any) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    resetForm: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    loading,
    isEditing,
    productFormData,
    setProductFormData,
    handleSubmit,
    resetForm
}) => {
    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
    );
};