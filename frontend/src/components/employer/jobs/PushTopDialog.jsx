import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';

const PUSH_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Gói đẩy tin 1',
    price: 100000,
  },
];

function formatVND(value) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export default function PushTopDialog({
  open,
  job,
  walletBalance = 0,
  onClose,
  onConfirm,
}) {
  const [selectedPackageId, setSelectedPackageId] = useState('');

  const selectedPackage = useMemo(
    () => PUSH_PACKAGES.find((pkg) => pkg.id === selectedPackageId),
    [selectedPackageId]
  );

  const canSubmit = Boolean(
    selectedPackage && walletBalance >= selectedPackage.price && job
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm?.(job, selectedPackage);
    setSelectedPackageId('');
  };

  const handleCloseDialog = () => {
    setSelectedPackageId('');
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '10px',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.2)',
            maxWidth: 520,
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 2.2,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <RocketLaunchOutlinedIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#1f2937' }}>
            Đẩy tin lên TOP
          </Typography>
        </Box>

        <IconButton size="small" onClick={handleCloseDialog} sx={{ color: '#9ca3af' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3, pt: 0.8, pb: 2 }}>
        {/* Job info card */}
        <Box
          sx={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            mb: 2.5,
          }}
        >
          {/* Job title with icon */}
          <Box sx={{ display: 'flex', gap: 1, p: 1.8, alignItems: 'flex-start', bgcolor: '#fff' }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                bgcolor: '#e7f0ff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                mt: '2px',
              }}
            >
              <CardGiftcardRoundedIcon sx={{ color: '#8ab4f8', fontSize: 15 }} />
            </Box>
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#1f2937', lineHeight: 1.55 }}>
              {job?.title || 'Tin tuyển dụng'}
            </Typography>
          </Box>

          {/* Wallet balance */}
          <Box
            sx={{
              borderTop: '1px solid #e5e7eb',
              bgcolor: '#f0f5ff',
              py: 1.2,
              px: 1.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>Số dư ví:</Typography>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb', lineHeight: 1.2 }}>
              {formatVND(walletBalance)} VNĐ
            </Typography>
          </Box>
        </Box>

        {/* Package selection label */}
        <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#374151', mb: 1.2 }}>
          Chọn gói đẩy tin:
        </Typography>

        {/* Package card */}
        <Box
          onClick={() => setSelectedPackageId('pkg-1')}
          sx={{
            display: 'inline-block',
            borderRadius: '8px',
            border: selectedPackageId === 'pkg-1' ? '1.5px solid #f59e0b' : '1px solid #e5e7eb',
            bgcolor: selectedPackageId === 'pkg-1' ? '#fffdf7' : '#fff',
            py: 1.2,
            px: 2.5,
            cursor: 'pointer',
            textAlign: 'center',
            mb: 2.5,
            transition: 'all 0.15s ease',
            '&:hover': {
              borderColor: '#f59e0b',
              bgcolor: '#fffdf7',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.4 }}>
            <ElectricBoltOutlinedIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
            <Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>
              {PUSH_PACKAGES[0].name}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#ea580c', mt: 0.3 }}>
            {formatVND(PUSH_PACKAGES[0].price)}đ
          </Typography>
        </Box>

        {/* Benefits */}
        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '8px', px: 1.8, py: 1.5 }}>
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#4b5563', mb: 1 }}>
            <WorkspacePremiumOutlinedIcon
              sx={{ fontSize: 15, mr: 0.5, color: '#d97706', verticalAlign: '-3px' }}
            />
            Quyền lợi khi đẩy tin TOP:
          </Typography>
          <Box
            component="ul"
            sx={{
              m: 0,
              pl: 2,
              color: '#4b5563',
              lineHeight: 1.75,
              fontSize: '0.84rem',
              '& li': { mb: 0.2 },
            }}
          >
            <li>Hiển thị đầu tiên trong danh sách tìm kiếm</li>
            <li>Tăng 300% lượt xem tin tuyển dụng</li>
            <li>Thu hút nhiều ứng viên chất lượng hơn</li>
            <li>Icon TOP nổi bật trong kết quả tìm kiếm</li>
          </Box>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, justifyContent: 'flex-end', gap: 0.8 }}>
        <Button
          onClick={handleCloseDialog}
          sx={{
            minWidth: 56,
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '6px',
            px: 1.5,
            py: 0.5,
            fontSize: '0.84rem',
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={handleSubmit}
          startIcon={<RocketLaunchOutlinedIcon sx={{ fontSize: '14px !important' }} />}
          sx={{
            minWidth: 110,
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '6px',
            boxShadow: 'none',
            bgcolor: '#f59e0b',
            color: '#fff',
            fontSize: '0.84rem',
            px: 1.5,
            py: 0.5,
            '&:hover': { bgcolor: '#ea580c', boxShadow: 'none' },
            '&.Mui-disabled': {
              bgcolor: '#f3f4f6',
              color: '#c8ced6',
            },
          }}
        >
          Đẩy tin ngay
        </Button>
      </DialogActions>
    </Dialog>
  );
}
