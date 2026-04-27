import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { Hero } from '@/shared/components/hero';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Shield, Recycle } from 'lucide-react';

export default function Home() {
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
            {/* Product Card 1 */}
            <Link href="/products/hydrating-essence-toner" className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop"
                    alt="Hydrating Essence Toner"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#7a9e8e] transition">
                    Hydrating Essence Toner
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Lightweight hydrating toner with hyaluronic acid
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">$32</span>
                      <span className="text-sm text-gray-500 line-through">$42</span>
                    </div>
                    <button className="px-3 py-2 bg-[#7a9e8e] text-white text-xs font-semibold rounded hover:bg-[#5a7a6b] transition">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Product Card 2 */}
            <Link href="/products/vitamin-c-brightening-serum" className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1599496257149-076fab403c4d?w=400&h=500&fit=crop"
                    alt="Vitamin C Serum"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#7a9e8e] transition">
                    Vitamin C Brightening Serum
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Stabilized vitamin C for brightening
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">$45</span>
                      <span className="text-sm text-gray-500 line-through">$60</span>
                    </div>
                    <button className="px-3 py-2 bg-[#7a9e8e] text-white text-xs font-semibold rounded hover:bg-[#5a7a6b] transition">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Product Card 3 */}
            <Link href="/products/retinol-night-cream" className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=500&fit=crop"
                    alt="Retinol Night Cream"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#7a9e8e] transition">
                    Retinol Night Cream
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Advanced retinol for anti-aging
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">$52</span>
                      <span className="text-sm text-gray-500 line-through">$70</span>
                    </div>
                    <button className="px-3 py-2 bg-[#7a9e8e] text-white text-xs font-semibold rounded hover:bg-[#5a7a6b] transition">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Product Card 4 */}
            <Link href="/products/daily-hydrating-moisturizer" className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop"
                    alt="Daily Hydrating Moisturizer"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#7a9e8e] transition">
                    Daily Hydrating Moisturizer
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Lightweight moisturizer for daily use
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">$35</span>
                      <span className="text-sm text-gray-500 line-through">$45</span>
                    </div>
                    <button className="px-3 py-2 bg-[#7a9e8e] text-white text-xs font-semibold rounded hover:bg-[#5a7a6b] transition">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Link>
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

