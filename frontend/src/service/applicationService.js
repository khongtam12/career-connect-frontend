import apiClient from "./apiClient";
// ── CANDIDATE ──

export const applyForJob = async (payload) => {
  const res = await apiClient.post('/api/v1/apply', payload);
  return res.data;
};


// uploadfile s3
export const uploadApplicationFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/api/v1/apply/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};


//employer
export const getCandidatesForEmployer = async () => {
  const res = await apiClient.get('/api/v1/apply/employer/candidates');
  return res.data;
};

// len lich phong van
export const scheduleInterview = async (applicationId, payload) => {
  const res = await apiClient.put(`/api/v1/apply/${applicationId}/schedule-interview`, payload);
  return res.data;
};

// huy phong van
export const cancelInterview = async (applicationId) => {
  const res = await apiClient.put(`/api/v1/apply/${applicationId}/cancel-interview`, {});
  return res.data;
};

// cap nhat trang thai
export const updateApplicationStatus = async (applicationId, payload) => {
  const res = await apiClient.put(`/api/v1/apply/${applicationId}/status`, payload);
  return res.data;
};

// tu choi ho so
export const rejectApplication = async (applicationId, reason) => {
  const res = await apiClient.put(`/api/v1/apply/${applicationId}/reject`, { status: 'REJECTED', reason });
  return res.data;
};