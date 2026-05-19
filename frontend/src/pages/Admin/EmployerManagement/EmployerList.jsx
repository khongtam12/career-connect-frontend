import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmployerStatsCards from '../../../components/admin/employers/EmployerStatsCards';
import EmployerSearchFilter from '../../../components/admin/employers/EmployerSearchFilter';
import EmployerTable from '../../../components/admin/employers/EmployerTable';
import { getRecruiters, getEmployerStats, patchRecruiterStatus } from '../../../service/adminService';

const ITEMS_PER_PAGE = 10;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function withRetry(fn, retries = 2, delayMs = 1500) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries) throw err;
      await sleep(delayMs);
    }
  }
}

export default function EmployerList() {
  const [allEmployers, setAllEmployers] = useState([]);
  const [filteredEmployers, setFilteredEmployers] = useState([]);
  const [pagedEmployers, setPagedEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, banned: 0, newToday: 0 });

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const showSnack = (message, severity = 'success') =>
    setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const fetchStats = async () => {
    try {
      const data = await withRetry(() => getEmployerStats());
      setStats(data.data || data);
    } catch (err) {
      console.error('Lỗi khi tải thống kê:', err);
    }
  };

  const fetchAllEmployers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await withRetry(() => getRecruiters(0, 1000));
      const data = response.data || response;
      const content = data.content || [];
      setAllEmployers(content);
    } catch (err) {
      console.error('Lỗi khi tải danh sách nhà tuyển dụng:', err);
      showSnack('Không thể tải danh sách nhà tuyển dụng', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchAllEmployers();
  }, [fetchAllEmployers]);

  // Handle Filtering (Client-side)
  useEffect(() => {
    let filtered = [...allEmployers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        (e.fullName && e.fullName.toLowerCase().includes(term)) ||
        (e.email && e.email.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    setFilteredEmployers(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1);
    setPage(1); 
  }, [allEmployers, searchTerm, statusFilter]);

  // Handle Pagination (Client-side)
  useEffect(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPagedEmployers(filteredEmployers.slice(startIndex, endIndex));
  }, [filteredEmployers, page]);

  const handleChangeStatus = async (employerId, newStatus) => {
    try {
      await patchRecruiterStatus(employerId, newStatus);
      showSnack(`Đã chuyển trạng thái sang ${newStatus === 'ACTIVE' ? 'Hoạt động' : 'Khóa'}`);
      // Refresh both stats and list
      fetchStats();
      fetchAllEmployers();
    } catch (err) {
      console.error('Lỗi khi đổi trạng thái:', err);
      showSnack('Không thể đổi trạng thái', 'error');
    }
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPage(1);
    fetchStats();
    fetchAllEmployers();
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#1f2937',
              lineHeight: 1.3,
            }}
          >
            Quản lý nhà tuyển dụng
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.3 }}>
            Xem danh sách và quản lý tài khoản nhà tuyển dụng
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              borderColor: '#d1d5db',
              color: '#374151',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
            }}
          >
            Làm mới
          </Button>
        </Box>
      </Box>

      <EmployerStatsCards stats={stats} />

      <EmployerSearchFilter
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
      />

      <EmployerTable
        employers={pagedEmployers}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onChangeStatus={handleChangeStatus}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          sx={{
            borderRadius: 2,
            fontSize: '0.84rem',
            fontWeight: 500,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: snack.severity === 'success' ? '#bbf7d0' : '#fecaca',
            bgcolor: snack.severity === 'success' ? '#f0fdf4' : '#fff5f5',
            color: snack.severity === 'success' ? '#15803d' : '#dc2626',
            '& .MuiAlert-icon': {
              color: snack.severity === 'success' ? '#16a34a' : '#ef4444',
            },
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
