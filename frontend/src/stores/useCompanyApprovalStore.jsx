import { create } from 'zustand';
import * as companyService from '../service/companyService';

const useCompanyApprovalStore = create((set, get) => ({
    pendingList: [],
    loading: false,
    error: null,

    // Tải danh sách đang chờ duyệt
    fetchPending: async () => {
        set({ loading: true, error: null });
        try {
            const data = await companyService.getPendingApprovals();
            set({ pendingList: data?.content || [], loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // Action duyệt
    approve: async (companyId) => {
        await companyService.processApproval({ companyId, action: 'APPROVED', note: '' });
        get().fetchPending();
    },

    // Action từ chối
    reject: async (companyId, note) => {
        await companyService.processApproval({ companyId, action: 'REJECTED', note });
        get().fetchPending();
    }
}));

export default useCompanyApprovalStore;
