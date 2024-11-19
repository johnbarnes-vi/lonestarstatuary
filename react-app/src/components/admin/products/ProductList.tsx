// src/components/admin/products/ProductList.tsx

import React from 'react';
import { Product } from '@lonestar/shared';

interface ProductListProps {
    products: Product[];
    searchTerm: string;
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
    products,
    searchTerm,
    onEdit,
    onDelete
}) => {
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2">SKU</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product.id}>
                            <td className="border px-4 py-2">
                                <div className="flex justify-center">
                                    {product.images.thumbnail ? (
                                        <img
                                            src={product.images.thumbnail}
                                            alt={product.name}
                                            className="w-16 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">No image</span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="border px-4 py-2">{product.sku}</td>
                            <td className="border px-4 py-2">{product.name}</td>
                            <td className="border px-4 py-2">{product.category}</td>
                            <td className="border px-4 py-2">${product.price}</td>
                            <td className="border px-4 py-2">
                                <span className={`px-2 py-1 rounded text-sm ${product.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800' :
                                        product.stockStatus === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                                            product.stockStatus === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-800' :
                                                product.stockStatus === 'PRE_ORDER' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                    }`}>
                                    {product.stockStatus}
                                </span>
                            </td>
                            <td className="border px-4 py-2">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};