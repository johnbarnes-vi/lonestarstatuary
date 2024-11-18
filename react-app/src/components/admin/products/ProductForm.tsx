// src/components/admin/products/ProductForm.tsx

import React from 'react';
import {
    Product,
    ProductCategory,
    ProductStockStatus,
    ProductDimensions,
    ProductWeight,
    CreateProductDTO
} from '@lonestar/shared';

// Define the form data type
interface ProductFormData extends Omit<CreateProductDTO, 'images'> {
    thumbnailFile?: File;
    mainImageFiles?: FileList;
    threeSixtyFiles?: FileList;
}

interface ProductFormProps {
    loading: boolean;
    isEditing: boolean;
    selectedProduct: Product | null;
    productFormData: ProductFormData;
    setProductFormData: (data: ProductFormData) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleDimensionChange: (field: keyof ProductDimensions, value: string) => void;
    handleWeightChange: (field: keyof ProductWeight, value: string) => void;
    handleEditionChange: (field: string, value: any) => void;
    resetForm: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    loading,
    isEditing,
    selectedProduct,
    productFormData,
    setProductFormData,
    handleSubmit,
    handleDimensionChange,
    handleWeightChange,
    handleEditionChange,
    resetForm
}) => {
    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <h3 className="text-lg font-semibold">
                {isEditing
                    ? `Edit Product: ${selectedProduct?.name}`
                    : 'Add New Product'
                }
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

            <textarea
                placeholder="Description"
                value={productFormData.description}
                onChange={e => setProductFormData({ ...productFormData, description: e.target.value })}
                className="w-full p-2 border rounded"
                required
                rows={4}
            />

            {/* Dimensions */}
            <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Dimensions</h4>
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700">Height</label>
                        <input
                            type="number"
                            value={productFormData.dimensions.height}
                            onChange={e => handleDimensionChange('height', e.target.value)}
                            className="mt-1 p-2 border rounded w-full"
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Width</label>
                        <input
                            type="number"
                            value={productFormData.dimensions.width}
                            onChange={e => handleDimensionChange('width', e.target.value)}
                            className="mt-1 p-2 border rounded w-full"
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Depth</label>
                        <input
                            type="number"
                            value={productFormData.dimensions.depth}
                            onChange={e => handleDimensionChange('depth', e.target.value)}
                            className="mt-1 p-2 border rounded w-full"
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Unit</label>
                        <select
                            value={productFormData.dimensions.unit}
                            onChange={e => handleDimensionChange('unit', e.target.value)}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        >
                            <option value="INCHES">Inches</option>
                            <option value="CM">Centimeters</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Weight */}
            <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Weight</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700">Value</label>
                        <input
                            type="number"
                            value={productFormData.weight.value}
                            onChange={e => handleWeightChange('value', e.target.value)}
                            className="mt-1 p-2 border rounded w-full"
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Unit</label>
                        <select
                            value={productFormData.weight.unit}
                            onChange={e => handleWeightChange('unit', e.target.value)}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        >
                            <option value="LBS">Pounds</option>
                            <option value="KG">Kilograms</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Material Information */}
            <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Material Information</h4>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700">Primary Material*</label>
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
                        <label className="block text-sm text-gray-700">Finish</label>
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
                        <label className="block text-sm text-gray-700">Color</label>
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

            {/* Edition Information */}
            <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Edition Information</h4>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={productFormData.edition.isLimited}
                            onChange={e => handleEditionChange('isLimited', e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-sm text-gray-700">Limited Edition</label>
                    </div>

                    {productFormData.edition.isLimited && (
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-700">Total Count</label>
                                <input
                                    type="number"
                                    value={productFormData.edition.totalCount || ''}
                                    onChange={e => handleEditionChange('totalCount', e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Current Number</label>
                                <input
                                    type="number"
                                    value={productFormData.edition.currentNumber || ''}
                                    onChange={e => handleEditionChange('currentNumber', e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700">Mold Creation Date</label>
                                <input
                                    type="date"
                                    value={productFormData.edition.moldCreationDate ?
                                        new Date(productFormData.edition.moldCreationDate)
                                            .toISOString().split('T')[0] : ''}
                                    onChange={e => handleEditionChange('moldCreationDate', e.target.value)}
                                    className="mt-1 p-2 border rounded w-full"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div>
                    <label className="block text-sm text-gray-700">Category</label>
                    <select
                        value={productFormData.category}
                        onChange={e => setProductFormData({
                            ...productFormData,
                            category: e.target.value as ProductCategory
                        })}
                        className="mt-1 p-2 border rounded w-full"
                        required
                    >
                        {Object.values(ProductCategory).map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Status</label>
                    <select
                        value={productFormData.stockStatus}
                        onChange={e => setProductFormData({
                            ...productFormData,
                            stockStatus: e.target.value as ProductStockStatus
                        })}
                        className="mt-1 p-2 border rounded w-full"
                        required
                    >
                        {Object.values(ProductStockStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Price</label>
                    <input
                        type="number"
                        value={productFormData.price}
                        onChange={e => setProductFormData({
                            ...productFormData,
                            price: parseFloat(e.target.value)
                        })}
                        className="mt-1 p-2 border rounded w-full"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
            </div>

            {/* Images */}
            <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Images</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700">Thumbnail</label>
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
                        <label className="block text-sm text-gray-700">Main Images</label>
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
                        <label className="block text-sm text-gray-700">360° View Images</label>
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
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 border-t pt-4">
                <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                </button>
            </div>
        </form>
    );
};
