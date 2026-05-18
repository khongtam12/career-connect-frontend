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
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Đang hiển thị' },
  { value: 'PENDING', label: 'Chờ duyệt' },
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
        borderRadius: 4,
        borderColor: '#dbeafe',
        p: 2,
        mb: 3,
        bgcolor: '#fff',
        boxShadow: '0 8px 24px rgba(148, 163, 184, 0.08)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm theo tiêu đề tin hoặc tên công ty..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#60a5fa', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              bgcolor: '#f8fbff',
              '& fieldset': { borderColor: '#dbeafe' },
              '&:hover fieldset': { borderColor: '#93c5fd' },
              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
            },
            '& .MuiOutlinedInput-input': {
              fontSize: '0.85rem',
              py: 1.1,
              color: '#0f172a',
            },
            '& .MuiOutlinedInput-input::placeholder': {
              fontSize: '0.85rem',
              color: '#94a3b8',
              opacity: 1,
            },
          }}
        />

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
              borderRadius: 999,
              bgcolor: '#f8fbff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dbeafe' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#93c5fd' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
              '& .MuiSelect-select': {
                fontSize: '0.85rem',
                py: 1.1,
                fontWeight: 700,
                color: '#0f172a',
              },
              '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: '#60a5fa',
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
