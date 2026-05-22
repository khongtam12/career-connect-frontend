import axios from 'axios';
import { useUserStore } from '../stores/useUserStore';

const normalizeBaseURL = (value = '') => value.replace(/\/+$/, '');
const localFallbackBaseURL = 'http://localhost:8080';
const configuredBaseURL = normalizeBaseURL(import.meta.env.VITE_BACKEND_URL || '');
let activeBaseURL = configuredBaseURL || localFallbackBaseURL;

const apiClient = axios.create({
  baseURL: activeBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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

const canFallbackToLocal = (requestConfig = {}) => (
  configuredBaseURL &&
  configuredBaseURL !== localFallbackBaseURL &&
  !requestConfig._localFallbackTried
);

const switchToBaseURL = (nextBaseURL) => {
  activeBaseURL = normalizeBaseURL(nextBaseURL);
  apiClient.defaults.baseURL = activeBaseURL;
};

export const getApiBaseURL = () => activeBaseURL;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest &&
      canFallbackToLocal(originalRequest) &&
      (isNetworkError(error) || isServiceUnavailableError(error) || isGatewayTimeoutError(error))
    ) {
      originalRequest._localFallbackTried = true;
      switchToBaseURL(localFallbackBaseURL);
      originalRequest.baseURL = localFallbackBaseURL;

      console.warn(
        `[API Fallback] Khong goi duoc backend deploy (${configuredBaseURL}). Chuyen sang local ${localFallbackBaseURL}.`
      );

      return apiClient(originalRequest);
    }

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

    return Promise.reject(error);
  }
);

export default apiClient;
