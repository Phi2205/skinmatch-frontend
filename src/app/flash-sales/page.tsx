'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { useQuery } from '@tanstack/react-query';
import { getActiveFlashSales } from '@/modules/flash-sales/services/flash-sale.service';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Loader2, Calendar, ShoppingBag, Clock, Sparkles } from 'lucide-react';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function FlashSalesLandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Fetch active campaigns
  const { data: flashSalesResponse, isLoading } = useQuery({
    queryKey: ['activeFlashSales'],
    queryFn: getActiveFlashSales,
  });

  const campaigns = flashSalesResponse?.data || [];
  const campaign = campaigns[0];
  const flashSaleItems = campaign?.items || [];

  // Group items by product_id, keeping only the variant with the minimum sale_price
  const displayItems = Object.values(
    flashSaleItems.reduce((acc, item) => {
      const pId = item.product_id;
      if (!pId) return acc;
      const existing = acc[pId];
      if (!existing || item.sale_price < existing.sale_price) {
        acc[pId] = item;
      }
      return acc;
    }, {} as Record<number, typeof flashSaleItems[0]>)
  );

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

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {isLoading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-[#7a9e8e] animate-spin" />
            <p className="text-gray-500 font-semibold text-lg">Đang tải danh sách Flash Sale...</p>
          </div>
        ) : campaigns.length === 0 || displayItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e8e5dd] p-16 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Zap size={32} className="fill-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Chưa có Flash Sale nào diễn ra</h1>
            <p className="text-gray-500 mb-6">
              Hiện tại không có chương trình khuyến mãi chớp nhoáng nào đang diễn ra. Vui lòng quay lại sau hoặc tham khảo các sản phẩm khác của chúng tôi nhé!
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#7a9e8e] text-white font-bold rounded-xl hover:bg-[#5a7a6b] transition shadow-lg shadow-[#7a9e8e]/20"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
        ) : (
          <div>
            {/* Banner/Header Section */}
            <div className="bg-[#7a9e8e] rounded-3xl p-8 sm:p-12 text-white mb-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Background Glow */}
              <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

              <div className="space-y-4 max-w-xl z-10">
                <span className="px-3 py-1 bg-white/15 text-white text-xs font-extrabold rounded-full tracking-wider uppercase flex items-center gap-1.5 w-fit">
                  <Sparkles className="w-3.5 h-3.5" /> Giờ Vàng Khuyến Mãi
                </span>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wide">
                  {campaign.title}
                </h1>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  Cơ hội mua sắm các sản phẩm chăm sóc da cao cấp của Silvor với mức giá giảm sâu chớp nhoáng độc quyền trong hôm nay!
                </p>
              </div>

              {/* Countdown panel */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 z-10 shrink-0 flex flex-col items-center justify-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-white/90 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-300" /> Thời gian còn lại
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex flex-col items-center">
                    <span className="bg-black text-white text-2xl sm:text-3xl font-black px-3 py-1.5 rounded-lg shadow-inner min-w-[50px] text-center">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-white/70 font-extrabold mt-1">GIỜ</span>
                  </div>
                  <span className="text-white font-black text-2xl -mt-5">:</span>
                  <div className="flex flex-col items-center">
                    <span className="bg-black text-white text-2xl sm:text-3xl font-black px-3 py-1.5 rounded-lg shadow-inner min-w-[50px] text-center">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-white/70 font-extrabold mt-1">PHÚT</span>
                  </div>
                  <span className="text-white font-black text-2xl -mt-5">:</span>
                  <div className="flex flex-col items-center">
                    <span className="bg-black text-white text-2xl sm:text-3xl font-black px-3 py-1.5 rounded-lg shadow-inner min-w-[50px] text-center">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-white/70 font-extrabold mt-1">GIÂY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayItems.map((item) => {
                const product = item.products;
                if (!product) return null;

                const originalPrice = item.variants?.price || item.sale_price * 1.35;
                const discountPercentage = Math.round(((originalPrice - item.sale_price) / originalPrice) * 100);

                // Stock details for bar
                const stock = item.variants?.stock || 20;
                const sold = (item.id % 8) + 3;
                const progressWidth = Math.min(Math.round((sold / stock) * 100), 95);

                return (
                  <Link 
                    key={item.id} 
                    href={`/products/${product.slug}`} 
                    className="group flex flex-col bg-white rounded-2xl border border-[#e8e5dd] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Product Image Area */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      {/* Percent Tag */}
                      <span className="absolute top-2 right-2 z-10 bg-gradient-to-r from-orange-500 to-[#e05243] text-white text-xs font-black px-2 py-0.5 rounded shadow">
                        -{discountPercentage}%
                      </span>
                      {/* Brand Label */}
                      <span className="absolute top-2 left-2 z-10 bg-[#7a9e8e]/95 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded">
                        Đặc quyền
                      </span>

                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                          <ShoppingBag size={48} />
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="flex-1 flex flex-col justify-between mt-4">
                      <div>
                        {/* Prices */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-[#e05243] text-base sm:text-lg font-black">
                            {formatPrice(item.sale_price)}
                          </span>
                          <span className="text-gray-400 line-through text-xs sm:text-sm">
                            {formatPrice(originalPrice)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-2 line-clamp-2 leading-snug group-hover:text-[#7a9e8e] transition-colors h-[42px]">
                          {product.name}
                        </h3>
                      </div>

                      {/* Progress Bar & CTA */}
                      <div className="mt-4 space-y-3">
                        <div className="w-full">
                          <div className="w-full h-5 bg-orange-100 rounded-full relative overflow-hidden shadow-inner flex items-center justify-center">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-400 to-[#e05243] absolute left-0 top-0 rounded-full transition-all duration-500"
                              style={{ width: `${progressWidth}%` }}
                            />
                            <span className="relative z-10 text-[10px] font-black text-white">
                              {progressWidth >= 80 ? `Sắp cháy hàng ${progressWidth}%` : `Đã bán ${progressWidth}%`}
                            </span>
                          </div>
                        </div>

                        <button 
                          className="w-full py-2 bg-[#7a9e8e] hover:bg-[#5a7a6b] text-white text-xs font-extrabold uppercase rounded-xl transition shadow-md shadow-[#7a9e8e]/10 group-hover:shadow-lg cursor-pointer"
                        >
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
