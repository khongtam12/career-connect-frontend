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
  Tooltip
} from '@mui/material';
import { FiBriefcase } from 'react-icons/fi';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
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
  color: '#6b7280',
  whiteSpace: 'nowrap',
  py: 2,
  borderBottom: '2px solid #f3f4f6',
  bgcolor: '#f9fafb',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const bodyCellSx = {
  fontSize: '0.85rem',
  color: '#374151',
  py: 2,
  borderBottom: '1px solid #f3f4f6',
};

function JobActionMenu({ job, onStatusChange, onViewDetail, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{ bgcolor: 'transparent', '&:hover': { bgcolor: '#f3f4f6' } }}>
        <MoreVertIcon fontSize="small" sx={{ color: '#9ca3af' }} />
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
            minWidth: 180,
            borderRadius: 3,
            border: '1px solid #f3f4f6',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      >
        <MenuItem onClick={() => { handleClose(); onViewDetail(job); }} sx={{ py: 1.2, px: 2, '&:hover': { bgcolor: '#f9fafb' } }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <VisibilityOutlinedIcon fontSize="small" sx={{ color: '#3b82f6' }} />
          </ListItemIcon>
          <ListItemText primary="Xem chi tiết" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
        </MenuItem>

        <Box sx={{ my: 0.5, height: '1px', bgcolor: '#f3f4f6' }} />

        {job.status === 'PENDING' && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'ACTIVE'); }} sx={{ py: 1.2, px: 2, color: '#10b981', '&:hover': { bgcolor: '#f0fdf4' } }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleOutlinedIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Phê duyệt tin" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
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

        {/* Closed option for ACTIVE jobs */}
        {job.status === 'ACTIVE' && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'CLOSED'); }} sx={{ py: 1.2, px: 2, color: '#64748b', '&:hover': { bgcolor: '#f1f5f9' } }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LockOutlinedIcon fontSize="small" sx={{ color: '#64748b' }} />
            </ListItemIcon>
            <ListItemText primary="Đóng tin (Closed)" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>
        )}

        {/* Re-open option for CLOSED jobs */}
        {job.status === 'CLOSED' && (
          <MenuItem onClick={() => { handleClose(); onStatusChange(job, 'ACTIVE'); }} sx={{ py: 1.2, px: 2, color: '#10b981', '&:hover': { bgcolor: '#f0fdf4' } }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <PlayCircleOutlineIcon fontSize="small" sx={{ color: 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Mở lại tin" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
          </MenuItem>
        )}

        {/* Hide Permanent Delete for ACTIVE and PENDING jobs */}
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
  onEdit,
  onDelete,
  loading = false
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid #f1f5f9',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.01), 0 1px 2px 0 rgba(0, 0, 0, 0.006)',
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
                    <Avatar sx={{ bgcolor: '#f9fafb', width: 64, height: 64 }}>
                      <FiBriefcase size={32} color="#d1d5db" />
                    </Avatar>
                    <Typography sx={{ fontWeight: 700, color: '#9ca3af', fontSize: '0.9rem' }}>
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
                    '&:hover': { bgcolor: '#f8fafc' },
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
                          bgcolor: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          p: 0.5,
                          '& img': { objectFit: 'contain' }
                        }}
                      >
                        <FiBriefcase size={20} color="#94a3b8" />
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography
                            noWrap
                            sx={{
                              fontWeight: 800,
                              fontSize: '0.875rem',
                              color: '#0f172a',
                              '&:hover': { color: '#4f46e5' },
                              cursor: 'pointer',
                              transition: 'color 0.2s'
                            }}
                          >
                            {job.title}
                          </Typography>
                          {job.isHot && (
                            <Chip
                              label="HOT"
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 900,
                                bgcolor: '#fff7ed',
                                color: '#c2410c',
                                border: '1px solid #ffedd5',
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: '0.7rem',
                            color: '#64748b',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em'
                          }}
                        >
                          {job.companyName || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#475569' }}>
                      <LocationOnOutlinedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                      <Typography noWrap sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                        {job.location || 'Toàn quốc'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#059669', fontWeight: 700 }}>
                      <AttachMoneyOutlinedIcon sx={{ fontSize: 18 }} />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 800 }}>
                        {job.salaryMin && job.salaryMax
                          ? `${job.salaryMin} - ${job.salaryMax} tr`
                          : job.salaryRange || 'Thỏa thuận'}
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
                          bgcolor: '#f5f3ff',
                          color: '#4f46e5',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '8px',
                          border: '1px solid #ede9fe'
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
                        job.status === 'ACTIVE' ? 'Đang hiển thị' :
                          job.status === 'PENDING' ? 'Chờ duyệt' :
                            job.status === 'CLOSED' ? 'Đã đóng' : 'Đã từ chối'
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          job.status === 'ACTIVE' ? '#f0fdf4' :
                            job.status === 'PENDING' ? '#fffbeb' :
                              job.status === 'CLOSED' ? '#f1f5f9' : '#fef2f2',
                        color:
                          job.status === 'ACTIVE' ? '#16a34a' :
                            job.status === 'PENDING' ? '#d97706' :
                              job.status === 'CLOSED' ? '#64748b' : '#ef4444',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        height: 28,
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor:
                          job.status === 'ACTIVE' ? '#dcfce7' :
                            job.status === 'PENDING' ? '#fef3c7' :
                              job.status === 'CLOSED' ? '#e2e8f0' : '#fee2e2',
                        '& .MuiChip-label': { px: 1.5 }
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
                      onEdit={onEdit}
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
          bgcolor: '#f9fafb',
          borderTop: '1px solid #f1f5f9',
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
              border: '1px solid #e2e8f0',
              bgcolor: '#fff',
              '&.Mui-selected': {
                bgcolor: '#3b82f6',
                color: '#fff',
                borderColor: '#3b82f6',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
                '&:hover': { bgcolor: '#2563eb' },
              },
              '&:hover': { bgcolor: '#f8fafc' }
            },
          }}
        />
      </Box>
    </Paper>
  );
}
