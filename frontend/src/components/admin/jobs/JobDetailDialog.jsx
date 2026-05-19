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
  Slide,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ADMIN_APPROVAL_GRACE_HOURS = 24;

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

const htmlContentSx = {
  fontSize: '0.85rem',
  color: '#374151',
  lineHeight: 1.7,
  overflowX: 'auto',
  overflowY: 'visible',
  wordBreak: 'normal',
  overflowWrap: 'normal',
  whiteSpace: 'normal',
  '& *': { maxWidth: '100%', boxSizing: 'border-box' },
};

const plainListSx = {
  fontSize: '0.85rem',
  color: '#374151',
  lineHeight: 1.7,
  listStyle: 'disc',
  pl: 2.5,
  my: 0.5,
  overflowX: 'auto',
  overflowY: 'visible',
  wordBreak: 'normal',
  overflowWrap: 'normal',
  whiteSpace: 'normal',
  '& li': { mb: 0.5 },
};

function isHtmlString(value) {
  return /<\/?[a-z][\s\S]*>/i.test(String(value || ''));
}

function normalizeHtml(value) {
  return value ? String(value).replace(/&nbsp;/g, ' ') : value;
}

function splitPlainText(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function stripBulletPrefix(value) {
  return String(value || '').replace(/^[-•]\s*/, '');
}

function getJobTypeLabel(type) {
  switch (type) {
    case 'FULL_TIME': return 'Toàn thời gian';
    case 'PART_TIME': return 'Bán thời gian';
    case 'CONTRACT': return 'Hợp đồng';
    case 'INTERNSHIP': return 'Thực tập';
    case 'FREELANCE': return 'Freelance';
    case 'TEMPORARY': return 'Tạm thời';
    case 'REMOTE': return 'Làm từ xa';
    default: return type || 'Chưa cập nhật';
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'ACTIVE': return 'Đang hiển thị';
    case 'PENDING': return 'Chờ duyệt';
    case 'CLOSED': return 'Đã đóng';
    case 'REJECTED': return 'Đã từ chối';
    default: return status || '---';
  }
}

function getStatusChipSx(status) {
  switch (status) {
    case 'ACTIVE':
      return { bgcolor: '#dcfce7', color: '#16a34a' };
    case 'PENDING':
      return { bgcolor: '#fef3c7', color: '#d97706' };
    case 'CLOSED':
      return { bgcolor: '#f3f4f6', color: '#6b7280' };
    case 'REJECTED':
      return { bgcolor: '#fee2e2', color: '#ef4444' };
    default:
      return { bgcolor: '#f3f4f6', color: '#6b7280' };
  }
}

function getEarliestApprovalTime(job) {
  const submittedAtRaw = job?.updatedAt || job?.createdAt;
  if (!submittedAtRaw) return null;
  const submittedAt = new Date(submittedAtRaw);
  if (Number.isNaN(submittedAt.getTime())) return null;
  return new Date(submittedAt.getTime() + ADMIN_APPROVAL_GRACE_HOURS * 60 * 60 * 1000);
}

function canApproveJob(job) {
  if (job?.status !== 'PENDING') return false;
  const earliestApprovalTime = getEarliestApprovalTime(job);
  if (!earliestApprovalTime) return false;
  return Date.now() >= earliestApprovalTime.getTime();
}

function RenderHtmlContent({ html, fallback = 'Chưa có thông tin' }) {
  if (!html) {
    return <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>{fallback}</Typography>;
  }

  const normalized = normalizeHtml(html);

  if (isHtmlString(normalized)) {
    return (
      <Box
        className="job-html"
        sx={htmlContentSx}
        dangerouslySetInnerHTML={{ __html: normalized }}
      />
    );
  }

  const lines = splitPlainText(normalized);
  if (!lines.length) {
    return <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic' }}>{fallback}</Typography>;
  }

  return (
    <Box component="ul" sx={plainListSx}>
      {lines.map((line, index) => (
        <Box component="li" key={`${line}-${index}`}>
          {stripBulletPrefix(line)}
        </Box>
      ))}
    </Box>
  );
}

function SectionCard({ title, children }) {
  return (
    <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <Box sx={{ bgcolor: '#f9fafb', px: 2, py: 1, borderBottom: '1px solid #e5e7eb' }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1f2937' }}>{title}</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {children}
      </Box>
    </Box>
  );
}

export default function JobDetailDialog({ open, job, onClose, loading, onStatusChange }) {
  if (!job && !loading) return null;

  const canApprove = canApproveJob(job);
  const earliestApprovalTime = getEarliestApprovalTime(job);

  const handleAction = (status) => {
    onStatusChange(job, status);
    onClose();
  };

  const formatSalary = () => {
    if (!job) return '---';
    if (job.salaryNegotiable || (!job.salaryMin && !job.salaryMax)) return 'Thỏa thuận';
    return `${Math.round((job.salaryMin || 0) / 1_000_000)} - ${Math.round((job.salaryMax || 0) / 1_000_000)} triệu`;
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
          width: { xs: '100%', sm: 480 },
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
          <WorkOutlineIcon sx={{ color: '#3b82f6', fontSize: 22 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1f2937' }}>
              Chi tiết tin tuyển dụng
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#9ca3af' }}>
              ID: {job?.jobId || '---'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#9ca3af' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2.5, bgcolor: '#f8fafc' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
            <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {/* Header: Logo + Title + Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                src={job.company?.logoUrl}
                variant="rounded"
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  '& img': { objectFit: 'contain' },
                }}
              >
                <BusinessOutlinedIcon sx={{ color: '#9ca3af' }} />
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#111827', lineHeight: 1.3, mb: 0.3 }}>
                  {job.title}
                </Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#6b7280', mb: 0.5 }}>
                  {job.company?.name || 'N/A'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={getStatusLabel(job.status)}
                    size="small"
                    sx={{
                      ...getStatusChipSx(job.status),
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                    }}
                  />
                  {job.jobType && (
                    <Chip label={getJobTypeLabel(job.jobType)} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22, bgcolor: '#f3f4f6', color: '#374151' }} />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Thông tin chính */}
            <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Ngành nghề</Typography>
                <Typography sx={valueSx}>{job.industry || 'Chưa cập nhật'}</Typography>
              </Box>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Vị trí/Cấp bậc</Typography>
                <Typography sx={valueSx}>{job.rank || 'Chưa cập nhật'}</Typography>
              </Box>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Kinh nghiệm</Typography>
                <Typography sx={valueSx}>{job.experience || 'Chưa cập nhật'}</Typography>
              </Box>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Học vấn</Typography>
                <Typography sx={valueSx}>{job.education || 'Chưa cập nhật'}</Typography>
              </Box>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Mức lương</Typography>
                <Typography sx={valueSx}>{formatSalary()}</Typography>
              </Box>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Số lượng tuyển</Typography>
                <Typography sx={valueSx}>{job.quantity ? `${job.quantity} người` : 'Chưa cập nhật'}</Typography>
              </Box>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Địa điểm</Typography>
                <Typography sx={valueSx}>{job.location || 'Chưa cập nhật'}</Typography>
              </Box>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Hạn nộp</Typography>
                <Typography sx={valueSx}>{job.deadline || 'Chưa cập nhật'}</Typography>
              </Box>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Lượt xem</Typography>
                <Typography sx={valueSx}>{job.views ?? 0}</Typography>
              </Box>
              <Box sx={infoRowSx}>
                <Typography sx={{ ...labelSx, minWidth: 130 }}>Ứng tuyển</Typography>
                <Typography sx={valueSx}>{job.numberOfApplications ?? 0}</Typography>
              </Box>
            </Box>

            {/* Mô tả công việc */}
            <SectionCard title="Mô tả công việc">
              <RenderHtmlContent html={job.description} fallback="Chưa có mô tả" />
            </SectionCard>

            {/* Yêu cầu ứng viên */}
            <SectionCard title="Yêu cầu ứng viên">
              <RenderHtmlContent html={job.candidateRequirements} fallback="Chưa có yêu cầu" />
            </SectionCard>

            {/* Quyền lợi */}
            <SectionCard title="Quyền lợi & Phúc lợi">
              <RenderHtmlContent html={job.benefitsDetail} fallback="Chưa có thông tin quyền lợi" />
            </SectionCard>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5, gap: 1, bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb', flexDirection: 'column' }}>
        {job?.status === 'PENDING' && !canApprove && earliestApprovalTime && (
          <Typography sx={{ width: '100%', fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
            Tin này chỉ có thể được phê duyệt sau {earliestApprovalTime.toLocaleString('vi-VN')}.
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          {job?.status === 'PENDING' && canApprove && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleAction('ACTIVE')}
              sx={{
                borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1,
                boxShadow: 'none', bgcolor: '#16a34a',
                '&:hover': { boxShadow: 'none', bgcolor: '#15803d' },
              }}
            >
              Phê duyệt
            </Button>
          )}

          {job?.status === 'PENDING' && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleAction('REJECTED')}
              sx={{
                borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1,
                boxShadow: 'none', bgcolor: '#ef4444',
                '&:hover': { boxShadow: 'none', bgcolor: '#dc2626' },
              }}
            >
              Từ chối
            </Button>
          )}

          {job?.status === 'ACTIVE' && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleAction('CLOSED')}
              sx={{
                borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1,
                boxShadow: 'none', bgcolor: '#6b7280',
                '&:hover': { boxShadow: 'none', bgcolor: '#4b5563' },
              }}
            >
              Đóng tin
            </Button>
          )}

          {job?.status === 'CLOSED' && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleAction('ACTIVE')}
              sx={{
                borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1,
                boxShadow: 'none', bgcolor: '#16a34a',
                '&:hover': { boxShadow: 'none', bgcolor: '#15803d' },
              }}
            >
              Mở lại tin
            </Button>
          )}
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#d1d5db', color: '#6b7280', borderRadius: 2, textTransform: 'none',
            fontWeight: 600, py: 1, fontSize: '0.85rem',
            '&:hover': { borderColor: '#9ca3af', bgcolor: 'white' },
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
