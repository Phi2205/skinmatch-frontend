import axiosInstance from "@/services/axiosInstance";
import { PaginatedResponse, Product, ProductQueryParams } from "../types/product.type";
import { ApiResponse } from "@/types/response.type";

export const getProducts = async (params: ProductQueryParams = {}): Promise<PaginatedResponse<Product>> => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.category_id) queryParams.append('category_id', params.category_id.toString());
        if (params.concern_ids) queryParams.append('concern_ids', params.concern_ids);
        if (params.skin_type_ids) queryParams.append('skin_type_ids', params.skin_type_ids);
        if (params.badge_ids) queryParams.append('badge_ids', params.badge_ids);
        if (params.min_price) queryParams.append('min_price', params.min_price.toString());
        if (params.max_price) queryParams.append('max_price', params.max_price.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const response = await axiosInstance.get<PaginatedResponse<Product>>(`/products?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export const getProductById = async (id: number): Promise<ApiResponse<Product>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
}

export const getProductBySlug = async (slug: string): Promise<ApiResponse<Product>> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Product>>(`/products/slug/${slug}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with slug ${slug}:`, error);
        throw error;
    }
}

export const createProduct = async (data: FormData): Promise<ApiResponse<Product>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Product>>('/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export const updateProduct = async (id: number, data: FormData): Promise<ApiResponse<Product>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<Product>>(`/products/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export const deleteProduct = async (id: number): Promise<ApiResponse<null>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export const updateProductStatus = async (id: number, is_active: boolean): Promise<ApiResponse<Product>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<Product>>(`/products/${id}/status`, { is_active });
        return response.data;
    } catch (error) {
        console.error('Error updating product status:', error);
        throw error;
    }
}

export const getProductsByBadgeSlug = async (slug: string, page: number, limit: number): Promise<PaginatedResponse<Product>> => {
    try {
        const response = await axiosInstance.get<PaginatedResponse<Product>>(`/products/filter-by/badge/${slug}`, { params: { page, limit } });
        return response.data;
    } catch (error) {
        console.error('Error fetching products by badge slug:', error);
        throw error;
    }
}

export const addProductImages = async (productId: number, data: FormData): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<any>>(`/products/${productId}/images`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding product images:', error);
        throw error;
    }
}

export const addSingleProductImage = async (productId: number, data: FormData): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<any>>(`/products/${productId}/images/single`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding single product image:', error);
        throw error;
    }
}

export const updateProductImage = async (productId: number, imageId: number, data: FormData): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<any>>(`/products/${productId}/images/${imageId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product image:', error);
        throw error;
    }
}

export const deleteProductImage = async (productId: number, imageId: number): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<any>>(`/products/${productId}/images/${imageId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product image:', error);
        throw error;
    }
}

export const reorderProductImages = async (productId: number, images: { id: number; position: number }[]): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.patch<ApiResponse<any>>(`/products/${productId}/images/reorder`, { images });
        return response.data;
    } catch (error) {
        console.error('Error reordering product images:', error);
        throw error;
    }
}
