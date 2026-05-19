import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Heart, MapPin, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { isJobSaved, toggleSavedJob } from '../utils/jobTracker';
import { useUserStore } from '../../../stores/useUserStore';

import { isBoldJob, isFrameJob, isHighlightJob, isHotJob, isUrgentJob } from '../utils/jobBadges';

export default function JobCard({ job, isFeatured = false, onDetail, isSaved, onToggleSave }) {
  const jobId = job?.jobId || job?.id;
  const [localSaved, setLocalSaved] = React.useState(() => isJobSaved(jobId));
  const resolvedSaved = typeof isSaved === 'boolean' ? isSaved : localSaved;
  const { isAuthenticated, openAuthDialog } = useUserStore();
  const showHotBadge = isHotJob(job);
  const showUrgentBadge = isUrgentJob(job);
  const isFrame = isFrameJob(job);
  const isBold = isBoldJob(job);
  const resolvedFeatured = isFeatured || isHighlightJob(job);

  useEffect(() => {
    setLocalSaved(isJobSaved(jobId));
  }, [jobId]);

  useEffect(() => {
    const handleUpdate = () => setLocalSaved(isJobSaved(jobId));
    window.addEventListener('jobTrackerUpdated', handleUpdate);
    return () => window.removeEventListener('jobTrackerUpdated', handleUpdate);
  }, [jobId]);

  const companyName =
    job.companyName || job.company || job.companyId || 'Doanh nghiệp';
  const companyLogo = job.logo || job.companyLogoUrl || job.company?.logo || '';

  const salaryLabel = formatSalary(job);
  const daysLeft = getDaysLeft(job.deadline);

  const handleToggleSave = () => {
    if (!isAuthenticated) {
      openAuthDialog({ closable: true });
      return;
    }
    if (onToggleSave) {
      onToggleSave(job, !resolvedSaved);
      return;
    }
    const next = toggleSavedJob(job);
    setLocalSaved(next);
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '2px solid',
        borderColor: resolvedFeatured || isFrame ? '#34d399' : '#e2e8f0',
        backgroundColor: resolvedFeatured ? '#f0fdf4' : '#ffffff',
        transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 16px 40px rgba(16, 185, 129, 0.18)',
          borderColor: '#34d399',
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/job/${job.jobId || job.id}`}
        sx={{
          height: '100%',
          '&:hover .job-card-title': { color: '#10b981' },
        }}
      >
        <Stack direction="row" sx={{ height: '100%' }}>

          {/* ── LEFT: Logo ── */}
          <Box
            sx={{
              width: 130,
              minHeight: 130,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#f8fafc',
              borderRight: '1px solid #f1f5f9',
              p: 1.5,
            }}
          >
            <img
              src={companyLogo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10'}
              alt={companyName}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: 100,
                maxHeight: 100,
                objectFit: 'contain',
                borderRadius: 8,
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10';
              }}
            />
          </Box>

          {/* ── CENTER: Info ── */}
          <Box sx={{ flex: 1, minWidth: 0, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.75 }}>

            {/* Title + Badges */}
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexWrap: 'nowrap' }}>
              <Typography
                className="job-card-title"
                sx={{
                  fontWeight: isBold ? 800 : 700,
                  color: '#1e293b',
                  fontSize: '1rem',
                  lineHeight: 1.35,
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: 0,
                }}
              >
                {job.title}
              </Typography>
              <CheckCircle size={16} color="#22c55e" style={{ flexShrink: 0 }} />
              {resolvedFeatured && (
                <Chip
                  label="TOP"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #f97316, #fb923c)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: 20,
                    flexShrink: 0,
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              )}
              {showHotBadge && (
                <Chip
                  label="🔥 HOT"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #ef4444, #f87171)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: 20,
                    flexShrink: 0,
                  }}
                />
              )}
              {showUrgentBadge && (
                <Chip
                  label="⚡ GẤP"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: 20,
                    flexShrink: 0,
                  }}
                />
              )}
            </Stack>

            {/* Company name */}
            <Typography
              variant="body2"
              sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}
              noWrap
            >
              {companyName}
            </Typography>

            {/* Tags row */}
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
              {job.location && (
                <Chip
                  icon={<MapPin size={12} />}
                  label={job.location}
                  size="small"
                  sx={{
                    bgcolor: '#f0fdf4',
                    color: '#16a34a',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    height: 26,
                    border: '1px solid #bbf7d0',
                    '& .MuiChip-icon': { color: '#22c55e' },
                  }}
                />
              )}
              {daysLeft !== null && daysLeft >= 0 && (
                <Chip
                  icon={<Clock size={12} />}
                  label={`Còn ${daysLeft} ngày để ứng tuyển`}
                  size="small"
                  sx={{
                    bgcolor: daysLeft <= 7 ? '#fef2f2' : '#f0fdf4',
                    color: daysLeft <= 7 ? '#dc2626' : '#16a34a',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    height: 26,
                    border: daysLeft <= 7 ? '1px solid #fecaca' : '1px solid #bbf7d0',
                    '& .MuiChip-icon': { color: daysLeft <= 7 ? '#ef4444' : '#22c55e' },
                  }}
                />
              )}
              {daysLeft !== null && daysLeft < 0 && (
                <Chip
                  label="Đã hết hạn"
                  size="small"
                  sx={{
                    bgcolor: '#fef2f2',
                    color: '#dc2626',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    height: 26,
                    border: '1px solid #fecaca',
                  }}
                />
              )}
              {/* Benefit tags inline */}
              {job.benefitTags && job.benefitTags.slice(0, 2).map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: '#ecfdf5',
                    color: '#059669',
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    height: 26,
                    border: '1px solid #a7f3d0',
                  }}
                />
              ))}
              {job.benefitTags && job.benefitTags.length > 2 && (
                <Chip
                  label={`+${job.benefitTags.length - 2}`}
                  size="small"
                  sx={{
                    bgcolor: '#f0fdf4',
                    color: '#059669',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 26,
                  }}
                />
              )}
            </Stack>
          </Box>

          {/* ── RIGHT: Salary + Actions ── */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              p: 2,
              pl: 0,
              minWidth: 170,
            }}
          >
            {/* Salary */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <DollarSign size={18} color="#22c55e" />
              <Typography
                sx={{
                  fontWeight: 800,
                  color: '#16a34a',
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {salaryLabel}
              </Typography>
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                size="small"
                onClick={(e) => {
                  // Let CardActionArea handle navigation
                }}
                sx={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderRadius: '10px',
                  px: 2.5,
                  py: 0.75,
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                    boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)',
                  },
                }}
              >
                Ứng tuyển
              </Button>
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleToggleSave();
                }}
                size="small"
                sx={{
                  border: '2px solid',
                  borderColor: resolvedSaved ? '#22c55e' : '#d1d5db',
                  color: resolvedSaved ? '#22c55e' : '#9ca3af',
                  bgcolor: resolvedSaved ? '#f0fdf4' : '#fff',
                  borderRadius: '10px',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#22c55e',
                    color: '#22c55e',
                    bgcolor: '#f0fdf4',
                  },
                }}
              >
                <Heart size={18} fill={resolvedSaved ? 'currentColor' : 'none'} />
              </IconButton>
            </Stack>
          </Box>

        </Stack>
      </CardActionArea>
    </Card>
  );
}

// ===== Helpers =====
const formatJobType = (jobType) => {
  if (!jobType) return '';
  const map = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    INTERNSHIP: 'Internship',
    REMOTE: 'Remote',
    FREELANCE: 'Freelance',
  };
  return map[jobType] || jobType;
};

const formatSalary = (job) => {
  if (job.salaryNegotiable) return 'Thỏa thuận';

  const min = job.salaryMin;
  const max = job.salaryMax;

  if (!min && !max) return 'Thỏa thuận';
  if (min && max)
    return `${formatNum(min)} - ${formatNum(max)} Triệu`;
  if (min) return `Từ ${formatNum(min)} Triệu`;
  return `Đến ${formatNum(max)} Triệu`;
};

const formatNum = (v) => {
  if (v >= 1_000_000) return `${Math.round((v / 1_000_000) * 10) / 10}`;
  return v.toLocaleString('vi-VN');
};

const getDaysLeft = (deadline) => {
  if (!deadline) return null;
  let date;
  if (deadline.includes('/')) {
    const parts = deadline.split('/');
    date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  } else {
    date = new Date(deadline);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return -1;
  return Math.ceil(Math.abs(date - today) / (1000 * 60 * 60 * 24));
};