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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

function formatDate(value) {
  if (!value) return 'Không giới hạn';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
}

function getPackageTone(item) {
  const category = String(item.packageCategory || '').toUpperCase();
  if (category === 'HIGHLIGHT') {
    return { bg: '#fff7ed', border: '#fb923c', text: '#9a3412', chip: '#f97316' };
  }
  return { bg: '#fdf4ff', border: '#d8b4fe', text: '#7e22ce', chip: '#a855f7' };
}

export default function PushTopDialog({
  open,
  job,
  entitlements = [],
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

  const canSubmit = Boolean(selectedEntitlement && job);
  const hasActiveMarketing = Boolean(job?.marketingAssignmentId);

  const handleClose = () => {
    setSelectedEntitlementId('');
    onClose?.();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm?.(job, selectedEntitlement);
    setSelectedEntitlementId('');
  };

  const handleRemove = () => {
    onRemove?.(job);
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
            borderRadius: '10px',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.2)',
            maxWidth: 560,
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
          pt: 2.2,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <RocketLaunchOutlinedIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#1f2937' }}>
            Áp dụng gói hiển thị cho tin
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: '#9ca3af' }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 0.8, pb: 2 }}>
        <Box
          sx={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            p: 1.8,
            mb: 2.5,
            bgcolor: '#fff',
          }}
        >
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', mb: 0.5 }}>
            {job?.title || 'Tin tuyển dụng'}
          </Typography>
          {hasActiveMarketing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip size="small" label={job?.marketingPackageLabel || 'Đang áp dụng'} color="warning" />
              <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Gói hiện tại đang được áp dụng cho tin này.
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Chọn một gói `highlight/effect` còn hiệu lực để áp dụng vào tin này.
            </Typography>
          )}
        </Box>

        <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#374151', mb: 1.2 }}>
          Gói khả dụng
        </Typography>

        <Box sx={{ display: 'grid', gap: 1.2 }}>
          {loading && (
            <Typography sx={{ fontSize: '0.84rem', color: '#6b7280' }}>
              Đang tải gói hiển thị...
            </Typography>
          )}

          {!loading && entitlements.length === 0 && (
            <Typography sx={{ fontSize: '0.84rem', color: '#6b7280' }}>
              Không có gói `highlight/effect` nào còn hiệu lực.
            </Typography>
          )}

          {!loading && entitlements.map((item) => {
            const tone = getPackageTone(item);
            const active = selectedEntitlementId === item.id;
            return (
              <Box
                key={item.id}
                onClick={() => setSelectedEntitlementId(item.id)}
                sx={{
                  borderRadius: '10px',
                  border: `1.5px solid ${active ? tone.border : '#e5e7eb'}`,
                  bgcolor: active ? tone.bg : '#fff',
                  px: 1.6,
                  py: 1.4,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, mb: 0.5 }}>
                      <AutoAwesomeOutlinedIcon sx={{ fontSize: 15, color: tone.chip }} />
                      <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: tone.text }}>
                        {item.packageLabel}
                      </Typography>
                      <Chip
                        label={item.packageCategory}
                        size="small"
                        sx={{ height: 20, fontSize: '0.68rem', bgcolor: tone.bg, color: tone.text, border: `1px solid ${tone.border}` }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Còn lại {item.remainingCount}/{item.usageLimit} tin, hết hạn {formatDate(item.endDate)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ border: '1px solid #e5e7eb', borderRadius: '8px', px: 1.8, py: 1.5, mt: 2.5 }}>
          <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#4b5563', mb: 1 }}>
            <WorkspacePremiumOutlinedIcon sx={{ fontSize: 15, mr: 0.5, color: '#d97706', verticalAlign: '-3px' }} />
            Giải thích
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, color: '#4b5563', lineHeight: 1.75, fontSize: '0.84rem' }}>
            <li>Highlight tăng độ ưu tiên hiển thị của job.</li>
            <li>Effect thêm nhãn HOT, in đậm hoặc đóng khung cho job.</li>
            <li>Mỗi gói có giới hạn số tin được áp dụng đồng thời.</li>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, justifyContent: 'space-between', gap: 0.8 }}>
        <Box>
          {hasActiveMarketing && (
            <Button
              onClick={handleRemove}
              color="error"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Gỡ gói hiển thị
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.8 }}>
          <Button
            onClick={handleClose}
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
            disabled={!canSubmit || hasActiveMarketing}
            onClick={handleSubmit}
            startIcon={<RocketLaunchOutlinedIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              minWidth: 140,
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
            Áp dụng gói
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
