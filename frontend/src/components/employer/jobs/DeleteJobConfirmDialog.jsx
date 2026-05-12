import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

export default function DeleteJobConfirmDialog({ open, jobTitle, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#1f2937' }}>Xác nhận xóa</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography sx={{ fontSize: '0.9rem', color: '#4b5563' }}>
          Bạn có chắc chắn muốn xóa tin
          {jobTitle ? ` "${jobTitle}"` : ''}?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderColor: '#d1d5db', color: '#6b7280', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{ bgcolor: '#ef4444', borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { bgcolor: '#dc2626' } }}
        >
          Xóa tin
        </Button>
      </DialogActions>
    </Dialog>
  );
}
