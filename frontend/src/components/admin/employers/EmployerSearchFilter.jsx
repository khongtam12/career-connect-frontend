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
  { value: 'all',      label: 'Tất cả trạng thái' },
  { value: 'ACTIVE',   label: 'Đang hoạt động' },
  { value: 'BANNED',   label: 'Đã bị khóa' },
];

export default function EmployerSearchFilter({
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
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm theo tên hoặc email nhà tuyển dụng..."
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
              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
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
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
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
