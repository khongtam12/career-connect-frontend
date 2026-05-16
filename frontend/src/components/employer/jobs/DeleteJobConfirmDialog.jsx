import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function DeleteJobConfirmDialog({ open, jobTitle, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableScrollLock
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteOutlineIcon sx={{ color: '#ef4444', fontSize: 24 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1f2937' }}>
            Xác nhận xóa tin
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#9ca3af' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
        <Alert severity="error" sx={{ borderRadius: 2, '& .MuiAlert-message': { fontSize: '0.85rem' } }}>
          Bạn đang yêu cầu xóa tin: <strong>{jobTitle || 'Tin tuyển dụng này'}</strong>. 
          <br /><br />
          Lưu ý: Hành động này <strong>không thể hoàn tác</strong>.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderColor: '#d1d5db', color: '#6b7280', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' } }}
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: '#ef4444',
            borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none',
            '&:hover': { bgcolor: '#dc2626', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' }
          }}
        >
          Xóa tin
        </Button>
      </DialogActions>
    </Dialog>
  );
}
