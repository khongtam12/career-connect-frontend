import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang tuyển' },
  { value: 'paused', label: 'Tạm dừng' },
  { value: 'closed', label: 'Đã đóng' },
  { value: 'expired', label: 'Hết hạn' },
];

export default function JobSearchFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: '#e5e7eb',
        p: 2,
        mb: 0,
        bgcolor: '#fff',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
        }}
      >
        {/* Ô tìm kiếm */}
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm theo tên vị trí..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#fff',
              '& fieldset': { borderColor: '#e5e7eb' },
              '&:hover fieldset': { borderColor: '#d1d5db' },
              '&.Mui-focused fieldset': { borderColor: '#10b981' },
            },
            '& .MuiOutlinedInput-input': {
              fontSize: '0.85rem',
              py: 1.1,
            },
            '& .MuiOutlinedInput-input::placeholder': {
              fontSize: '0.85rem',
              color: '#9ca3af',
              opacity: 1,
            },
          }}
        />

        {/* Dropdown lọc trạng thái (nằm dưới, sát ô tìm kiếm như hình 2) */}
        <FormControl
          size="small"
          sx={{
            width: { xs: '100%', sm: 220 },
            alignSelf: 'flex-start',
          }}
        >
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: 2,
              bgcolor: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
              '& .MuiSelect-select': {
                fontSize: '0.85rem',
                py: 1.1,
              },
              '& .MuiSvgIcon-root': {
                fontSize: 18,
              },
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.85rem' }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}
