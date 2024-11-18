// src/components/admin/products/ProductManager.tsx

import React, { useEffect } from 'react';
import { Product } from '@lonestar/shared';
import { useProductManagement } from './useProductManagement';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';

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
    resetForm,
    fetchProducts
  } = useProductManagement();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle edit button click
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setProductFormData(product);
    setIsEditing(true);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Product Management
      </h2>

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

      {/* Product Form */}
      <ProductForm
        loading={loading}
        isEditing={isEditing}
        productFormData={productFormData}
        setProductFormData={setProductFormData}
        handleSubmit={isEditing ? handleUpdateProduct : handleCreateProduct}
        resetForm={resetForm}
      />

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