'use client';

import { Trash2, Sparkles, Layers } from 'lucide-react';
import { Product, ProductVariant } from '@/modules/product/types/product.type';

export interface SelectedVariantState {
  variant_id: number;
  sale_price: number;
  selected: boolean;
}

export interface SelectedProductBlock {
  product_id: number;
  sale_price: number; // Used only if the product has no variants
  variants: SelectedVariantState[]; // Used if the product has variants
}

interface ProductSelectionBlockProps {
  block: SelectedProductBlock;
  idx: number;
  productsList: Product[];
  blocks: SelectedProductBlock[];
  onProductChange: (index: number, productId: number) => void;
  onRemoveBlock: (index: number) => void;
  onVariantToggle: (blockIndex: number, variantId: number) => void;
  onVariantPriceChange: (blockIndex: number, variantId: number, price: number) => void;
  onBlockPriceChange: (index: number, price: number) => void;
  onQuickDiscount: (blockIndex: number, discountPercent: number) => void;
  formatPrice: (price: number) => string;
}

export function ProductSelectionBlock({
  block,
  idx,
  productsList,
  blocks,
  onProductChange,
  onRemoveBlock,
  onVariantToggle,
  onVariantPriceChange,
  onBlockPriceChange,
  onQuickDiscount,
  formatPrice
}: ProductSelectionBlockProps) {
  const matchedProduct = productsList.find(p => p.id === block.product_id);
  const hasVariants = matchedProduct && matchedProduct.variants && matchedProduct.variants.length > 0;

  // Helper to format variant attributes
  const formatVariantAttributes = (variant: ProductVariant) => {
    if (!variant.attributes || variant.attributes.length === 0) return '';
    return variant.attributes.map((attr) => `${attr.name}: ${attr.value}`).join(' / ');
  };

  return (
    <div 
      className={`p-4 rounded-xl border transition-all ${
        block.product_id > 0 
          ? 'bg-white border-[#7a9e8e]/35 shadow-sm border-l-4 border-l-[#7a9e8e]' 
          : 'bg-gray-50/50 border-gray-200'
      }`}
    >
      {/* Header Row: Product Select + Remove Button */}
      <div className="flex gap-4 items-start justify-between mb-3.5">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Sản phẩm {idx + 1}
          </label>
          <select
            required
            value={block.product_id || ''}
            onChange={(e) => onProductChange(idx, Number(e.target.value))}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] bg-white text-sm cursor-pointer font-medium"
          >
            <option value="">-- Chọn sản phẩm tham gia --</option>
            {productsList.map((prod) => {
              const isSelectedElsewhere = blocks.some((b, bIdx) => bIdx !== idx && b.product_id === prod.id);
              return (
                <option 
                  key={prod.id} 
                  value={prod.id}
                  disabled={isSelectedElsewhere}
                >
                  {prod.name} ({formatPrice(prod.price)}) {isSelectedElsewhere ? ' — [Đã chọn]' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Delete Block */}
        <button
          type="button"
          onClick={() => onRemoveBlock(idx)}
          className="mt-6 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
          title="Xóa sản phẩm này"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Product Selected Content */}
      {matchedProduct && (
        <div className="space-y-4">
          {/* Quick Discount Tool */}
          <div className="bg-gray-50 rounded-lg p-3 flex flex-wrap gap-2 items-center justify-between border border-gray-150">
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
              <Sparkles size={14} className="text-amber-500" />
              Áp dụng giảm giá nhanh cho phân loại đã chọn:
            </span>
            <div className="flex gap-1.5">
              {[10, 20, 30, 40, 50].map((percent) => (
                <button
                  key={percent}
                  type="button"
                  onClick={() => onQuickDiscount(idx, percent)}
                  className="px-2 py-1 text-xs font-semibold bg-white border border-gray-200 text-[#7a9e8e] rounded-md hover:bg-[#7a9e8e] hover:text-white hover:border-[#7a9e8e] transition cursor-pointer"
                >
                  -{percent}%
                </button>
              ))}
            </div>
          </div>

          {/* Option 1: Product has VARIANTS */}
          {hasVariants ? (
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={14} className="text-gray-400" /> 
                Chọn phân loại tham gia (mỗi phân loại chỉ chọn 1 lần):
              </div>
              <div className="divide-y divide-gray-100 border border-gray-150 rounded-xl overflow-hidden bg-gray-50/30">
                {block.variants.map((v) => {
                  const origVariant = matchedProduct.variants.find((ov) => ov.id === v.variant_id);
                  if (!origVariant) return null;
                  
                  const attributesStr = formatVariantAttributes(origVariant);

                  return (
                    <div 
                      key={v.variant_id} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-3 transition ${
                        v.selected ? 'bg-emerald-50/10' : 'opacity-65'
                      }`}
                    >
                      {/* Toggle Checkbox and Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          id={`v_${idx}_${v.variant_id}`}
                          checked={v.selected}
                          onChange={() => onVariantToggle(idx, v.variant_id)}
                          className="mt-1 w-4.5 h-4.5 cursor-pointer accent-[#7a9e8e] rounded border-gray-300"
                        />
                        <label 
                          htmlFor={`v_${idx}_${v.variant_id}`}
                          className="flex-1 cursor-pointer min-w-0 text-sm select-none"
                        >
                          <div className="font-semibold text-gray-800 truncate">
                            {attributesStr || 'Mặc định'}
                          </div>
                          <div className="text-xs text-gray-500 flex flex-wrap gap-2 mt-0.5">
                            {origVariant.sku && <span>SKU: {origVariant.sku}</span>}
                            {origVariant.stock !== undefined && (
                              <span>• Kho: <b className="text-gray-700">{origVariant.stock}</b></span>
                            )}
                            <span>• Gốc: <b className="text-[#7a9e8e]">{formatPrice(origVariant.price)}</b></span>
                          </div>
                        </label>
                      </div>

                      {/* Sale Price Input */}
                      <div className="w-full sm:w-44 flex items-center gap-2">
                        {v.selected ? (
                          <div className="relative flex-1">
                            <input
                              type="number"
                              required
                              min={0}
                              value={v.sale_price || ''}
                              onChange={(e) => onVariantPriceChange(idx, v.variant_id, Number(e.target.value))}
                              className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] bg-white text-sm text-right font-semibold text-gray-800"
                              placeholder="Giá flash sale"
                            />
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">₫</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic w-full text-center py-1.5">Không tham gia</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Option 2: Product has NO variants */
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50/50 p-3.5 rounded-xl border border-gray-150 gap-3">
              <div className="text-sm">
                <div className="font-semibold text-gray-700">Sản phẩm không có phân loại</div>
                <div className="text-xs text-gray-500 mt-0.5 flex gap-2">
                  <span>Giá gốc: <b>{formatPrice(matchedProduct.price)}</b></span>
                </div>
              </div>

              <div className="w-full sm:w-44 relative">
                <input
                  type="number"
                  required
                  min={0}
                  value={block.sale_price || ''}
                  onChange={(e) => onBlockPriceChange(idx, Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a9e8e] bg-white text-sm text-right font-semibold text-gray-800"
                  placeholder="Giá flash sale"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7a9e8e] text-xs font-semibold">₫</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
