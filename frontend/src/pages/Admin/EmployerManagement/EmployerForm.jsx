import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import * as adminService from '@/service/adminService';
import useEmployerStore from '@/stores/useEmployerStore';

const schema = z.object({
    fullName: z.string().min(3, { message: 'Họ tên phải có ít nhất 3 ký tự' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    companyId: z.string().min(1, { message: 'Vui lòng chọn công ty' })
});

const EmployerForm = ({ isOpen, onClose, mode, initialData }) => {
    const [loading, setLoading] = useState(false);
    const refresh = useEmployerStore(state => state.refresh);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { fullName: '', email: '', companyId: '' }
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    fullName: initialData.fullName || '',
                    email: initialData.email || '',
                    companyId: initialData.companyId || ''
                });
            } else {
                reset({ fullName: '', email: '', companyId: '' });
            }
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (mode === 'edit' && initialData?.id) {
                await adminService.updateRecruiter(initialData.id, data);
                toast({ title: 'Thành công', description: 'Cập nhật nhà tuyển dụng thành công', variant: 'default' });
            } else {
                await adminService.createRecruiter(data);
                toast({ title: 'Thành công', description: 'Tạo nhà tuyển dụng mới', variant: 'default' });
            }
            refresh();
            onClose();
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Có lỗi xảy ra, vui lòng thử lại', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 fixed inset-0 z-50" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-md z-50">
                    <Dialog.Title className="text-xl font-bold mb-4">
                        {mode === 'edit' ? 'Chỉnh sửa Nhà tuyển dụng' : 'Tạo Nhà tuyển dụng mới'}
                    </Dialog.Title>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                            <input {...register('fullName')} className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập họ tên" />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input {...register('email')} type="email" className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="example@email.com" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
                            <input {...register('companyId')} className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập ID công ty" />
                            {errors.companyId && <p className="text-red-500 text-sm mt-1">{errors.companyId.message}</p>}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Dialog.Close asChild>
                                <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Hủy</button>
                            </Dialog.Close>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                                {loading ? 'Đang xử lý...' : 'Lưu lại'}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default EmployerForm;
