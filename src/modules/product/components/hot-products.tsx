'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByBadgeSlug } from '@/modules/product/services/product.service';

const getMDSoldCount = (id: number) => {
  const base = (id * 149) % 2000 + 1000; 
  const formatted = (base / 1000).toFixed(3);
  let str = formatted;
  if (str.endsWith('0')) str = str.slice(0, -1);
  if (str.endsWith('0')) str = str.slice(0, -1);
  if (str.endsWith('.')) str = str.slice(0, -1);
  return `${str}M`;
};

export function HotProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: hotProductsResponse, isLoading } = useQuery({
    queryKey: ['products', 'hot', 1],
    queryFn: () => getProductsByBadgeSlug('hot', 1, 15), 
  });

  const products = hotProductsResponse?.data?.items || [];

  const handleScrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 300; 
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 300; 
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const renderProductCard = (product: any) => {
    const productImg = product.image_url || '/placeholder.png';
    // Use category name if available, else first 3-4 words of product name
    const shortName = product.category?.name || product.name.split(' ').slice(0, 4).join(' ');

    return (
      <Link 
        key={product.id}
        href={`/products/${product.slug}`} 
        className="group bg-white rounded-[14px] border border-gray-200 hover:border-[#1a654d] p-2 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center cursor-pointer h-[155px] sm:h-[180px] flex-shrink-0 w-[116px] sm:w-[130px] snap-start"
      >
        <div className="relative w-full aspect-square mb-1.5 flex items-center justify-center p-0.5">
          <Image
            src={productImg}
            alt={product.name}
            fill
            className="object-contain mix-blend-multiply p-1 group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 110px, 150px"
          />
        </div>

        <div className="flex flex-col items-center w-full mt-auto">
          {/* <span className="text-[11px] sm:text-xs text-gray-800 font-normal tracking-wide">
            {getMDSoldCount(product.id)} đã bán
          </span> */}
          
          <h3 className="font-medium text-[12px] sm:text-[13px] text-gray-900 leading-snug line-clamp-1 w-full mt-0.5">
            {shortName}
          </h3>
        </div>
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full relative px-4 sm:px-0">
        <div className="flex overflow-x-auto gap-3 pb-6 scrollbar-hide">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[116px] sm:w-[130px] h-[155px] sm:h-[180px] bg-white rounded-[14px] border border-gray-100 p-2 space-y-2 animate-pulse shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg" />
              <div className="h-2.5 bg-gray-100 rounded w-2/3 mt-2" />
              <div className="h-2.5 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative group">
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none !important;
        }
      `}} />

      <button 
        onClick={handleScrollLeft}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] items-center justify-center text-gray-700 hover:text-[#1a654d] hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronLeft size={20} className="stroke-[2.5]" />
      </button>

      <button 
        onClick={handleScrollRight}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] items-center justify-center text-gray-700 hover:text-[#1a654d] hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronRight size={20} className="stroke-[2.5]" />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2.5 sm:gap-4 pb-2 sm:pb-6 scrollbar-hide px-4 sm:px-0 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product: any) => renderProductCard(product))}
      </div>
    </div>
  );
}
