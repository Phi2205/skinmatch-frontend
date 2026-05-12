import axiosInstance from "@/services/axiosInstance";
import { Concern } from "../types/concern.type";
import { ApiResponse } from "@/types/response.type";

export const getAllConcerns = async (): Promise<ApiResponse<Concern[]>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Concern[]>>('/concerns');
        return response.data;
    } catch (error) {
        console.error('Error fetching concerns:', error);
        throw error;
    }
}

export const createConcern = async (data: { name: string }): Promise<ApiResponse<Concern>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Concern>>('/concerns', data);
        return response.data;
    } catch (error) {
        console.error('Error creating concern:', error);
        throw error;
    }
}

export const createMultipleConcerns = async (data: { concerns: { name: string }[] }): Promise<ApiResponse<Concern[]>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Concern[]>>('/concerns/bulk', data);
        return response.data;
    } catch (error) {
        console.error('Error creating multiple concerns:', error);
        throw error;
    }
}

export const updateConcern = async (id: number, data: { name: string }): Promise<ApiResponse<Concern>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<Concern>>(`/concerns/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating concern:', error);
        throw error;
    }
}

export const deleteConcern = async (id: number): Promise<ApiResponse<void>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<void>>(`/concerns/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting concern:', error);
        throw error;
    }
}
