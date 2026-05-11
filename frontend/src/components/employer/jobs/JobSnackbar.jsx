import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function JobSnackbar({ open, message, severity, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          borderRadius: 2,
          fontSize: '0.84rem',
          fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: severity === 'success' ? '#bbf7d0' : '#fecaca',
          bgcolor: severity === 'success' ? '#f0fdf4' : '#fff5f5',
          color: severity === 'success' ? '#15803d' : '#dc2626',
          '& .MuiAlert-icon': {
            color: severity === 'success' ? '#16a34a' : '#ef4444',
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
