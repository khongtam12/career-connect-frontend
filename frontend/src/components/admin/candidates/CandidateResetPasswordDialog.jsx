import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#d1d5db' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
  '& .MuiOutlinedInput-input': { fontSize: '0.85rem', py: 1 },
  '& .MuiOutlinedInput-input::placeholder': { fontSize: '0.85rem', color: '#9ca3af', opacity: 1 },
};

const sectionTitleSx = {
  fontWeight: 700, fontSize: '0.95rem', color: '#1f2937', mb: 2, mt: 1,
  display: 'flex', alignItems: 'center', gap: 1,
  '&::before': { content: '""', width: 4, height: 18, bgcolor: '#3b82f6', borderRadius: 1, display: 'inline-block' },
};

export default function CandidateResetPasswordDialog({ open, candidate, onClose, onSubmit }) {
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (open) setNewPassword('');
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const candidateId = candidate?.candidateId || candidate?.id;
    onSubmit(candidateId, newPassword);
    setNewPassword('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockResetIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1f2937' }}>
            Đặt lại mật khẩu
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#9ca3af' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          <Typography sx={sectionTitleSx}>Thông tin ứng viên</Typography>
          <Box sx={{ bgcolor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 2, p: 1.5, mb: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>Đặt lại mật khẩu cho:</Typography>
            <Typography sx={{ fontWeight: 700, color: '#111827' }}>
              {candidate?.fullName || '—'}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
              {candidate?.email || '—'}
            </Typography>
          </Box>

          <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#374151', mb: 1 }}>
            Mật khẩu mới
          </Typography>
          <TextField
            name="newPassword"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            size="small"
            placeholder="Mặc định: 123456"
            sx={fieldSx}
          />
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mt: 0.75 }}>
            Để trống sẽ dùng mật khẩu mặc định.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#d1d5db', color: '#6b7280', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' } }}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#3b82f6', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none', '&:hover': { bgcolor: '#2563eb', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' } }}>
            Đổi mật khẩu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
