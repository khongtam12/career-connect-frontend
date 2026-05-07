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
  Skeleton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
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

function EmployerActionMenu({ employer, onChangeStatus }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isBanned = employer.status === 'BANNED';

  const handleToggleBanned = () => {
    handleClose();
    onChangeStatus(employer.id, isBanned ? 'ACTIVE' : 'BANNED');
  };

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
            minWidth: 180,
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleToggleBanned} sx={{ py: 1 }}>
          <ListItemIcon>
            {isBanned ? (
              <LockOpenOutlinedIcon fontSize="small" sx={{ color: '#10b981' }} />
            ) : (
              <LockOutlinedIcon fontSize="small" sx={{ color: '#ef4444' }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={isBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}

export default function EmployerTable({
  employers = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  onChangeStatus,
}) {
  if (loading) {
    return (
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}><Skeleton height={60} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

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
                Nhà tuyển dụng
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 200 }}>
                Email
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 200 }}>
                Công ty
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 120 }}>
                Ngày đăng ký
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
            {employers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">
                    Không tìm thấy nhà tuyển dụng nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              employers.map((emp) => (
                <TableRow
                  key={emp.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#fafafa' },
                    transition: 'background-color 0.15s',
                  }}
                >
                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={emp.avatar} alt={emp.fullName} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: '#1f2937',
                            lineHeight: 1.4,
                          }}
                        >
                          {emp.fullName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {emp.position || 'Nhà tuyển dụng'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>
                        {emp.email}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BusinessOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>
                        {emp.companyName || 'Unknown'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>
                      {emp.createdAt || 'N/A'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Chip
                      label={emp.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                      size="small"
                      sx={{
                        bgcolor: emp.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                        color: emp.status === 'ACTIVE' ? '#16a34a' : '#ef4444',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center' }}>
                    <EmployerActionMenu
                      employer={emp}
                      onChangeStatus={onChangeStatus}
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
          page={page}
          onChange={(_, val) => onPageChange?.(val)}
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
