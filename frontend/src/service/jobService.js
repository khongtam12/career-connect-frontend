import apiClient from './apiClient';

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
