'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, use, useMemo } from 'react';
import {
  Heart,
  Share2,
  Star,
  Check,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Clock,
  ChevronRight,
  Info,
  ChevronLeft,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getProductBySlug, getSimilarProducts, getProductReviews } from '@/modules/product/services/product.service';
import { ProductSkeleton } from '@/modules/product/components/product-skeleton';
import { useCart } from '@/modules/cart/hooks/useCart';
import { toast } from 'sonner';
import { CheckoutModal } from '@/modules/orders/components/checkout-modal';

// Extended Mock Data to match Hasaki details
const MOCK_PRODUCT = {
  id: 1,
  name: "Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml",
  brand: "CeraVe",
  slug: "sua-rua-mat-cerave-sach-sau-473ml",
  price: 490000,
  originalPrice: 535000,
  category: "Sữa Rửa Mặt",
  description: `
    <div class="space-y-4">
      <p>Hiện sản phẩm <strong>Sữa Rửa Mặt Cerave Sạch Sâu</strong> đã có mặt tại <strong>SkinMatch</strong> với 3 loại và 3 dung tích (88ml; 236ml; 473ml):</p>
      <ul class="list-disc pl-5 space-y-1">
        <li><strong>Sữa Rửa Mặt Cerave Sạch Sâu Cho Da Thường Đến Da Dầu</strong></li>
        <li><strong>Sữa Rửa Mặt Cerave Làm Sạch & Tẩy Tế Bào Chết Dịu Nhẹ</strong></li>
        <li><strong>Sữa Rửa Mặt Cerave Cho Da Khô</strong></li>
      </ul>
      <h3 class="text-lg font-bold mt-6">1. Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu</h3>
      <p><strong>Sữa Rửa Mặt Cerave Foaming Cleanser</strong> kết cấu dạng gel tạo bọt rất lý tưởng để loại bỏ dầu thừa, bụi bẩn và lớp trang điểm với công thức nhẹ nhàng, không làm phá vỡ hàng rào bảo vệ tự nhiên của da và chứa các thành phần giúp duy trì độ ẩm cân bằng da.</p>
    </div>
  `,
  ingredient_full_text: "Aqua/Water, Glycerin, Coco-Betaine, Propylene Glycol, Sodium Cocoyl Glycinate, Peg-120 Methyl Glucose Dioleate, Sodium Chloride, Acrylates Copolymer, Citric Acid, Capryloyl Glycine, Caprylyl Glycol, Sodium Hydroxide, Niacinamide, Disodium Edta, Sodium Hyaluronate, Sodium Lauroyl Lactylate, Ceramide Np, Phenoxyethanol, Ceramide Ap, Phytosphingosine, Cholesterol, Xanthan Gum, Carbomer, Ethylhexylglycerin, Ceramide Eop.",
  usage_instructions: "Làm ướt da bằng nước ấm. Massage sữa rửa mặt vào da theo chuyển động tròn nhẹ nhàng. Rửa sạch lại với nước.",
  images: [
    { id: 1, image_url: "https://res.cloudinary.com/djrq6q1nx/image/upload/v1777831179/skinmatch/products/jydxi0a0vsvuvaymvq14.png", position: 0 },
    { id: 2, image_url: "https://media.hcdn.vn/catalog/product/p/r/promotions-auto-sua-rua-mat-cerave-sach-sau-cho-da-thuong-den-da-dau-473ml_1EM9SjWUk6UTus6S.png", position: 1 },
    { id: 3, image_url: "https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-sua-rua-mat-cerave-sach-sau-cho-da-thuong-den-da-dau-473ml-1741158164.jpg", position: 2 },
  ],
  badges: [
    { id: 1, name: "Bán Chạy" },
    { id: 2, name: "Chính Hãng" }
  ],
  rating: 4.9,
  reviewsCount: 1250,
  soldCount: 5000,
};

const SECTIONS = [
  { id: 'description', label: 'Mô tả' },
  { id: 'ingredients', label: 'Thành phần' },
  { id: 'usage', label: 'HDSD' },
  { id: 'reviews', label: 'Đánh giá' }
];

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('description');
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { data: productResponse, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
  });

  const apiProduct = productResponse?.data;

  const { data: similarResponse, isLoading: isSimilarLoading } = useQuery({
    queryKey: ['similarProducts', apiProduct?.id],
    queryFn: () => getSimilarProducts(apiProduct!.id, 4),
    enabled: !!apiProduct?.id,
  });

  const similarProducts = similarResponse?.data || [];
  const productInfoRef = useRef<HTMLDivElement>(null);

  // Reviews query and state
  const [reviewsPage, setReviewsPage] = useState(1);
  const reviewsLimit = 5;

  const { data: reviewsResponse, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['productReviews', apiProduct?.id, reviewsPage],
    queryFn: () => getProductReviews(apiProduct!.id, reviewsPage, reviewsLimit),
    enabled: !!apiProduct?.id,
  });

  const visibleSections = useMemo(() => {
    if (!apiProduct) return SECTIONS;
    return SECTIONS.filter(section => {
      if (section.id === 'description') return !!apiProduct.description;
      if (section.id === 'ingredients') return !!apiProduct.ingredient_full_text;
      if (section.id === 'usage') return !!apiProduct.usage_instructions;
      if (section.id === 'reviews') return true;
      return true;
    });
  }, [apiProduct]);

  useEffect(() => {
    const handleScroll = () => {
      // Sticky nav logic
      if (!productInfoRef.current) return;
      const rect = productInfoRef.current.getBoundingClientRect();
      setShowSticky(rect.bottom < 100);

      // Section highlight logic
      for (const section of visibleSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }

      // Scroll to top button logic
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleSections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  useEffect(() => {
    if (apiProduct?.variants && apiProduct.variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(apiProduct.variants[0].id || null);
    }
  }, [apiProduct, selectedVariantId]);

  const activeFlashSale = useMemo(() => {
    const sVariant = apiProduct?.variants?.find((v: any) => v.id === selectedVariantId) || apiProduct?.variants?.[0];
    return sVariant?.flash_sale || apiProduct?.flash_sale;
  }, [apiProduct, selectedVariantId]);

  const hasActiveFlashSale = useMemo(() => {
    if (!activeFlashSale) return false;
    const now = new Date().getTime();
    const start = new Date(activeFlashSale.start_at).getTime();
    const end = new Date(activeFlashSale.end_at).getTime();
    return now >= start && now <= end;
  }, [activeFlashSale]);

  const [fsTimeLeft, setFsTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!hasActiveFlashSale || !activeFlashSale?.end_at) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(activeFlashSale.end_at).getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setFsTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setFsTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [hasActiveFlashSale, activeFlashSale?.end_at]);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (error || !apiProduct) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h1>
        <p className="text-gray-600 mb-6">Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
        <Link href="/" className="bg-[#7a9e8e] text-white px-6 py-2 rounded-xl font-semibold">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  // Merge API data with mock stats for UI completeness
  const product = {
    ...MOCK_PRODUCT,
    ...apiProduct,
    images: (apiProduct.images?.length ? apiProduct.images : (apiProduct.product_images?.length ? apiProduct.product_images : [])) as any[],
    brand: (apiProduct.categories && apiProduct.categories.length > 0) ? apiProduct.categories[0].name : "SkinMatch",
    variants: apiProduct.variants || [],
  };

  // Ensure there is at least one image for the UI to avoid crashes
  if (product.images.length === 0) {
    product.images = [{
      id: 0,
      image_url: apiProduct.image_url || '/placeholder.png',
      position: 0
    }];
  }

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];

  const currentPrice = hasActiveFlashSale && activeFlashSale
    ? activeFlashSale.sale_price
    : (selectedVariant?.price || product.price);

  const currentOriginalPrice = hasActiveFlashSale && activeFlashSale
    ? (selectedVariant?.price || product.price)
    : null;

  const discount = currentOriginalPrice ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100) : 0;
  const handleAddToCart = async () => {
    if (!apiProduct) return;
    try {
      await addItem(apiProduct, quantity, selectedVariantId || undefined);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <Header />

      {/* Sticky Product Nav */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-lg border-b border-gray-100"
          >
            <div className="max-w-[1240px] mx-auto px-4">
              {/* Upper Sticky Part */}
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                    <Image src={product.images[0]?.image_url || '/placeholder.png'} alt="" fill className="object-contain p-1" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-900 truncate max-w-[200px] md:max-w-[400px]">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#326e51]">{currentPrice.toLocaleString('vi-VN')}₫</span>
                      {currentOriginalPrice && <span className="text-[10px] text-gray-400 line-through">{currentOriginalPrice.toLocaleString('vi-VN')}₫</span>}
                      <span className="text-[10px] font-bold text-[#326e51]">| {product.brand}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2.5 bg-white border-2 border-[#326e51] text-[#326e51] text-[10px] font-black rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart size={14} />
                    THÊM GIỎ HÀNG
                  </button>
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="px-6 py-2.5 bg-[#326e51] text-white text-[10px] font-black rounded-xl hover:bg-[#25543d] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    MUA NGAY
                  </button>
                </div>
              </div>

              {/* Navigation Tabs (Sticky) */}
              <div className="flex gap-8 overflow-x-auto scrollbar-hide py-3">
                {visibleSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`text-sm font-bold whitespace-nowrap transition-colors relative cursor-pointer ${activeSection === section.id ? 'text-[#326e51]' : 'text-gray-400 hover:text-gray-600'
                      }`}
                  >
                    {section.label}
                    {activeSection === section.id && (
                      <motion.div layoutId="stickyNavLine" className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#326e51]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-[1240px] mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-[13px] text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link href="/" className="hover:text-[#326e51] transition-colors">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-[#326e51] transition-colors">Sản phẩm</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Info Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Gallery */}
            <div className="lg:col-span-5 p-6 border-r border-gray-50">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={product.images[activeImageIndex]?.image_url || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setActiveImageIndex(prev => (prev > 0 ? prev - 1 : product.images.length - 1))} className="p-2 bg-white/90 rounded-full shadow-lg cursor-pointer"><ChevronLeft size={20} /></button>
                  <button onClick={() => setActiveImageIndex(prev => (prev < product.images.length - 1 ? prev + 1 : 0))} className="p-2 bg-white/90 rounded-full shadow-lg cursor-pointer"><ChevronRight size={20} /></button>
                </div>
              </div>
              <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${activeImageIndex === idx ? 'border-[#326e51] scale-105 shadow-md' : 'border-transparent'
                      }`}
                  >
                    <Image src={img.image_url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-7 p-8 md:p-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#326e51] font-bold uppercase tracking-wider text-sm">{product.brand}</span>
                  <div className="flex gap-2">
                    {product.badges.map(badge => (
                      <span key={badge.id} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-md border border-red-100">{badge.name}</span>
                    ))}
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>

                <div className="flex items-center gap-6 border-y border-gray-50 py-4">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFull = starVal <= Math.floor(product.rating || 0);
                        const isHalf = !isFull && (starVal - 0.5 <= (product.rating || 0));
                        return (
                          <Star
                            key={starVal}
                            size={16}
                            className={`${isFull
                              ? 'fill-yellow-400 text-yellow-400'
                              : isHalf
                                ? 'fill-yellow-400/50 text-yellow-400'
                                : 'text-gray-200 fill-transparent'
                              }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{product.rating || '0.0'}</span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{(product.reviews_count ?? product.reviewsCount ?? 0)} Đánh giá</span>
                  <span className="text-sm text-gray-500 font-medium">Đã bán {product.soldCount}+</span>
                </div>

                {hasActiveFlashSale && activeFlashSale && (
                  <div className="bg-[#2f6a4f] text-white rounded-lg px-4 py-2.5 flex items-center justify-between shadow-sm">
                    {/* Left Part: FLASH DEAL Label */}
                    <div className="flex items-center gap-1.5 font-black uppercase text-xs sm:text-sm tracking-wider italic">
                      <Zap size={16} className="fill-amber-400 text-amber-400 animate-pulse" />
                      <span>FLASH DEAL</span>
                    </div>

                    {/* Right Part: Countdown Timer */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                      <span className="text-white/95 text-[10px] sm:text-xs tracking-wider uppercase font-black mr-1">
                        KẾT THÚC TRONG
                      </span>

                      {/* 4-Block Countdown digits */}
                      <span className="bg-black text-white text-xs sm:text-sm font-black px-1.5 py-0.5 rounded min-w-[20px] text-center shadow-inner">
                        {fsTimeLeft.days}
                      </span>
                      <span className="text-white font-black text-xs sm:text-sm">:</span>
                      <span className="bg-black text-white text-xs sm:text-sm font-black px-1.5 py-0.5 rounded min-w-[24px] text-center shadow-inner">
                        {String(fsTimeLeft.hours).padStart(2, '0')}
                      </span>
                      <span className="text-white font-black text-xs sm:text-sm">:</span>
                      <span className="bg-black text-white text-xs sm:text-sm font-black px-1.5 py-0.5 rounded min-w-[24px] text-center shadow-inner">
                        {String(fsTimeLeft.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-white font-black text-xs sm:text-sm">:</span>
                      <span className="bg-black text-white text-xs sm:text-sm font-black px-1.5 py-0.5 rounded min-w-[24px] text-center shadow-inner">
                        {String(fsTimeLeft.seconds).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-black text-[#326e51]">{currentPrice.toLocaleString('vi-VN')}₫</span>
                    {currentOriginalPrice && (
                      <>
                        <span className="text-lg text-gray-400 line-through">{currentOriginalPrice.toLocaleString('vi-VN')}₫</span>
                        <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-lg">-{discount}%</span>
                      </>
                    )}
                  </div>

                  {product.variants.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                          {product.variants[0]?.attributes?.[0]?.name || 'Phiên bản'}
                        </p>
                        {selectedVariant && selectedVariant.stock !== undefined && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedVariant.stock > 0
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-600'
                            }`}>
                            {selectedVariant.stock > 0 ? `Còn ${selectedVariant.stock} sản phẩm` : 'Hết hàng'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {product.variants.map((v) => (
                          <button
                            key={v.id}
                            disabled={v.stock === 0}
                            onClick={() => setSelectedVariantId(v.id || null)}
                            className={`group relative px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 flex flex-col items-center min-w-[80px] cursor-pointer ${selectedVariant?.id === v.id
                              ? 'bg-[#326e51] text-white border-[#326e51] shadow-lg shadow-[#326e51]/20 scale-105'
                              : v.stock === 0
                                ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-60'
                                : 'bg-white text-gray-700 border-gray-100 hover:border-[#326e51] hover:text-[#326e51]'
                              }`}
                          >
                            <span className="relative z-10">
                              {v.attributes.map(a => a.value).join(' / ')}
                            </span>
                            {selectedVariant?.id === v.id && (
                              <motion.div
                                layoutId="activeVariant"
                                className="absolute inset-0 bg-[#326e51] rounded-2xl -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-red-500 text-xs font-bold pt-2">
                    <Clock size={14} />
                    <span>Giá tốt nhất trong 30 ngày qua</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 pt-4">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Số lượng</p>
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 hover:bg-gray-50 transition-colors text-gray-500 cursor-pointer active:scale-95"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-black text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 hover:bg-gray-50 transition-colors text-gray-500 cursor-pointer active:scale-95"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 h-auto sm:h-14 pt-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 border-2 border-[#326e51] text-[#326e51] font-black rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart />
                    THÊM GIỎ HÀNG
                  </button>
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="flex-1 bg-[#326e51] text-white font-black rounded-2xl hover:bg-[#25543d] transition-all shadow-lg shadow-[#326e51]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    MUA NGAY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar (Static) */}
        <div ref={productInfoRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 sticky top-[64px] z-40 lg:static">
          <div className="flex gap-8 px-8 overflow-x-auto scrollbar-hide py-4">
            {visibleSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-sm font-bold whitespace-nowrap transition-colors relative cursor-pointer ${activeSection === section.id ? 'text-[#326e51]' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {section.label}
                {activeSection === section.id && (
                  <motion.div layoutId="staticNavLine" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#326e51]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sequential Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          <div className="lg:col-span-9 min-w-0 w-full space-y-8">
            {/* Description Section */}
            {product.description && (
              <section id="description" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Thông tin sản phẩm</h3>
                </div>
                <div className="relative">
                  <div
                    className={`transition-all duration-500 overflow-hidden ${!isDescriptionExpanded ? 'max-h-[400px]' : 'max-h-none'}`}
                  >
                    <div className="p-8">
                      <div className="prose prose-sm prose-slate max-w-none w-full !whitespace-normal !break-normal !break-words prose-p:text-gray-600 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5" dangerouslySetInnerHTML={{ __html: product.description.replace(/&nbsp;|\u00A0/g, ' ') }} />
                    </div>
                  </div>

                  {!isDescriptionExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                  )}

                  <div className={`p-6 flex justify-center ${isDescriptionExpanded ? 'border-t border-gray-50' : ''}`}>
                    <button
                      onClick={() => {
                        if (isDescriptionExpanded) {
                          scrollToSection('description');
                        }
                        setIsDescriptionExpanded(!isDescriptionExpanded);
                      }}
                      className="flex items-center gap-2 text-[#326e51] font-black text-sm hover:opacity-80 transition-all cursor-pointer bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm"
                    >
                      {isDescriptionExpanded ? (
                        <>THU GỌN NỘI DUNG <ChevronUp size={18} /></>
                      ) : (
                        <>XEM THÊM NỘI DUNG <ChevronDown size={18} /></>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Ingredients Section */}
            {product.ingredient_full_text && (
              <section id="ingredients" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Thành phần chính</h3>
                </div>
                <div className="p-8 space-y-6">
                  {/* <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                    <Info size={24} className="text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed font-medium">Bảng thành phần có thể thay đổi theo lô sản xuất. Vui lòng tham khảo bao bì thực tế.</p>
                  </div> */}
                  <div className="prose prose-sm prose-slate max-w-none w-full !whitespace-normal !break-normal !break-words prose-p:text-gray-600 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5" dangerouslySetInnerHTML={{ __html: product.ingredient_full_text?.replace(/&nbsp;|\u00A0/g, ' ') || '' }} />
                </div>
              </section>
            )}

            {/* Usage Section */}
            {product.usage_instructions && (
              <section id="usage" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Hướng dẫn sử dụng</h3>
                </div>
                <div className="p-8">
                  <div className="prose prose-sm prose-slate max-w-none w-full !whitespace-normal !break-normal !break-words prose-p:text-gray-600 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5" dangerouslySetInnerHTML={{ __html: product.usage_instructions?.replace(/&nbsp;|\u00A0/g, ' ') || '' }} />
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section id="reviews" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Đánh giá từ khách hàng</h3>
                <div className="flex items-center gap-2">
                  <Star className="fill-yellow-400 text-yellow-400" size={18} />
                  <span className="font-bold text-gray-900">
                    {product.rating || '0.0'}/5
                  </span>
                  <span className="text-sm text-gray-500">
                    ({product.reviews_count ?? product.reviewsCount ?? 0} nhận xét)
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10 space-y-8">
                {isReviewsLoading ? (
                  <div className="space-y-6 py-4 animate-pulse">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full" />
                          <div className="space-y-1">
                            <div className="h-4 w-24 bg-gray-100 rounded" />
                            <div className="h-3 w-16 bg-gray-100 rounded" />
                          </div>
                        </div>
                        <div className="h-4 w-full bg-gray-50 rounded pl-13" />
                      </div>
                    ))}
                  </div>
                ) : !reviewsResponse?.data || reviewsResponse.data.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-3">
                    <p className="text-gray-400 text-sm">Sản phẩm chưa có đánh giá nào. ✨</p>
                    <p className="text-xs text-gray-400">Hãy mua hàng và trở thành người đầu tiên nhận xét về sản phẩm này nhé!</p>
                  </div>
                ) : (
                  <>
                    {reviewsResponse.data.map((review) => {
                      const userInitial = review.users?.name ? review.users.name.charAt(0).toUpperCase() : 'K';
                      const userName = review.users?.name || 'Khách hàng';
                      const formattedDate = review.created_at
                        ? new Date(review.created_at).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                        : 'Vừa xong';

                      return (
                        <div key={review.id} className="pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#326e51]/10 text-[#326e51] rounded-full flex items-center justify-center font-bold text-sm">
                                {userInitial}
                              </div>
                              <div>
                                <p className="text-sm font-black text-gray-900">{userName}</p>
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={
                                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">{formattedDate}</span>
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed pl-13 whitespace-pre-line">
                            {review.comment || 'Khách hàng không để lại bình luận.'}
                          </p>

                          {/* Render review images dynamically */}
                          {review.review_images && review.review_images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 pl-13">
                              {review.review_images.map((img) => (
                                <div
                                  key={img.id}
                                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 cursor-zoom-in hover:scale-105 transition-transform duration-200"
                                >
                                  <Image
                                    src={img.image_url}
                                    alt="Ảnh đánh giá từ khách hàng"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Pagination Controls */}
                    {(() => {
                      const meta = reviewsResponse?.meta;
                      if (!meta || meta.totalPages <= 1) return null;

                      return (
                        <div className="flex justify-center items-center gap-2 pt-6 border-t border-gray-100">
                          <button
                            onClick={() => setReviewsPage((p) => Math.max(1, p - 1))}
                            disabled={!meta.hasPrevPage}
                            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                          >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                          </button>

                          {Array.from({ length: meta.totalPages }).map((_, idx) => {
                            const pageNum = idx + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setReviewsPage(pageNum)}
                                className={`w-9 h-9 rounded-xl font-bold text-xs border flex items-center justify-center transition-all ${meta.page === pageNum
                                  ? 'bg-[#326e51] text-white border-[#326e51] shadow-md shadow-[#326e51]/20'
                                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          <button
                            onClick={() =>
                              setReviewsPage((p) => Math.min(meta.totalPages, p + 1))
                            }
                            disabled={!meta.hasNextPage}
                            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </section>

            {/* Similar Products Section */}
            {(isSimilarLoading || (similarProducts && similarProducts.length > 0)) && (
              <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Sản phẩm tương tự</h3>
                </div>
                <div className="p-8">
                  {isSimilarLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-5 space-y-4 animate-pulse">
                          <div className="aspect-square bg-gray-100 rounded-xl w-full" />
                          <div className="h-4 bg-gray-100 rounded w-1/3" />
                          <div className="h-5 bg-gray-100 rounded w-full" />
                          <div className="flex justify-between items-center pt-2">
                            <div className="h-6 bg-gray-100 rounded w-1/2" />
                            <div className="w-8 h-8 rounded-full bg-gray-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {similarProducts.map((p) => {
                        const minPrice = p.price || 0;
                        const productImg = p.image_url || p.images?.[0]?.image_url || '/placeholder.png';
                        return (
                          <Link key={p.id} href={`/products/${p.slug}`} className="group h-full block">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-gray-100">
                              {/* Image Container */}
                              <div className="relative aspect-square bg-[#f8f9fa] overflow-hidden p-6">
                                <Image
                                  src={productImg}
                                  alt={p.name}
                                  fill
                                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                              </div>

                              {/* Content */}
                              <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[#7a9e8e] bg-[#7a9e8e]/5 px-2 py-1 rounded">
                                    {p.categories?.[0]?.name || 'Sản phẩm'}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-gray-900">★ 4.9</span>
                                  </div>
                                </div>

                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#326e51] transition-colors line-clamp-2 leading-snug flex-1 text-xs">
                                  {p.name}
                                </h3>

                                <div className="mt-auto pt-4 border-t border-gray-50">
                                  <div className="flex justify-between items-center gap-2">
                                    <span className="text-sm font-black text-[#326e51]">
                                      {minPrice.toLocaleString('vi-VN')}₫
                                    </span>
                                    <button className="w-8 h-8 bg-[#326e51] text-white rounded-full flex items-center justify-center hover:bg-[#25543d] transition-all shadow-md active:scale-95 group-hover:rotate-90 cursor-pointer">
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-48">
              <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-[#326e51]" />
                Cam kết SkinMatch
              </h4>
              <ul className="space-y-4">
                {["100% Hàng chính hãng", "Giao hàng nhanh 2H", "Đổi trả 15 ngày"].map(c => (
                  <li key={c} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                    <Check size={16} className="text-green-500" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={apiProduct}
        variantId={selectedVariantId}
        quantity={quantity}
        totalPrice={currentPrice * quantity}
      />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-8 w-12 h-12 bg-[#326e51] text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer z-50 hover:bg-[#25543d] transition-all border-4 border-white/20 backdrop-blur-sm"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
