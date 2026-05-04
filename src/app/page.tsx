'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { Hero } from '@/shared/components/hero';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Shield, Recycle, ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByBadgeSlug } from '@/modules/product/services/product.service';

export default function Home() {
  const { data: bestSellersResponse, isLoading } = useQuery({
    queryKey: ['products', 'best-seller'],
    queryFn: () => getProductsByBadgeSlug('best-seller', 1, 4),
  });

  const bestSellers = bestSellersResponse?.data?.items || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Leaf className="w-12 h-12 text-[#7a9e8e]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Natural</h3>
              <p className="text-gray-600 text-sm">
                All our ingredients are natural and carefully selected for effectiveness
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-[#7a9e8e]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cruelty-Free</h3>
              <p className="text-gray-600 text-sm">
                Never tested on animals. Supporting ethical beauty practices
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Recycle className="w-12 h-12 text-[#7a9e8e]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">
                Sustainable packaging and carbon-neutral shipping
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Bestselling Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most-loved skincare essentials loved by thousands of customers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-5 bg-gray-200 rounded w-1/4" />
                      <div className="h-8 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : bestSellers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No best-selling products found at the moment.</p>
              </div>
            ) : (
              bestSellers.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                          <ShoppingBag size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#7a9e8e] transition line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                        {product.summary || 'No summary available'}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-[#7a9e8e]">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <button className="px-3 py-2 bg-[#7a9e8e] text-white text-xs font-semibold rounded hover:bg-[#5a7a6b] transition">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


