import axiosInstance from "@/services/axiosInstance";
import { ApiResponse } from "@/types/response.type";
import { AddToCartRequest, CartItem, UpdateCartItemRequest } from "../types/cart.type";

export const getCart = async (): Promise<ApiResponse<CartItem[]>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<CartItem[]>>('/carts');
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
}

export const addToCart = async (data: AddToCartRequest): Promise<ApiResponse<CartItem>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<CartItem>>('/carts', data);
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

export const updateCartItemQuantity = async (id: number, data: UpdateCartItemRequest): Promise<ApiResponse<CartItem>> => {
    try {
        const response = await axiosInstance.put<ApiResponse<CartItem>>(`/carts/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw error;
    }
}

export const removeCartItem = async (id: number): Promise<ApiResponse<null>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/carts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
    }
}

export const clearCart = async (): Promise<ApiResponse<null>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>('/carts');
        return response.data;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
}
