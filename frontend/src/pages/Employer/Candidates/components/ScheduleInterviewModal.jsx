import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, TextField } from '@mui/material';

const ScheduleInterviewModal = ({ open, onClose, candidateName }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px' } }}
        >
            <DialogTitle className="font-bold text-xl border-b border-gray-100 pb-3">
                Lên lịch phỏng vấn
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
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                    <TextField 
                        label="Thời gian" 
                        type="time" 
                        fullWidth 
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </div>
                
                <TextField 
                    label="Địa điểm / Link họp online" 
                    placeholder="VD: Tầng 3, Tòa nhà ABC hoặc Link Google Meet"
                    fullWidth 
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
                
                <TextField 
                    label="Lời nhắn / Ghi chú cho ứng viên" 
                    multiline
                    rows={3}
                    placeholder="Trang phục, yêu cầu chuẩn bị..."
                    fullWidth 
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
            </DialogContent>
            <DialogActions className="p-4 border-t border-gray-100">
                <Button onClick={onClose} className="text-gray-500 font-bold capitalize">
                    Hủy
                </Button>
                <Button variant="contained" className="bg-emerald-600 hover:bg-emerald-700 font-bold capitalize rounded-xl px-6">
                    Xác nhận Lên Lịch
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScheduleInterviewModal;
