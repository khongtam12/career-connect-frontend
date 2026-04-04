import React from 'react';
import { Chip } from '@mui/material';
import { STATUS_MAP } from './mockData';

const chipColorMap = {
  success: { bgcolor: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
  warning: { bgcolor: '#fef3c7', color: '#d97706', border: '#fde68a' },
  default: { bgcolor: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' },
  error: { bgcolor: '#fee2e2', color: '#dc2626', border: '#fecaca' },
};

export default function JobStatusChip({ status }) {
  const info = STATUS_MAP[status] || STATUS_MAP.active;
  const colors = chipColorMap[info.color] || chipColorMap.default;

  return (
    <Chip
      label={info.label}
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
