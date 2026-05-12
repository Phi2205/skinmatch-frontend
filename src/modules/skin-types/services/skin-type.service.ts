import axiosInstance from "@/services/axiosInstance";
import { SkinType } from "../types/skin-type.type";
import { ApiResponse } from "@/types/response.type";

export const getAllSkinTypes = async (): Promise<ApiResponse<SkinType[]>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<SkinType[]>>('/skin-types');
        return response.data;
    } catch (error) {
        console.error('Error fetching skin types:', error);
        throw error;
    }
}

export const createSkinType = async (data: { name: string; description?: string }): Promise<ApiResponse<SkinType>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<SkinType>>('/skin-types', data);
        return response.data;
    } catch (error) {
        console.error('Error creating skin type:', error);
        throw error;
    }
}

export const createMultipleSkinTypes = async (data: { skinTypes: { name: string; description?: string }[] }): Promise<ApiResponse<SkinType[]>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<SkinType[]>>('/skin-types/bulk', data);
        return response.data;
    } catch (error) {
        console.error('Error creating multiple skin types:', error);
        throw error;
    }
}

export const updateSkinType = async (id: number, data: { name: string; description?: string }): Promise<ApiResponse<SkinType>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<SkinType>>(`/skin-types/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating skin type:', error);
        throw error;
    }
}

export const deleteSkinType = async (id: number): Promise<ApiResponse<void>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<void>>(`/skin-types/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting skin type:', error);
        throw error;
    }
}
