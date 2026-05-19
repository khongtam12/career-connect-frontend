import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import JobStatsCards from '../../../components/admin/jobs/JobStatsCards';
import JobSearchFilter from '../../../components/admin/jobs/JobSearchFilter';
import JobTable from '../../../components/admin/jobs/JobTable';
import { getJobsByAdmin, getJobStats, getJobById, adminChangeJobStatus, adminDeleteJob } from '../../../service/jobService';
import JobDetailDialog from '../../../components/admin/jobs/JobDetailDialog';
import { useUserStore } from '../../../stores/useUserStore';

const Job = () => {
  const user = useUserStore((s) => s.user);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    size: 10,
  });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const showSnack = (message, severity = 'success') =>
    setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const fetchData = useCallback(async () => {
    setLoading(true);

    getJobStats()
      .then((statsData) => {
        if (statsData) {
          setStats({
            total: statsData.totalJobs || 0,
            active: statsData.openJobs || 0,
            pending: statsData.pendingJobs || 0,
            rejected: statsData.rejectedJobs || 0,
          });
        }
      })
      .catch((err) => console.error('Error fetching stats:', err));

    try {
      const res = await getJobsByAdmin(searchTerm, statusFilter, page, 10);
      setJobs(res.content || []);
      setPagination({
        totalElements: res.totalElements || 0,
        totalPages: res.totalPages || 0,
        size: res.size || 10,
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (error.response?.status === 403) {
        showSnack('Bạn không có quyền truy cập dữ liệu này', 'error');
      } else {
        showSnack('Không thể tải danh sách tin tuyển dụng', 'error');
      }
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchData, searchTerm]);

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(0);
    fetchData();
    showSnack('Đã làm mới dữ liệu');
  };

  const handleStatusChange = async (job, newStatus) => {
    try {
      const adminId = user?.adminId || user?.id || 'ADMIN001';
      await adminChangeJobStatus(job.jobId, newStatus, adminId);
      showSnack(`Đã cập nhật trạng thái tin sang: ${newStatus}`);
      fetchData();
    } catch (error) {
      console.error('Error changing status:', error);
      const backendMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      showSnack(backendMessage || 'Không thể cập nhật trạng thái tin tuyển dụng', 'error');
    }
  };

  const handleViewDetail = async (job) => {
    setDetailDialogOpen(true);
    setDetailLoading(true);
    try {
      const data = await getJobById(job.jobId);
      setSelectedJob(data);
    } catch (error) {
      console.error('Error fetching job detail:', error);
      showSnack('Không thể tải thông tin chi tiết tin tuyển dụng', 'error');
      setDetailDialogOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEdit = (job) => {
    showSnack(`Chỉnh sửa tin: ${job.title}`, 'info');
  };

  const handleDelete = async (job) => {
    try {
      const adminId = user?.adminId || user?.id || 'ADMIN001';
      await adminDeleteJob(job.jobId, adminId);
      setJobs((prev) => prev.filter((j) => j.jobId !== job.jobId));
      showSnack('Đã xóa tin tuyển dụng');
    } catch (error) {
      console.error('Delete error:', error);
      const backendMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      showSnack(backendMessage || 'Không thể xóa tin tuyển dụng', 'error');
    }
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
            Quản lý tin tuyển dụng
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.3 }}>
            Duyệt và quản lý tin tuyển dụng trên hệ thống
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

      <JobStatsCards stats={stats} />

      <JobSearchFilter
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(0);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setPage(0);
        }}
      />

      <JobTable
        jobs={jobs}
        page={page}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        onPageChange={setPage}
        onStatusChange={handleStatusChange}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <JobDetailDialog
        open={detailDialogOpen}
        job={selectedJob}
        loading={detailLoading}
        onStatusChange={handleStatusChange}
        onClose={() => {
          setDetailDialogOpen(false);
          setTimeout(() => setSelectedJob(null), 300);
        }}
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
};

export default Job;
