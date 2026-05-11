'use client';

import { useState, Fragment } from 'react';
import { 
  Zap, 
  Calendar, 
  Clock, 
  Loader2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Layers,
  Trash2
} from 'lucide-react';
import { FlashSaleCampaign } from '@/modules/flash-sales/types/flash-sale.type';

interface CampaignsTableProps {
  campaigns: FlashSaleCampaign[];
  isLoadingSales: boolean;
  formatPrice: (price: number) => string;
  formatDateTime: (isoString: string) => string;
  onToggleStatus?: (campaignId: number, currentStatus: boolean) => void;
  onDeleteItem?: (itemId: number) => void;
}

export function CampaignsTable({ 
  campaigns, 
  isLoadingSales, 
  formatPrice, 
  formatDateTime,
  onToggleStatus,
  onDeleteItem
}: CampaignsTableProps) {
  // Tracks which campaigns are expanded in the list to show products/variants
  const [expandedCampaigns, setExpandedCampaigns] = useState<Record<number, boolean>>({});

  const toggleCampaignExpand = (campaignId: number) => {
    setExpandedCampaigns(prev => ({
      ...prev,
      [campaignId]: !prev[campaignId]
    }));
  };

  // Helper to format variant attributes
  const formatVariantAttributes = (variant: any) => {
    if (!variant.attributes || variant.attributes.length === 0) return '';
    return variant.attributes.map((attr: any) => `${attr.name}: ${attr.value}`).join(' / ');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="font-bold text-gray-900 text-lg">Chiến dịch đang diễn ra / Sắp hoạt động</h2>
        <span className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Live campaigns
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Tên chiến dịch</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Thời gian bắt đầu</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Thời gian kết thúc</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Số sản phẩm</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoadingSales ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#7a9e8e] animate-spin" />
                    <p className="text-sm font-medium">Đang tải danh sách chiến dịch...</p>
                  </div>
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
                      <Zap size={24} className="fill-amber-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700">Chưa có chiến dịch Flash Sale nào hoạt động</p>
                      <p className="text-sm text-gray-400 mt-1">Hãy nhấp nút "Tạo chiến dịch mới" để lên khung giờ vàng.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              campaigns.map((camp) => (
                <Fragment key={camp.id}>
                  <tr 
                    onClick={() => toggleCampaignExpand(camp.id)}
                    className="hover:bg-gray-50/80 transition cursor-pointer select-none border-b border-gray-100"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        {expandedCampaigns[camp.id] ? (
                          <ChevronUp className="w-4.5 h-4.5 text-[#7a9e8e]" />
                        ) : (
                          <ChevronDown className="w-4.5 h-4.5 text-gray-400" />
                        )}
                        {camp.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDateTime(camp.start_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatDateTime(camp.end_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-700">{camp.items?.length || 0}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleStatus) {
                            onToggleStatus(camp.id, camp.is_active);
                          }
                        }}
                        className="cursor-pointer hover:scale-105 transition"
                        title="Click để đổi trạng thái"
                      >
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          camp.is_active 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {camp.is_active ? 'HOẠT ĐỘNG' : 'TẠM KHÓA'}
                        </span>
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded detail row */}
                  {expandedCampaigns[camp.id] && (
                    <tr className="bg-gray-50/30">
                      <td colSpan={5} className="px-6 py-5 border-b border-gray-200">
                        <div className="pl-6 pr-2 py-1 space-y-3">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#7a9e8e]" />
                            Danh sách chi tiết sản phẩm ({camp.items?.length || 0})
                          </div>
                          
                          {camp.items && camp.items.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[350px] overflow-y-auto pr-1">
                              {camp.items.map((item) => {
                                const product = item.products;
                                const variant = item.variants;
                                
                                // Format variant attributes if present
                                let variantName = '';
                                if (variant && (variant as any).attributes) {
                                  variantName = formatVariantAttributes(variant);
                                }

                                return (
                                  <div 
                                    key={item.id} 
                                    className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-150 shadow-sm hover:border-gray-350 transition"
                                  >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      {/* Product thumbnail */}
                                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 relative flex items-center justify-center">
                                        {product?.image_url ? (
                                          <img 
                                            src={product.image_url} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover" 
                                          />
                                        ) : (
                                          <Package className="w-6 h-6 text-gray-300" />
                                        )}
                                      </div>
                                      
                                      {/* Name & price */}
                                      <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-800 text-sm truncate">
                                          {product?.name || 'Sản phẩm không rõ'}
                                        </div>
                                        {variantName ? (
                                          <div className="text-xs text-[#7a9e8e] font-semibold truncate mt-0.5">
                                            Phân loại: {variantName}
                                          </div>
                                        ) : (
                                          variant?.sku && (
                                            <div className="text-[10px] text-gray-400 mt-0.5">
                                              SKU: {variant.sku}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Prices and Delete trigger */}
                                    <div className="flex items-center gap-3 shrink-0">
                                      <div className="text-right">
                                        <div className="font-black text-[#e05243] text-sm">
                                          {formatPrice(item.sale_price)}
                                        </div>
                                        {variant?.price ? (
                                          <div className="text-[10px] text-gray-400 line-through">
                                            {formatPrice(variant.price)}
                                          </div>
                                        ) : (
                                          (product as any)?.price && (
                                            <div className="text-[10px] text-gray-400 line-through">
                                              {formatPrice((product as any).price)}
                                            </div>
                                          )
                                        )}
                                      </div>

                                      {/* Trash remove from campaign */}
                                      {onDeleteItem && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteItem(item.id);
                                          }}
                                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                          title="Xóa khỏi chiến dịch"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 italic">Không có chi tiết sản phẩm.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
