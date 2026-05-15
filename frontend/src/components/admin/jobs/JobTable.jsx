import React, { useState } from 'react';
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
  Avatar,
  Chip,
  Pagination,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { FiBriefcase } from 'react-icons/fi';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const headCellSx = {
  fontWeight: 700,
  fontSize: '0.75rem',
  color: '#64748b',
  whiteSpace: 'nowrap',
  py: 2,
  borderBottom: '2px solid #dbeafe',
  bgcolor: '#f8fbff',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const bodyCellSx = {
  fontSize: '0.85rem',
  color: '#334155',
  py: 2,
  borderBottom: '1px solid #eff6ff',
};

const ADMIN_APPROVAL_GRACE_HOURS = 24;

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

function JobActionMenu({ job, onStatusChange, onViewDetail, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const canApprove = canApproveJob(job);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{ bgcolor: 'transparent', '&:hover': { bgcolor: '#eff6ff' } }}>
        <MoreVertIcon fontSize="small" sx={{ color: '#94a3b8' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 220,
            borderRadius: 3,
            border: '1px solid #dbeafe',
            boxShadow: '0 18px 40px rgba(37, 99, 235, 0.12)',
          },
        }}
      >
        <MenuItem onClick={() => { handleClose(); onViewDetail(job); }} sx={{ py: 1.2, px: 2, '&:hover': { bgcolor: '#f8fbff' } }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <VisibilityOutlinedIcon fontSize="small" sx={{ color: '#3b82f6' }} />
          </ListItemIcon>
          <ListItemText primary="Xem chi tiết" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
        </MenuItem>

        <Box sx={{ my: 0.5, height: '1px', bgcolor: '#e2e8f0' }} />

        {job.status === 'PENDING' && canApprove && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'ACTIVE'); }} sx={{ py: 1.2, px: 2, color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' } }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlinedIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Phê duyệt tin" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>
        )}

        {job.status === 'PENDING' && !canApprove && (
          <MenuItem disabled sx={{ py: 1.2, px: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlinedIcon fontSize="small" sx={{ color: '#cbd5e1' }} />
            </ListItemIcon>
            <ListItemText
              primary="Chưa thể phê duyệt"
              secondary={getEarliestApprovalTime(job)?.toLocaleString('vi-VN') ? `Sau ${getEarliestApprovalTime(job).toLocaleString('vi-VN')}` : ''}
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }}
              secondaryTypographyProps={{ fontSize: '0.72rem' }}
            />
          </MenuItem>
        )}

        {job.status === 'PENDING' && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'REJECTED'); }} sx={{ py: 1.2, px: 2, color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <HighlightOffOutlinedIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Từ chối tin" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>
        )}

        {job.status === 'ACTIVE' && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'CLOSED'); }} sx={{ py: 1.2, px: 2, color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LockOutlinedIcon fontSize="small" sx={{ color: '#64748b' }} />
            </ListItemIcon>
            <ListItemText primary="Đóng tin" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>
        )}

        {job.status === 'CLOSED' && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'ACTIVE'); }} sx={{ py: 1.2, px: 2, color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' } }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PlayCircleOutlineIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Mở lại tin" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>
        )}

        {job.status !== 'ACTIVE' && job.status !== 'PENDING' && (
          <MenuItem onClick={() => { handleClose(); onDelete(job); }} sx={{ py: 1.2, px: 2, color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <DeleteOutlineIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Xóa vĩnh viễn" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default function JobTable({
  jobs = [],
  page = 0,
  totalPages = 0,
  totalElements = 0,
  onPageChange,
  onStatusChange,
  onViewDetail,
  onDelete,
  loading = false,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '28px',
        border: '1px solid #dbeafe',
        overflow: 'hidden',
        boxShadow: '0 14px 36px rgba(148, 163, 184, 0.12)',
      }}
    >
      <TableContainer sx={{ minHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, pl: 4, minWidth: 320 }}>Tin tuyển dụng</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 180 }}>Địa điểm</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 150 }}>Mức lương</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 120 }}>Ứng viên</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 150 }}>Trạng thái</TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 130 }}>Ngày đăng</TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: 'center', pr: 4, minWidth: 80 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 10 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#eff6ff', width: 64, height: 64 }}>
                      <FiBriefcase size={32} color="#60a5fa" />
                    </Avatar>
                    <Typography sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.9rem' }}>
                      Không tìm thấy tin tuyển dụng nào
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job, idx) => (
                <TableRow
                  key={job.jobId || idx}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#f8fbff' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell sx={{ ...bodyCellSx, pl: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={job.companyLogoUrl}
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: '#f8fbff',
                          border: '1px solid #dbeafe',
                          p: 0.5,
                          '& img': { objectFit: 'contain' },
                        }}
                      >
                        <FiBriefcase size={20} color="#60a5fa" />
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.875rem',
                            color: '#0f172a',
                          }}
                        >
                          {job.title}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: '0.7rem',
                            color: '#2563eb',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em',
                          }}
                        >
                          {job.companyName || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#475569' }}>
                      <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#60a5fa' }} />
                      <Typography noWrap sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {job.location || 'Toàn quốc'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#2563eb', fontWeight: 700 }}>
                      <AttachMoneyOutlinedIcon sx={{ fontSize: 18 }} />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 800 }}>
                        {job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax} tr` : 'Thỏa thuận'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Tooltip title="Số lượng ứng viên đã ứng tuyển" arrow>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          bgcolor: '#eff6ff',
                          color: '#2563eb',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '999px',
                          border: '1px solid #bfdbfe',
                        }}
                      >
                        <PeopleOutlinedIcon sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 800 }}>
                          {job.numberOfApplications || 0}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Chip
                      label={
                        job.status === 'ACTIVE'
                          ? 'Đang hiển thị'
                          : job.status === 'PENDING'
                            ? 'Chờ duyệt'
                            : job.status === 'CLOSED'
                              ? 'Đã đóng'
                              : 'Đã từ chối'
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          job.status === 'REJECTED'
                            ? '#fef2f2'
                            : '#eff6ff',
                        color:
                          job.status === 'REJECTED'
                            ? '#ef4444'
                            : job.status === 'CLOSED'
                              ? '#64748b'
                              : '#2563eb',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        height: 28,
                        borderRadius: '999px',
                        border: '1px solid',
                        borderColor:
                          job.status === 'REJECTED'
                            ? '#fecaca'
                            : job.status === 'CLOSED'
                              ? '#cbd5e1'
                              : '#bfdbfe',
                        '& .MuiChip-label': { px: 1.5 },
                      }}
                    />
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : '---'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center', pr: 4 }}>
                    <JobActionMenu
                      job={job}
                      onStatusChange={onStatusChange}
                      onViewDetail={onViewDetail}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          bgcolor: '#f8fbff',
          borderTop: '1px solid #dbeafe',
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Hiển thị {jobs.length} / {totalElements} kết quả
        </Typography>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, val) => onPageChange?.(val - 1)}
          shape="rounded"
          size="medium"
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 800,
              fontSize: '0.75rem',
              borderRadius: '12px',
              border: '1px solid #dbeafe',
              bgcolor: '#fff',
              '&.Mui-selected': {
                bgcolor: '#3b82f6',
                color: '#fff',
                borderColor: '#3b82f6',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
                '&:hover': { bgcolor: '#2563eb' },
              },
              '&:hover': { bgcolor: '#f8fbff' },
            },
          }}
        />
      </Box>
    </Paper>
  );
}
