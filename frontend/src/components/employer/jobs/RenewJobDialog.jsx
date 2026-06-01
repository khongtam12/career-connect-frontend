import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import {
  selectSx,
  sectionLabelSx,
} from './jobDialogStyles';

export default function RenewJobDialog({
  open,
  job,
  subscriptionOptions,
  onClose,
  onSubmit,
}) {
  const [selectedSubscription, setSelectedSubscription] = useState('');

  const handleClose = () => {
    setSelectedSubscription('');
    onClose?.();
  };

  const handleSubmit = () => {
    if (!selectedSubscription) return;

    onSubmit({
      companySubscriptionId: selectedSubscription,
    });
    setSelectedSubscription('');
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      disableScrollLock
      disableAutoFocus
      disableRestoreFocus
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* Header */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutorenewOutlinedIcon sx={{ color: '#0ea5e9', fontSize: 24 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1f2937' }}>
            Gia hạn tin tuyển dụng
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: '#9ca3af' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-message': { fontSize: '0.85rem' } }}>
          Bạn đang gia hạn cho tin: <strong>{job?.title}</strong>. 
          <br/>
          Hành động này sẽ <strong>tiêu tốn 1 lượt đăng</strong> từ Gói tin bạn chọn và tin sẽ lập tức chuyển thành trạng thái <strong>Đang Đăng (ACTIVE)</strong> mà không cần đợi duyệt.
        </Alert>

        <Box sx={{ mb: 2.5 }}>
          <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Chọn gói tin sử dụng</Typography>
          {subscriptionOptions.length === 0 ? (
            <Alert 
              severity="warning" 
              sx={{ 
                borderRadius: 2, 
                border: '1px solid #fcd34d',
                bgcolor: '#fffbeb',
                '& .MuiAlert-message': { width: '100%' } 
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', color: '#92400e', mb: 1.5, fontWeight: 500 }}>
                Bạn hiện không có gói tin nào còn hiệu lực hoặc còn lượt đăng.
              </Typography>
              <Button
                variant="contained"
                size="small"
                href="/employer/pricing"
                sx={{
                  bgcolor: '#f59e0b',
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#d97706' },
                }}
              >
                Mua gói tin ngay
              </Button>
            </Alert>
          ) : (
            <FormControl fullWidth size="small">
              <Select
                displayEmpty
                value={selectedSubscription}
                onChange={(e) => setSelectedSubscription(e.target.value)}
                sx={selectSx}
                MenuProps={{ PaperProps: { sx: { '& .MuiMenuItem-root': { fontSize: '0.85rem' } } } }}
                renderValue={(val) => {
                  if (!val) {
                    return <span style={{ color: '#9ca3af' }}>-- Chọn gói tin đang còn lượt --</span>;
                  }
                  const selected = subscriptionOptions.find((opt) => opt.id === val);
                  return selected?.label || '';
                }}
              >
                {subscriptionOptions.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ borderColor: '#d1d5db', color: '#6b7280', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' } }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedSubscription}
          sx={{
            bgcolor: '#0ea5e9',
            borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none',
            '&:hover': { bgcolor: '#0284c7', boxShadow: '0 2px 8px rgba(14,165,233,0.3)' },
            '&.Mui-disabled': { bgcolor: '#e0f2fe', color: '#7dd3fc' }
          }}
        >
          Xác nhận gia hạn
        </Button>
      </DialogActions>
    </Dialog>
  );
}
