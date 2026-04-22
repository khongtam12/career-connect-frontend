import apiClient from './apiClient';

/**
 * Apply for a job — POST /api/v1/apply
 * @param {{ jobId: string, cvId: string, note?: string }} payload
 */
export const applyForJob = async (payload) => {
  const res = await apiClient.post('/api/v1/apply', payload);
  return res.data;
};
