import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Pagination,
  Tooltip,
} from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import JobStatusChip from './JobStatusChip';
import JobTypeChip from './JobTypeChip';
import JobActionMenu from './JobActionMenu';

// Header styling chung
const headCellSx = {
  fontWeight: 600,
  fontSize: '0.8rem',
  color: '#374151',
  whiteSpace: 'nowrap',
  py: 1.5,
  borderBottom: '2px solid #e5e7eb',
  bgcolor: '#f9fafb',
};

const bodyCellSx = {
  fontSize: '0.85rem',
  color: '#374151',
  py: 1.8,
  borderBottom: '1px solid #f3f4f6',
};

// Bảng màu fallback cho các gói không khớp từ khoá - màu sắc đậm, nổi bật
const PACKAGE_CHIP_COLORS = [
  { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' },   // indigo-blue
  { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },   // deep-rose
  { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },   // emerald
  { bg: '#fff7ed', text: '#9a3412', border: '#fdba74' },   // burnt-orange
  { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' },   // violet
  { bg: '#cffafe', text: '#164e63', border: '#67e8f9' },   // teal-cyan
  { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },   // amber
  { bg: '#ffe4e6', text: '#9f1239', border: '#fda4af' },   // crimson-rose
  { bg: '#ecfccb', text: '#365314', border: '#a3e635' },   // lime-green
  { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' },   // indigo
  { bg: '#ffedd5', text: '#7c2d12', border: '#fb923c' },   // deep-orange
  { bg: '#f0fdf4', text: '#14532d', border: '#4ade80' },   // forest-green
];

// Màu theo từ khoá gói tin - mỗi loại gói có màu sắc riêng biệt, chuyên nghiệp
const LABEL_COLOR_MAP = [
  // BEST SELLER: vàng-amber nổi bật
  {
    match: ['best', 'seller'],
    color: { bg: '#fffbeb', text: '#92400e', border: '#f59e0b' },
    uppercase: true,
    boxShadow: '0 0 0 1px #f59e0b33',
  },
  // Cơ bản / Basic: xanh dương nhẹ
  {
    match: ['co ban', 'coban', 'basic', 'tin co ban'],
    color: { bg: '#eff6ff', text: '#1e40af', border: '#93c5fd' },
  },
  // Tiêu chuẩn / Standard: xanh lam trung tính
  {
    match: ['tieu chuan', 'standard'],
    color: { bg: '#ecfeff', text: '#0e7490', border: '#22d3ee' },
  },
  // VIP / Premium: tím violet cao cấp
  {
    match: ['vip', 'premium'],
    color: { bg: '#faf5ff', text: '#6d28d9', border: '#c084fc' },
    boxShadow: '0 0 0 1px #c084fc44',
  },
  // Đặc biệt / Special: hồng magenta sang trọng
  {
    match: ['dac biet', 'special', 'platinum'],
    color: { bg: '#fdf2f8', text: '#9d174d', border: '#f472b6' },
  },
  // Pro / Professional
  {
    match: ['pro', 'professional'],
    color: { bg: '#f0f9ff', text: '#075985', border: '#38bdf8' },
  },
  // Gold
  {
    match: ['gold', 'vang'],
    color: { bg: '#fefce8', text: '#713f12', border: '#eab308' },
    boxShadow: '0 0 0 1px #eab30833',
  },
  // Silver
  {
    match: ['silver', 'bac'],
    color: { bg: '#f8fafc', text: '#334155', border: '#94a3b8' },
  },
  // Enterprise
  {
    match: ['enterprise', 'doanh nghiep'],
    color: { bg: '#fff7ed', text: '#7c2d12', border: '#f97316' },
  },
];

function normalizeLabel(label) {
  return label
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase();
}

function getPackageChipStyle(label) {
  if (!label) return null;
  const normalized = normalizeLabel(label);
  const mapped = LABEL_COLOR_MAP.find((entry) =>
    entry.match.some((token) => normalized.includes(token))
  );
  if (mapped) {
    const { color, uppercase, boxShadow } = mapped;
    return {
      bgcolor: color.bg,
      color: color.text,
      border: `1.5px solid ${color.border}`,
      ...(boxShadow ? { boxShadow } : {}),
      _uppercase: uppercase || false,
    };
  }
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash * 31 + label.charCodeAt(i)) % 9973;
  }
  const colors = PACKAGE_CHIP_COLORS[hash % PACKAGE_CHIP_COLORS.length];
  return {
    bgcolor: colors.bg,
    color: colors.text,
    border: `1.5px solid ${colors.border}`,
  };
}

function parseDeadlineToDate(deadline) {
  if (!deadline || typeof deadline !== 'string') return null;

  const value = deadline.trim();
  if (!value || value.toLowerCase() === 'chưa cập nhật') return null;

  const viMatch = value.match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/);
  if (viMatch) {
    const day = Number(viMatch[1]);
    const monthIndex = Number(viMatch[2]) - 1;
    const year = Number(viMatch[3]);

    // Hạn nộp thường là theo ngày → coi hết hạn sau 23:59:59
    const date = new Date(year, monthIndex, day, 23, 59, 59, 999);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Fallback: ISO hoặc format khác
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isDeadlineExpired(deadline) {
  const date = parseDeadlineToDate(deadline);
  if (!date) return false;
  return date.getTime() < Date.now();
}

export default function JobTable({
  jobs = [],
  page = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
  onChangeStatus,
  onOpenMarketing,
  onRemoveMarketing,
  onRenew,
  allSubscriptions = [],
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, borderColor: '#e5e7eb', overflow: 'hidden' }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, minWidth: 250 }}>
                Vị trí tuyển dụng
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 200 }}>
                Địa điểm
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 120 }}>
                Loại hình
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>
                Mức lương
              </TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 70 }}>
                Ứng viên
              </TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 70 }}>
                Lượt xem
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 110 }}>
                Hạn nộp
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 60 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">
                    Không có tin tuyển dụng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow
                  key={job.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#fafafa' },
                    transition: 'background-color 0.15s',
                  }}
                >
                  {/* Vị trí tuyển dụng */}
                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          color: '#1f2937',
                          lineHeight: 1.4,
                        }}
                      >
                        {job.title}
                      </Typography>
                      {job.packageLabel && (() => {
                        const chipStyle = getPackageChipStyle(job.packageLabel) || {};
                        const { _uppercase, ...cleanStyle } = chipStyle;
                        const displayLabel = _uppercase
                          ? job.packageLabel.toUpperCase()
                          : job.packageLabel;
                          
                        const currentSub = allSubscriptions?.find(s => s.id === job.companySubscriptionId);
                        let isExpiringSoon = false;
                        let text = null;
                        let iconEl = undefined;
                        
                        if (currentSub && currentSub.endDate) {
                          const expDate = new Date(currentSub.endDate);
                          expDate.setHours(0, 0, 0, 0);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const diffDays = Math.round((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          
                          isExpiringSoon = diffDays <= 1;
                          text = diffDays < 0 ? 'Gói đã hết hạn' : `Hạn gói: ${String(expDate.getDate()).padStart(2, '0')}/${String(expDate.getMonth() + 1).padStart(2, '0')}/${expDate.getFullYear()}`;
                          
                          if (isExpiringSoon) {
                            iconEl = diffDays < 0 ? <ErrorOutlineIcon /> : <TimerOutlinedIcon />;
                          }
                        }
                          
                        const chipEl = (
                          <Chip
                            label={displayLabel}
                            size="small"
                            icon={iconEl}
                            sx={{
                              ...cleanStyle,
                              fontWeight: 600,
                              fontSize: '0.64rem',
                              height: 20,
                              minWidth: 0,
                              borderRadius: '5px',
                              flexShrink: 0,
                              '& .MuiChip-label': {
                                px: 1,
                                lineHeight: '20px',
                                display: 'block',
                                whiteSpace: 'nowrap',
                              },
                              '& .MuiChip-icon': {
                                width: '12px',
                                height: '12px',
                                ml: 0.8,
                                color: isExpiringSoon ? '#ef4444' : 'inherit',
                              },
                              transition: 'box-shadow 0.2s',
                              ...(isExpiringSoon ? { border: '1px solid #ef4444' } : {})
                            }}
                          />
                        );
                        
                        return text ? (
                          <Tooltip title={text} arrow placement="top">
                            {chipEl}
                          </Tooltip>
                        ) : chipEl;
                      })()}
                      {job.marketingPackageLabel && (
                        <Chip
                          label={job.marketingPackageLabel}
                          size="small"
                          sx={{
                            bgcolor: job.marketingPackageCategory === 'HIGHLIGHT' ? '#fff7ed' : '#fdf2f8',
                            color: job.marketingPackageCategory === 'HIGHLIGHT' ? '#9a3412' : '#9d174d',
                            border: job.marketingPackageCategory === 'HIGHLIGHT'
                              ? '1px solid #fdba74'
                              : '1px solid #f9a8d4',
                            fontWeight: 700,
                            fontSize: '0.64rem',
                            height: 20,
                            borderRadius: '5px',
                            flexShrink: 0,
                            '& .MuiChip-label': {
                              px: 1,
                              lineHeight: '20px',
                              display: 'block',
                              whiteSpace: 'nowrap',
                            },
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  {/* Địa điểm */}
                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                      <LocationOnOutlinedIcon
                        sx={{ fontSize: 16, color: '#9ca3af', mt: 0.2, flexShrink: 0 }}
                      />
                      <Typography
                        sx={{
                          fontSize: '0.82rem',
                          color: '#6b7280',
                          lineHeight: 1.4,
                        }}
                      >
                        {job.location}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Loại hình */}
                  <TableCell sx={bodyCellSx}>
                    <JobTypeChip type={job.type} />
                  </TableCell>

                  {/* Mức lương */}
                  <TableCell sx={bodyCellSx}>
                    {job.salaryNegotiable ? (
                      <Chip
                        label="Thỏa thuận"
                        size="small"
                        sx={{
                          bgcolor: '#f0fdf4',
                          color: '#16a34a',
                          border: '1px solid #86efac',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 26,
                          borderRadius: '6px',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          bgcolor: '#f0fdf4',
                          color: '#16a34a',
                          px: 1,
                          py: 0.4,
                          borderRadius: '6px',
                          display: 'inline-block',
                          textAlign: 'center',
                          border: '1px solid #86efac',
                          minWidth: '60px',
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.2 }}>
                          {Math.round((job.salaryMin || 0) / 1_000_000)} - {Math.round((job.salaryMax || 0) / 1_000_000)}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 600 }}>triệu</Typography>
                      </Box>
                    )}
                  </TableCell>

                  {/* Ứng viên */}
                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      <PersonOutlineIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {job.applicants}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Lượt xem */}
                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {job.views}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Hạn nộp */}
                  <TableCell sx={bodyCellSx}>
                    {(() => {
                      const expired = typeof job.deadlineExpired === 'boolean'
                        ? job.deadlineExpired
                        : isDeadlineExpired(job.deadline);
                      const color = expired ? 'red' : '#6b7280';

                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayOutlinedIcon
                            sx={{ fontSize: 14, color }}
                          />
                          <Typography sx={{ fontSize: '0.82rem', color }}>
                            {job.deadline}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </TableCell>

                  {/* Trạng thái */}
                  <TableCell sx={bodyCellSx}>
                    <JobStatusChip status={job.status} />
                  </TableCell>

                  {/* Thao tác */}
                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center' }}>
                    {(() => {
                      const currentSub = allSubscriptions?.find(s => s.id === job.companySubscriptionId);
                      let packageExpiringSoon = false;
                      if (currentSub?.endDate) {
                        const expDate = new Date(currentSub.endDate);
                        expDate.setHours(0, 0, 0, 0);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const diffDays = Math.round((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        if (diffDays <= 1) packageExpiringSoon = true;
                      }

                      return (
                        <JobActionMenu
                          job={job}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onChangeStatus={onChangeStatus}
                          onOpenMarketing={onOpenMarketing}
                          onRemoveMarketing={onRemoveMarketing}
                          onRenew={onRenew}
                          packageExpiringSoon={packageExpiringSoon}
                        />
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
          borderTop: '1px solid #f3f4f6',
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, val) => onPageChange?.(val)}
          shape="rounded"
          size="small"
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 500,
              '&.Mui-selected': {
                bgcolor: '#10b981',
                color: '#fff',
                '&:hover': { bgcolor: '#059669' },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
}
