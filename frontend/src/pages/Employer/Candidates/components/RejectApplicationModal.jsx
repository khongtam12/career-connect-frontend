import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, TextField } from '@mui/material';
import { FiXCircle } from 'react-icons/fi';

const RejectApplicationModal = ({ open, onClose, candidateName }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
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
                
                <TextField 
                    label="Lý do từ chối (Bắt buộc)" 
                    multiline
                    rows={4}
                    placeholder="VD: Kinh nghiệm chưa phù hợp với yêu cầu vị trí hiện tại..."
                    fullWidth 
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
            </DialogContent>
            <DialogActions className="p-4 border-t border-gray-100">
                <Button onClick={onClose} className="text-gray-500 font-bold capitalize">
                    Hủy
                </Button>
                <Button variant="contained" color="error" className="font-bold capitalize rounded-xl px-6 bg-red-600 hover:bg-red-700 shadow-none">
                    Xác nhận Từ Chối
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RejectApplicationModal;
