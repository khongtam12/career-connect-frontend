import { create } from 'zustand';
import * as adminService from '../service/adminService';

const useRecruiterStore = create((set, get) => ({
    recruiters: [],
    loading: false,
    error: null,
    totalElements: 0,
    page: 0,
    size: 10,
    
    // Gọi API lấy danh sách recruiter
    fetchRecruiters: async (page = 0, size = 10) => {
        set({ loading: true, error: null });
        try {
            const data = await adminService.getRecruiters(page, size);
            set({ 
                recruiters: data?.data?.content || [], 
                totalElements: data?.data?.totalElements || 0,
                page, 
                size,
                loading: false 
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
    
    // Refresh lại danh sách sau khi có thao tác update/delete
    refresh: () => {
        const { page, size } = get();
        get().fetchRecruiters(page, size);
    }
}));

export default useRecruiterStore;
