import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Divider,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const labelSx = {
  fontSize: '0.8rem',
  color: '#6b7280',
  fontWeight: 600,
};

const valueSx = {
  fontSize: '0.85rem',
  color: '#111827',
  fontWeight: 500,
  wordBreak: 'break-word',
};

const infoRowSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  py: 1.1,
  px: 2,
  borderBottom: '1px solid #f1f5f9',
  '&:last-child': { borderBottom: 'none' },
};

export default function CandidateDetailDialog({ open, candidate, onClose }) {
  if (!candidate) return null;

  const formatCurrency = (value) => {
    if (!value) return 'Chưa cập nhật';
    return Number(value).toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 440 },
          height: '100%',
          maxHeight: '100%',
          m: 0,
          position: 'fixed',
          right: 0,
          top: 0,
          borderRadius: { xs: 0, sm: '16px 0 0 16px' },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5, pt: 1.75, px: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonOutlineIcon sx={{ color: '#3b82f6', fontSize: 22 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1f2937' }}>
            Chi tiết ứng viên
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#9ca3af' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 2.5, bgcolor: '#f8fafc' }}>
        <Stack spacing={2.5}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              src={candidate.avatar}
              sx={{
                width: 90,
                height: 90,
                mx: 'auto',
                mb: 1.25,
                border: '2px solid #e5e7eb',
                bgcolor: '#f3f4f6',
              }}
            />
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#111827', mb: 0.5 }}>
              {candidate.fullName}
            </Typography>
            <Chip
              label={candidate.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tài khoản khóa'}
              size="small"
              sx={{
                bgcolor: candidate.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                color: candidate.status === 'ACTIVE' ? '#16a34a' : '#ef4444',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          </Box>

          <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <Box sx={infoRowSx}>
              <Typography sx={{ ...labelSx, minWidth: 130 }}>Email</Typography>
              <Typography sx={valueSx}>{candidate.email || 'Chưa cập nhật'}</Typography>
            </Box>
            <Box sx={infoRowSx}>
              <Typography sx={{ ...labelSx, minWidth: 130 }}>Điện thoại</Typography>
              <Typography sx={valueSx}>{candidate.phone || 'Chưa cập nhật'}</Typography>
            </Box>
            <Box sx={infoRowSx}>
              <Typography sx={{ ...labelSx, minWidth: 130 }}>Địa chỉ</Typography>
              <Typography sx={valueSx}>{candidate.address || 'Chưa cập nhật'}</Typography>
            </Box>
            <Box sx={infoRowSx}>
              <Typography sx={{ ...labelSx, minWidth: 130 }}>Ngày sinh</Typography>
              <Typography sx={valueSx}>{candidate.dateOfBirth || 'Chưa cập nhật'}</Typography>
            </Box>
            <Box sx={infoRowSx}>
              <Typography sx={{ ...labelSx, minWidth: 130 }}>Chức danh</Typography>
              <Typography sx={valueSx}>{candidate.currentJobTitle || 'Chưa cập nhật'}</Typography>
            </Box>
            <Box sx={infoRowSx}>
              <Typography sx={{ ...labelSx, minWidth: 130 }}>Kinh nghiệm</Typography>
              <Typography sx={valueSx}>
                {candidate.experienceYear ? `${candidate.experienceYear} năm` : 'Chưa cập nhật'}
              </Typography>
            </Box>
            <Box sx={infoRowSx}>
              <Typography sx={{ ...labelSx, minWidth: 130 }}>Mức lương</Typography>
              <Typography sx={valueSx}>
                {formatCurrency(candidate.expectedSalary)}
              </Typography>
            </Box>
            <Box sx={infoRowSx}>
              <Typography sx={{ ...labelSx, minWidth: 130 }}>Ngày đăng ký</Typography>
              <Typography sx={valueSx}>{candidate.createdAt || 'Chưa cập nhật'}</Typography>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, py: 1.5, gap: 1, bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#d1d5db', color: '#6b7280', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.5, py: 1, fontSize: '0.85rem', '&:hover': { borderColor: '#9ca3af', bgcolor: 'white' } }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
