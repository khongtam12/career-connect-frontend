import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const statStyles = [
  { color: '#2563eb', label: 'Tổng tin tuyển dụng' },
  { color: '#16a34a', label: 'Đang hiển thị' },
  { color: '#ea580c', label: 'Chờ duyệt' },
  { color: '#9333ea', label: 'Đã từ chối' },
];

export default function JobStatsCards({ stats = {} }) {
  const values = [
    stats.total ?? 0,
    stats.active ?? 0,
    stats.pending ?? 0,
    stats.rejected ?? 0,
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 3,
      }}
    >
      {statStyles.map((s, i) => (
        <Paper
          key={i}
          variant="outlined"
          sx={{
            p: 2.5,
            textAlign: 'center',
            borderRadius: 2,
            borderColor: '#e5e7eb',
            bgcolor: '#fff',
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: 2 },
          }}
        >
          <Typography
            sx={{
              fontSize: '2rem',
              fontWeight: 700,
              color: s.color,
              lineHeight: 1.2,
            }}
          >
            {values[i]}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.85rem',
              color: '#6b7280',
              mt: 0.5,
              fontWeight: 500,
            }}
          >
            {s.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
