'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByBadgeSlug } from '@/modules/product/services/product.service';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function FlashSale() {
  // Timer matching mockup values for standard display
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 32,
    seconds: 38,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 1, minutes: 32, seconds: 38 }; // reset loop for demo
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch up to 10 items to allow horizontal scrolling
  const { data: flashSaleResponse, isLoading } = useQuery({
    queryKey: ['products', 'flash-sale'],
    queryFn: () => getProductsByBadgeSlug('flash-sale', 1, 10),
  });

  const flashSaleProducts = flashSaleResponse?.data?.items || [];

  // Ref and scroll handlers for slider
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll 80% of client width for smooth progression
      const scrollAmount = clientWidth * 0.8;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer container styled in elegant brand green */}
        <div className="bg-[#7a9e8e] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          
          {/* Header Row */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                Flash deals
              </h2>
              
              {/* Digit Countdown Timer */}
              <div className="flex items-center gap-1.5 ml-2">
                <span className="bg-black text-white text-xs sm:text-sm font-extrabold px-2 py-1 rounded min-w-[26px] text-center shadow-inner">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-white font-black text-sm">:</span>
                <span className="bg-black text-white text-xs sm:text-sm font-extrabold px-2 py-1 rounded min-w-[26px] text-center shadow-inner">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-white font-black text-sm">:</span>
                <span className="bg-black text-white text-xs sm:text-sm font-extrabold px-2 py-1 rounded min-w-[26px] text-center shadow-inner">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <Link 
              href="/products" 
              className="text-white text-xs sm:text-sm font-bold hover:underline tracking-tight opacity-95 hover:opacity-100 transition"
            >
              Xem tất cả
            </Link>
          </div>

          {/* Slider Container Wrapper */}
          <div className="relative group/slider">
            
            {/* Left Navigation Arrow */}
            {flashSaleProducts.length > 0 && (
              <button 
                onClick={() => scroll('left')}
                className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#7a9e8e] hover:text-[#5a7a6b] shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 duration-200 cursor-pointer border border-gray-100 hover:scale-105"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Horizontal Scroll Track */}
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto no-scrollbar gap-3.5 pb-1 scroll-smooth snap-x snap-mandatory"
            >
              {isLoading ? (
                // Skeletal Loaders
                Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-white rounded-2xl p-3 animate-pulse h-[335px] flex flex-col justify-between w-[calc(50%-7px)] sm:w-[calc(33.33%-10px)] md:w-[calc(25%-11px)] lg:w-[calc(20%-11px)] shrink-0"
                  >
                    <div className="aspect-square bg-gray-100 rounded-xl" />
                    <div className="space-y-2 mt-4 flex-1">
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-5/6" />
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full w-full mt-4" />
                  </div>
                ))
              ) : flashSaleProducts.length === 0 ? (
                <div className="w-full py-16 text-center text-white bg-[#6b8e7e]/50 rounded-2xl border border-white/20">
                  <ShoppingBag className="w-14 h-14 mx-auto mb-3 opacity-30" />
                  <h3 className="text-lg font-bold mb-1">Không có sản phẩm Flash Sale</h3>
                  <p className="text-xs text-white/80 max-w-sm mx-auto">
                    Hiện chưa có sản phẩm nào áp dụng khuyến mãi Flash Sale trong khung giờ này.
                  </p>
                </div>
              ) : (
                flashSaleProducts.map((product) => {
                  // Mocking sale metrics based on original product price
                  const originalPrice = product.price * 1.35;
                  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

                  // Psuedo sale amounts for authenticity
                  const itemsTotal = 20;
                  const itemsSold = (product.id % 12) + 7;
                  const percentSold = Math.round((itemsSold / itemsTotal) * 100);

                  return (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.slug}`} 
                      className="group block w-[calc(50%-7px)] sm:w-[calc(33.33%-10px)] md:w-[calc(25%-11px)] lg:w-[calc(20%-11px)] shrink-0 snap-start"
                    >
                      <div className="bg-white rounded-2xl hover:shadow-xl hover:-translate-y-1 transition duration-300 p-3 h-[335px] flex flex-col justify-between">
                        
                        {/* Product Image Panel */}
                        <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                          {/* Discount Banner Top-Right */}
                          <div className="absolute top-1 right-1 z-10 bg-gradient-to-r from-orange-500 to-[#e05243] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                            -{discountPercentage}%
                          </div>

                          {/* Tag overlay Top-Left */}
                          <div className="absolute top-1 left-1 z-10 bg-[#7a9e8e]/95 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                            Duy nhất
                          </div>

                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-300">
                              <ShoppingBag size={36} />
                            </div>
                          )}
                        </div>

                        {/* Info and Price Area */}
                        <div className="mt-3 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Price Row (First, matching the screenshot) */}
                            <div className="flex items-baseline flex-wrap gap-1">
                              <span className="text-[#e05243] font-black text-sm sm:text-[15px]">
                                {formatPrice(product.price)}
                              </span>
                              <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                                {formatPrice(originalPrice)}
                              </span>
                            </div>

                            {/* Product Title (below price) */}
                            <h3 className="font-bold text-gray-800 text-xs sm:text-[13px] mt-1.5 group-hover:text-[#7a9e8e] transition line-clamp-2 h-[34px] leading-tight">
                              {product.name}
                            </h3>
                          </div>

                          {/* Progress Bar styled directly after the mockup */}
                          <div className="w-full mt-3">
                            <div className="w-full h-4.5 bg-orange-100 rounded-full relative overflow-hidden shadow-inner flex items-center justify-center">
                              {/* Filling slider progress indicator */}
                              <div 
                                className="h-full bg-gradient-to-r from-orange-400 to-[#e05243] absolute left-0 top-0 rounded-full transition-all duration-500"
                                style={{ width: `${percentSold}%` }}
                              />
                              {/* Floating percentage text */}
                              <span className="relative z-10 text-[9px] sm:text-[10px] font-black text-white text-center">
                                {percentSold >= 80 ? `Sắp cháy hàng ${percentSold}%` : `Đã bán ${percentSold}%`}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* Right Navigation Arrow */}
            {flashSaleProducts.length > 0 && (
              <button 
                onClick={() => scroll('right')}
                className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#7a9e8e] hover:text-[#5a7a6b] shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 duration-200 cursor-pointer border border-gray-100 hover:scale-105"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Cross-browser style tag to hide standard scrollbar lines cleanly */}
            <style dangerouslySetInnerHTML={{__html: `
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}} />
          </div>

        </div>

      </div>
    </section>
  );
}
