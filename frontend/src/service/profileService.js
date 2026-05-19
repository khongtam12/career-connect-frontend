import apiClient from "./apiClient";

// ========== ADMIN PROFILE ==========
export const getAdminProfile = async () => {
    const res = await apiClient.get("/api/v1/user/admin/profile/me");
    return res.data;
};

export const updateAdminProfile = async (payload) => {
    const res = await apiClient.put("/api/v1/user/admin/profile/me", payload);
    return res.data;
};

// ========== CANDIDATE PROFILE ==========
export const getCandidateProfile = async () => {
    const res = await apiClient.get("/api/v1/user/candidate/profile/me");
    return res.data;
};

export const updateCandidateProfile = async (payload) => {
    const res = await apiClient.put("/api/v1/user/candidate/profile/me", payload);
    return res.data;
};

// ========== EMPLOYER PROFILE ==========
export const getEmployerProfile = async () => {
    const res = await apiClient.get("/api/v1/user/employer/profile/me");
    return res.data;
};

export const updateEmployerProfile = async (payload) => {
    const res = await apiClient.put("/api/v1/user/employer/profile/me", payload);
    return res.data;
};

// ========== COMPANY PROFILE ==========
export const getCompanyProfile = async (companyId) => {
    const res = await apiClient.get(`/api/v1/company/${companyId}/profile`);
    return res.data;
};

export const updateCompanyProfile = async (companyId, payload) => {
    const res = await apiClient.put(`/api/v1/company/${companyId}/profile`, payload);
    return res.data;
};

// ========== CHANGE PASSWORD ==========
export const changePassword = async (payload) => {
    // payload: { currentPassword, newPassword, confirmPassword }
    const res = await apiClient.post("/api/v1/user/auth/change-password", payload);
    return res.data;
};

// ========== COMMON STORAGE ==========
export const uploadAvatar = async (file) => {
    const key = `avatars/${Date.now()}_${file.name}`;
    
    // Sử dụng endpoint storage dùng chung của hệ thống
    const res = await apiClient.get('/api/v1/storage/presigned-url', {
        params: { key, contentType: file.type }
    });
    
    // API storage-service trả về object { uploadUrl, fileUrl }
    const { uploadUrl, fileUrl } = res.data;

    // Upload trực tiếp lên S3 qua presigned URL
    await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
        },
        body: file,
    });

    return fileUrl;
};

