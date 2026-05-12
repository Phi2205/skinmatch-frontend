'use client';

import { Header } from '@/shared/components/header';
import { Footer } from '@/shared/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/modules/cart/hooks/useCart';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Lock, User, Phone, Mail, MapPin, FileText, CreditCard, Loader2 } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/modules/orders/services/orders.service';
import { toast } from 'sonner';

const checkoutSchema = zod.object({
  receiver_name: zod.string().min(2, 'Tên người nhận phải có ít nhất 2 ký tự'),
  receiver_phone: zod.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  receiver_email: zod.string().email('Email không hợp lệ').optional().or(zod.literal('')),
  address_line: zod.string().min(5, 'Địa chỉ chi tiết phải có ít nhất 5 ký tự'),
  note: zod.string().optional(),
  payment_method: zod.enum(['MOMO', 'VNPAY']).default('MOMO'),
});

type CheckoutFormData = zod.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_method: 'MOMO'
    }
  });

  const paymentMethod = useWatch({ control, name: 'payment_method' });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Đặt hàng thành công!');
        clearCart();
        const orderId = response.data.id;
        
        if (response.data.payUrl) {
          window.location.href = response.data.payUrl;
        } else {
          router.push(`/order-confirmation?orderId=${orderId}`);
        }
      } else {
        console.error('Cart order creation returned failure response:', response);
        toast.error(response.message || 'Đã xảy ra lỗi khi đặt hàng');
      }
    },
    onError: (error: any) => {
      console.error('Cart order creation failed error:', error);
      toast.error(error?.response?.data?.message || 'Không thể kết nối đến máy chủ');
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    mutation.mutate(data);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
          <div className="text-center max-w-md bg-white p-8 rounded-lg border border-[#e8e5dd] space-y-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Lock size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-semibold">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy chọn những sản phẩm phù hợp nhất cho làn da của mình nhé!
            </p>
            <Link
              href="/products"
              className="inline-block w-full px-6 py-3 bg-[#7a9e8e] hover:bg-[#5a7a6b] text-white font-semibold rounded-lg transition-all text-sm uppercase tracking-wider"
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left: Form (Col-span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-8 border border-[#e8e5dd] space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Shipping Address
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <input
                      {...register('receiver_name')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition font-semibold text-sm ${
                        errors.receiver_name ? 'border-red-300 focus:border-red-500' : 'border-[#e8e5dd] focus:border-[#7a9e8e]'
                      }`}
                      placeholder="Receiver name"
                    />
                    {errors.receiver_name && (
                      <p className="text-[10px] text-red-500 font-semibold">{errors.receiver_name.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <input
                      {...register('receiver_phone')}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition font-semibold text-sm ${
                        errors.receiver_phone ? 'border-red-300 focus:border-red-500' : 'border-[#e8e5dd] focus:border-[#7a9e8e]'
                      }`}
                      placeholder="Phone number"
                    />
                    {errors.receiver_phone && (
                      <p className="text-[10px] text-red-500 font-semibold">{errors.receiver_phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <input
                    {...register('receiver_email')}
                    className="w-full px-4 py-2 bg-white border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition font-semibold text-sm"
                    placeholder="Email"
                  />
                  {errors.receiver_email && (
                    <p className="text-[10px] text-red-500 font-semibold">{errors.receiver_email.message}</p>
                  )}
                </div>

                {/* Address Line */}
                <div className="space-y-1.5">
                  <input
                    {...register('address_line')}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 transition font-semibold text-sm ${
                      errors.address_line ? 'border-red-300 focus:border-red-500' : 'border-[#e8e5dd] focus:border-[#7a9e8e]'
                    }`}
                    placeholder="Street address (No., street, ward, district, city)"
                  />
                  {errors.address_line && (
                    <p className="text-[10px] text-red-500 font-semibold">{errors.address_line.message}</p>
                  )}
                </div>

                {/* Note */}
                <div className="space-y-1.5">
                  <textarea
                    {...register('note')}
                    rows={3}
                    className="w-full px-4 py-2 bg-white border border-[#e8e5dd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e]/20 focus:border-[#7a9e8e] transition resize-none font-semibold text-sm"
                    placeholder="Order note (delivery guidelines, timing...)"
                  />
                </div>

                {/* Payment Methods Section from image */}
                <div className="pt-4 border-t border-[#e8e5dd] space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Chọn phương thức thanh toán:
                  </h3>
                  
                  <div className="space-y-3">
                    {/* MoMo Option */}
                    <label 
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        mutation.isPending ? 'opacity-50 pointer-events-none' : ''
                      } ${
                        paymentMethod === 'MOMO' 
                          ? 'border-orange-500 bg-orange-50/5 shadow-sm' 
                          : 'border-gray-200 hover:border-orange-500/20'
                      }`}
                    >
                      <input 
                        type="radio" 
                        {...register('payment_method')} 
                        value="MOMO" 
                        className="hidden" 
                      />
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#A50064] flex flex-col items-center justify-center text-white font-black text-[9px] leading-none space-y-0.5 flex-shrink-0">
                          <span>mo</span>
                          <span>mo</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          Ví điện tử MoMo
                        </span>
                      </div>

                      {/* Custom Radio Button */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'MOMO' ? 'border-orange-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'MOMO' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        )}
                      </div>
                    </label>

                    {/* VNPay Option */}
                    <label 
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        mutation.isPending ? 'opacity-50 pointer-events-none' : ''
                      } ${
                        paymentMethod === 'VNPAY' 
                          ? 'border-orange-500 bg-orange-50/5 shadow-sm' 
                          : 'border-gray-200 hover:border-orange-500/20'
                      }`}
                    >
                      <input 
                        type="radio" 
                        {...register('payment_method')} 
                        value="VNPAY" 
                        className="hidden" 
                      />
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex flex-col items-center justify-center font-bold text-[8px] leading-tight text-blue-600 flex-shrink-0">
                          <span className="text-red-500 font-extrabold text-[10px]">VN</span>
                          <span className="text-blue-800 font-black tracking-tighter text-[8px]">PAY</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          Cổng thanh toán VNPay
                        </span>
                      </div>

                      {/* Custom Radio Button */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'VNPAY' ? 'border-orange-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'VNPAY' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Order Summary Sticky Box (Col-span 1) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-[#e8e5dd] sticky top-24 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-4 max-h-96 overflow-y-auto pb-4 border-b border-[#e8e5dd]">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-50 rounded border border-gray-100 flex-shrink-0">
                      <Image
                        src={item.imageUrl || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-contain p-1 rounded"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </p>
                      {item.attributes && item.attributes.length > 0 && (
                        <p className="text-[10px] font-semibold text-[#7a9e8e] mt-1 bg-[#7a9e8e]/5 px-2 py-0.5 rounded inline-block">
                          {item.attributes.map(a => a.value).join(' / ')}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-semibold">Subtotal</span>
                  <span className="font-semibold text-gray-900">{total.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-500 font-semibold">Shipping</span>
                  <span className="text-[#7a9e8e] font-semibold uppercase text-[10px] bg-[#7a9e8e]/5 px-2 py-0.5 rounded border border-[#7a9e8e]/10">Free</span>
                </div>
              </div>

              {/* Total Price & Submit Button */}
              <div className="pt-6 border-t border-[#e8e5dd] space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#7a9e8e]">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <button
                  form="checkout-form"
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-3 bg-[#7a9e8e] text-white font-bold rounded-lg hover:bg-[#5a7a6b] transition-all flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    'Place Order'
                  )}
                </button>

                <p className="text-[10px] text-center text-gray-400 font-semibold">
                  By placing an order, you agree to SkinMatch's Shopping Terms
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
