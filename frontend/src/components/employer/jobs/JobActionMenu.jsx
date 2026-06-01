import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import LayersClearOutlinedIcon from '@mui/icons-material/LayersClearOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';

// chuyển trạng thái employer được phép
const TRANSITIONS = {
  DRAFT:  [{ to: 'PENDING', label: 'Gửi duyệt',     Icon: SendRoundedIcon,            color: '#6366f1' }],
  ACTIVE: [
    { to: 'PAUSED', label: 'Tạm dừng',    Icon: PauseCircleOutlineIcon,    color: '#f59e0b' },
    { to: 'CLOSED', label: 'Đóng tin',     Icon: DoNotDisturbOnOutlinedIcon, color: '#9ca3af' },
  ],
  PAUSED: [{ to: 'ACTIVE', label: 'Tiếp tục đăng', Icon: PlayCircleOutlineIcon,     color: '#10b981' }],
  REJECTED: [{ to: 'PENDING', label: 'Gửi duyệt lại', Icon: SendRoundedIcon,          color: '#6366f1' }],
};

const MARKETING_ALLOWED_STATUSES = new Set(['ACTIVE']);

export default function JobActionMenu({
  job,
  onEdit,
  onDelete,
  onChangeStatus,
  onOpenMarketing,
  onRemoveMarketing,
  onRenew,
  packageExpiringSoon,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => { e.preventDefault(); e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleClose = (e) => { 
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setAnchorEl(null); 
  };
  const handle = (e, fn) => { 
    if (e) { e.preventDefault(); e.stopPropagation(); }
    handleClose(); 
    fn?.(job); 
  };

  const jobStatus = (job.status || '').toUpperCase();
  const transitions = TRANSITIONS[jobStatus] || [];
  const canApplyMarketing = MARKETING_ALLOWED_STATUSES.has(jobStatus);
  const isStatusOk = new Set(['ACTIVE', 'PAUSED', 'CLOSED', 'EXPIRED']).has(jobStatus);
  const canRenew = isStatusOk && (jobStatus === 'CLOSED' || packageExpiringSoon);
  const canDelete = (job?.applicants || 0) === 0;

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{ color: '#6b7280', p: 0.2, '&:hover': { color: '#374151', bgcolor: '#f3f4f6' } }}
      >
        <MoreVertIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
              minWidth: 190,
              border: '1px solid #f3f4f6',
              mt: 0.6,
              '& .MuiMenuItem-root': { fontSize: '0.84rem', py: 0.8, px: 1.4 },
              '& .MuiListItemIcon-root': { minWidth: 30 },
            },
          },
        }}
      >
        <MenuItem dense onClick={(e) => handle(e, onEdit)}>
          <ListItemIcon>
            <EditOutlinedIcon sx={{ fontSize: 17, color: '#6b7280' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.84rem' }}>Chỉnh sửa</ListItemText>
        </MenuItem>

        {transitions.map(({ to, label, Icon, color }) => (
          <MenuItem key={to} dense onClick={(e) => { handleClose(e); onChangeStatus?.(job, to); }}>
            <ListItemIcon>
              {React.createElement(Icon, { sx: { fontSize: 17, color } })}
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontSize: '0.84rem', color }}
            />
          </MenuItem>
        ))}

        {canRenew && (
          <MenuItem dense onClick={(e) => handle(e, onRenew)}>
            <ListItemIcon>
              <AutorenewOutlinedIcon sx={{ fontSize: 17, color: '#0ea5e9' }} />
            </ListItemIcon>
            <ListItemText
              primary="Gia hạn tin"
              primaryTypographyProps={{ fontSize: '0.84rem', color: '#0ea5e9' }}
            />
          </MenuItem>
        )}

        {canApplyMarketing && (
          <MenuItem dense onClick={(e) => handle(e, onOpenMarketing)}>
            <ListItemIcon>
              <RocketLaunchOutlinedIcon sx={{ fontSize: 17, color: '#f59e0b' }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.84rem', color: '#b45309' }}>
              Áp dụng `highlight/effect`
            </ListItemText>
          </MenuItem>
        )}

        {job?.marketingAssignmentId && (
          <MenuItem dense onClick={(e) => handle(e, onRemoveMarketing)}>
            <ListItemIcon>
              <LayersClearOutlinedIcon sx={{ fontSize: 17, color: '#dc2626' }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.84rem', color: '#dc2626' }}>
              Gỡ gói hiển thị
            </ListItemText>
          </MenuItem>
        )}

        {canDelete ? (
          <MenuItem dense onClick={(e) => handle(e, onDelete)}>
            <ListItemIcon>
              <DeleteOutlineIcon sx={{ fontSize: 17, color: '#ef4444' }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.84rem', color: '#ef4444' }}>Xóa</ListItemText>
          </MenuItem>
        ) : (
          <Tooltip 
            title="Không thể xóa tin do đã có ứng viên nộp hồ sơ. Vui lòng chuyển trạng thái sang 'Đóng tin' để dừng tuyển." 
            placement="left" 
            arrow
          >
            <Box>
              <MenuItem dense disabled sx={{ opacity: 0.5 }}>
                <ListItemIcon>
                  <DeleteOutlineIcon sx={{ fontSize: 17, color: '#ef4444' }} />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontSize: '0.84rem', color: '#ef4444' }}>Xóa</ListItemText>
              </MenuItem>
            </Box>
          </Tooltip>
        )}
      </Menu>
    </>
  );
}
