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
    const res = await apiClient.get(`/api/v1/company/upload/presigned-url?key=${key}&contentType=${contentType}`)
    return res.data
}

export const deleteFile = async ({ key }) => {
    const res = await apiClient.delete(`/api/v1/company/upload/delete?key=${key}`)
    return res.data
}
