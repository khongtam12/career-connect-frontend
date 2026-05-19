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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

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
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon fontSize="small" sx={{ color: '#6b7280' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 0.5,
            minWidth: 150,
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleClose(); onViewDetail(job); }} sx={{ py: 1 }}>
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" sx={{ color: '#6366f1' }} />
          </ListItemIcon>
          <ListItemText
            primary="Xem chi tiết"
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
          />
        </MenuItem>

        {job.status === 'PENDING' && canApprove && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'ACTIVE'); }} sx={{ py: 1 }}>
            <ListItemIcon>
              <CheckCircleOutlinedIcon fontSize="small" sx={{ color: '#10b981' }} />
            </ListItemIcon>
            <ListItemText
              primary="Phê duyệt tin"
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
            />
          </MenuItem>
        )}

        {job.status === 'PENDING' && !canApprove && (
          <MenuItem disabled sx={{ py: 1 }}>
            <ListItemIcon>
              <CheckCircleOutlinedIcon fontSize="small" sx={{ color: '#d1d5db' }} />
            </ListItemIcon>
            <ListItemText
              primary="Chưa thể phê duyệt"
              secondary={getEarliestApprovalTime(job)?.toLocaleString('vi-VN') ? `Sau ${getEarliestApprovalTime(job).toLocaleString('vi-VN')}` : ''}
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
              secondaryTypographyProps={{ fontSize: '0.72rem' }}
            />
          </MenuItem>
        )}

        {job.status === 'PENDING' && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'REJECTED'); }} sx={{ py: 1 }}>
            <ListItemIcon>
              <HighlightOffOutlinedIcon fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <ListItemText
              primary="Từ chối tin"
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
            />
          </MenuItem>
        )}

        {job.status === 'ACTIVE' && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'CLOSED'); }} sx={{ py: 1 }}>
            <ListItemIcon>
              <LockOutlinedIcon fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <ListItemText
              primary="Đóng tin"
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
            />
          </MenuItem>
        )}

        {job.status === 'CLOSED' && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'ACTIVE'); }} sx={{ py: 1 }}>
            <ListItemIcon>
              <PlayCircleOutlineIcon fontSize="small" sx={{ color: '#10b981' }} />
            </ListItemIcon>
            <ListItemText
              primary="Mở lại tin"
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
            />
          </MenuItem>
        )}

        {job.status !== 'ACTIVE' && job.status !== 'PENDING' && (
          <MenuItem onClick={() => { handleClose(); onDelete(job); }} sx={{ py: 1 }}>
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <ListItemText
              primary="Xóa vĩnh viễn"
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
            />
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
      variant="outlined"
      sx={{ borderRadius: 2, borderColor: '#e5e7eb', overflow: 'hidden' }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headCellSx, minWidth: 280 }}>
                Tin tuyển dụng
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 150 }}>
                Địa điểm
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 130 }}>
                Mức lương
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 100 }}>
                Ứng viên
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 120 }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 120 }}>
                Ngày đăng
              </TableCell>
              <TableCell sx={{ ...headCellSx, textAlign: 'center', minWidth: 60 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">
                    Không tìm thấy tin tuyển dụng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job, idx) => (
                <TableRow
                  key={job.jobId || idx}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#fafafa' },
                    transition: 'background-color 0.15s',
                  }}
                >
                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={job.companyLogoUrl}
                        variant="rounded"
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: '#1f2937',
                            lineHeight: 1.4,
                          }}
                        >
                          {job.title}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{ fontSize: '0.75rem', color: '#6b7280' }}
                        >
                          {job.companyName || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>
                        {job.location || 'Toàn quốc'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    {(!job.salaryMin && !job.salaryMax) || job.salaryNegotiable ? (
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

                  <TableCell sx={bodyCellSx}>
                    <Tooltip title="Số lượng ứng viên đã ứng tuyển" arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                        <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>
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
                          job.status === 'ACTIVE'
                            ? '#dcfce7'
                            : job.status === 'PENDING'
                              ? '#fef3c7'
                              : job.status === 'REJECTED'
                                ? '#fee2e2'
                                : '#f3f4f6',
                        color:
                          job.status === 'ACTIVE'
                            ? '#16a34a'
                            : job.status === 'PENDING'
                              ? '#d97706'
                              : job.status === 'REJECTED'
                                ? '#ef4444'
                                : '#6b7280',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : '---'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center' }}>
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
          justifyContent: 'flex-end',
          p: 2,
          borderTop: '1px solid #f3f4f6',
        }}
      >
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, val) => onPageChange?.(val - 1)}
          shape="rounded"
          size="small"
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 500,
              '&.Mui-selected': {
                bgcolor: '#3b82f6',
                color: '#fff',
                '&:hover': { bgcolor: '#2563eb' },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
}
