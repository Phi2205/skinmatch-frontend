'use client';

import { useState } from 'react';
import { 
  Zap, 
  X, 
  Plus, 
  Loader2, 
  BadgePercent 
} from 'lucide-react';
import { toast } from 'sonner';
import { Product, ProductVariant } from '@/modules/product/types/product.type';
import { CreateFlashSaleCampaignPayload, CreateFlashSaleItemPayload } from '@/modules/flash-sales/types/flash-sale.type';
import { 
  ProductSelectionBlock, 
  SelectedProductBlock 
} from './ProductSelectionBlock';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  productsList: Product[];
  createMutation: any;
  formatPrice: (price: number) => string;
}

export function CreateCampaignModal({
  isOpen,
  onClose,
  productsList,
  createMutation,
  formatPrice
}: CreateCampaignModalProps) {
  const [campaignTitle, setCampaignTitle] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // Product blocks list
  const [blocks, setBlocks] = useState<SelectedProductBlock[]>([
    { product_id: 0, sale_price: 0, variants: [] }
  ]);

  if (!isOpen) return null;

  const resetForm = () => {
    setCampaignTitle('');
    setStartAt('');
    setEndAt('');
    setIsActive(true);
    setBlocks([{ product_id: 0, sale_price: 0, variants: [] }]);
  };

  const handleAddBlockRow = () => {
    setBlocks([...blocks, { product_id: 0, sale_price: 0, variants: [] }]);
  };

  const handleRemoveBlockRow = (index: number) => {
    if (blocks.length === 1) {
      toast.warning('Phải có ít nhất 1 sản phẩm tham gia Flash Sale.');
      return;
    }
    setBlocks(blocks.filter((_, idx) => idx !== index));
  };

  const handleProductChange = (index: number, productId: number) => {
    if (productId > 0) {
      const isAlreadySelected = blocks.some((b, idx) => idx !== index && b.product_id === productId);
      if (isAlreadySelected) {
        toast.error('Sản phẩm này đã được chọn trong chiến dịch này rồi!');
        return;
      }
    }

    const updated = [...blocks];
    const matched = productsList.find(p => p.id === productId);

    if (matched) {
      const hasVariants = matched.variants && matched.variants.length > 0;
      if (hasVariants) {
        updated[index] = {
          product_id: productId,
          sale_price: 0,
          variants: matched.variants.map((v: ProductVariant) => ({
            variant_id: v.id || 0,
            sale_price: Math.round(v.price * 0.8),
            selected: true,
          }))
        };
      } else {
        updated[index] = {
          product_id: productId,
          sale_price: Math.round(matched.price * 0.8),
          variants: []
        };
      }
    } else {
      updated[index] = {
        product_id: 0,
        sale_price: 0,
        variants: []
      };
    }

    setBlocks(updated);
  };

  const handleBlockPriceChange = (index: number, price: number) => {
    const updated = [...blocks];
    updated[index].sale_price = price;
    setBlocks(updated);
  };

  const handleVariantSelectionToggle = (blockIndex: number, variantId: number) => {
    const updated = [...blocks];
    const block = updated[blockIndex];
    block.variants = block.variants.map(v => {
      if (v.variant_id === variantId) {
        return { ...v, selected: !v.selected };
      }
      return v;
    });
    setBlocks(updated);
  };

  const handleVariantPriceChange = (blockIndex: number, variantId: number, price: number) => {
    const updated = [...blocks];
    const block = updated[blockIndex];
    block.variants = block.variants.map(v => {
      if (v.variant_id === variantId) {
        return { ...v, sale_price: price };
      }
      return v;
    });
    setBlocks(updated);
  };

  const applyQuickDiscountToBlock = (blockIndex: number, discountPercent: number) => {
    const updated = [...blocks];
    const block = updated[blockIndex];
    const matched = productsList.find(p => p.id === block.product_id);
    if (!matched) return;

    const discountFactor = (100 - discountPercent) / 100;

    const hasVariants = matched.variants && matched.variants.length > 0;
    if (hasVariants) {
      block.variants = block.variants.map(v => {
        const originalVariant = matched.variants.find((ov) => ov.id === v.variant_id);
        const originalPrice = originalVariant ? originalVariant.price : matched.price;
        return {
          ...v,
          sale_price: Math.round(originalPrice * discountFactor)
        };
      });
    } else {
      block.sale_price = Math.round(matched.price * discountFactor);
    }
    setBlocks(updated);
    toast.success(`Đã áp dụng giảm giá ${discountPercent}% cho sản phẩm này!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề chiến dịch.');
      return;
    }
    if (!startAt) {
      toast.error('Vui lòng chọn thời gian bắt đầu.');
      return;
    }
    if (!endAt) {
      toast.error('Vui lòng chọn thời gian kết thúc.');
      return;
    }

    const start = new Date(startAt);
    const end = new Date(endAt);
    if (start >= end) {
      toast.error('Thời gian bắt đầu phải trước thời gian kết thúc.');
      return;
    }

    const validItems: CreateFlashSaleItemPayload[] = [];

    blocks.forEach(block => {
      if (block.product_id <= 0) return;

      const matchedProduct = productsList.find(p => p.id === block.product_id);
      if (!matchedProduct) return;

      const hasVariants = matchedProduct.variants && matchedProduct.variants.length > 0;
      if (hasVariants) {
        block.variants.forEach(v => {
          if (v.selected && v.sale_price >= 0) {
            validItems.push({
              product_id: block.product_id,
              variant_id: v.variant_id,
              sale_price: v.sale_price
            });
          }
        });
      } else {
        if (block.sale_price >= 0) {
          validItems.push({
            product_id: block.product_id,
            sale_price: block.sale_price
          });
        }
      }
    });

    if (validItems.length === 0) {
      toast.error('Vui lòng thêm ít nhất một phân loại sản phẩm hợp lệ tham gia chiến dịch.');
      return;
    }

    const payload: CreateFlashSaleCampaignPayload = {
      title: campaignTitle.trim(),
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      is_active: isActive,
      items: validItems
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        resetForm();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Zap className="text-amber-500 fill-amber-500 w-5 h-5 animate-pulse" />
            <h3 className="text-lg font-bold text-gray-900">Tạo Chiến Dịch Flash Sale Mới</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Campaign Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề chiến dịch
            </label>
            <input
              type="text"
              required
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition"
              placeholder="Ví dụ: Khung Giờ Vàng 12h-14h Ngày 11/05"
            />
          </div>

          {/* Grid of Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Khung giờ bắt đầu
              </label>
              <input
                type="datetime-local"
                required
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Khung giờ kết thúc
              </label>
              <input
                type="datetime-local"
                required
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] transition text-sm"
              />
            </div>
          </div>

          {/* Toggle Is Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="campaign_is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-[#7a9e8e]"
            />
            <label htmlFor="campaign_is_active" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
              Kích hoạt chiến dịch ngay khi tạo thành công
            </label>
          </div>

          {/* Items Section */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <BadgePercent className="w-5 h-5 text-[#7a9e8e]" />
                Sản phẩm tham gia khuyến mãi
              </h4>
              <button
                type="button"
                onClick={handleAddBlockRow}
                className="flex items-center gap-1 text-xs font-bold text-[#7a9e8e] hover:text-[#5a7a6b] transition cursor-pointer"
              >
                <Plus size={16} /> Thêm sản phẩm
              </button>
            </div>

            {/* Product Blocks Grid */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {blocks.map((block, idx) => (
                <ProductSelectionBlock
                  key={idx}
                  block={block}
                  idx={idx}
                  productsList={productsList}
                  blocks={blocks}
                  onProductChange={handleProductChange}
                  onRemoveBlock={handleRemoveBlockRow}
                  onVariantToggle={handleVariantSelectionToggle}
                  onVariantPriceChange={handleVariantPriceChange}
                  onBlockPriceChange={handleBlockPriceChange}
                  onQuickDiscount={applyQuickDiscountToBlock}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          </div>

          {/* Modal Footer actions */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2.5 bg-[#7a9e8e] text-white font-bold rounded-xl hover:bg-[#5a7a6b] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#7a9e8e]/20"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Xác nhận tạo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
