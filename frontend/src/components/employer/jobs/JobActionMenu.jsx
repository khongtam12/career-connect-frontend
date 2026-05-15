import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
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

// chuyển trạng thái employer được phép
const TRANSITIONS = {
  DRAFT:  [{ to: 'PENDING', label: 'Gửi duyệt',     Icon: SendRoundedIcon,            color: '#6366f1' }],
  ACTIVE: [
    { to: 'PAUSED', label: 'Tạm dừng',    Icon: PauseCircleOutlineIcon,    color: '#f59e0b' },
    { to: 'CLOSED', label: 'Đóng tin',     Icon: DoNotDisturbOnOutlinedIcon, color: '#9ca3af' },
  ],
  PAUSED: [{ to: 'ACTIVE', label: 'Tiếp tục đăng', Icon: PlayCircleOutlineIcon,     color: '#10b981' }],
};

export default function JobActionMenu({
  job,
  onEdit,
  onDelete,
  onChangeStatus,
  onOpenMarketing,
  onRemoveMarketing,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleClose = () => setAnchorEl(null);
  const handle = (fn) => { handleClose(); fn?.(job); };

  const transitions = TRANSITIONS[(job.status || '').toUpperCase()] || [];

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
        <MenuItem dense onClick={() => handle(onEdit)}>
          <ListItemIcon>
            <EditOutlinedIcon sx={{ fontSize: 17, color: '#6b7280' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.84rem' }}>Chỉnh sửa</ListItemText>
        </MenuItem>

        {transitions.map(({ to, label, Icon, color }) => (
          <MenuItem key={to} dense onClick={() => { handleClose(); onChangeStatus?.(job, to); }}>
            <ListItemIcon>
              <Icon sx={{ fontSize: 17, color }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.84rem', color }}>
              {label}
            </ListItemText>
          </MenuItem>
        ))}

        <MenuItem dense onClick={() => handle(onOpenMarketing)}>
          <ListItemIcon>
            <RocketLaunchOutlinedIcon sx={{ fontSize: 17, color: '#f59e0b' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.84rem', color: '#b45309' }}>
            Áp dụng `highlight/effect`
          </ListItemText>
        </MenuItem>

        {job?.marketingAssignmentId && (
          <MenuItem dense onClick={() => handle(onRemoveMarketing)}>
            <ListItemIcon>
              <LayersClearOutlinedIcon sx={{ fontSize: 17, color: '#dc2626' }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.84rem', color: '#dc2626' }}>
              Gỡ gói hiển thị
            </ListItemText>
          </MenuItem>
        )}

        <MenuItem dense onClick={() => handle(onDelete)}>
          <ListItemIcon>
            <DeleteOutlineIcon sx={{ fontSize: 17, color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.84rem', color: '#ef4444' }}>Xóa</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
