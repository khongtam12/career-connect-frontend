import apiClient from "./apiClient";

// Lấy thông tin candidate (avatar, fullName...)
export const getCandidateInfo = async (candidateId) => {
  const res = await apiClient.get(`/api/v1/user/candidate/${candidateId}`);
  return res.data;
};
