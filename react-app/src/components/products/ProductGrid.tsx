import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@lonestar/shared';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const navigate = useNavigate();

  // Create URL-friendly slug from product name and SKU
  const createProductSlug = (name: string, sku: string) => {
    const nameSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `${nameSlug}_${sku}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => navigate(`/products/${createProductSlug(product.name, product.sku)}`)}
        >
          <div className="aspect-square relative">
            <img
              src={product.images.thumbnail || '/api/placeholder/400/400'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stockStatus === 'LOW_STOCK' && (
              <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Low Stock
              </span>
            )}
            {product.stockStatus === 'OUT_OF_STOCK' && (
              <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
            {product.stockStatus === 'PRE_ORDER' && (
              <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Pre-order
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {product.name}
            </h3>
            <p className="text-gray-500 text-sm mb-2">
              {product.category}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.edition.isLimited && (
                <span className="text-sm text-gray-600">
                  {product.edition.availableQuantity} left
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;