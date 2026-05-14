'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/modules/cart/hooks/useCart';
import { useAuth } from '@/contexts/authContext';
import { Trash2, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, isLoading: isCartLoading } = useCart();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login?redirect=/cart');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const shipping = 0;
  const tax = 0;
  const grandTotal = total;

  if (isAuthLoading || isCartLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#7a9e8e] animate-spin" />
            <p className="text-gray-600 animate-pulse">Đang tải giỏ hàng...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#f5f2ed] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-600 mb-8">
              Khám phá bộ sưu tập các sản phẩm chăm sóc da của chúng tôi
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 md:pt-28 pb-12">
        {/* Page Title */}
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">Giỏ Hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white rounded-lg p-6 border border-[#e8e5dd]"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-lg font-semibold text-gray-900 hover:text-[#7a9e8e] transition block mb-2"
                  >
                    {item.name}
                  </Link>
                  
                  {item.attributes && item.attributes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.attributes.map((attr, idx) => (
                        <span key={idx} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {attr.name}: {attr.value}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#e8e5dd] rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-3 py-2 hover:bg-[#f5f2ed]"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-l border-r border-[#e8e5dd]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-2 hover:bg-[#f5f2ed]"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-[#e8e5dd] sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-[#e8e5dd]">
                <div className="flex justify-between">
                  <span className="text-gray-700">Tạm tính</span>
                  <span className="font-semibold text-gray-900">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-[#e8e5dd]">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-[#7a9e8e]">
                    {grandTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition mb-4"
              >
                Tiến hành thanh toán
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="w-full block text-center px-6 py-3 border border-[#e8e5dd] text-gray-900 font-semibold rounded-lg hover:bg-[#f5f2ed] transition"
              >
                Tiếp tục mua sắm
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-[#e8e5dd] space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <span>Miễn phí vận chuyển cho đơn hàng trên 500.000₫</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <span>Đảm bảo hoàn tiền trong 30 ngày</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">✓</span>
                  <span>Thanh toán an toàn với bảo mật SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

