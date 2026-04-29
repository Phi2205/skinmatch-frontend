import axiosInstance from "@/services/axiosInstance";
import { Badge } from "../types/badge.type";
import { ApiResponse } from "@/types/response.type";

export const getAllBadges = async (): Promise<ApiResponse<Badge[]>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Badge[]>>('/badges');
        return response.data;
    } catch (error) {
        console.error('Error fetching badges:', error);
        throw error;
    }
}

export const createBadge = async (data: FormData): Promise<ApiResponse<Badge>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Badge>>('/badges', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating badge:', error);
        throw error;
    }
}

export const createMultipleBadges = async (data: { badges: { name: string, icon_url?: string | null }[] }): Promise<ApiResponse<Badge[]>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Badge[]>>('/badges/bulk', data);
        return response.data;
    } catch (error) {
        console.error('Error creating multiple badges:', error);
        throw error;
    }
}

export const updateBadge = async (id: number, data: FormData): Promise<ApiResponse<Badge>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<Badge>>(`/badges/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating badge:', error);
        throw error;
    }
}

export const deleteBadge = async (id: number): Promise<ApiResponse<null>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/badges/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting badge:', error);
        throw error;
    }
}
