import axios from 'axios';
import { useUserStore } from '../stores/useUserStore';
import { toast } from 'react-toastify';

const isLocalFrontendHost = (() => {
  if (typeof window === 'undefined') return import.meta.env.DEV;
  const { hostname } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1';
})();

const rawBaseURL =
  import.meta.env.VITE_BACKEND_URL ||
  (isLocalFrontendHost ? 'http://localhost:8080' : '');
const baseURL = rawBaseURL.replace(/\/+$/, '');

// --- Rate Limiter Config (Client Side) ---
const MAX_REQUESTS = 30; // Tối đa 30 request
const WINDOW_MS = 10000; // Trong vòng 10 giây
let requestTimestamps = [];

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor cho Rate Limiting ---
apiClient.interceptors.request.use((config) => {
  const now = Date.now();

  // Loại bỏ các timestamp cũ hơn 10 giây
  requestTimestamps = requestTimestamps.filter(timestamp => now - timestamp < WINDOW_MS);
  if (requestTimestamps.length >= MAX_REQUESTS) {
    // Thông báo cho người dùng
    toast.error("Bạn đang thao tác quá nhanh! Vui lòng đợi một chút.", {
      id: 'rate-limit-toast', // ID để không hiện nhiều toast trùng nhau
    });

    // Hủy request ngay tại Client
    return Promise.reject(new Error('RATE_LIMIT_EXCEEDED'));
  }
  // Lưu timestamp của request mới
  requestTimestamps.push(now);
  return config;
}, (error) => {
  return Promise.reject(error);
});

const recentServiceLogs = new Map();
const SERVICE_LOG_TTL_MS = 5000;

const resolveServiceName = (config = {}) => {
  if (config.serviceName) return config.serviceName;

  const url = config.url || '';
  if (url.includes('/api/v1/job')) return 'job-service';
  if (url.includes('/api/v1/notifications')) return 'notification-service';
  if (url.includes('/api/v1/user')) return 'user-service';
  if (url.includes('/api/v1/company')) return 'company-service';
  if (url.includes('/api/v1/apply')) return 'application-service';
  if (url.includes('/api/v1/package')) return 'payment-service';
  if (url.includes('/api/v1/cvs')) return 'cv-service';
  if (url.includes('/api/v1/storage')) return 'storage-service';
  return 'service';
};

const shouldLogServiceError = (serviceName) => {
  const now = Date.now();
  const lastLoggedAt = recentServiceLogs.get(serviceName) || 0;

  if (now - lastLoggedAt < SERVICE_LOG_TTL_MS) {
    return false;
  }

  recentServiceLogs.set(serviceName, now);
  return true;
};

export const isServiceUnavailableError = (error) => error?.response?.status === 503;
const isGatewayTimeoutError = (error) => error?.response?.status === 504;
const isNetworkError = (error) => !error?.response && !!error?.request;

export const getApiBaseURL = () => baseURL;

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
          `${getApiBaseURL()}/api/v1/user/auth/refresh`,
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

    if (isServiceUnavailableError(error) && !originalRequest?.quietOn503) {
      const serviceName = resolveServiceName(originalRequest);
      const responseMessage =
        error.response?.data?.message || 'Dich vu tam thoi gian doan';

      if (shouldLogServiceError(serviceName)) {
        console.error(
          `%c [Circuit Breaker:${serviceName}] ${responseMessage}`,
          'color: white; background: #e74c3c; padding: 4px; border-radius: 4px; font-weight: bold;'
        );
      }
    }

    if (baseURL && (isNetworkError(error) || isGatewayTimeoutError(error))) {
      console.error(
        `[API Error] Khong the ket noi toi backend ${baseURL}. Kiem tra lai domain/SSL/backend.`
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
