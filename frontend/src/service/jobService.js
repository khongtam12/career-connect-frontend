import apiClient from './apiClient';

export const createJob = async (payload) => {
  const res = await apiClient.post('/api/v1/job/employer/create', payload);
  return res.data;
};

export const updateJob = async (jobId, payload) => {
  const res = await apiClient.put(`/api/v1/job/employer/${jobId}`, payload);
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

export const getJobById = async (jobId) => {
  const res = await apiClient.get(`/api/v1/job/${jobId}`);
  return res.data;
};

export const getJobs = async ({ page = 0, size = 9, sortBy = 'createdAt', sortDir = 'desc' } = {}) => {
  const response = await apiClient.get('/api/v1/job', {
    params: { page, size, sortBy, sortDir },
  });
  return response.data;
};

export const searchJobs = async ({
  keyword,
  location,
  industryId,
  fieldId,
  jobType,
  status,
  experienceMin,
  experienceMax,
  salaryMin,
  salaryMax,
  page = 0,
  size = 9,
  sortBy = 'createdAt',
  sortDir = 'desc',
} = {}) => {
  const response = await apiClient.get('/api/v1/job/search', {
    params: {
      keyword,
      location,
      industryId,
      fieldId,
      jobType,
      status,
      experienceMin,
      experienceMax,
      salaryMin,
      salaryMax,
      page,
      size,
      sortBy,
      sortDir,
    },
  });
  return response.data;
};

export const getJobFilters = async () => {
  const response = await apiClient.get('/api/v1/job/filters');
  return response.data;
};

export const getJobStats = async () => {
  const response = await apiClient.get('/api/v1/job/stats');
  return response.data;
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
