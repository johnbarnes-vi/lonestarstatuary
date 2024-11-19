// src/components/admin/products/ProductManager.tsx
import React, { useEffect, useState } from 'react';
import { Product } from '@lonestar/shared';
import { useProductManagement } from './useProductManagement';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { CollapsibleSection } from '../../common/CollapsibleSection';

export const ProductManager: React.FC = () => {
    const {
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
        handleDimensionChange,
        handleWeightChange,
        handleEditionChange,
        resetForm,
        fetchProducts
    } = useProductManagement();

    // Collapse states
    const [isListExpanded, setIsListExpanded] = useState(true);
    const [isFormExpanded, setIsFormExpanded] = useState(false);

    // Handle edit button click
    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setProductFormData(product);
        setIsEditing(true);
        setIsFormExpanded(true); // Expand the form section
        setIsListExpanded(false); // Optionally collapse the list section
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Product Management
            </h2>

            <div className="space-y-4">
                <CollapsibleSection 
                    title="Product List"
                    maxHeight="600px"
                    isExpanded={isListExpanded}
                    onToggle={() => setIsListExpanded(!isListExpanded)}
                >
                    {/* Search */}
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
                    <ProductList
                        products={products}
                        searchTerm={searchTerm}
                        onEdit={handleEdit}
                        onDelete={handleDeleteProduct}
                    />
                </CollapsibleSection>

                <CollapsibleSection 
                    title={isEditing ? "Edit Product" : "Add New Product"}
                    maxHeight="FULL_HEIGHT"
                    isExpanded={isFormExpanded}
                    onToggle={() => setIsFormExpanded(!isFormExpanded)}
                >
                    <ProductForm
                        loading={loading}
                        isEditing={isEditing}
                        selectedProduct={selectedProduct}
                        productFormData={productFormData}
                        setProductFormData={setProductFormData}
                        handleSubmit={isEditing ? handleUpdateProduct : handleCreateProduct}
                        handleDimensionChange={handleDimensionChange}
                        handleWeightChange={handleWeightChange}
                        handleEditionChange={handleEditionChange}
                        resetForm={() => {
                            resetForm();
                            setIsFormExpanded(false);
                            setIsListExpanded(true);
                        }}
                    />
                </CollapsibleSection>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-lg">Loading...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;