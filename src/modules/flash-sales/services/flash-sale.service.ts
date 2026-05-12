import { axiosInstance } from "@/services/axiosInstance";
import { ApiResponse } from "@/types/response.type";
import {
  CreateFlashSaleCampaignPayload,
  CreateFlashSaleItemPayload,
  FlashSaleCampaign,
} from "../types/flash-sale.type";

/**
 * Tạo mới một chiến dịch Flash Sale (Yêu cầu tài khoản Admin)
 */
export async function createFlashSaleCampaign(
  payload: CreateFlashSaleCampaignPayload
): Promise<ApiResponse<FlashSaleCampaign>> {
  try {
    const response = await axiosInstance.post<ApiResponse<FlashSaleCampaign>>(
      "/flash-sales",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating flash sale campaign:", error);
    throw error;
  }
}

/**
 * Lấy danh sách các chiến dịch Flash Sale đang diễn ra trong khung giờ hiện tại
 */
export async function getActiveFlashSales(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<FlashSaleCampaign[] | { items: FlashSaleCampaign[]; meta: any }>> {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FlashSaleCampaign[] | { items: FlashSaleCampaign[]; meta: any }>
    >("/flash-sales/active", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching active flash sales:", error);
    throw error;
  }
}

/**
 * Thêm sản phẩm/phân loại vào chiến dịch Flash Sale (Yêu cầu tài khoản Admin)
 */
export async function addItemToCampaign(
  campaignId: number,
  payload: CreateFlashSaleItemPayload
): Promise<ApiResponse<any>> {
  try {
    const response = await axiosInstance.post<ApiResponse<any>>(
      `/flash-sales/${campaignId}/items`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding item to campaign ${campaignId}:`, error);
    throw error;
  }
}

/**
 * Cập nhật trạng thái hoạt động của chiến dịch Flash Sale (Yêu cầu tài khoản Admin)
 */
export async function updateCampaignStatus(
  campaignId: number,
  isActive: boolean
): Promise<ApiResponse<any>> {
  try {
    const response = await axiosInstance.patch<ApiResponse<any>>(
      `/flash-sales/${campaignId}/status`,
      { is_active: isActive }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating status for campaign ${campaignId}:`, error);
    throw error;
  }
}

/**
 * Xóa sản phẩm khỏi chiến dịch Flash Sale (Yêu cầu tài khoản Admin)
 */
export async function deleteFlashSaleItem(
  itemId: number
): Promise<ApiResponse<any>> {
  try {
    const response = await axiosInstance.delete<ApiResponse<any>>(
      `/flash-sales/items/${itemId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting flash sale item ${itemId}:`, error);
    throw error;
  }
}
