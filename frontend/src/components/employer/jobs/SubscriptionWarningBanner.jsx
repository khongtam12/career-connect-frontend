import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

export default function SubscriptionWarningBanner() {
  return (
    <Box
      sx={{
        mt: -0.5,
        mb: 2.5,
        borderRadius: 3,
        border: '1.5px solid #fcd34d',
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 60%, #fde68a22 100%)',
        boxShadow: '0 2px 12px rgba(245,158,11,0.10), 0 1px 3px rgba(245,158,11,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2.5,
        py: 1.8,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            bgcolor: '#fef3c7',
            border: '1.5px solid #fcd34d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 20, color: '#d97706' }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#92400e', lineHeight: 1.4 }}>
            Bạn chưa có gói tin còn hiệu lực
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#b45309', mt: 0.25, lineHeight: 1.4 }}>
            Hết lượt đăng hoặc chưa mua gói. Mua thêm gói tin để tiếp tục đăng tuyển dụng.
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        size="small"
        startIcon={<ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />}
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />}
        href="/employer/pricing"
        sx={{
          bgcolor: '#f59e0b',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.78rem',
          borderRadius: 2,
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
          px: 2,
          py: 0.8,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          '&:hover': {
            bgcolor: '#d97706',
            boxShadow: '0 4px 12px rgba(245,158,11,0.45)',
          },
        }}
      >
        Mua gói tin
      </Button>
    </Box>
  );
}
