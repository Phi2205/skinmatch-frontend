'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, Sparkles, Heart, Plus, Loader2, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByBadgeSlug } from '@/modules/product/services/product.service';
import { useCart } from '@/modules/cart/hooks/useCart';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const getSoldCount = (id: number) => {
  // Generate a realistic consistent sold count based on product ID
  const base = (id * 17) % 80 + 12; // e.g. 12 to 92
  const decimal = (id * 3) % 10;
  return `${base}.${decimal}k`;
};

export function BestSellers() {
  const { addItem } = useCart();
  const [page, setPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState<any[]>([]);
  const [prevResponse, setPrevResponse] = useState<any>(null);

  const { data: bestSellersResponse, isLoading, isFetching } = useQuery({
    queryKey: ['products', 'best-seller', page],
    queryFn: () => getProductsByBadgeSlug('best-seller', page, 4),
  });

  // Synchronous state synchronization during render to completely eliminate transition lag
  if (bestSellersResponse && bestSellersResponse !== prevResponse) {
    setPrevResponse(bestSellersResponse);
    const newItems = bestSellersResponse.data?.items || [];
    setAccumulatedProducts((prev) => {
      if (page === 1) {
        return newItems;
      }
      const existingIds = new Set(prev.map((p) => p.id));
      const filteredNewItems = newItems.filter((item: any) => !existingIds.has(item.id));
      return [...prev, ...filteredNewItems];
    });
  }

  const hasNextPage = bestSellersResponse?.data?.meta?.hasNextPage || false;

  const handleAddToCart = async (product: any) => {
    try {
      const variantId = product.variants?.[0]?.id || undefined;
      await addItem(product, 1, variantId);
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const showLoading = isLoading || (isFetching && page > 1);

  return (
    <div className="space-y-12">
      {/* Redesigned Premium Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {accumulatedProducts.length === 0 && isLoading ? (
          // Initial Loading Skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 p-5 space-y-4 animate-pulse shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-2xl w-full" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-5 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-gray-100 rounded w-1/2" />
                  <div className="w-10 h-10 rounded-full bg-gray-100" />
                </div>
              </div>
            </div>
          ))
        ) : accumulatedProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#7a9e8e] opacity-40 animate-bounce" />
            <p className="font-semibold text-gray-600">Hiện tại chưa có sản phẩm bán chạy.</p>
          </div>
        ) : (
          accumulatedProducts.map((productItem) => {
            const product = productItem as any;
            const productImg = product.image_url || '/placeholder.png';

            // Resolve active flash sale at product or variant level
            const activeFlashSale = product.flash_sale || (product.variants || []).find((v: any) => v.flash_sale)?.flash_sale;

            const hasActiveFlashSale = (() => {
              if (!activeFlashSale) return false;
              const now = new Date().getTime();
              const start = new Date(activeFlashSale.start_at).getTime();
              const end = new Date(activeFlashSale.end_at).getTime();
              return now >= start && now <= end;
            })();

            const currentPrice = hasActiveFlashSale && activeFlashSale
              ? activeFlashSale.sale_price
              : product.price;

            const currentOriginalPrice = hasActiveFlashSale && activeFlashSale
              ? product.price
              : product.originalPrice;

            const discountPercent = currentOriginalPrice
              ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
              : 0;

            return (
              <div key={product.id} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                {/* Product Link Container */}
                <Link href={`/products/${product.slug}`} className="block flex-1 flex flex-col">
                  {/* Image Container with Elegant Gradient */}
                  <div className="relative aspect-square bg-gradient-to-br from-[#faf9f6] to-[#f5f2ed]/40 overflow-hidden p-6 flex-shrink-0">
                    {/* Status badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                      <span className="px-2.5 py-1 bg-[#326e51] text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse" /> BÁN CHẠY
                      </span>
                    </div>

                    {/* Corner Discount Badge (Hasaki Style) */}
                    {discountPercent > 0 && (
                      <div className="absolute top-0 right-0 z-10 bg-[#326e51] text-white font-black text-xs px-3.5 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1">
                        {hasActiveFlashSale && <Zap size={11} className="fill-amber-300 text-amber-300 animate-pulse" />}
                        <span>-{discountPercent}%</span>
                      </div>
                    )}

                    {/* Decorative Heart Button */}
                    <button className="absolute top-12 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer hover:scale-115 active:scale-95 shadow-sm">
                      <Heart size={14} className="hover:fill-red-500" />
                    </button>

                    <Image
                      src={productImg}
                      alt={product.name}
                      fill
                      className="object-contain p-5 group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      priority
                    />
                  </div>

                  {/* Content and Meta Section */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Category and Star Rating */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7a9e8e]">
                        {product.categories?.[0]?.name || 'Mỹ Phẩm'}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 bg-amber-50/50 px-2 py-0.5 rounded-full border border-amber-100/30">
                        <Star size={11} className="fill-amber-500 text-amber-500" />
                        <span>{product.rating || '4.9'}</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-extrabold text-sm text-gray-900 leading-snug group-hover:text-[#326e51] transition-colors line-clamp-2 mb-2 flex-1">
                      {product.name}
                    </h3>

                    {/* Sales Count & Summary */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 mb-2">
                      <span>{getSoldCount(product.id)} đã bán</span>
                      <span>•</span>
                      <span className="font-normal line-clamp-1">{product.summary || 'Chăm sóc tối ưu'}</span>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-[#326e51]">
                          {formatPrice(currentPrice)}
                        </span>
                        {currentOriginalPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {formatPrice(currentOriginalPrice)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-10 h-10 bg-[#7a9e8e] hover:bg-[#326e51] text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg shadow-[#7a9e8e]/20 active:scale-95 cursor-pointer"
                        title="Thêm nhanh vào giỏ hàng"
                      >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}

        {/* Skeletons while loading more items */}
        {isFetching && page > 1 && (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`more-skeleton-${i}`} className="bg-white rounded-3xl overflow-hidden border border-gray-100 p-5 space-y-4 animate-pulse shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-2xl w-full" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-5 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-gray-100 rounded w-1/2" />
                  <div className="w-10 h-10 rounded-full bg-gray-100" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button Section */}
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="px-8 py-3.5 bg-white border-2 border-[#7a9e8e]/30 text-[#326e51] font-bold text-sm rounded-2xl hover:border-[#326e51] hover:bg-[#326e51]/5 transition-all duration-300 flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#326e51]" />
                Đang tải thêm...
              </>
            ) : (
              'Xem thêm sản phẩm bán chạy'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
