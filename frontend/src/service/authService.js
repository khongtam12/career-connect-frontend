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

export const register = async (data) => {
    const res = await apiClient.post(`/api/v1/user/auth/register`, data);
    return res.data;
};

export const sendOtp = async (email, type) => {
    const res = await apiClient.post(`/api/v1/user/auth/send-otp`, { email, type });
    return res.data;
};

export const verifyOtp = async (email, otp) => {
    const res = await apiClient.post(`/api/v1/user/auth/verify-otp`, { email, otp });
    return res.data;
};
