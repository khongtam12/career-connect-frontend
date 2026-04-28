import apiClient from './apiClient';

export const getCandidates = async (params) => {
    try {
        const response = await apiClient.get('/api/v1/user/admin/candidates', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCandidateStatus = async (id, status) => {
    try {
        const response = await apiClient.patch(`/api/v1/user/admin/candidates/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCandidate = async (candidateData) => {
    try {
        const response = await apiClient.post('/api/v1/user/admin/candidates', candidateData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCandidate = async (id, candidateData) => {
    try {
        const response = await apiClient.put(`/api/v1/user/admin/candidates/${id}`, candidateData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetCandidatePassword = async (id, newPassword) => {
    try {
        const response = await apiClient.patch(`/api/v1/user/admin/candidates/${id}/reset-password`, { newPassword });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCandidateStats = async () => {
    try {
        const response = await apiClient.get('/api/v1/user/admin/candidates/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};

