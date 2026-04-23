import React from 'react';
import { Chip } from '@mui/material';
import { STATUS_MAP, STATUS_MAP_UPPER } from './mockData';

/**
 * Màu sắc cho từng trạng thái — mỗi trạng thái một màu riêng biệt.
 *
 *  draft    → xám nhạt     (chưa gửi)
 *  pending  → vàng cam     (chờ duyệt)
 *  active   → xanh lá      (đang tuyển)
 *  paused   → xanh dương   (tạm dừng)
 *  closed   → xám đậm      (đã đóng)
 *  rejected → đỏ           (từ chối)
 *  expired  → cam nhạt     (hết hạn)
 */
const chipColorMap = {
  draft:   { bgcolor: '#f3f4f6', color: '#6b7280', border: '#d1d5db' },   // xám nhạt
  pending: { bgcolor: '#fef9c3', color: '#a16207', border: '#fde047' },   // vàng
  success: { bgcolor: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },   // xanh lá
  paused:  { bgcolor: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },   // xanh dương
  default: { bgcolor: '#f3f4f6', color: '#374151', border: '#d1d5db' },   // xám đậm
  error:   { bgcolor: '#fee2e2', color: '#dc2626', border: '#fecaca' },   // đỏ
  expired: { bgcolor: '#ffedd5', color: '#c2410c', border: '#fed7aa' },   // cam nhạt
};

export default function JobStatusChip({ status }) {
  // Hỗ trợ cả lowercase (FE) và UPPERCASE (BE enum)
  const info = STATUS_MAP[status]
    || STATUS_MAP_UPPER[status]
    || STATUS_MAP.active;

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
        whiteSpace: 'nowrap',
      }}
    />
  );
}
