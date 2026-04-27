import axiosInstance from "@/services/axiosInstance";
import { Category } from "../types/category.type";
import { ApiResponse } from "@/types/response.type";

export const getAllCategories = async (): Promise<ApiResponse<Category[]>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Category[]>>('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export const createCategory = async (data: { name: string }): Promise<ApiResponse<Category>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Category>>('/categories', data);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}

export const updateCategory = async (id: number, data: { name: string }): Promise<ApiResponse<Category>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<Category>>(`/categories/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

export const updateStatusCategory = async (id: number, data: { is_active: boolean }): Promise<ApiResponse<Category>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<Category>>(`/categories/${id}/status`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating category status:', error);
        throw error;
    }
}