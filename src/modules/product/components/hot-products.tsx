'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByBadgeSlug } from '@/modules/product/services/product.service';

const getMDSoldCount = (id: number) => {
  // Generate a consistent "M đã bán" number based on product ID, like 2.638M, 2.47M, etc.
  const base = (id * 149) % 2000 + 1000; // e.g. 1000 to 3000
  const formatted = (base / 1000).toFixed(3);
  // Remove trailing zeros if any to make it look like 2.47M or 2.638M
  let str = formatted;
  if (str.endsWith('0')) str = str.slice(0, -1);
  if (str.endsWith('0')) str = str.slice(0, -1);
  if (str.endsWith('.')) str = str.slice(0, -1);
  return `${str}M`;
};

export function HotProducts() {
  const [page] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: hotProductsResponse, isLoading } = useQuery({
    queryKey: ['products', 'hot', page],
    queryFn: () => getProductsByBadgeSlug('hot', page, 15), // Fetch up to 15 items for scroll
  });

  const products = hotProductsResponse?.data?.items || [];

  const handleScrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 360; // Approximate width of 2 items
    const isAtBeginning = container.scrollLeft <= 10;

    if (isAtBeginning) {
      // Loop to the end
      container.scrollTo({
        left: container.scrollWidth - container.clientWidth,
        behavior: 'smooth',
      });
    } else {
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 360; // Approximate width of 2 items
    // scrollLeft + clientWidth reaching scrollWidth means we're at the end
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 15;

    if (isAtEnd) {
      // Loop back to the beginning (nhảy tới đầu)
      container.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    } else {
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full group">
      {/* Inject styling to completely hide the scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none !important;
        }
      `}} />

      {/* Navigation Arrow Left */}
      {products.length > 0 && (
        <button 
          onClick={handleScrollLeft}
          className="absolute -left-4 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center text-gray-700 hover:text-[#326e51] hover:border-[#7a9e8e]/40 hover:scale-110 active:scale-95 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer md:opacity-0 md:group-hover:opacity-100"
          aria-label="Scroll Left"
        >
          <ChevronLeft size={20} className="stroke-[2.5]" />
        </button>
      )}

      {/* Navigation Arrow Right */}
      {products.length > 0 && (
        <button 
          onClick={handleScrollRight}
          className="absolute -right-4 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center text-gray-700 hover:text-[#326e51] hover:border-[#7a9e8e]/40 hover:scale-110 active:scale-95 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer md:opacity-0 md:group-hover:opacity-100"
          aria-label="Scroll Right"
        >
          <ChevronRight size={20} className="stroke-[2.5]" />
        </button>
      )}

      {isLoading ? (
        // Initial Loading Skeletons
        <div 
          className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide px-4 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-44 h-60 bg-white rounded-[24px] border border-gray-100/50 p-5 space-y-4 animate-pulse shadow-sm flex flex-col items-center"
            >
              <div className="w-28 h-28 bg-gray-100 rounded-2xl" />
              <div className="space-y-2 w-full flex flex-col items-center">
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-white rounded-[24px] border border-dashed border-gray-200">
          <Flame className="w-12 h-12 mx-auto mb-3 text-[#326e51] opacity-40 animate-bounce" />
          <p className="font-semibold text-gray-600">Hiện tại chưa có sản phẩm hot nào.</p>
        </div>
      ) : (
        // Horizontal Scroll Container
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide px-4 sm:px-0 scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch' 
          }}
        >
          {products.map((product: any) => {
            const productImg = product.image_url || '/placeholder.png';

            return (
              <Link 
                key={product.id}
                href={`/products/${product.slug}`} 
                className="group flex-shrink-0 w-44 bg-white rounded-[24px] border border-gray-100/40 p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                {/* Image Container with Elegant Padding */}
                <div className="relative w-full aspect-square mb-4 flex items-center justify-center p-1">
                  <Image
                    src={productImg}
                    alt={product.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="150px"
                    priority
                  />
                </div>

                {/* Content Container */}
                <div className="flex flex-col items-center w-full mt-auto">
                  {/* Sold count in grey */}
                  <span className="text-[11px] text-gray-400 font-medium tracking-wide mb-1.5">
                    {getMDSoldCount(product.id)} đã bán
                  </span>
                  
                  {/* Product Title in bold centered */}
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-2 w-full group-hover:text-[#326e51] transition-colors px-1">
                    {product.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
