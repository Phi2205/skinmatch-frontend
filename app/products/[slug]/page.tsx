'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, Share2, Star, Check } from 'lucide-react';

// Mock product data - will be replaced with database calls
const PRODUCTS: Record<string, any> = {
  'gentle-foaming-cleanser': {
    id: '1',
    name: 'Gentle Foaming Cleanser',
    slug: 'gentle-foaming-cleanser',
    price: 28,
    compareAtPrice: 35,
    category: 'Cleansers',
    description: 'Soft foam cleanser that removes impurities without stripping',
    longDescription:
      'Our gentle foaming cleanser removes makeup and impurities while maintaining your skin\'s natural pH balance. Perfect for all skin types, especially sensitive and combination skin. This luxurious formula creates a rich lather that feels wonderful on your face while being tough on dirt and makeup.',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=700&fit=crop',
    ],
    rating: 4.5,
    reviews: 128,
    stock: 50,
    size: '150ml',
    skinTypes: ['Normal', 'Combination', 'Sensitive'],
    concerns: [],
    ingredients: ['Glycerin', 'Water', 'Cleanser Complex'],
    benefits: [
      'Removes makeup and impurities',
      'Maintains skin pH balance',
      'Suitable for all skin types',
      'Sulfate-free formula',
    ],
    howToUse: 'Wet your face with lukewarm water. Apply a small amount of cleanser and massage gently in circular motions. Rinse thoroughly with water.',
    reviews_list: [
      {
        id: 1,
        author: 'Sarah M.',
        rating: 5,
        title: 'Best cleanser ever!',
        content: 'My skin has never felt better. This cleanser is gentle yet effective.',
      },
      {
        id: 2,
        author: 'Emily J.',
        rating: 4,
        title: 'Great for sensitive skin',
        content: 'No irritation, no dryness. Exactly what my sensitive skin needed.',
      },
    ],
  },
  'hydrating-essence-toner': {
    id: '2',
    name: 'Hydrating Essence Toner',
    slug: 'hydrating-essence-toner',
    price: 32,
    compareAtPrice: 42,
    category: 'Serums & Treatments',
    description: 'Lightweight hydrating toner with hyaluronic acid',
    longDescription:
      'This essence toner provides lightweight hydration and prepares your skin for better absorption of serums and moisturizers. Contains hyaluronic acid for deep hydration, making it ideal for all skin types looking for that extra boost of moisture.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop',
    ],
    rating: 4.8,
    reviews: 256,
    stock: 45,
    size: '200ml',
    skinTypes: ['Normal', 'Dry', 'Combination'],
    concerns: ['Dryness'],
    ingredients: ['Hyaluronic Acid', 'Glycerin', 'Plant Extracts'],
    benefits: [
      'Deep hydration',
      'Improves product absorption',
      'Lightweight texture',
      'Brightens complexion',
    ],
    howToUse: 'After cleansing, apply with a cotton pad or spray directly onto face. Pat gently until absorbed. Follow with serum and moisturizer.',
    reviews_list: [
      {
        id: 1,
        author: 'Lisa K.',
        rating: 5,
        title: 'Game changer!',
        content: 'My skin looks so plump and dewy after using this. Love it!',
      },
    ],
  },
  'vitamin-c-brightening-serum': {
    id: '4',
    name: 'Vitamin C Brightening Serum',
    slug: 'vitamin-c-brightening-serum',
    price: 45,
    compareAtPrice: 60,
    category: 'Serums & Treatments',
    description: 'Stabilized vitamin C for brightening and protection',
    longDescription:
      'This potent vitamin C serum brightens dark spots and pigmentation while providing powerful antioxidant protection. Boosts collagen production for youthful skin.',
    imageUrl: 'https://images.unsplash.com/photo-1599496257149-076fab403c4d?w=600&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599496257149-076fab403c4d?w=600&h=700&fit=crop',
    ],
    rating: 4.7,
    reviews: 342,
    stock: 40,
    size: '30ml',
    skinTypes: ['Normal', 'Oily', 'Combination'],
    concerns: ['Pigmentation', 'Wrinkles'],
    ingredients: ['Vitamin C', 'Ferulic Acid', 'Vitamin E'],
    benefits: [
      'Brightens dark spots',
      'Antioxidant protection',
      'Boosts collagen',
      'Evens skin tone',
    ],
    howToUse: 'Apply 2-3 drops to clean, dry skin in the morning. Gently pat until absorbed. Follow with sunscreen during the day.',
    reviews_list: [],
  },
  'retinol-night-cream': {
    id: '5',
    name: 'Retinol Night Cream',
    slug: 'retinol-night-cream',
    price: 52,
    compareAtPrice: 70,
    category: 'Moisturizers',
    description: 'Advanced retinol treatment for anti-aging',
    longDescription:
      'Our night cream features encapsulated retinol to minimize irritation while maximizing results. Reduces fine lines, wrinkles, and improves overall skin texture over time.',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=700&fit=crop',
    ],
    rating: 4.9,
    reviews: 501,
    stock: 30,
    size: '50ml',
    skinTypes: ['Normal', 'Oily'],
    concerns: ['Wrinkles'],
    ingredients: ['Retinol', 'Hyaluronic Acid', 'Peptides'],
    benefits: [
      'Reduces fine lines',
      'Improves texture',
      'Anti-aging',
      'Encapsulated formula',
    ],
    howToUse: 'Apply a small amount to clean, dry skin before bed. Use 2-3 times per week initially, then increase frequency as tolerated.',
    reviews_list: [],
  },
  'daily-hydrating-moisturizer': {
    id: '6',
    name: 'Daily Hydrating Moisturizer',
    slug: 'daily-hydrating-moisturizer',
    price: 35,
    compareAtPrice: 45,
    category: 'Moisturizers',
    description: 'Lightweight moisturizer for daily use',
    longDescription:
      'This lightweight moisturizer hydrates without feeling heavy. Perfect for morning use or as a base for makeup. Contains hyaluronic acid and niacinamide.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=700&fit=crop',
    ],
    rating: 4.7,
    reviews: 418,
    stock: 60,
    size: '100ml',
    skinTypes: ['Normal', 'Dry', 'Combination', 'Sensitive'],
    concerns: ['Dryness', 'Sensitivity'],
    ingredients: ['Hyaluronic Acid', 'Niacinamide', 'Ceramides'],
    benefits: [
      'Lightweight texture',
      'Long-lasting hydration',
      'Non-comedogenic',
      'Suitable for all skin types',
    ],
    howToUse: 'Apply to clean skin morning and night. Use upward motions to apply. Can be used under makeup or sunscreen.',
    reviews_list: [],
  },
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS[params.slug];
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <p>Product not found</p>
          <Link href="/products" className="text-[#7a9e8e] hover:underline">
            Back to products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e5dd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#7a9e8e] hover:underline">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-[#7a9e8e] hover:underline">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative h-96 lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <span className="inline-block px-3 py-1 bg-[#f5f2ed] text-[#7a9e8e] text-xs font-semibold rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#c9b896] text-[#c9b896]"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.compareAtPrice}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              {product.stock > 0 ? (
                <p className="text-sm text-green-600 font-semibold">In Stock</p>
              ) : (
                <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              {product.longDescription}
            </p>

            {/* Quick Info */}
            <div className="bg-[#f5f2ed] rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#7a9e8e]" />
                <span className="text-sm text-gray-700">Size: {product.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#7a9e8e]" />
                <span className="text-sm text-gray-700">
                  Suitable for: {product.skinTypes.join(', ')}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 items-center pt-4">
              <div className="flex items-center border border-[#e8e5dd] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-[#f5f2ed]"
                >
                  −
                </button>
                <span className="px-6 py-2 border-l border-r border-[#e8e5dd]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-[#f5f2ed]"
                >
                  +
                </button>
              </div>
              <button
                disabled={product.stock === 0}
                className="flex-1 px-8 py-3 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="px-4 py-3 border border-[#e8e5dd] rounded-lg hover:bg-[#f5f2ed] transition"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            {/* Share */}
            <div className="flex items-center gap-2 pt-4 border-t border-[#e8e5dd]">
              <span className="text-sm text-gray-600">Share:</span>
              <button className="p-2 hover:bg-[#f5f2ed] rounded-lg transition">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-[#e8e5dd] pt-12">
          <div className="flex gap-8 border-b border-[#e8e5dd] mb-8">
            {['description', 'ingredients', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`pb-4 font-semibold capitalize ${
                  selectedTab === tab
                    ? 'text-[#7a9e8e] border-b-2 border-[#7a9e8e]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {selectedTab === 'description' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#7a9e8e] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    How to Use
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.howToUse}
                  </p>
                </div>
              </div>
            )}

            {selectedTab === 'ingredients' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Ingredients
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.ingredients.map((ingredient: string, i: number) => (
                    <div key={i} className="p-4 bg-[#f5f2ed] rounded-lg">
                      <p className="font-semibold text-gray-900">
                        {ingredient}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="max-w-2xl">
                {product.reviews_list.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews_list.map(
                      (review: any) => (
                        <div
                          key={review.id}
                          className="border-b border-[#e8e5dd] pb-6"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-[#c9b896] text-[#c9b896]'
                                      : 'fill-gray-300 text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {review.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            By {review.author}
                          </p>
                          <p className="text-gray-700">{review.content}</p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
