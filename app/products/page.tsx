'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';

// Mock products data - will be replaced with database calls
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Gentle Foaming Cleanser',
    slug: 'gentle-foaming-cleanser',
    price: 28,
    compareAtPrice: 35,
    category: 'Cleansers',
    skinTypes: ['Normal', 'Combination', 'Sensitive'],
    concerns: [],
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=500&fit=crop',
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: 'Hydrating Essence Toner',
    slug: 'hydrating-essence-toner',
    price: 32,
    compareAtPrice: 42,
    category: 'Serums & Treatments',
    skinTypes: ['Normal', 'Dry', 'Combination'],
    concerns: ['Dryness'],
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop',
    rating: 4.8,
    reviews: 256,
  },
  {
    id: '3',
    name: 'Anti-Acne Serum',
    slug: 'anti-acne-serum',
    price: 38,
    compareAtPrice: 48,
    category: 'Serums & Treatments',
    skinTypes: ['Oily', 'Combination'],
    concerns: ['Acne', 'Oiliness'],
    imageUrl: 'https://images.unsplash.com/photo-1596517980799-9f4c8cb08bac?w=400&h=500&fit=crop',
    rating: 4.6,
    reviews: 89,
  },
  {
    id: '4',
    name: 'Vitamin C Brightening Serum',
    slug: 'vitamin-c-brightening-serum',
    price: 45,
    compareAtPrice: 60,
    category: 'Serums & Treatments',
    skinTypes: ['Normal', 'Oily', 'Combination'],
    concerns: ['Pigmentation', 'Wrinkles'],
    imageUrl: 'https://images.unsplash.com/photo-1599496257149-076fab403c4d?w=400&h=500&fit=crop',
    rating: 4.7,
    reviews: 342,
  },
  {
    id: '5',
    name: 'Retinol Night Cream',
    slug: 'retinol-night-cream',
    price: 52,
    compareAtPrice: 70,
    category: 'Moisturizers',
    skinTypes: ['Normal', 'Oily'],
    concerns: ['Wrinkles'],
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=500&fit=crop',
    rating: 4.9,
    reviews: 501,
  },
  {
    id: '6',
    name: 'Daily Hydrating Moisturizer',
    slug: 'daily-hydrating-moisturizer',
    price: 35,
    compareAtPrice: 45,
    category: 'Moisturizers',
    skinTypes: ['Normal', 'Dry', 'Combination', 'Sensitive'],
    concerns: ['Dryness', 'Sensitivity'],
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop',
    rating: 4.7,
    reviews: 418,
  },
  {
    id: '7',
    name: 'Mineral Sunscreen SPF 50',
    slug: 'mineral-sunscreen-spf-50',
    price: 40,
    compareAtPrice: 50,
    category: 'Sunscreen',
    skinTypes: ['Normal', 'Dry', 'Sensitive'],
    concerns: ['Sensitivity'],
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=500&fit=crop',
    rating: 4.8,
    reviews: 267,
  },
  {
    id: '8',
    name: 'Soothing Clay Mask',
    slug: 'soothing-clay-mask',
    price: 32,
    compareAtPrice: 42,
    category: 'Face Masks',
    skinTypes: ['Sensitive', 'Normal'],
    concerns: ['Sensitivity'],
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop',
    rating: 4.6,
    reviews: 154,
  },
];

const CATEGORIES = ['All', 'Cleansers', 'Serums & Treatments', 'Moisturizers', 'Sunscreen', 'Face Masks'];
const SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
const CONCERNS = ['Acne', 'Wrinkles', 'Dryness', 'Oiliness', 'Sensitivity', 'Pigmentation'];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = MOCK_PRODUCTS;

    // Search filter
    if (searchTerm) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Skin type filter
    if (selectedSkinTypes.length > 0) {
      products = products.filter((p) =>
        selectedSkinTypes.some((st) => p.skinTypes.includes(st))
      );
    }

    // Concerns filter
    if (selectedConcerns.length > 0) {
      products = products.filter((p) =>
        selectedConcerns.some((c) => p.concerns.includes(c))
      );
    }

    // Price filter
    products = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.reverse();
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured (no change)
        break;
    }

    return products;
  }, [searchTerm, selectedCategory, selectedSkinTypes, selectedConcerns, priceRange, sortBy]);

  const toggleSkinType = (skinType: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(skinType) ? prev.filter((s) => s !== skinType) : [...prev, skinType]
    );
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-[#faf8f5] border-b border-[#e8e5dd] py-8">
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
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skin Type Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Skin Type</h3>
              <div className="space-y-2">
                {SKIN_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSkinTypes.includes(type)}
                      onChange={() => toggleSkinType(type)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Concerns Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Concerns</h3>
              <div className="space-y-2">
                {CONCERNS.map((concern) => (
                  <label key={concern} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedConcerns.includes(concern)}
                      onChange={() => toggleConcern(concern)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700">{concern}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">${priceRange[0]}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])
                  }
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-gray-900">${priceRange[1]}</span>
              </div>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== 'All' ||
              selectedSkinTypes.length > 0 ||
              selectedConcerns.length > 0 ||
              searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSkinTypes([]);
                  setSelectedConcerns([]);
                  setSearchTerm('');
                  setPriceRange([0, 100]);
                }}
                className="w-full px-4 py-2 bg-[#f5f2ed] text-gray-900 rounded-lg hover:bg-[#e8e5dd] transition text-sm font-semibold"
              >
                Reset Filters
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
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300 h-full">
                      <div className="relative h-72 bg-gray-200 overflow-hidden">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-[#f5f2ed] text-[#7a9e8e] text-xs font-semibold rounded">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#7a9e8e] transition line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex text-[#c9b896]">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-sm">
                                {'★'}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">({product.reviews})</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                            {product.compareAtPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.compareAtPrice}
                              </span>
                            )}
                          </div>
                          <button className="px-3 py-2 bg-[#7a9e8e] text-white text-xs font-semibold rounded hover:bg-[#5a7a6b] transition">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedSkinTypes([]);
                    setSelectedConcerns([]);
                    setSearchTerm('');
                    setPriceRange([0, 100]);
                  }}
                  className="px-4 py-2 bg-[#7a9e8e] text-white rounded-lg hover:bg-[#5a7a6b] transition"
                >
                  Clear Filters
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
