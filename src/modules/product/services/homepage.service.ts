import axiosInstance from "../../../services/axiosInstance";

export const homepage = async () => {
    const response = await axiosInstance.get('/homepage');
    return response.data;
}