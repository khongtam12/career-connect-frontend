import apiClient from './apiClient';

export const getCandidates = async (params) => {
    const response = await apiClient.get('/api/v1/user/admin/candidates', { params });
    return response.data;
};

export const updateCandidateStatus = async (id, status) => {
    const response = await apiClient.patch(`/api/v1/user/admin/candidates/${id}/status`, { status });
    return response.data;
};

export const createCandidate = async (candidateData) => {
    const response = await apiClient.post('/api/v1/user/admin/candidates', candidateData);
    return response.data;
};

export const updateCandidate = async (id, candidateData) => {
    const response = await apiClient.put(`/api/v1/user/admin/candidates/${id}`, candidateData);
    return response.data;
};

export const resetCandidatePassword = async (id, newPassword) => {
    const response = await apiClient.patch(`/api/v1/user/admin/candidates/${id}/reset-password`, { newPassword });
    return response.data;
};

export const getCandidateStats = async () => {
    const response = await apiClient.get('/api/v1/user/admin/candidates/stats');
    return response.data;
};

