import apiClient from './apiClient';

export const getPackage = async (options = {}) => {
    const response = await apiClient.get('/api/v1/package', {
        params: {
            includeInactive: options.includeInactive === true,
        },
    });
    return response.data;
};
export const paymentPackage = async (body) => {
    const response = await apiClient.post('/api/v1/package/payments/vnpay',
        body
    );
    return response.data;
};

export const updatePackage = async (packageId, body) => {
    const response = await apiClient.put(`/api/v1/package/${packageId}`, body);
    return response.data;
};
