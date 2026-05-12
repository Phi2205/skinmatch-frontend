'use client';

import { useState } from 'react';
import { AdminSidebar } from '@/shared/components/admin/sidebar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getActiveFlashSales, 
  createFlashSaleCampaign,
  updateCampaignStatus,
  deleteFlashSaleItem
} from '@/modules/flash-sales/services/flash-sale.service';
import { getProducts } from '@/modules/product/services/product.service';
import { CreateFlashSaleCampaignPayload, FlashSaleCampaign } from '@/modules/flash-sales/types/flash-sale.type';
import { Product } from '@/modules/product/types/product.type';
import { toast } from 'sonner';
import { Plus, Zap } from 'lucide-react';
import { CampaignsTable } from '@/modules/flash-sales/components/CampaignsTable';
import { CreateCampaignModal } from '@/modules/flash-sales/components/CreateCampaignModal';

export default function AdminFlashSales() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  // 1. Fetch active/current flash sales
  const { data: flashSalesResponse, isLoading: isLoadingSales } = useQuery({
    queryKey: ['activeFlashSales'],
    queryFn: () => getActiveFlashSales(),
  });

  // 2. Fetch products list to choose from (limit 100)
  const { data: productsResponse } = useQuery({
    queryKey: ['adminProductsSelect'],
    queryFn: () => getProducts({ limit: 100 }),
  });

  const campaigns: FlashSaleCampaign[] = flashSalesResponse?.data
    ? (Array.isArray(flashSalesResponse.data)
        ? flashSalesResponse.data
        : (flashSalesResponse.data as any).items || [])
    : [];
  const productsList = (productsResponse?.data?.items || []) as Product[];

  // 3. Mutation to create campaign
  const createMutation = useMutation({
    mutationFn: (payload: CreateFlashSaleCampaignPayload) => createFlashSaleCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeFlashSales'] });
      toast.success('Chiến dịch Flash Sale đã được tạo thành công!');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.response?.data?.message || 'Không thể tạo chiến dịch Flash Sale.');
    }
  });

  // 4. Mutation to toggle active/inactive status of a campaign
  const toggleStatusMutation = useMutation({
    mutationFn: ({ campaignId, isActive }: { campaignId: number; isActive: boolean }) => 
      updateCampaignStatus(campaignId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeFlashSales'] });
      toast.success('Cập nhật trạng thái chiến dịch thành công!');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.response?.data?.message || 'Không thể cập nhật trạng thái chiến dịch.');
    }
  });

  // 5. Mutation to delete a specific item/variant from a campaign
  const deleteItemMutation = useMutation({
    mutationFn: (itemId: number) => deleteFlashSaleItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeFlashSales'] });
      queryClient.invalidateQueries({ queryKey: ['campaignItemsAdmin'] });
      toast.success('Đã xóa sản phẩm khỏi chiến dịch Flash Sale!');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.response?.data?.message || 'Không thể xóa sản phẩm khỏi chiến dịch.');
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="text-amber-500 fill-amber-500 w-6 h-6 animate-pulse" />
                  Quản lý Flash Sales
                </h1>
                <p className="text-gray-600">Thiết lập các chương trình khuyến mãi chớp nhoáng theo khung giờ vàng.</p>
              </div>
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 bg-[#7a9e8e] text-white px-5 py-2.5 rounded-xl hover:bg-[#5a7a6b] transition shadow-lg shadow-[#7a9e8e]/20 cursor-pointer"
              >
                <Plus size={20} />
                <span className="font-bold">Tạo chiến dịch mới</span>
              </button>
            </div>

            {/* Current Campaigns List Component */}
            <CampaignsTable
              campaigns={campaigns}
              isLoadingSales={isLoadingSales}
              formatPrice={formatPrice}
              formatDateTime={formatDateTime}
              onToggleStatus={(campaignId, currentStatus) => {
                toggleStatusMutation.mutate({ campaignId, isActive: !currentStatus });
              }}
              onDeleteItem={(itemId) => {
                if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm/phân loại này khỏi chiến dịch Flash Sale?')) {
                  deleteItemMutation.mutate(itemId);
                }
              }}
            />

          </div>
        </main>
      </div>

      {/* Create Campaign Modal Component */}
      <CreateCampaignModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        productsList={productsList}
        createMutation={createMutation}
        formatPrice={formatPrice}
      />
    </div>
  );
}
