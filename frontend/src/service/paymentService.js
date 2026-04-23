import apiClient from './apiClient';

export const getPackage = async () => {
    const response = await apiClient.get('/api/v1/package');
    return response.data;
};