import { axiosInstance } from "@/services/axiosInstance";
import { ApiResponse } from "@/types/response.type";
import { User } from "../../auth/types/user.type";

export interface UpdateUserProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * Fetch the current user profile from the backend
 */
export async function getUserProfile(): Promise<ApiResponse<User>> {
  const response = await axiosInstance.get<ApiResponse<User>>("/user/profile");
  return response.data;
}

/**
 * Update the user profile (name, email, phone) on the backend
 */
export async function updateUserProfile(
  payload: UpdateUserProfilePayload
): Promise<ApiResponse<User>> {
  const response = await axiosInstance.put<ApiResponse<User>>(
    "/user/profile",
    payload
  );
  return response.data;
}

/**
 * Upload and update the user avatar
 */
export async function uploadUserAvatar(file: File): Promise<ApiResponse<User>> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.put<ApiResponse<User>>(
    "/user/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

