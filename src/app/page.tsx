'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { Hero } from '@/shared/components/hero';
import { MobileHero } from '@/shared/components/mobile-hero';
import Link from 'next/link';
import { Leaf, Shield, Recycle, Flame } from 'lucide-react';
import { BestSellers } from '@/modules/product/components/best-sellers';
import { HotProducts } from '@/modules/product/components/hot-products';
import { FlashSale } from '@/modules/flash-sales/components/flash-sale';

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Desktop Hero */}
      <div className="hidden md:block">
        <Hero />
      </div>

      {/* Mobile Hero (Hasaki style) */}
      <div className="block md:hidden">
        <MobileHero />
      </div>

      <FlashSale />

      {/* Hot Products Section */}
      <section className="py-16 bg-[#f5f6f8] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0f5f2] text-[#326e51] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Flame size={14} className="fill-[#326e51] text-[#326e51] animate-pulse" />
              <span>Cực Kỳ Hot</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Sản Phẩm Hot Nhất
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Khám phá các sản phẩm đang được săn đón và bán chạy nhất tại SkinMatch ngay hôm nay!
            </p>
          </div>

          <HotProducts />
        </div>
      </section>

      {/* Benefits Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Leaf className="w-12 h-12 text-[#7a9e8e]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Natural</h3>
              <p className="text-gray-600 text-sm">
                All our ingredients are natural and carefully selected for effectiveness
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-[#7a9e8e]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cruelty-Free</h3>
              <p className="text-gray-600 text-sm">
                Never tested on animals. Supporting ethical beauty practices
              </p>
            </div>

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
      </section> */}

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

          <BestSellers />

          {/* <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition"
            >
              View All Products
            </Link>
          </div> */}
        </div>
      </section>

      <Footer />
    </div>
  );
}


