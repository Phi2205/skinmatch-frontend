import axiosInstance from "@/services/axiosInstance";
import { ApiResponse } from "@/types/response.type";
import { CreateMomoPaymentRequest, MomoPaymentResponse, PaymentTransaction } from "../types/payments.type";

export const createMomoLink = async (data: CreateMomoPaymentRequest): Promise<MomoPaymentResponse> => {
  try {
    const response = await axiosInstance.post<MomoPaymentResponse>('/payments/create-momo-link', data);
    return response.data;
  } catch (error) {
    console.error('Error creating MoMo payment link:', error);
    throw error;
  }
};

export const getOrderStatus = async (orderId: number): Promise<ApiResponse<PaymentTransaction[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<PaymentTransaction[]>>(`/payments/order-status`, {
      params: { orderId }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching status for order ${orderId}:`, error);
    throw error;
  }
};

export const cancelOrder = async (orderId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post<{ success: boolean; message: string }>('/payments/cancel-order', { orderId });
    return response.data;
  } catch (error) {
    console.error(`Error canceling order ${orderId}:`, error);
    throw error;
  }
};

export interface VnpayPaymentResponse {
  payUrl: string;
}

export const createVnpayLink = async (data: { orderId: number; amount: number }): Promise<VnpayPaymentResponse> => {
  try {
    const response = await axiosInstance.post<VnpayPaymentResponse>('/payments/create-vnpay-link', data);
    return response.data;
  } catch (error) {
    console.error('Error creating VNPAY payment link:', error);
    throw error;
  }
};

