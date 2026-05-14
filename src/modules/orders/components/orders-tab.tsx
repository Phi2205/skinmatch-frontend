'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Loader2, Calendar, CreditCard, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Star, X, Camera, Trash2 } from 'lucide-react';
import { Order } from '@/modules/orders/types/orders.type';
import { PaginationMeta } from '@/modules/product/types/product.type';
import { createProductReview } from '@/modules/product/services/product.service';

interface OrdersTabProps {
  orders: Order[];
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: (page?: number, limit?: number) => void;
  ordersPage: number;
  setOrdersPage: (page: number) => void;
}

export function OrdersTab({
  orders,
  meta,
  isLoading,
  error,
  fetchOrders,
  ordersPage,
  setOrdersPage,
}: OrdersTabProps) {
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrderAndItem, setReviewOrderAndItem] = useState<{
    orderId: number;
    orderItemId: number;
    productId: number;
    productName: string;
    productImage: string;
  } | null>(null);

  const toggleOrder = (orderId: number) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleOpenReviewModal = (orderId: number, item: any, productObj: any) => {
    setReviewOrderAndItem({
      orderId,
      orderItemId: item.id,
      productId: productObj.id,
      productName: productObj.name || 'Sản phẩm',
      productImage: productObj.image_url || productObj.thumbnail || '/placeholder.png'
    });
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewOrderAndItem(null);
  };
  return (
    <div className="bg-white rounded-lg p-4 lg:p-8 border border-[#e8e5dd]">
      <div className="flex justify-between items-center mb-4 lg:mb-6 pb-4 border-b border-[#e8e5dd]">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          Lịch sử đơn hàng
        </h2>
        {meta && (
          <span className="text-xs lg:text-sm text-gray-500">
            Tổng số {meta.totalItems} đơn hàng
          </span>
        )}
      </div>

      {isLoading ? (
        <OrdersSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() => fetchOrders(ordersPage, 5)}
            className="px-4 py-2 bg-[#7a9e8e] text-white rounded-lg hover:bg-[#5a7a6b] transition text-sm font-semibold cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#f5f2ed] rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6 text-sm lg:text-base">
            Bạn chưa có đơn hàng nào.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2 bg-[#7a9e8e] text-white font-semibold rounded-lg hover:bg-[#5a7a6b] transition cursor-pointer text-sm lg:text-base"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4 lg:space-y-6">
          {orders.map((order) => {
            const orderDate = new Date(order.created_at).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Status Badge classes
            let statusClasses = "bg-gray-50 text-gray-700 border-gray-100";
            const statusUpper = order.status.toUpperCase();
            if (statusUpper === 'PENDING') {
              statusClasses = "bg-amber-50 text-amber-700 border-amber-200";
            } else if (statusUpper === 'COMPLETED' || statusUpper === 'SUCCESS' || statusUpper === 'SHIPPED') {
              statusClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
            } else if (statusUpper === 'CANCELLED' || statusUpper === 'FAILED') {
              statusClasses = "bg-rose-50 text-rose-700 border-rose-200";
            }

            // Payment Status Badge
            let paymentStatusClasses = "bg-gray-50 text-gray-700 border-gray-100";
            const payStatusUpper = order.status.toUpperCase();
            if (payStatusUpper === 'PENDING') {
              paymentStatusClasses = "bg-amber-50 text-amber-700 border-amber-200";
            } else if (payStatusUpper === 'PAID') {
              paymentStatusClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
            } else if (payStatusUpper === 'FAILED') {
              paymentStatusClasses = "bg-rose-50 text-rose-700 border-rose-200";
            }

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-[#e8e5dd] overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Order Header Info */}
                <div 
                  onClick={() => toggleOrder(order.id)}
                  className="bg-gray-50/50 px-4 py-3 lg:px-6 lg:py-4 border-b border-[#e8e5dd] flex flex-wrap justify-between items-center gap-2 lg:gap-4 cursor-pointer hover:bg-gray-100/50 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-x-4 lg:gap-x-6 gap-y-1">
                    <div>
                      <span className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mã đơn</span>
                      <p className="text-xs lg:text-sm font-bold text-gray-900">#{order.id}</p>
                    </div>
                    <div>
                      <span className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày đặt</span>
                      <p className="text-xs lg:text-sm text-gray-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-gray-400" />
                        {orderDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thanh toán</span>
                      <p className="text-xs lg:text-sm text-gray-700 flex items-center gap-1">
                        <CreditCard className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-gray-400" />
                        {order.payment_method}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:gap-3">
                    <span className={`px-2 py-0.5 lg:px-2.5 lg:py-1 text-[11px] lg:text-xs font-bold rounded-full border ${statusClasses}`}>
                      {order.status}
                    </span>
                    {expandedOrders[order.id] ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Order Items */}
                {expandedOrders[order.id] && (
                  <div className="divide-y divide-gray-100 px-4 lg:px-6">
                    {(() => {
                      const itemsList = order.items || (order as any).order_items || [];
                      if (itemsList.length === 0) {
                        return (
                          <div className="py-6 text-center text-gray-500 text-xs">
                            Không có sản phẩm nào trong đơn hàng.
                          </div>
                        );
                      }
                      return itemsList.map((item: any) => {
                        const productObj = item.product || item.products;
                        const variantObj = item.variant || item.variants;
                        const imageUrl = productObj?.image_url || productObj?.thumbnail || '/placeholder.png';
                        const volumeText = variantObj?.volume ? ` | Size: ${variantObj.volume}` : '';
                        
                        return (
                          <div key={item.id} className="py-4 flex gap-4 items-center">
                            <div className="relative w-14 h-14 bg-gray-50 border border-[#e8e5dd] rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={imageUrl}
                                alt={productObj?.name || 'Product'}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              {productObj?.slug ? (
                                <Link
                                  href={`/products/${productObj.slug}`}
                                  className="text-sm font-semibold text-gray-900 hover:text-[#7a9e8e] transition block truncate cursor-pointer"
                                >
                                  {productObj.name}
                                </Link>
                              ) : (
                                <span className="text-sm font-semibold text-gray-900 block truncate">
                                  {productObj?.name || 'Sản phẩm'}
                                </span>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                SL: {item.quantity} × {item.price.toLocaleString('vi-VN')}₫
                                {volumeText}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              {/* Review Action */}
                              {order.status.toUpperCase() === 'PAID' && (
                                item.is_reviewed ? (
                                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                                    ✓ Đã đánh giá
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleOpenReviewModal(order.id, item, productObj)}
                                    className="px-3 py-1.5 border border-[#7a9e8e] text-[#7a9e8e] hover:bg-[#7a9e8e] hover:text-white rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer"
                                  >
                                    Đánh giá
                                  </button>
                                )
                              )}
                              
                              <div className="text-right min-w-[80px]">
                                <p className="text-sm font-bold text-gray-900">
                                  {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}

                {/* Order Footer Actions & Total */}
                <div className={`px-6 py-4 bg-gray-50/20 ${expandedOrders[order.id] ? 'border-t border-[#e8e5dd]' : ''} flex flex-wrap justify-between items-center gap-4`}>
                  <div className="text-sm text-gray-600">
                    Người nhận: <span className="font-semibold text-gray-900">{order.receiver_name}</span> ({order.receiver_phone})
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-xs text-gray-500 font-medium">Tổng tiền:</span>
                      <p className="text-lg font-black text-[#7a9e8e]">
                        {order.total_price.toLocaleString('vi-VN')}₫
                      </p>
                    </div>

                    {order.payUrl && order.status.toUpperCase() !== 'PAID' && order.status.toUpperCase() !== 'CANCELLED' && (
                      <a
                        href={order.payUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#7a9e8e] text-white text-xs font-bold rounded-lg hover:bg-[#5a7a6b] transition flex items-center gap-1.5 shadow-sm shadow-[#7a9e8e]/20"
                      >
                        Thanh toán ngay
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-[#e8e5dd]">
              <button
                onClick={() => setOrdersPage(Math.max(1, ordersPage - 1))}
                disabled={!meta.hasPrevPage}
                className="p-2 border border-[#e8e5dd] rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: meta.totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setOrdersPage(pageNum)}
                    className={`w-9 h-9 rounded-lg font-bold text-sm border flex items-center justify-center transition cursor-pointer ${meta.page === pageNum
                      ? 'bg-[#7a9e8e] text-white border-[#7a9e8e] shadow-sm shadow-[#7a9e8e]/20'
                      : 'border-[#e8e5dd] text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setOrdersPage(Math.min(meta.totalPages, ordersPage + 1))}
                disabled={!meta.hasNextPage}
                className="p-2 border border-[#e8e5dd] rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        reviewData={reviewOrderAndItem}
        onSuccess={() => fetchOrders(ordersPage, 5)}
      />
    </div>
  );
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewData: {
    orderId: number;
    orderItemId: number;
    productId: number;
    productName: string;
    productImage: string;
  } | null;
  onSuccess: () => void;
}

function ReviewModal({ isOpen, onClose, reviewData, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when opening a new product
  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(null);
      setComment('');
      // Reset images
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setImagePreviews([]);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  if (!isOpen || !reviewData) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const updatedImages = [...images, ...filesArray].slice(0, 5); // Max 5 images
      setImages(updatedImages);

      const updatedPreviews = updatedImages.map((file) => URL.createObjectURL(file));
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviews(updatedPreviews);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createProductReview(reviewData.productId, {
        orderItemId: reviewData.orderItemId,
        rating,
        comment: comment.trim() || undefined,
        images: images,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#e8e5dd] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-[#e8e5dd] flex justify-between items-center">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Đánh giá sản phẩm
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {success ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Đánh giá thành công!</h4>
              <p className="text-sm text-gray-500">Cảm ơn bạn đã đóng góp ý kiến về sản phẩm.</p>
            </div>
          ) : (
            <>
              {/* Product Details */}
              <div className="flex gap-4 items-center p-3 bg-gray-50 rounded-xl border border-[#e8e5dd]">
                <div className="relative w-14 h-14 bg-white border border-[#e8e5dd] rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={reviewData.productImage}
                    alt={reviewData.productName}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {reviewData.productName}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Đơn hàng #{reviewData.orderId}</p>
                </div>
              </div>

              {/* Rating selection (Stars) */}
              <div className="space-y-2 text-center">
                <label className="block text-sm font-semibold text-gray-700">
                  Bạn đánh giá sản phẩm này thế nào?
                </label>
                <div className="flex justify-center items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isStarred = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-10 h-10 transition-colors ${
                            isStarred
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-200 fill-transparent'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                {/* Interactive text helper for rating */}
                <p className="text-xs font-semibold text-amber-600 h-4">
                  {rating === 5 && 'Tuyệt vời! 😍'}
                  {rating === 4 && 'Rất tốt! 😊'}
                  {rating === 3 && 'Bình thường! 😐'}
                  {rating === 2 && 'Chưa tốt! 🙁'}
                  {rating === 1 && 'Tệ! 😡'}
                </p>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Viết bình luận của bạn (Không bắt buộc)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm (chất lượng, mùi hương, tác dụng...)"
                  rows={4}
                  className="w-full px-4 py-3 text-sm text-gray-900 bg-white border border-[#e8e5dd] rounded-xl focus:ring-2 focus:ring-[#7a9e8e] focus:border-[#7a9e8e] transition duration-200 resize-none outline-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Hình ảnh thực tế (Tối đa 5 ảnh)
                </label>
                
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Previews */}
                  {imagePreviews.map((url, index) => (
                    <div key={url} className="relative w-20 h-20 rounded-xl border border-[#e8e5dd] overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition duration-200 cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Upload Trigger Button */}
                  {images.length < 5 && (
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#c4bfae] hover:border-[#7a9e8e] bg-gray-50/50 hover:bg-[#7a9e8e]/5 cursor-pointer flex flex-col items-center justify-center transition duration-200 gap-1 flex-shrink-0 select-none">
                      <Camera className="w-5 h-5 text-gray-400 group-hover:text-[#7a9e8e] transition" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Thêm ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-100 text-center animate-pulse">
                  {error}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-[#e8e5dd] text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#7a9e8e] hover:bg-[#5a7a6b] text-white text-sm font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi đánh giá'
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-[#e8e5dd] overflow-hidden"
        >
          {/* Order Header Info */}
          <div className="bg-gray-50/50 px-6 py-4 border-b border-[#e8e5dd] flex flex-wrap justify-between items-center gap-4 animate-pulse">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <div className="h-3 w-12 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              <div>
                <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
              <div>
                <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
            </div>
          </div>

          {/* Order Footer Actions & Total */}
          <div className="px-6 py-4 bg-gray-50/20 flex flex-wrap justify-between items-center gap-4 animate-pulse">
            <div className="h-4 w-56 bg-gray-200 rounded" />

            <div className="flex items-center gap-6">
              <div className="text-right space-y-1">
                <div className="h-3 w-14 bg-gray-200 rounded ml-auto" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-2 pt-4 border-t border-[#e8e5dd] animate-pulse">
        <div className="w-8 h-8 border border-gray-100 rounded-lg bg-gray-50/50" />
        <div className="w-8 h-8 border border-[#7a9e8e]/20 rounded-lg bg-[#7a9e8e]/5" />
        <div className="w-8 h-8 border border-gray-100 rounded-lg bg-gray-50/50" />
        <div className="w-8 h-8 border border-gray-100 rounded-lg bg-gray-50/50" />
        <div className="w-8 h-8 border border-gray-100 rounded-lg bg-gray-50/50" />
      </div>
    </div>
  );
}
