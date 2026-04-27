import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from '@/components/ui/use-toast';
import * as adminService from '@/service/adminService';
import useRecruiterStore from '@/stores/useRecruiterStore';

const RecruiterDeleteConfirm = ({ isOpen, onClose, recruiterId }) => {
    const [loading, setLoading] = useState(false);
    const refresh = useRecruiterStore(state => state.refresh);

    // Xử lý xóa
    const handleDelete = async () => {
        if (!recruiterId) return;
        setLoading(true);
        try {
            await adminService.deleteRecruiter(recruiterId);
            toast({
                title: 'Xóa',
                description: 'Xóa recruiter thành công',
                variant: 'default'
            });
            refresh();
            onClose();
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Không thể xóa recruiter này', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 fixed inset-0 z-50" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md z-50">
                    <Dialog.Title className="text-lg font-bold mb-2">Xác nhận xóa</Dialog.Title>
                    <Dialog.Description className="mb-6 text-gray-600">
                        Bạn có chắc muốn xóa recruiter này? Hành động này không thể hoàn tác.
                    </Dialog.Description>
                    
                    <div className="flex justify-end gap-3">
                        <Dialog.Close asChild>
                            <button disabled={loading} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                                Hủy
                            </button>
                        </Dialog.Close>
                        <button 
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default RecruiterDeleteConfirm;
