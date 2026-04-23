import apiClient from './apiClient';

// ── EMPLOYER: Quản lý tin tuyển dụng ──

/**
 * Tạo tin tuyển dụng mới
 * POST /api/v1/job/employer/create
 */
export const createJob = async (payload) => {
  const res = await apiClient.post('/api/v1/job/employer/create', payload);
  return res.data;
};

/**
 * Cập nhật tin tuyển dụng
 * PUT /api/v1/job/employer/:jobId
 */
export const updateJob = async (jobId, payload) => {
  const res = await apiClient.put(`/api/v1/job/employer/${jobId}`, payload);
  return res.data;
};

/**
 * Xóa tin tuyển dụng
 * DELETE /api/v1/job/employer/:jobId
 */
export const deleteJob = async (jobId) => {
  const res = await apiClient.delete(`/api/v1/job/employer/${jobId}`);
  return res.data;
};

/**
 * Lấy danh sách tin của employer (có search, filter, phân trang)
 * GET /api/v1/job/employer/my-jobs?search=&status=&page=1&size=10
 */
export const getMyJobs = async ({ search, status, page = 1, size = 10 } = {}) => {
  const params = { page, size };
  if (search) params.search = search;
  if (status && status !== 'all') params.status = status;
  const res = await apiClient.get('/api/v1/job/employer/my-jobs', { params });
  return res.data;
};

/**
 * Thống kê tin tuyển dụng của employer
 * GET /api/v1/job/employer/stats
 */
export const getMyStats = async () => {
  const res = await apiClient.get('/api/v1/job/employer/stats');
  return res.data;
};

/**
 * Đẩy tin lên TOP
 * PUT /api/v1/job/employer/:jobId/push-top
 */
export const pushJobToTop = async (jobId) => {
  const res = await apiClient.put(`/api/v1/job/employer/${jobId}/push-top`);
  return res.data;
};

/**
 * Thay đổi trạng thái tin
 * PUT /api/v1/job/employer/:jobId/status?status=PAUSED
 */
export const changeJobStatus = async (jobId, status) => {
  const res = await apiClient.put(`/api/v1/job/employer/${jobId}/status`, null, {
    params: { status },
  });
  return res.data;
};

// ── PUBLIC: Xem / tìm kiếm ──

/**
 * Xem chi tiết job
 * GET /api/v1/job/:jobId
 */
export const getJobById = async (jobId) => {
  const res = await apiClient.get(`/api/v1/job/${jobId}`);
  return res.data;
};

/**
 * Tìm kiếm việc làm
 * GET /api/v1/job/search?search=&industry=&jobType=&location=&page=1&size=10
 */
export const searchJobs = async ({ search, industry, jobType, location, page = 1, size = 10 } = {}) => {
  const params = { page, size };
  if (search) params.search = search;
  if (industry) params.industry = industry;
  if (jobType) params.jobType = jobType;
  if (location) params.location = location;
  const res = await apiClient.get('/api/v1/job/search', { params });
  return res.data;
};

// ── Legacy (giữ lại cho trang candidate) ──

/**
 * Apply for a job — POST /api/v1/apply
 * @param {{ jobId: string, cvId: string, note?: string }} payload
 */
export const applyForJob = async (payload) => {
  const res = await apiClient.post('/api/v1/apply', payload);
  return res.data;
};
