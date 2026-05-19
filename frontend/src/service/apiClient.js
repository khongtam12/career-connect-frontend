import axios from 'axios';
import { useUserStore } from '../stores/useUserStore';

const rawBaseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const baseURL = rawBaseURL.replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      originalRequest._retry = true;

      try {
        if (
          originalRequest.url?.includes('/api/v1/user/auth/refresh') ||
          originalRequest.url?.includes('/api/v1/user/auth/logout')
        ) {
          useUserStore.getState().clearUser();
          return Promise.reject(error);
        }

        const res = await axios.post(
          `${baseURL}/api/v1/user/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (res.status === 200) {
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        useUserStore.getState().clearUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
