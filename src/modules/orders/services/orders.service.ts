import axiosInstance from "@/services/axiosInstance";
import { ApiResponse } from "@/types/response.type";
import { CreateDirectOrderRequest, CreateOrderRequest, Order } from "../types/orders.type";

export const createOrder = async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const createDirectOrder = async (data: CreateDirectOrderRequest): Promise<ApiResponse<Order>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Order>>('/orders/direct', data);
    return response.data;
  } catch (error) {
    console.error('Error creating direct order:', error);
    throw error;
  }
};

export const getUserOrders = async (): Promise<ApiResponse<Order[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Order[]>>('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getOrderById = async (id: number): Promise<ApiResponse<Order>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};
