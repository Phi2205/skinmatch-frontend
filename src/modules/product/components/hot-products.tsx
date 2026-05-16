'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2, Flame } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const {
    data: infiniteHotProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['products', 'hot'],
    queryFn: ({ pageParam = 1 }) => getProductsByBadgeSlug('hot', pageParam, 10),
    enabled: true,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data?.meta;
      if (!meta) return undefined;
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
  });

  const products = infiniteHotProducts?.pages.flatMap((page) => page.data?.items || []) || [];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5 || hasNextPage);

      // Auto load more when near the end
      if (scrollLeft + clientWidth > scrollWidth - 300 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products, hasNextPage, isFetchingNextPage]);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollRef.current) return;
      const x = e.clientX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 1.2;
      if (Math.abs(walk) > 3) setHasMoved(true);
      scrollRef.current.scrollLeft = scrollLeftState - walk;
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, scrollLeftState]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !scrollRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.clientX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      
      if (direction === 'right' && scrollLeft + clientWidth >= scrollWidth - 10 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
        return;
      }

      const scrollAmount = clientWidth * 0.8;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
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

  return (
    <div className="w-full relative group/slider">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(122, 158, 142, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(122, 158, 142, 0.6);
        }
      `}} />

      {/* Left Arrow */}
      {canScrollLeft && (
        <button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] items-center justify-center text-gray-700 hover:text-[#1a654d] hover:scale-110 transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
        >
          <ChevronLeft size={20} className="stroke-[2.5]" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.08)] items-center justify-center text-gray-700 hover:text-[#1a654d] hover:scale-110 transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
        >
          <ChevronRight size={20} className="stroke-[2.5]" />
        </button>
      )}

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onClickCapture={onClickCapture}
        className={`flex overflow-x-auto gap-2.5 sm:gap-4 pb-4 sm:pb-8 custom-scrollbar px-4 sm:px-0 transition-all ${
          isDragging 
            ? 'cursor-grabbing select-none scroll-auto snap-none' 
            : 'cursor-grab scroll-smooth snap-x snap-mandatory'
        }`}
        style={{ 
          scrollBehavior: isDragging ? 'auto' : 'smooth',
          scrollSnapType: isDragging ? 'none' : 'x mandatory'
        }}
      >
        {isLoading && products.length === 0 ? (
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[116px] sm:w-[130px] h-[155px] sm:h-[180px] bg-white rounded-[14px] border border-gray-100 p-2 space-y-2 animate-pulse shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg" />
              <div className="h-2.5 bg-gray-100 rounded w-2/3 mt-2" />
              <div className="h-2.5 bg-gray-100 rounded w-full" />
            </div>
          ))
        ) : (
          products.map((product: any) => renderProductCard(product))
        )}

        {/* Load More Sentinel */}
        {hasNextPage && (
          <div className="shrink-0 w-20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#7a9e8e] animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
