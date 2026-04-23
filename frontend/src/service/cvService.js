import apiClient from './apiClient';

/**
 * CV Service - Kết nối với backend cv-service (port 8087)
 */

export const getMyCVs = async () => {
  const res = await apiClient.get('/api/v1/cvs/my-cvs');
  return res.data;
};

export const getCVById = async (id) => {
  const res = await apiClient.get(`/api/v1/cvs/${id}`);
  return res.data;
};

export const createCV = async (cvData) => {
  const res = await apiClient.post('/api/v1/cvs', cvData);
  return res.data;
};

export const updateCV = async (id, cvData) => {
  const res = await apiClient.put(`/api/v1/cvs/${id}`, cvData);
  return res.data;
};

export const deleteCV = async (id) => {
  const res = await apiClient.delete(`/api/v1/cvs/${id}`);
  return res.data;
};

export const uploadCVAvatar = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/api/v1/cvs/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data; // Trả về URL S3
};
