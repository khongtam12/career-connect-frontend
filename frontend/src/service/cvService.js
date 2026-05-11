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

export const saveCV = async (cvData) => {
  if (cvData.id) {
    return updateCV(cvData.id, cvData);
  }
  return createCV(cvData);
};

export const uploadCVFile = async (id, formData) => {
  const res = await apiClient.post(`/api/v1/cvs/${id}/upload-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Unified S3 Upload Logic (Internal for CV)
export const uploadCVAvatar = async (file) => {
  const key = `cv/avatars/${Date.now()}_${file.name}`;
  
  // 1. Lấy presigned URL từ chính cv-service
  const res = await apiClient.get('/api/v1/cvs/upload/presigned-url', {
    params: { key, contentType: file.type }
  });
  
  const uploadUrl = res.data;
  const fileUrl = uploadUrl.split('?')[0];

  // 2. Upload trực tiếp lên S3
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  return fileUrl; 
};
