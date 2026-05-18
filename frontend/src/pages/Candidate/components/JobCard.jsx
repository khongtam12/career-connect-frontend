import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Heart } from 'lucide-react';
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
    job.companyName || job.company || job.companyId || 'Doanh nghiep';
  const companyLogo = job.logo || job.companyLogoUrl || job.company?.logo || '';

  const jobTypeLabel = job.type || formatJobType(job.jobType);
  const salaryLabel = job.salary || formatSalary(job.salaryMin, job.salaryMax);
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
        position: 'relative',
        borderRadius: 3,
        border: '1px solid',
        borderColor: '#e5e7eb',
        backgroundColor: resolvedFeatured ? '#ecfdf5' : '#ffffff',
        minHeight: 140,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        borderLeft: resolvedFeatured || isFrame ? '4px solid #10b981' : '1px solid #e5e7eb',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/job/${job.jobId || job.id}`}
        sx={{
          borderRadius: 3,
          height: '100%',
          alignItems: 'stretch',
          '&:hover .job-card-title': { color: '#10b981' },
        }}
      >
        <CardContent sx={{ p: 2.25 }}>
          <Stack spacing={1.3}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Avatar
                src={companyLogo || undefined}
                alt={companyName}
                variant="rounded"
                sx={{
                  width: 52,
                  height: 52,
                  bgcolor: '#e2e8f0',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
                imgProps={{
                  onError: (event) => {
                    event.target.onerror = null;
                    event.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10';
                  },
                }}
              >
                {companyName.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }} noWrap>
                  Công Ty {companyName}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="job-card-title"
                  sx={{
                    fontWeight: isBold ? 800 : 700,
                    color: '#0f172a',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {job.title}
                </Typography>
              </Box>
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleToggleSave();
                }}
                sx={{
                  border: '1px solid',
                  borderColor: resolvedSaved ? '#22c55e' : '#d1d5db',
                  color: resolvedSaved ? '#16a34a' : '#6b7280',
                  alignSelf: 'center',
                }}
              >
                <Heart size={18} fill={resolvedSaved ? 'currentColor' : 'none'} />
              </IconButton>
            </Stack>

            <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
              Lương: {salaryLabel} VNĐ
            </Typography>

            {(resolvedFeatured || showHotBadge || showUrgentBadge) && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {resolvedFeatured && (
                  <Chip label="TOP" size="small" sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 700 }} />
                )}
                {showHotBadge && (
                  <Chip label="HOT" size="small" sx={{ bgcolor: '#ef4444', color: '#fff', fontWeight: 700 }} />
                )}
                {showUrgentBadge && (
                  <Chip label="GẤP" size="small" sx={{ bgcolor: '#f97316', color: '#fff', fontWeight: 700 }} />
                )}
              </Stack>
            )}

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {job.location && (
                <Chip label={job.location} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569' }} />
              )}
              {jobTypeLabel && (
                <Chip
                  label={jobTypeLabel}
                  size="small"
                  sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 600 }}
                />
              )}
            </Stack>
          </Stack>
        </CardContent>
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

const formatSalary = (min, max) => {
  if (!min && !max) return 'Thoa thuan';
  if (min && max) return `${formatSalaryValue(min)} - ${formatSalaryValue(max)}`;
  if (min) return `Tu ${formatSalaryValue(min)}`;
  return `Den ${formatSalaryValue(max)}`;
};

const formatSalaryValue = (value) => {
  if (value >= 1000000) {
    const millions = Math.round((value / 1000000) * 10) / 10;
    return `${millions} trieu`;
  }
  return `${value}`;
};