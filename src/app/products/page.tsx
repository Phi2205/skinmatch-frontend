'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, Plus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/modules/product/services/product.service';
import { ProductCardSkeleton } from '@/modules/product/components/product-skeleton';
import { getAllCategories } from '@/modules/category/services/category.service';
import { getAllConcerns } from '@/modules/concerns/services/concern.service';
import { getAllSkinTypes } from '@/modules/skin-types/services/skin-type.service';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All');
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<number[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Expansion states for filters
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isSkinTypesExpanded, setIsSkinTypesExpanded] = useState(false);
  const [isConcernsExpanded, setIsConcernsExpanded] = useState(false);

  // Fetch filter data
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  const { data: concernsResponse } = useQuery({
    queryKey: ['concerns'],
    queryFn: getAllConcerns
  });

  const { data: skinTypesResponse } = useQuery({
    queryKey: ['skinTypes'],
    queryFn: getAllSkinTypes
  });

  const categories = categoriesResponse?.data || [];
  const concerns = concernsResponse?.data || [];
  const skinTypes = skinTypesResponse?.data || [];

  const [page, setPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState<any[]>([]);
  const [prevResponse, setPrevResponse] = useState<any>(null);

  // Reset page when any filter parameters change
  useEffect(() => {
    setPage(1);
    setAccumulatedProducts([]);
    setPrevResponse(null);
  }, [searchTerm, selectedCategory, selectedSkinTypes, selectedConcerns, priceRange, sortBy]);

  const { data: productsResponse, isLoading, isFetching, error } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, selectedSkinTypes, selectedConcerns, priceRange, sortBy, page],
    queryFn: () => getProducts({
      page,
      limit: 8, // Set limit to 8 for neat grid pages
      search: searchTerm,
      category_ids: selectedCategory === 'All' ? undefined : selectedCategory.toString(),
      skin_type_ids: selectedSkinTypes.length > 0 ? selectedSkinTypes.join(',') : undefined,
      concern_ids: selectedConcerns.length > 0 ? selectedConcerns.join(',') : undefined,
      min_price: priceRange[0],
      max_price: priceRange[1],
      sortBy: sortBy === 'featured' ? 'created_at' : sortBy.split('-')[0],
      sortOrder: sortBy.includes('high') ? 'desc' : 'asc'
    }),
  });

  // Synchronous state synchronization during render to eliminate frame lag
  if (productsResponse && productsResponse !== prevResponse) {
    setPrevResponse(productsResponse);
    const newItems = productsResponse.data?.items || [];
    setAccumulatedProducts((prev) => {
      if (page === 1) {
        return newItems;
      }
      const existingIds = new Set(prev.map((p) => p.id));
      const filteredNewItems = newItems.filter((item) => !existingIds.has(item.id));
      return [...prev, ...filteredNewItems];
    });
  }

  const filteredProducts = accumulatedProducts;
  const hasNextPage = productsResponse?.data?.meta?.hasNextPage || false;

  const toggleSkinType = (id: number) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleConcern = (id: number) => {
    setSelectedConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-[#faf8f5] border-b border-[#e8e5dd] pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Products</h1>
          <p className="text-gray-600 mt-2">
            Discover our collection of natural skincare products crafted for every skin type
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? 'block' : 'hidden'
            } lg:block bg-white rounded-lg p-6 h-fit border border-[#e8e5dd]`}
          >
            <div className="flex justify-between items-center lg:block mb-6 lg:mb-0">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                className="lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                ✕
              </button>
            </div>

            {/* Search in sidebar */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    checked={selectedCategory === 'All'}
                    onChange={() => setSelectedCategory('All')}
                    className="w-4 h-4 text-[#7a9e8e] focus:ring-[#7a9e8e] border-gray-300"
                  />
                  <span className={`text-sm ${selectedCategory === 'All' ? 'text-[#7a9e8e] font-bold' : 'text-gray-600'} group-hover:text-[#7a9e8e] transition-colors`}>
                    All Categories
                  </span>
                </label>
                {categories.slice(0, isCategoriesExpanded ? undefined : 4).map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                      className="w-4 h-4 text-[#7a9e8e] focus:ring-[#7a9e8e] border-gray-300"
                    />
                    <span className={`text-sm ${selectedCategory === cat.id ? 'text-[#7a9e8e] font-bold' : 'text-gray-600'} group-hover:text-[#7a9e8e] transition-colors`}>
                      {cat.name}
                    </span>
                  </label>
                ))}
                {categories.length > 4 && (
                  <button
                    onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                    className="text-xs font-bold text-[#7a9e8e] hover:underline flex items-center gap-1 mt-1"
                  >
                    {isCategoriesExpanded ? 'See Less' : `See More (${categories.length - 4})`}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isCategoriesExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Skin Type Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Skin Type</h3>
              <div className="space-y-2">
                {skinTypes.slice(0, isSkinTypesExpanded ? undefined : 4).map((type) => (
                  <label key={type.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedSkinTypes.includes(type.id)}
                      onChange={() => toggleSkinType(type.id)}
                      className="w-4 h-4 rounded text-[#7a9e8e] focus:ring-[#7a9e8e] border-gray-300"
                    />
                    <span className={`text-sm ${selectedSkinTypes.includes(type.id) ? 'text-[#7a9e8e] font-bold' : 'text-gray-600'} group-hover:text-[#7a9e8e] transition-colors`}>
                      {type.name}
                    </span>
                  </label>
                ))}
                {skinTypes.length > 4 && (
                  <button
                    onClick={() => setIsSkinTypesExpanded(!isSkinTypesExpanded)}
                    className="text-xs font-bold text-[#7a9e8e] hover:underline flex items-center gap-1 mt-1"
                  >
                    {isSkinTypesExpanded ? 'See Less' : `See More (${skinTypes.length - 4})`}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isSkinTypesExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Concerns Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Skin Concerns</h3>
              <div className="space-y-2">
                {concerns.slice(0, isConcernsExpanded ? undefined : 4).map((concern) => (
                  <label key={concern.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedConcerns.includes(concern.id)}
                      onChange={() => toggleConcern(concern.id)}
                      className="w-4 h-4 rounded text-[#7a9e8e] focus:ring-[#7a9e8e] border-gray-300"
                    />
                    <span className={`text-sm ${selectedConcerns.includes(concern.id) ? 'text-[#7a9e8e] font-bold' : 'text-gray-600'} group-hover:text-[#7a9e8e] transition-colors`}>
                      {concern.name}
                    </span>
                  </label>
                ))}
                {concerns.length > 4 && (
                  <button
                    onClick={() => setIsConcernsExpanded(!isConcernsExpanded)}
                    className="text-xs font-bold text-[#7a9e8e] hover:underline flex items-center gap-1 mt-1"
                  >
                    {isConcernsExpanded ? 'See Less' : `See More (${concerns.length - 4})`}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isConcernsExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Max Price</span>
                  <span className="text-sm font-black text-[#7a9e8e]">{priceRange[1].toLocaleString('vi-VN')}₫</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="50000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7a9e8e]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  <span>0₫</span>
                  <span>2.000.000₫</span>
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== 'All' ||
              selectedSkinTypes.length > 0 ||
              selectedConcerns.length > 0 ||
              searchTerm ||
              priceRange[1] !== 2000000) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSkinTypes([]);
                  setSelectedConcerns([]);
                  setSearchTerm('');
                  setPriceRange([0, 2000000]);
                }}
                className="w-full px-4 py-2 bg-[#f5f2ed] text-gray-900 rounded-lg hover:bg-[#e8e5dd] transition text-sm font-bold uppercase tracking-wider active:scale-95"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort and mobile filter toggle */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden px-4 py-2 border border-[#e8e5dd] rounded-lg text-sm font-semibold"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-[#e8e5dd] rounded-lg text-sm font-semibold bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {isLoading && filteredProducts.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={`initial-skeleton-${i}`} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group h-full">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-gray-100">
                        {/* Image Container - Square */}
                        <div className="relative aspect-square bg-[#f8f9fa] overflow-hidden p-6">
                          <Image
                            src={product.image_url || '/placeholder.png'}
                            alt={product.name}
                            fill
                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#7a9e8e] bg-[#7a9e8e]/5 px-2 py-1 rounded">
                              {product.categories?.[0]?.name || 'Uncategorized'}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-gray-900">★ 4.9</span>
                            </div>
                          </div>

                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#7a9e8e] transition-colors line-clamp-2 leading-snug flex-1">
                            {product.name}
                          </h3>

                          <div className="mt-auto pt-4 border-t border-gray-50">
                            <div className="flex justify-between items-center gap-2">
                              <div className="flex flex-col">
                                <span className="text-lg font-black text-gray-900">
                                  {product.price.toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                              <button className="w-10 h-10 bg-[#7a9e8e] text-white rounded-full flex items-center justify-center hover:bg-[#5a7a6b] transition-all shadow-md active:scale-95 group-hover:rotate-90">
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Append skeletons at the bottom of the grid when loading more pages */}
                  {isFetching && (
                    Array.from({ length: 4 }).map((_, i) => (
                      <ProductCardSkeleton key={`more-skeleton-${i}`} />
                    ))
                  )}
                </div>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={isFetching}
                      className="px-10 py-4 bg-[#7a9e8e] text-white font-bold text-sm rounded-2xl hover:bg-[#5a7a6b] transition-all duration-300 flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer active:scale-95"
                    >
                      {isFetching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Đang tải thêm...
                        </>
                      ) : (
                        'Xem thêm sản phẩm'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center border border-[#e8e5dd]">
                <div className="w-20 h-20 bg-[#f5f2ed] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedSkinTypes([]);
                    setSelectedConcerns([]);
                    setPriceRange([0, 2000000]);
                  }}
                  className="mt-6 text-[#7a9e8e] font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

