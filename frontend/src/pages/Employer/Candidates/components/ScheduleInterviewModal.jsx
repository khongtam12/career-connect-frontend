import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ScheduleInterviewModal = ({ open, onClose, candidateName, applicationId, onSuccess }) => {
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewTime, setInterviewTime] = useState('');
    const [location, setLocation] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!interviewDate || !interviewTime) {
            toast.warning('Vui lòng chọn ngày và giờ phỏng vấn');
            return;
        }
        if (!location.trim()) {
            toast.warning('Vui lòng nhập địa điểm / link phỏng vấn');
            return;
        }

        setLoading(true);

        try {
            const { scheduleInterview } = await import('@/service/applicationService');
            await scheduleInterview(applicationId, {
                interviewDate,
                interviewTime,
                location: location.trim(),
                note: note.trim()
            });

            // Reset form
            setInterviewDate('');
            setInterviewTime('');
            setLocation('');
            setNote('');

            toast.success(`Đã lên lịch phỏng vấn thành công cho ${candidateName} và gửi email thông báo!`);

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error('Schedule interview error:', err);
            toast.error(err?.response?.data?.message || 'Lỗi khi lên lịch phỏng vấn. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setInterviewDate('');
        setInterviewTime('');
        setLocation('');
        setNote('');
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
            <DialogTitle className="font-bold text-xl border-b border-gray-100 pb-3 flex items-center gap-2 text-emerald-700">
                <FiCalendar /> Lên lịch phỏng vấn
            </DialogTitle>
            <DialogContent className="pt-5 flex flex-col gap-5">
                <Typography className="text-gray-600 text-sm">
                    Thiết lập lịch phỏng vấn cho ứng viên <span className="font-bold">{candidateName}</span>. Thông báo sẽ được gửi qua email.
                </Typography>

                <div className="flex gap-4">
                    <TextField
                        label="Ngày phỏng vấn"
                        type="date"
                        fullWidth
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                    <TextField
                        label="Thời gian"
                        type="time"
                        fullWidth
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </div>

                <TextField
                    label="Địa điểm / Link họp online"
                    placeholder="VD: Tầng 3, Tòa nhà ABC hoặc Link Google Meet"
                    fullWidth
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    size="small"
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />

                <TextField
                    label="Lời nhắn / Ghi chú cho ứng viên"
                    multiline
                    rows={3}
                    placeholder="Trang phục, yêu cầu chuẩn bị..."
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
            </DialogContent>
            <DialogActions className="p-4 border-t border-gray-100">
                <Button onClick={handleClose} className="text-gray-500 font-bold capitalize" disabled={loading}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold capitalize rounded-xl px-6"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? 'Đang xử lý...' : 'Xác nhận Lên Lịch'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScheduleInterviewModal;
