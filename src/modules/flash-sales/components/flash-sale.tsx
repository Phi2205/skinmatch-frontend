'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ChevronLeft, ChevronRight, Loader2, Flame } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getActiveFlashSales, getCampaignItems } from '../services/flash-sale.service';
import { FlashSaleCampaign, FlashSaleItem, FlashSaleProduct } from '../types/flash-sale.type';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [page] = useState(1);
  const limit = 20;

  // 1. Fetch active flash sale campaigns
  const { data: activeCampaignsResponse, isLoading: isActiveLoading } = useQuery({
    queryKey: ['activeFlashSales'],
    queryFn: () => getActiveFlashSales(),
  });

  const campaigns: FlashSaleCampaign[] = activeCampaignsResponse?.data
    ? (Array.isArray(activeCampaignsResponse.data)
        ? activeCampaignsResponse.data
        : (activeCampaignsResponse.data as any).items || [])
    : [];

  const campaign = campaigns[0];
  const campaignId = campaign?.id;

  // 2. Fetch products of that specific active campaign (paginated)
  const { data: campaignItemsResponse, isLoading: isItemsLoading } = useQuery({
    queryKey: ['campaignItems', campaignId, page],
    queryFn: () => getCampaignItems(campaignId!, { page, limit }),
    enabled: !!campaignId,
  });

  const isLoading = isActiveLoading || (!!campaignId && isItemsLoading);

  const displayItems: FlashSaleProduct[] = campaignItemsResponse?.data?.items || [];

  // Ref and scroll handlers for slider
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!campaign?.end_at) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(campaign.end_at).getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer(); // Initial call
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [campaign?.end_at]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-4 sm:py-12 bg-white">
        <div className="mx-0 sm:max-w-7xl sm:mx-auto px-0 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#7a9e8e] to-[#6a8e7e] sm:rounded-3xl p-3 sm:p-6 shadow-sm sm:shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-3 sm:mb-6 animate-pulse px-2 sm:px-0">
              <div className="flex items-center gap-2">
                <div className="h-6 w-24 sm:h-7 sm:w-36 bg-white/20 rounded-lg" />
                <div className="flex items-center gap-1">
                  <div className="h-5 w-6 bg-white/20 rounded" />
                  <div className="h-5 w-6 bg-white/20 rounded" />
                  <div className="h-5 w-6 bg-white/20 rounded" />
                </div>
              </div>
              <div className="h-3 w-12 sm:h-4 sm:w-16 bg-white/20 rounded" />
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-3.5 pb-1 px-2 sm:px-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[140px] sm:w-[calc(33.33%-10px)] md:w-[calc(25%-11px)] lg:w-[calc(20%-11px)] shrink-0 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col animate-pulse"
                >
                  <div className="relative aspect-square bg-gray-100 rounded-lg sm:rounded-xl" />

                  {/* Info Skeleton */}
                  <div className="mt-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Price Skeleton */}
                      <div className="flex gap-2">
                        <div className="h-4 w-16 bg-gray-100 rounded" />
                        <div className="h-3 w-10 bg-gray-100 rounded mt-1" />
                      </div>

                      {/* Title Skeletons */}
                      <div className="space-y-2 mt-3">
                        <div className="h-3.5 bg-gray-100 rounded w-full" />
                        <div className="h-3.5 bg-gray-100 rounded w-4/5" />
                      </div>
                    </div>

                    {/* Progress Bar Skeleton */}
                    <div className="w-full h-4.5 bg-gray-100 rounded-full mt-4" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    );
  }

  // If there's no active campaign, we can hide or display empty state gracefully
  if (campaigns.length === 0 || displayItems.length === 0) {
    return null; // Keep layout clean by hiding section when no flash sales are active
  }

  return (
    <section className="py-4 sm:py-12 bg-white">
      <div className="mx-0 sm:max-w-7xl sm:mx-auto px-0 sm:px-6 lg:px-8">

        {/* Outer container styled in elegant brand green */}
        <div className="bg-gradient-to-r from-[#7a9e8e] to-[#6a8e7e] sm:rounded-3xl p-3 sm:p-6 shadow-sm sm:shadow-xl relative overflow-hidden">

          {/* Header Row */}
          <div className="flex justify-between items-center mb-3 sm:mb-6 px-1 sm:px-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-base sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-4 h-4 sm:hidden text-yellow-300" />
                {campaign.title || 'Flash deals'}
              </h2>

              {/* Digit Countdown Timer */}
              <div className="flex items-center gap-1 sm:ml-2">
                <span className="bg-black/80 text-white text-[10px] sm:text-sm font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center shadow-inner">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-white font-bold text-xs sm:text-sm">:</span>
                <span className="bg-black/80 text-white text-[10px] sm:text-sm font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center shadow-inner">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-white font-bold text-xs sm:text-sm">:</span>
                <span className="bg-black/80 text-white text-[10px] sm:text-sm font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center shadow-inner">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <Link
              href="/flash-sales"
              className="flex items-center text-white text-[11px] sm:text-sm font-semibold hover:underline tracking-tight opacity-95 hover:opacity-100 transition whitespace-nowrap"
            >
              Xem tất cả <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" />
            </Link>
          </div>

          {/* Slider Container Wrapper */}
          <div className="relative group/slider">

            {/* Left Navigation Arrow */}
            {displayItems.length > 0 && (
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
              className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-3.5 pb-1 px-1 sm:px-0 scroll-smooth snap-x snap-mandatory"
            >
              {displayItems.map((product) => {
                const activeFlashSaleItem = product.flash_sale_items?.reduce((min, curr) => {
                  return (!min || curr.sale_price < min.sale_price) ? curr : min;
                }, null as typeof product.flash_sale_items[0] | null);

                if (!activeFlashSaleItem) return null;

                const salePrice = activeFlashSaleItem.sale_price;
                const originalPrice = activeFlashSaleItem.variants?.price || salePrice * 1.35;
                const discountPercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group block w-[140px] sm:w-[calc(33.33%-10px)] md:w-[calc(25%-11px)] lg:w-[calc(20%-11px)] shrink-0 snap-start"
                  >
                    <div className="bg-white rounded-xl sm:rounded-2xl hover:shadow-xl hover:-translate-y-1 transition duration-300 p-2 sm:p-3 h-full flex flex-col">

                      {/* Product Image Panel */}
                      <div className="relative aspect-square bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                        {/* Discount Banner Top-Right */}
                        <div className="absolute top-1 right-1 z-10 bg-gradient-to-r from-[#7a9e8e] to-[#326e51] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow">
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
                          <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                            <ShoppingBag size={36} />
                          </div>
                        )}
                      </div>

                      {/* Info and Price Area */}
                      <div className="mt-2 sm:mt-3 flex-1 flex flex-col">
                        <div>
                          {/* Price Row */}
                          <div className="flex flex-col sm:flex-row sm:items-baseline flex-wrap gap-0 sm:gap-1">
                            <span className="text-[#326e51] font-black text-sm sm:text-[15px]">
                              {formatPrice(salePrice)}
                            </span>
                            <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                              {formatPrice(originalPrice)}
                            </span>
                          </div>

                          {/* Product Title */}
                          <h3 className="font-semibold sm:font-bold text-gray-800 text-xs sm:text-[13px] mt-1 sm:mt-1.5 group-hover:text-[#7a9e8e] transition line-clamp-2 leading-tight">
                            {product.name}
                          </h3>
                        </div>

                        {/* Progress Bar */}
                        {/* <div className="w-full mt-3">
                            <div className="w-full h-4.5 bg-[#eef5f1] rounded-full relative overflow-hidden shadow-inner flex items-center justify-center">
                            <div 
                              className="h-full bg-gradient-to-r from-[#7a9e8e] to-[#326e51] absolute left-0 top-0 rounded-full transition-all duration-500"
                              style={{ width: `${percentSold}%` }}
                            />
                            <span className="relative z-10 text-[9px] sm:text-[10px] font-black text-white text-center">
                              {percentSold >= 80 ? `Sắp cháy hàng ${percentSold}%` : `Đã bán ${percentSold}%`}
                            </span>
                          </div>
                        </div> */}

                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Right Navigation Arrow */}
            {displayItems.length > 0 && (
              <button
                onClick={() => scroll('right')}
                className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#7a9e8e] hover:text-[#5a7a6b] shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100 duration-200 cursor-pointer border border-gray-100 hover:scale-105"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Cross-browser style tag to hide standard scrollbar lines cleanly */}
            <style dangerouslySetInnerHTML={{
              __html: `
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
