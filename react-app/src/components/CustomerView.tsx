// src/components/CustomerView.tsx
import React, { useEffect, useState } from 'react';
import { useProductManagement } from './admin/products/useProductManagement';
import { ProductCategory } from '@lonestar/shared';
import ProductGrid from './products/ProductGrid';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const CustomerView: React.FC = () => {
  const { products, loading, searchTerm, setSearchTerm, fetchProducts } = useProductManagement();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter and sort products
  const displayedProducts = React.useMemo(() => {
    let filtered = products
      // Remove discontinued products
      .filter(p => p.stockStatus !== 'DISCONTINUED')
      // Apply search filter
      .filter(p => 
        searchTerm === '' || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      // Apply category filter
      .filter(p => selectedCategory === 'ALL' || p.category === selectedCategory);

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Get limited edition products
  const limitedEditionProducts = React.useMemo(() => 
    products.filter(p => 
      p.stockStatus !== 'DISCONTINUED' && 
      p.edition.isLimited && 
      p.edition.availableQuantity > 0
    ),
    [products]
  );

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Limited Edition Section */}
        {limitedEditionProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Limited Edition Pieces
              </h2>
              <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                View All →
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {limitedEditionProducts.slice(0, 3).map(product => (
                <div
                  key={product.id}
                  className="relative bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Only {product.edition.availableQuantity} left
                    </span>
                  </div>
                  <img
                    src={product.images.thumbnail || '/api/placeholder/400/400'}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Limited Edition of {product.edition.runSize}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Product Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Sculptures
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </div>

          {/* Search and Filters */}
          <div className={`lg:flex gap-6 mb-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Search Bar */}
            <div className="relative flex-1 mb-4 lg:mb-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search sculptures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative mb-4 lg:mb-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | 'ALL')}
                className="appearance-none pl-4 pr-10 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Categories</option>
                {Object.values(ProductCategory).map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <ChevronDown 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                size={20}
              />
            </div>

            {/* Sort Options */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-4 pr-10 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              <ChevronDown 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                size={20}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-gray-600">
            Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'sculpture' : 'sculptures'}
            {selectedCategory !== 'ALL' && ` in ${selectedCategory.toLowerCase()}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>

          {/* Product Grid */}
          {displayedProducts.length > 0 ? (
            <ProductGrid products={displayedProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No sculptures found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                  setSortBy('newest');
                }}
                className="mt-4 text-blue-500 hover:text-blue-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerView;