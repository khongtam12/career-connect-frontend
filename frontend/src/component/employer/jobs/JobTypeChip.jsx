import React from 'react';
import { Chip } from '@mui/material';

const typeColorMap = {
  'Toàn thời gian': { bgcolor: '#dbeafe', color: '#2563eb', border: '#93c5fd' },
  'Bán thời gian': { bgcolor: '#ede9fe', color: '#7c3aed', border: '#c4b5fd' },
  'Thực tập': { bgcolor: '#ede9fe', color: '#7c3aed', border: '#c4b5fd' },
  'Freelance': { bgcolor: '#fef3c7', color: '#d97706', border: '#fcd34d' },
  'Remote': { bgcolor: '#ccfbf1', color: '#0d9488', border: '#5eead4' },
};

const defaultColors = { bgcolor: '#f3f4f6', color: '#6b7280', border: '#d1d5db' };

export default function JobTypeChip({ type }) {
  const colors = typeColorMap[type] || defaultColors;

  return (
    <Chip
      label={type}
      size="small"
      sx={{
        bgcolor: colors.bgcolor,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 26,
        borderRadius: '6px',
      }}
    />
  );
}
