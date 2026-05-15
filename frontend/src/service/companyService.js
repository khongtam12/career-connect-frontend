import apiClient from "./apiClient";

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
    const res = await apiClient.get(`/api/v1/company/pending-approvals?page=${page}&size=${size}`);
    return res.data;
};

export const getCompanyDetail = async (id) => {
    const res = await apiClient.get(`/api/v1/company/${id}`);
    return res.data;
};

export const getCompanySubscriptions = async (companyId) => {
    const res = await apiClient.get(`/api/v1/company/subscription/company/${companyId}`);
    return res.data;
};

export const getCompanyMarketingEntitlements = async (companyId, category) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await apiClient.get(`/api/v1/company/marketing-entitlements/company/${companyId}${query}`);
    return res.data;
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
