import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const statStyles = [
  { color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', label: 'Tổng tin' },
  { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Đang hiển thị' },
  { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: 'Chờ duyệt' },
  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'Đã từ chối' },
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
      {statStyles.map((stat, index) => (
        <Paper
          key={stat.label}
          variant="outlined"
          sx={{
            p: 2.5,
            textAlign: 'center',
            borderRadius: 4,
            borderColor: stat.border,
            bgcolor: '#fff',
            boxShadow: '0 8px 24px rgba(148, 163, 184, 0.08)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 28px rgba(37, 99, 235, 0.12)',
            },
          }}
        >
          {/* <Box
            sx={{
              width: 44,
              height: 44,
              mx: 'auto',
              mb: 1.5,
              borderRadius: '14px',
              bgcolor: stat.bg,
              border: `1px solid ${stat.border}`,
            }}
          /> */}

          <Typography
            sx={{
              fontSize: '2rem',
              fontWeight: 800,
              color: stat.color,
              lineHeight: 1.2,
            }}
          >
            {values[index]}
          </Typography>

          <Typography
            sx={{
              fontSize: '0.85rem',
              color: '#475569',
              mt: 0.5,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.025em',
            }}
          >
            {stat.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
