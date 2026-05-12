import { LoginPayload, RegisterPayload } from "../types/auth.type";
import axios from "axios";
import { ApiResponse } from "@/types/response.type";
import { User } from "../types/user.type";
import { axiosInstance } from "@/services/axiosInstance";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosPublic = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const login = async (data: LoginPayload): Promise<ApiResponse<{ user: User }>> => {
  if (typeof window !== 'undefined') {
    // Clear old auth data
    localStorage.removeItem('user');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  const response = await axiosPublic.post<ApiResponse<{ user: User }>>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterPayload): Promise<ApiResponse<any>> => {
  if (typeof window !== 'undefined') {
    // Clear old auth data
    localStorage.removeItem('user');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  const response = await axiosPublic.post<ApiResponse<any>>('/auth/register', data);
  return response.data;
};

export const logout = async () => {
  try {
    // Call logout API if needed (optional, depends on your backend)
    await axiosPublic.post('/auth/logout');
  } catch (error) {
    // Even if API call fails, we still want to clear local storage
    console.error('Logout API error:', error);
  } finally {
    // Always clear user from localStorage
    localStorage.removeItem('user');
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}

export const verifyOtp = async (data: { email: string, otp: string }): Promise<ApiResponse<any>> => {
  const response = await axiosPublic.post<ApiResponse<any>>('/auth/verify-otp', data);
  return response.data;
}

export const refresh = async () => {
  try {
    const response = await axiosPublic.post<ApiResponse<{ user: User }>>('/auth/refresh-token');
    return response.data;
  } catch (error) {
    console.error('Refresh API error:', error);
    return null;
  }
}

export interface UpdatePasswordPayload {
  oldPassword?: string;
  newPassword: string;
}

export const updatePassword = async (data: UpdatePasswordPayload): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.put<ApiResponse<any>>('/auth/update-password', data);
  return response.data;
}