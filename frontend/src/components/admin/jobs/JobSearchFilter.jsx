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
  { value: '',         label: 'Tất cả trạng thái' },
  { value: 'ACTIVE',   label: 'Đang hiển thị' },
  { value: 'PENDING',  label: 'Chờ duyệt' },
  { value: 'REJECTED', label: 'Đã từ chối' },
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
        mb: 3,
        bgcolor: '#fff',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        {/* Ô tìm kiếm */}
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm theo tiêu đề tin hoặc tên công ty..."
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
              '&.Mui-focused fieldset': { borderColor: '#6366f1' },
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

        {/* Dropdown lọc trạng thái */}
        <FormControl
          size="small"
          sx={{
            width: { xs: '100%', sm: 260 },
            flexShrink: 0,
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
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
              '& .MuiSelect-select': {
                fontSize: '0.85rem',
                py: 1.1,
                fontWeight: 600
              },
              '& .MuiSvgIcon-root': {
                fontSize: 18,
              },
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}
