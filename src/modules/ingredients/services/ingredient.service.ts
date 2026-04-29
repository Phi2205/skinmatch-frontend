import axiosInstance from "@/services/axiosInstance";
import { Ingredient } from "../types/ingredient.type";
import { ApiResponse } from "@/types/response.type";

export const getAllIngredients = async (): Promise<ApiResponse<Ingredient[]>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Ingredient[]>>('/ingredients');
        return response.data;
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
}

export const createIngredient = async (data: { name: string }): Promise<ApiResponse<Ingredient>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Ingredient>>('/ingredients', data);
        return response.data;
    } catch (error) {
        console.error('Error creating ingredient:', error);
        throw error;
    }
}

export const createMultipleIngredients = async (data: { ingredients: { name: string }[] }): Promise<ApiResponse<Ingredient[]>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Ingredient[]>>('/ingredients/bulk', data);
        return response.data;
    } catch (error) {
        console.error('Error creating multiple ingredients:', error);
        throw error;
    }
}

export const updateIngredient = async (id: number, data: { name: string }): Promise<ApiResponse<Ingredient>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<Ingredient>>(`/ingredients/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating ingredient:', error);
        throw error;
    }
}

export const deleteIngredient = async (id: number): Promise<ApiResponse<void>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<void>>(`/ingredients/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        throw error;
    }
}
