'use client';

import { use, useEffect, useState } from 'react';
import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import { getOrderById } from '@/modules/orders/services/orders.service';
import { useQuery } from '@tanstack/react-query';
import {
  CreditCard,
  Loader2,
  CheckCircle,
  Clock,
  ChevronRight,
  QrCode,
  ShieldCheck,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const id = parseInt(orderId);
  const router = useRouter();

  const { data: orderResponse, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
  });

  const order = orderResponse?.data;

  // If COD, automatically redirect to confirmation
  useEffect(() => {
    if (order && order.payment_method === 'COD') {
      router.push(`/order-confirmation?orderId=${order.id}`);
    }
  }, [order, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#326e51]" size={48} />
        <p className="mt-4 font-black text-gray-500 uppercase tracking-widest text-xs">Đang tải thông tin thanh toán...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
          <AlertCircle size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">KHÔNG TÌM THẤY ĐƠN HÀNG</h1>
        <p className="text-gray-500 mb-8 max-w-sm font-medium">Đơn hàng của bạn không tồn tại hoặc đã quá hạn thanh toán. Vui lòng kiểm tra lại.</p>
        <Link href="/" className="bg-[#326e51] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#326e51]/20 hover:scale-105 transition-all">
          QUAY LẠI TRANG CHỦ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-[#326e51] transition-colors">Trang chủ</Link>
          <ChevronRight size={12} />
          <span>Thanh toán</span>
          <ChevronRight size={12} />
          <span className="text-gray-900">Đơn hàng #{order.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Payment Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#326e51] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#326e51]/20">
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Thanh toán</h1>
                    <p className="text-sm text-[#326e51] font-black">Mã đơn hàng: #{order.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</span>
                  <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase border border-yellow-100 mt-1">
                    Chờ thanh toán
                  </span>
                </div>
              </div>

              <div className="p-10 bg-[#f8f9fa] rounded-[32px] border border-gray-100 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#326e51]/5 rounded-bl-[100px] -mr-10 -mt-10" />

                {order.payment_method === 'MOMO' || order.payment_method === 'ZALOPAY' ? (
                  <>
                    <div className="relative z-10">
                      <div className="w-56 h-56 bg-white p-6 rounded-[40px] shadow-2xl border border-gray-100 flex items-center justify-center group transition-transform hover:scale-105 duration-500">
                        {/* Mock QR Code */}
                        <QrCode size={160} className="text-[#326e51] group-hover:text-[#25543d] transition-colors" />
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-4 -right-4 w-12 h-12 bg-[#326e51] text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white"
                      >
                        <CheckCircle size={24} />
                      </motion.div>
                    </div>

                    <div className="space-y-3 z-10">
                      <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Quét mã {order.payment_method}</h3>
                      <p className="text-sm text-gray-500 font-bold max-w-sm leading-relaxed">
                        Mở ứng dụng <span className="text-[#326e51] font-black">{order.payment_method}</span> của bạn, chọn chức năng "Quét mã QR" và quét hình bên trên để hoàn tất.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 shadow-sm text-[#326e51] rounded-2xl text-xs font-black z-10">
                      <Clock size={16} className="animate-pulse" />
                      <span className="uppercase tracking-widest">Hiệu lực trong: 14:59</span>
                    </div>
                  </>
                ) : (
                  <div className="py-16 relative z-10">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-green-100/50">
                      <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Thanh toán khi nhận hàng (COD)</h3>
                    <p className="text-sm text-gray-500 mt-3 font-bold max-w-xs mx-auto leading-relaxed">
                      Đơn hàng của bạn đã được ghi nhận. Vui lòng chuẩn bị <span className="text-[#326e51] font-black">{order.total_price.toLocaleString('vi-VN')}₫</span> khi nhân viên giao hàng đến.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-12 space-y-4">
                <div className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:border-[#326e51]/20 transition-colors group cursor-pointer shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-sm font-black text-gray-700 uppercase tracking-tight">Giao dịch an toàn & Bảo mật</span>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-[#326e51] transition-colors" size={20} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/"
                    className="py-5 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-3xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group"
                  >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    HỦY BỎ
                  </Link>
                  <button
                    onClick={() => window.location.href = `/order-confirmation?orderId=${order.id}`}
                    className="py-5 bg-[#326e51] text-white font-black rounded-3xl hover:bg-[#25543d] transition-all shadow-2xl shadow-[#326e51]/30 flex items-center justify-center gap-3 active:scale-95"
                  >
                    XÁC NHẬN ĐÃ TRẢ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-10 sticky top-32">
              <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight border-b border-gray-50 pb-6">Đơn hàng của bạn</h3>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Tiền hàng</span>
                  <span className="font-black text-gray-900">{order.total_price.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Phí giao hàng</span>
                  <span className="text-[#326e51] font-black uppercase text-[10px] bg-[#326e51]/5 px-3 py-1 rounded-full border border-[#326e51]/10">Miễn phí</span>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Tổng cộng</span>
                  <span className="text-3xl font-black text-[#326e51] tracking-tighter">{order.total_price.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-gray-100">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Thông tin giao hàng</h4>
                  <div className="p-6 bg-[#f8f9fa] rounded-3xl border border-gray-50 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#326e51] flex-shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{order.receiver_name}</p>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">{order.receiver_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#326e51] flex-shrink-0">
                        <MapPin size={18} />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-bold">
                        {order.address_line}, {order.ward}, {order.district}, {order.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <AlertCircle size={14} />
                  <span>Cần hỗ trợ? Hotline 1900 1234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MapPin(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
