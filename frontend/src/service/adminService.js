import apiClient from "./apiClient";

export const getRecruiters = async (page = 0, size = 10) => {
    const res = await apiClient.get(`/api/v1/admin/recruiters?page=${page}&size=${size}`);
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
