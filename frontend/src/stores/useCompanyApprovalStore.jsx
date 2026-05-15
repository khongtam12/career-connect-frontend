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
    },

    // Tra cứu mã số thuế (VietQR)
    taxInfo: null,
    verifying: false,
    
    verifyTax: async (taxCode) => {
        set({ verifying: true, taxInfo: null });
        try {
            const res = await companyService.verifyTaxCode(taxCode);
            if (res && res.code === "00") {
                set({ taxInfo: res.data, verifying: false });
                return res.data;
            }
            set({ verifying: false });
            return null;
        } catch (error) {
            set({ verifying: false });
            throw error;
        }
    },

    resetTaxInfo: () => set({ taxInfo: null, verifying: false })
}));

export default useCompanyApprovalStore;
