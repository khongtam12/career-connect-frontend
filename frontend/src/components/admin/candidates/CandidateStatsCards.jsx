import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const statStyles = [
  { color: '#2563eb', label: 'Tổng ứng viên' },
  { color: '#16a34a', label: 'Tài khoản hoạt động' },
  { color: '#ea580c', label: 'Tài khoản khóa' },
  { color: '#9333ea', label: 'Đăng ký hôm nay' },
];

export default function CandidateStatsCards({ stats = {} }) {
  const values = [
    stats.total ?? 0,
    stats.active ?? 0,
    stats.banned ?? 0,
    stats.newToday ?? 0,
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
