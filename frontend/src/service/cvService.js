import apiClient from './apiClient';

/**
 * CV Service - Kết nối với backend cv-service (port 8087)
 */

export const getMyCVs = async () => {
  console.log('🔄 [CV Flow] Đang tải danh sách CV từ Backend...');
  const res = await apiClient.get('/api/v1/cvs/my-cvs');
  console.log('✅ [CV Flow] Đã tải danh sách CV:', res.data);
  return res.data;
};

export const getCVById = async (id) => {
  const res = await apiClient.get(`/api/v1/cvs/${id}`);
  return res.data;
};

export const createCV = async (cvData) => {
  console.log('📤 [CV Flow] Gửi yêu cầu TẠO MỚI CV với dữ liệu:', cvData);
  const res = await apiClient.post('/api/v1/cvs', cvData);
  console.log('🎉 [CV Flow] Đã TẠO CV thành công. Phản hồi từ Server:', res.data);
  return res.data;
};

export const updateCV = async (id, cvData) => {
  console.log(`📤 [CV Flow] Gửi yêu cầu CẬP NHẬT CV (ID: ${id}) với dữ liệu:`, cvData);
  const res = await apiClient.put(`/api/v1/cvs/${id}`, cvData);
  console.log('🎉 [CV Flow] Đã CẬP NHẬT CV thành công. Phản hồi từ Server:', res.data);
  return res.data;
};

export const deleteCV = async (id) => {
  const res = await apiClient.delete(`/api/v1/cvs/${id}`);
  return res.data;
};

export const reviewCV = async (id) => {
  const res = await apiClient.post(`/api/v1/cvs/${id}/ai-review`);
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
