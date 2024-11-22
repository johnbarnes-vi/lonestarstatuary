import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '@lonestar/shared';
import { useProductManagement } from '../../components/admin/products/useProductManagement';

const ProductDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { products, loading, fetchProducts } = useProductManagement();
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
    useEffect(() => {
      // Fetch products if not already loaded
      if (products.length === 0) {
        fetchProducts();
      }
    }, [fetchProducts, products.length]);
  
    useEffect(() => {
      if (!slug || products.length === 0) return;
  
      // Extract SKU from slug (format: product-name_SKU)
      const sku = slug.split('_').pop();
      if (!sku) return;
  
      // Find product with matching SKU
      const product = products.find(p => p.sku === sku);
      setCurrentProduct(product || null);
    }, [slug, products]);
  
    if (loading) {
      return (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      );
    }
  
    if (!currentProduct) {
      return (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Product not found
            </h2>
            <button
              onClick={() => navigate('/')}
              className="text-blue-500 hover:text-blue-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden">
              {currentProduct.images.main[0] && (
                <img
                  src={currentProduct.images.main[0]}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {currentProduct.images.main.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${currentProduct.name} view ${index + 2}`}
                  className="aspect-square rounded object-cover cursor-pointer"
                />
              ))}
            </div>
          </div>
  
          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentProduct.name}</h1>
              <p className="text-sm text-gray-500">SKU: {currentProduct.sku}</p>
            </div>
  
            <div className="text-2xl font-semibold text-gray-900">
              ${currentProduct.price.toFixed(2)}
            </div>
  
            <div className="prose max-w-none">
              <p>{currentProduct.description}</p>
            </div>
  
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Dimensions</h3>
                <p className="text-gray-600">
                  {currentProduct.dimensions.height}" × {currentProduct.dimensions.width}" × {currentProduct.dimensions.depth}"
                </p>
              </div>
  
              <div>
                <h3 className="text-lg font-medium text-gray-900">Material</h3>
                <p className="text-gray-600">
                  {currentProduct.material.primary}
                  {currentProduct.material.finish && ` - ${currentProduct.material.finish}`}
                  {currentProduct.material.color && ` (${currentProduct.material.color})`}
                </p>
              </div>
  
              {currentProduct.edition.isLimited && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Limited Edition</h3>
                  <p className="text-gray-600">
                    {currentProduct.edition.availableQuantity} available of {currentProduct.edition.runSize}
                  </p>
                </div>
              )}
  
              <div>
                <h3 className="text-lg font-medium text-gray-900">Stock Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  currentProduct.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800' :
                  currentProduct.stockStatus === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                  currentProduct.stockStatus === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-800' :
                  currentProduct.stockStatus === 'PRE_ORDER' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentProduct.stockStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
  
            <div className="pt-6 border-t">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center text-blue-500 hover:text-blue-700"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductDetails;