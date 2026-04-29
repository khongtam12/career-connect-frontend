import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, TextField, CircularProgress, Alert } from '@mui/material';
import { FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const RejectApplicationModal = ({ open, onClose, candidateName, applicationId, onSuccess }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!reason.trim()) {
            setError('Vui lòng nhập lý do từ chối');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { rejectApplication } = await import('@/service/applicationService');
            await rejectApplication(applicationId, reason.trim());

            setReason('');
            toast.success(`Đã từ chối hồ sơ của ${candidateName} và gửi email phản hồi!`);
            
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error('Reject application error:', err);
            setError(err?.response?.data?.message || 'Lỗi khi từ chối hồ sơ. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        setReason('');
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px' } }}
        >
            <DialogTitle className="font-bold text-xl border-b border-gray-100 pb-3 text-red-600 flex items-center gap-2">
                <FiXCircle /> Từ chối hồ sơ
            </DialogTitle>
            <DialogContent className="pt-5 flex flex-col gap-4">
                <Typography className="text-gray-600 text-sm mb-2">
                    Bạn đang từ chối hồ sơ của <span className="font-bold">{candidateName}</span>. Vui lòng cung cấp lý do để ứng viên có thể cải thiện trong tương lai.
                </Typography>

                {error && (
                    <Alert severity="error" onClose={() => setError('')} sx={{ borderRadius: '10px' }}>
                        {error}
                    </Alert>
                )}
                
                <TextField 
                    label="Lý do từ chối (Bắt buộc)" 
                    multiline
                    rows={4}
                    placeholder="VD: Kinh nghiệm chưa phù hợp với yêu cầu vị trí hiện tại..."
                    fullWidth 
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
            </DialogContent>
            <DialogActions className="p-4 border-t border-gray-100">
                <Button onClick={handleClose} className="text-gray-500 font-bold capitalize" disabled={loading}>
                    Hủy
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    className="font-bold capitalize rounded-xl px-6 bg-red-600 hover:bg-red-700 shadow-none"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? 'Đang xử lý...' : 'Xác nhận Từ Chối'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RejectApplicationModal;
