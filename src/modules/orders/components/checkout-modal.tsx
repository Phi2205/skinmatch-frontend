'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { 
  X, 
  Loader2, 
  Check,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  User,
  Mail,
  FileText
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { createDirectOrder } from '../services/orders.service';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/modules/product/types/product.type';




const checkoutSchema = zod.object({
  receiver_name: zod.string().min(2, 'Tên người nhận phải có ít nhất 2 ký tự'),
  receiver_phone: zod.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  receiver_email: zod.string().email('Email không hợp lệ').optional().or(zod.literal('')),
  address_line: zod.string().min(5, 'Địa chỉ chi tiết phải có ít nhất 5 ký tự'),
  ward: zod.string().optional(),
  district: zod.string().optional(),
  city: zod.string().optional(),
  note: zod.string().optional(),
  payment_method: zod.enum(['MOMO', 'VNPAY']).default('MOMO'),
});

type CheckoutFormData = zod.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variantId?: number | null;
  quantity: number;
  totalPrice: number;
}

export function CheckoutModal({ 
  isOpen, 
  onClose, 
  product, 
  variantId, 
  quantity, 
  totalPrice 
}: CheckoutModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);



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

  const router = useRouter();
  const paymentMethod = useWatch({ control, name: 'payment_method' });

  const mutation = useMutation({
    mutationFn: createDirectOrder,
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Đặt hàng thành công!');
        const orderId = response.data.id;
        
        // Redirect based on payment method submitted
        if ((variables.payment_method === 'MOMO' || variables.payment_method === 'VNPAY') && response.data.payUrl) {
          window.location.href = response.data.payUrl;
        } else {
          router.push(`/order-confirmation?orderId=${orderId}`);
        }
        
        onClose();
      } else {
        console.error('Direct order creation returned failure response:', response);
        toast.error(response.message || 'Đã xảy ra lỗi khi đặt hàng');
      }
    },
    onError: (error: any) => {
      console.error('Direct order creation failed error:', error);
      toast.error(error?.response?.data?.message || 'Không thể kết nối đến máy chủ');
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    mutation.mutate({
      ...data,
      product_id: product.id,
      variant_id: variantId || undefined,
      quantity,
    });
  };

  const selectedVariant = product.variants?.find(v => v.id === variantId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]"
          >
            {isSuccess ? (
              <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Check size={48} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-black text-gray-900">ĐẶT HÀNG THÀNH CÔNG!</h2>
                <p className="text-gray-500 max-w-md">
                  Cảm ơn bạn đã tin tưởng SkinMatch. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
                </p>
                <div className="pt-4">
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-[#326e51] text-white font-bold rounded-2xl hover:bg-[#25543d] transition-all cursor-pointer"
                  >
                    Quay lại cửa hàng
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Left Side: Form */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto scrollbar-hide">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                      <Truck className="text-[#326e51]" />
                      THANH TOÁN
                    </h2>
                    <button onClick={onClose} className="md:hidden p-2 text-gray-400 cursor-pointer"><X /></button>
                  </div>

                  <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <User size={14} /> Tên người nhận
                        </label>
                        <input
                          {...register('receiver_name')}
                          className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#326e51]/20 transition font-bold ${
                            errors.receiver_name ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-[#326e51]'
                          }`}
                          placeholder="Nguyễn Văn A"
                        />
                        {errors.receiver_name && <p className="text-[10px] text-red-500 font-bold">{errors.receiver_name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Phone size={14} /> Số điện thoại
                        </label>
                        <input
                          {...register('receiver_phone')}
                          className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#326e51]/20 transition font-bold ${
                            errors.receiver_phone ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-[#326e51]'
                          }`}
                          placeholder="0901234567"
                        />
                        {errors.receiver_phone && <p className="text-[10px] text-red-500 font-bold">{errors.receiver_phone.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail size={14} /> Email
                      </label>
                      <input
                        {...register('receiver_email')}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#326e51]/20 focus:border-[#326e51] transition font-bold"
                        placeholder="example@gmail.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} /> Địa chỉ nhận hàng
                      </label>
                      <input
                        {...register('address_line')}
                        className={`w-full px-5 py-3.5 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#326e51]/20 transition font-bold ${
                          errors.address_line ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-[#326e51]'
                        }`}
                        placeholder="Số nhà, tên đường, phường/xã..."
                      />
                      {errors.address_line && <p className="text-[10px] text-red-500 font-bold">{errors.address_line.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} /> Ghi chú cho đơn hàng
                      </label>
                      <textarea
                        {...register('note')}
                        rows={2}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#326e51]/20 focus:border-[#326e51] transition resize-none font-bold"
                        placeholder="Ghi chú về thời gian giao hàng, chỉ dẫn địa chỉ..."
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard size={14} /> Chọn phương thức thanh toán:
                      </label>
                      
                      <div className="space-y-3">
                        {/* MoMo Option */}
                        <label 
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            mutation.isPending ? 'opacity-50 pointer-events-none' : ''
                          } ${
                            paymentMethod === 'MOMO' 
                              ? 'border-orange-500 bg-orange-50/5 shadow-sm scale-[1.01]' 
                              : 'border-gray-100 hover:border-orange-500/20'
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
                            <span className="text-sm font-bold text-gray-800">
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
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            mutation.isPending ? 'opacity-50 pointer-events-none' : ''
                          } ${
                            paymentMethod === 'VNPAY' 
                              ? 'border-orange-500 bg-orange-50/5 shadow-sm scale-[1.01]' 
                              : 'border-gray-100 hover:border-orange-500/20'
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
                            <span className="text-sm font-bold text-gray-800">
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

                {/* Right Side: Order Summary */}
                <div className="w-full md:w-[380px] bg-gray-50 p-8 border-l border-gray-100 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">ĐƠN HÀNG</h3>
                    <button onClick={onClose} className="hidden md:block p-2 text-gray-400 hover:text-gray-600 transition cursor-pointer"><X /></button>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={product.image_url || (product.images?.[0]?.image_url) || '/placeholder.png'} alt="" className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate leading-tight">{product.name}</p>
                        {selectedVariant && (
                          <p className="text-[10px] font-black text-[#326e51] mt-1 bg-[#326e51]/5 px-2 py-0.5 rounded-full inline-block">
                            {selectedVariant.attributes.map(a => a.value).join(' / ')}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 font-bold mt-1">Số lượng: {quantity}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-400">Tạm tính</span>
                        <span className="font-black text-gray-900">{totalPrice.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-400">Phí vận chuyển</span>
                        <span className="text-[#326e51] font-black uppercase text-[10px] bg-[#326e51]/5 px-2 py-0.5 rounded-md tracking-tighter">Miễn phí toàn quốc</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-200 space-y-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-black text-gray-900">TỔNG CỘNG</span>
                      <span className="text-3xl font-black text-[#326e51] tracking-tighter">{totalPrice.toLocaleString('vi-VN')}₫</span>
                    </div>
                    
                    <button
                      form="checkout-form"
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full py-4.5 bg-[#326e51] text-white font-black rounded-2xl hover:bg-[#25543d] transition-all shadow-xl shadow-[#326e51]/30 flex items-center justify-center gap-3 disabled:opacity-70 cursor-pointer active:scale-95"
                    >
                      {mutation.isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        'XÁC NHẬN ĐẶT HÀNG'
                      )}
                    </button>



                    <p className="text-[10px] text-center text-gray-400 font-bold">
                      Bằng việc đặt hàng, bạn đồng ý với Điều khoản của SkinMatch
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
