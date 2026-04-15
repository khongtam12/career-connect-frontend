import apiClient from './apiClient';
export const login = async (data) => {
    const res = await apiClient.post(`/api/v1/user/auth/login`, data);
    return res.data;
};
export const getCurrentUser = async () => {
    const res = await apiClient.get(`/api/v1/user/auth/me`);
    return res.data;
};

// LOGOUT
export const logoutAccount = async () => {
    await apiClient.post(`/api/v1/user/auth/logout`);
};
