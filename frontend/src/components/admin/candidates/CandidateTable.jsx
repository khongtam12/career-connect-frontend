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
  ListItemText
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

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

function CandidateActionMenu({ candidate, onChangeStatus, onResetPassword, onViewDetail }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isLocked = candidate.status === 'BANNED';

  const handleToggleStatus = () => {
    handleClose();
    onChangeStatus(candidate, isLocked ? 'ACTIVE' : 'BANNED');
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
            minWidth: 150,
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleClose(); onViewDetail(candidate); }} sx={{ py: 1 }}>
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" sx={{ color: '#6366f1' }} />
          </ListItemIcon>
          <ListItemText
            primary="Xem chi tiết"
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
          />
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onResetPassword(candidate); }} sx={{ py: 1 }}>
          <ListItemIcon>
            <VpnKeyOutlinedIcon fontSize="small" sx={{ color: '#3b82f6' }} />
          </ListItemIcon>
          <ListItemText
            primary="Reset mật khẩu"
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
          />
        </MenuItem>
        <MenuItem onClick={handleToggleStatus} sx={{ py: 1 }}>
          <ListItemIcon>
            {isLocked ? (
              <LockOpenOutlinedIcon fontSize="small" sx={{ color: '#10b981' }} />
            ) : (
              <LockOutlinedIcon fontSize="small" sx={{ color: '#ef4444' }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={isLocked ? 'Mở khóa' : 'Khóa tài khoản'}
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}

export default function CandidateTable({
  candidates = [],
  page = 1,
  totalPages = 1,
  onPageChange,
  onChangeStatus,
  onResetPassword,
  onViewDetail,
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
                Ứng viên
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 200 }}>
                Email
              </TableCell>
              <TableCell sx={{ ...headCellSx, minWidth: 150 }}>
                Số điện thoại
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
            {candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">
                    Không có ứng viên nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#fafafa' },
                    transition: 'background-color 0.15s',
                  }}
                >
                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={candidate.avatar} alt={candidate.fullName} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: '#1f2937',
                            lineHeight: 1.4,
                          }}
                        >
                          {candidate.fullName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {candidate.currentJobTitle || 'Chưa cập nhật'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>
                        {candidate.email}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneOutlinedIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>
                        {candidate.phone || 'Chưa cập nhật'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#374151' }}>
                      {candidate.createdAt || 'Chưa cập nhật'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <Chip
                      label={candidate.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                      size="small"
                      sx={{
                        bgcolor: candidate.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                        color: candidate.status === 'ACTIVE' ? '#16a34a' : '#ef4444',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ ...bodyCellSx, textAlign: 'center' }}>
                    <CandidateActionMenu
                      candidate={candidate}
                      onChangeStatus={onChangeStatus}
                      onResetPassword={onResetPassword}
                      onViewDetail={onViewDetail}
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
