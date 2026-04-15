import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const statStyles = [
  { color: '#16a34a', label: 'Đang tuyển' },
  { color: '#ea580c', label: 'Tạm dừng' },
  { color: '#6b7280', label: 'Đã đóng' },
  { color: '#2563eb', label: 'Tổng ứng viên' },
];

export default function JobStatsCards({ stats = {} }) {
  const values = [
    stats.active ?? 0,
    stats.paused ?? 0,
    stats.closed ?? 0,
    stats.totalApplicants ?? 0,
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
