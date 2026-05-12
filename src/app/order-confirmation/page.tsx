'use client';

import { useEffect, Suspense } from 'react';
import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import Link from 'next/link';
import {
  CheckCircle,
  XCircle,
  ShoppingBag,
  ArrowRight,
  User,
  MapPin
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '@/modules/orders/services/orders.service';
import { cancelOrder } from '@/modules/payments/services/payments.service';
import { motion } from 'framer-motion';

function OrderConfirmationComponent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const resultCode = searchParams.get('resultCode');
  const status = searchParams.get('status');
  const id = orderId ? parseInt(orderId) : null;
  const isFailed = (resultCode && resultCode !== '0') || status === 'failed';

  // useEffect(() => {
  //   if (isFailed && id) {
  //     cancelOrder(id).catch(console.error);
  //   }
  // }, [isFailed, id]);

  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => id ? getOrderById(id) : null,
    enabled: !!id,
  });

  const order = orderResponse?.data;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pt-32 pb-20 space-y-8">
        {/* Success Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className={`w-20 h-20 ${isFailed ? 'bg-red-500 shadow-red-500/20' : 'bg-[#7a9e8e] shadow-[#7a9e8e]/20'} rounded-lg flex items-center justify-center text-white shadow-xl rotate-6`}>
                {isFailed ? <XCircle size={40} strokeWidth={2.5} /> : <CheckCircle size={40} strokeWidth={2.5} />}
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className={`absolute -top-3 -right-3 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow border border-[#e8e5dd] ${isFailed ? 'text-red-500' : 'text-[#7a9e8e]'}`}
              >
                <ShoppingBag size={20} />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-3 tracking-tight"
          >
            {isFailed ? "THANH TOÁN THẤT BẠI" : "ĐẶT HÀNG THÀNH CÔNG"}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-500 font-semibold max-w-md mx-auto leading-relaxed"
          >
            {isFailed
              ? "Giao dịch thanh toán trực tuyến của bạn đã bị hủy hoặc gặp sự cố. Đơn hàng chưa thể xử lý thành công."
              : "Cảm ơn bạn đã tin tưởng SkinMatch. Đơn hàng của bạn đã được xác nhận thành công và đang chuẩn bị giao hàng."}
          </motion.p>

          {order && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#e8e5dd] rounded-lg shadow-sm"
            >
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mã đơn hàng:</span>
              <span className="text-sm font-bold text-[#7a9e8e]">#{order.id}</span>
            </motion.div>
          )}

          {/* Order Summary Box */}
          {order && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-8 bg-white rounded-lg p-6 border border-[#e8e5dd] text-left space-y-6"
            >
              <h3 className="text-lg font-bold text-gray-900 pb-4 border-b border-[#e8e5dd] text-center">Thông tin chi tiết</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-semibold">Tiền sản phẩm</span>
                  <span className="font-bold text-gray-900">{order.total_price.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400 font-semibold">Phí giao hàng</span>
                  <span className="text-[#7a9e8e] font-semibold text-[10px] bg-[#7a9e8e]/5 px-2 py-0.5 rounded border border-[#7a9e8e]/10">Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-semibold">Phương thức thanh toán</span>
                  <span className="font-bold text-gray-900 uppercase text-xs bg-gray-100 px-2 py-0.5 rounded">{order.payment_method}</span>
                </div>
                <div className="pt-4 border-t border-[#e8e5dd] flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-[#7a9e8e]">{order.total_price.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="pt-4 border-t border-[#e8e5dd] space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thông tin giao hàng</h4>
                <div className="p-4 bg-gray-50 rounded-lg border border-[#e8e5dd] space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg border border-[#e8e5dd] flex items-center justify-center text-[#7a9e8e] flex-shrink-0 shadow-sm">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.receiver_name}</p>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">{order.receiver_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg border border-[#e8e5dd] flex items-center justify-center text-[#7a9e8e] flex-shrink-0 shadow-sm">
                      <MapPin size={16} />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                      {order.address_line}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/dashboard/orders"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7a9e8e] text-white font-bold rounded-lg hover:bg-[#5a7a6b] transition-all shadow-sm group text-sm uppercase tracking-wider"
          >
            Xem đơn hàng của bạn
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#e8e5dd] text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-all text-sm uppercase tracking-wider"
          >
            Tiếp tục mua sắm
            <ShoppingBag size={18} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center">
        <div className="text-sm text-gray-500 font-semibold animate-pulse">Đang tải thông tin đơn hàng...</div>
      </div>
    }>
      <OrderConfirmationComponent />
    </Suspense>
  );
}
