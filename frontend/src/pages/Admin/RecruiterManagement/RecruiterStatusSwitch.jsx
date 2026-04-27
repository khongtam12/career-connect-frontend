import React, { useState } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { toast } from '@/components/ui/use-toast';
import * as adminService from '@/service/adminService';
import useRecruiterStore from '@/stores/useRecruiterStore';

const RecruiterStatusSwitch = ({ id, initialStatus }) => {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const refresh = useRecruiterStore(state => state.refresh);

    // Xử lý bật/tắt trạng thái
    const handleToggle = async (checked) => {
        const newStatus = checked ? 'ACTIVE' : 'INACTIVE';
        setLoading(true);
        try {
            await adminService.patchRecruiterStatus(id, newStatus);
            setStatus(newStatus);
            toast({
                title: 'Cập nhật trạng thái',
                description: checked ? 'Đã bật' : 'Đã tắt',
                variant: 'default'
            });
            refresh();
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Không thể cập nhật trạng thái', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Switch.Root
            checked={status === 'ACTIVE'}
            onCheckedChange={handleToggle}
            disabled={loading}
            className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer disabled:opacity-50"
        >
            <Switch.Thumb 
                className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" 
            />
        </Switch.Root>
    );
};

export default RecruiterStatusSwitch;
