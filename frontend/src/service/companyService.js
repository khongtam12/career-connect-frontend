import axios from "axios";
import apiClient from "./apiClient";

const rawCompanyServiceURL = import.meta.env.VITE_COMPANY_SERVICE_URL || 'http://localhost:8081';
const companyServiceURL = rawCompanyServiceURL.replace(/\/+$/, '');

const companyServiceClient = axios.create({
    baseURL: companyServiceURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const shouldFallbackToDirectCompanyService = (error) => {
    const status = error?.response?.status;
    return status === 503 || status === 504 || error?.code === 'ERR_NETWORK';
};

const callCompanyService = async (request) => {
    try {
        const response = await request(apiClient);
        return response.data;
    } catch (error) {
        if (!shouldFallbackToDirectCompanyService(error)) {
            throw error;
        }

        const directResponse = await request(companyServiceClient);
        return directResponse.data;
    }
};

export const saveCompany = async (payload) => {
    const res = await apiClient.post("/api/v1/company/save", payload)
    return res.data
}
export const saveVerification = async (payload) => {
    const res = await apiClient.post("/api/v1/company/verification", payload)
    return res.data
}

export const getUrl = async ({ key, contentType }) => {
    const res = await apiClient.get(`/api/v1/storage/presigned-url?key=${key}&contentType=${contentType}`)
    return res.data
}

export const deleteFile = async ({ key }) => {
    const res = await apiClient.delete(`/api/v1/storage/delete?key=${key}`)
    return res.data
}

export const getPendingApprovals = async (page = 0, size = 20) => {
    return callCompanyService((client) => client.get(`/api/v1/company/pending-approvals?page=${page}&size=${size}`));
};

export const getCompanyDetail = async (id) => {
    return callCompanyService((client) => client.get(`/api/v1/company/${id}`));
};

export const getCompanySubscriptions = async (companyId) => {
    return callCompanyService((client) => client.get(`/api/v1/company/subscription/company/${companyId}`));
};

export const getCompanyMarketingEntitlements = async (companyId, category) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return callCompanyService((client) => client.get(`/api/v1/company/marketing-entitlements/company/${companyId}${query}`));
};

export const getActiveMarketingAssignment = async (companyId, targetScope, targetId) => {
    return callCompanyService((client) => client.get(`/api/v1/company/marketing-entitlements/company/${companyId}/active-assignment`, {
        params: { targetScope, targetId },
    }));
};

export const getFeaturedCompanyIds = async () => {
    return callCompanyService((client) => client.get(`/api/v1/company/marketing-entitlements/featured-companies`));
};

export const processApproval = async (payload) => {
    // payload: { companyId, action: 'APPROVED' | 'REJECTED', note: '' }
    const res = await apiClient.post('/api/v1/company/approval', payload);
    return res.data;
};

export const verifyTaxCode = async (taxCode) => {
    const res = await apiClient.get(`/api/v1/company/verify-tax/${taxCode}`);
    return res.data;
};
