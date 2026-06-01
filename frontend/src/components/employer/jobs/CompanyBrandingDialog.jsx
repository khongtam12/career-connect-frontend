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
  Chip,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function formatDate(value) {
  if (!value) return 'Không giới hạn';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
}

export default function CompanyBrandingDialog({
  open,
  companyName,
  entitlements = [],
  activeAssignment = null,
  loading = false,
  onClose,
  onConfirm,
  onRemove,
}) {
  const [selectedEntitlementId, setSelectedEntitlementId] = useState('');

  const selectedEntitlement = useMemo(
    () => entitlements.find((item) => item.id === selectedEntitlementId),
    [entitlements, selectedEntitlementId]
  );

  const canSubmit = Boolean(selectedEntitlement && !activeAssignment);
  const hasActiveBranding = Boolean(activeAssignment);

  const handleClose = () => {
    setSelectedEntitlementId('');
    onClose?.();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm?.(selectedEntitlement);
    setSelectedEntitlementId('');
  };

  const handleRemove = () => {
    onRemove?.(activeAssignment.id);
    setSelectedEntitlementId('');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            maxWidth: 500,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 3,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarOutlineIcon sx={{ color: '#059669', fontSize: 24 }} />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
            Branding Công ty
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: '#9ca3af' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1, pb: 3 }}>
        <Typography sx={{ fontSize: '0.9rem', color: '#4b5563', mb: 3 }}>
            Sử dụng gói Branding để hiển thị logo doanh nghiệp tại mục <strong>"Công ty nổi bật"</strong> trên trang chủ ứng viên.
        </Typography>

        <Box
          sx={{
            border: '1.5px solid #ecfdf5',
            borderRadius: '12px',
            p: 2,
            mb: 3,
            bgcolor: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ bgcolor: '#fff', p: 1, borderRadius: '8px', border: '1px solid #d1fae5' }}>
             <WorkspacePremiumOutlinedIcon sx={{ color: '#059669' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#065f46' }}>
              {companyName}
            </Typography>
            {hasActiveBranding ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: '#10b981' }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>
                  Đang hiển thị nổi bật
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Chưa kích hoạt hiển thị logo nổi bật
              </Typography>
            )}
          </Box>
        </Box>

        {hasActiveBranding && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>
                Gói <strong>{activeAssignment.packageLabel}</strong> đang được áp dụng cho công ty của bạn.
            </Alert>
        )}

        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', mb: 1.5 }}>
          Gói Branding khả dụng
        </Typography>

        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {loading && (
            <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', py: 2 }}>
              Đang tải danh sách gói...
            </Typography>
          )}

          {!loading && entitlements.length === 0 && !hasActiveBranding && (
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    Bạn chưa mua gói Branding nào hoặc gói đã sử dụng hết.
                </Typography>
                <Button 
                    variant="text" 
                    size="small" 
                    sx={{ mt: 1, textTransform: 'none', fontWeight: 600, color: '#059669' }}
                    onClick={() => window.open('/employer/pricing', '_blank')}
                >
                    Mua gói ngay
                </Button>
            </Box>
          )}

          {!loading && entitlements.map((item) => {
            const active = selectedEntitlementId === item.id;
            const isAssigned = hasActiveBranding && activeAssignment.entitlementId === item.id;

            return (
              <Box
                key={item.id}
                onClick={() => !hasActiveBranding && setSelectedEntitlementId(item.id)}
                sx={{
                  borderRadius: '12px',
                  border: `2px solid ${active ? '#10b981' : isAssigned ? '#10b981' : '#f3f4f6'}`,
                  bgcolor: active || isAssigned ? '#f0fdf4' : '#fff',
                  px: 2,
                  py: 1.8,
                  cursor: hasActiveBranding ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: active || isAssigned ? '#065f46' : '#1f2937' }}>
                      {item.packageLabel}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', mt: 0.5 }}>
                      Hiệu lực đến: {formatDate(item.endDate)}
                    </Typography>
                  </Box>
                  {(active || isAssigned) && (
                      <CheckCircleOutlineIcon sx={{ color: '#10b981' }} />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 4, pt: 1, justifyContent: 'space-between' }}>
        <Box>
          {hasActiveBranding && (
            <Button
              onClick={handleRemove}
              color="error"
              variant="text"
              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.9rem' }}
            >
              Gỡ hiển thị
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={handleClose}
            sx={{
              color: '#6b7280',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Đóng
          </Button>
          {!hasActiveBranding && (
            <Button
              variant="contained"
              disabled={!canSubmit || loading}
              onClick={handleSubmit}
              sx={{
                bgcolor: '#059669',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                px: 4,
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                '&:hover': { bgcolor: '#047857' },
                '&.Mui-disabled': { bgcolor: '#f3f4f6', color: '#9ca3af' }
              }}
            >
              Kích hoạt ngay
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
