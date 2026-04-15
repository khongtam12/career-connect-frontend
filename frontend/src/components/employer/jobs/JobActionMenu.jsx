import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function JobActionMenu({ job, onEdit, onPushTop, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleAction = (action) => {
    handleClose();
    action?.(job);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{
          color: '#6b7280',
          p: 0.2,
          '&:hover': { color: '#374151', bgcolor: '#f3f4f6' },
        }}
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
              borderRadius: '8px',
              boxShadow: '0 8px 22px rgba(15, 23, 42, 0.16)',
              minWidth: 174,
              border: '1px solid #eceff3',
              mt: 0.6,
              '& .MuiMenuItem-root': {
                fontSize: '0.84rem',
                py: 0.75,
                px: 1.2,
              },
              '& .MuiListItemIcon-root': { minWidth: 28 },
            },
          },
        }}
      >
        <MenuItem dense onClick={() => handleAction(onEdit)}>
          <ListItemIcon>
            <EditOutlinedIcon sx={{ fontSize: 18, color: '#6b7280' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.84rem' }}>
            Chỉnh sửa
          </ListItemText>
        </MenuItem>

        <MenuItem dense onClick={() => handleAction(onPushTop)}>
          <ListItemIcon>
            <RocketLaunchOutlinedIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ fontSize: '0.84rem', fontWeight: 700 }}
            sx={{ color: '#d97706' }}
          >
            Đẩy tin lên TOP
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem dense onClick={() => handleAction(onDelete)}>
          <ListItemIcon>
            <DeleteOutlineIcon sx={{ fontSize: 18, color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.84rem' }} sx={{ color: '#ef4444' }}>
            Xóa
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
