import axios from 'axios';
import apiClient from './apiClient';

const isLocalFrontendHost = (() => {
  if (typeof window === 'undefined') return import.meta.env.DEV;
  const { hostname } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1';
})();

const rawJobServiceURL =
  import.meta.env.VITE_JOB_SERVICE_URL ||
  (isLocalFrontendHost ? 'http://localhost:8082' : '');
const jobServiceURL = rawJobServiceURL.replace(/\/+$/, '');

const jobServiceClient = axios.create({
  baseURL: jobServiceURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const jobRequestConfig = (overrides = {}) => ({
  serviceName: 'job-service',
  ...overrides,
});

const shouldFallbackToDirectJobService = (error) => {
  if (!jobServiceURL) return false;
  const status = error?.response?.status;
  return status === 503 || status === 504 || error?.code === 'ERR_NETWORK';
};

const callJobService = async (request, requestConfig = {}) => {
  try {
    const response = await request(apiClient);
    return response.data;
  } catch (error) {
    if (!shouldFallbackToDirectJobService(error) || requestConfig?.skipJobFallback) {
      throw error;
    }

    const directResponse = await request(jobServiceClient);
    return directResponse.data;
  }
};

export const createJob = async (payload) => {
  const res = await apiClient.post('/api/v1/job/employer/create', payload);
  return res.data;
};

export const updateJob = async (jobId, payload) => {
  const res = await apiClient.put(`/api/v1/job/employer/${jobId}`, payload);
  return res.data;
};

export const renewJob = async (jobId, payload) => {
  const res = await apiClient.put(`/api/v1/job/employer/${jobId}/renew`, payload);
  return res.data;
};

export const deleteJob = async (jobId) => {
  const res = await apiClient.delete(`/api/v1/job/employer/${jobId}`);
  return res.data;
};

export const getMyJobs = async ({ search, status, page = 1, size = 10 } = {}) => {
  const params = { page, size };
  if (search) params.search = search;
  if (status && status !== 'all') params.status = status;
  const res = await apiClient.get('/api/v1/job/employer/my-jobs', { params });
  return res.data;
};

export const getMyStats = async () => {
  const res = await apiClient.get('/api/v1/job/employer/stats');
  return res.data;
};

export const changeJobStatus = async (jobId, status) => {
  const res = await apiClient.put(`/api/v1/job/employer/${jobId}/status`, null, {
    params: { status },
  });
  return res.data;
};

export const applyMarketingPackage = async (jobId, payload) => {
  const res = await apiClient.post(`/api/v1/job/employer/${jobId}/marketing`, payload);
  return res.data;
};

export const removeMarketingPackage = async (jobId) => {
  const res = await apiClient.delete(`/api/v1/job/employer/${jobId}/marketing`);
  return res.data;
};

export const applyCompanyMarketingPackage = async (payload) => {
  const res = await apiClient.post('/api/v1/job/employer/marketing/company', payload);
  return res.data;
};

export const removeCompanyMarketingPackage = async (assignmentId) => {
  const res = await apiClient.delete('/api/v1/job/employer/marketing/shared', {
    params: { assignmentId },
  });
  return res.data;
};

export const getJobById = async (jobId, requestConfig = {}) => {
  return callJobService(
    (client) => client.get(`/api/v1/job/${jobId}`, jobRequestConfig(requestConfig)),
    requestConfig
  );
};

export const getJobs = async ({ page = 0, size = 9, sortBy = 'createdAt', sortDir = 'desc' } = {}) => {
  return callJobService((client) =>
    client.get('/api/v1/job', {
      params: { page, size, sortBy, sortDir },
    })
  );
};

export const searchJobs = async ({
  keyword,
  location,
  industryId,
  fieldId,
  jobType,
  marketingPackageCategory,
  marketingPackageType,
  status,
  experienceMin,
  experienceMax,
  salaryMin,
  salaryMax,
  rank,
  education,
  salaryNegotiable,
  page = 0,
  size = 9,
  sortBy = 'createdAt',
  sortDir = 'desc',
} = {}, requestConfig = {}) => {
  return callJobService(
    (client) =>
      client.get('/api/v1/job/search', {
        ...jobRequestConfig(requestConfig),
        params: {
          keyword,
          location,
          industryId,
          fieldId,
          jobType,
          marketingPackageCategory,
          marketingPackageType,
          status,
          experienceMin,
          experienceMax,
          salaryMin,
          salaryMax,
          rank,
          education,
          salaryNegotiable,
          page,
          size,
          sortBy,
          sortDir,
        },
      }),
    requestConfig
  );
};

export const getJobFilters = async (requestConfig = {}) => {
  return callJobService(
    (client) => client.get('/api/v1/job/filters', jobRequestConfig(requestConfig)),
    requestConfig
  );
};

export const getJobStats = async (requestConfig = {}) => {
  return callJobService(
    (client) => client.get('/api/v1/job/stats', jobRequestConfig(requestConfig)),
    requestConfig
  );
};

export const applyForJob = async (payload) => {
  const res = await apiClient.post('/api/v1/apply', payload);
  return res.data;
};

export const getJobsByAdmin = async (search, status, page = 0, size = 10) => {
  const params = { page, size };
  if (search) params.search = search;
  if (status && status !== 'all') params.status = status;
  const res = await apiClient.get('/api/v1/job/admin/filter', { params });
  return res.data;
};

export const adminChangeJobStatus = async (jobId, status, adminId) => {
  const res = await apiClient.put(`/api/v1/job/admin/${jobId}/status`, null, {
    params: { status },
    headers: { 'X-Admin-Id': adminId || 'ADMIN001' }
  });
  return res.data;
};

export const adminDeleteJob = async (jobId, adminId) => {
  const res = await apiClient.delete(`/api/v1/job/admin/${jobId}`, {
    headers: {
      'X-Admin-Id': adminId || 'ADMIN001'
    }
  });
  return res.data;
};

export const getMyApplications = async () => {
  const res = await apiClient.get('/api/v1/apply/my-applications');
  return res.data;
};
