import api from "@/lib/axios";

export const getIsSurveyed = async() => {
    const response = await api.get('/user');
    return response.data;
}

export const refreshToken = async() => {
    const response = await api.post('/auth/refresh');
    return response.data;
}

export const logout = async() => {
    const response = await api.post('/auth/logout');
    return response.data
}

export const deleteWithdraw = async () => {
    const response = await api.delete("/auth/withdraw");
    return response.data;
}