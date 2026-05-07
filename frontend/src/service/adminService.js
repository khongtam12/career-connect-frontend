import apiClient from "./apiClient";

export const getRecruiters = async (page = 0, size = 10, keyword = '', status = '') => {
    let url = `/api/v1/admin/recruiters?page=${page}&size=${size}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    if (status && status !== 'all') url += `&status=${status}`;
    const res = await apiClient.get(url);
    return res.data;
};

export const createRecruiter = async (payload) => {
    const res = await apiClient.post("/api/v1/admin/recruiters", payload);
    return res.data;
};

export const updateRecruiter = async (id, payload) => {
    const res = await apiClient.put(`/api/v1/admin/recruiters/${id}`, payload);
    return res.data;
};

export const deleteRecruiter = async (id) => {
    const res = await apiClient.delete(`/api/v1/admin/recruiters/${id}`);
    return res.data;
};

export const patchRecruiterStatus = async (id, status) => {
    const res = await apiClient.patch(`/api/v1/admin/recruiters/${id}/status`, { status });
    return res.data;
};

export const getEmployerStats = async () => {
    const res = await apiClient.get("/api/v1/admin/recruiters/stats");
    return res.data;
};


