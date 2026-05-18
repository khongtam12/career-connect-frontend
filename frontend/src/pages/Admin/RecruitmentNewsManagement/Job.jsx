import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import JobStatsCards from '../../../components/admin/jobs/JobStatsCards';
import JobSearchFilter from '../../../components/admin/jobs/JobSearchFilter';
import JobTable from '../../../components/admin/jobs/JobTable';
import { getJobsByAdmin, getJobStats, getJobById, adminChangeJobStatus, adminDeleteJob } from '../../../service/jobService';
import { toast } from 'react-toastify';
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
        toast.error('Bạn không có quyền truy cập dữ liệu này');
      } else {
        toast.error('Không thể tải danh sách tin tuyển dụng');
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
    toast.success('Đã làm mới dữ liệu');
  };

  const handleStatusChange = async (job, newStatus) => {
    try {
      const adminId = user?.adminId || user?.id || 'ADMIN001';
      await adminChangeJobStatus(job.jobId, newStatus, adminId);
      toast.success(`Đã cập nhật trạng thái tin sang: ${newStatus}`);
      fetchData();
    } catch (error) {
      console.error('Error changing status:', error);
      const backendMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(backendMessage || 'Không thể cập nhật trạng thái tin tuyển dụng');
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
      toast.error('Không thể tải thông tin chi tiết tin tuyển dụng');
      setDetailDialogOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEdit = (job) => {
    toast.info(`Chỉnh sửa tin: ${job.title}`);
  };

  const handleDelete = async (job) => {
    try {
      const adminId = user?.adminId || user?.id || 'ADMIN001';
      await adminDeleteJob(job.jobId, adminId);
      setJobs((prev) => prev.filter((j) => j.jobId !== job.jobId));
      toast.success('Đã xóa tin tuyển dụng');
    } catch (error) {
      console.error('Delete error:', error);
      const backendMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(backendMessage || 'Không thể xóa tin tuyển dụng');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 'none', mx: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: '1.75rem',
              color: '#0f172a',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Quản lý tin tuyển dụng
          </Typography>
          <Typography sx={{ color: '#475569', fontSize: '0.95rem', mt: 0.5, fontWeight: 500 }}>
            Duyệt và quản lý tin tuyển dụng trên hệ thống
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              borderColor: '#bfdbfe',
              color: '#2563eb',
              borderRadius: '999px',
              px: 2.75,
              py: 1,
              fontSize: '0.875rem',
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#eff6ff',
              '&:hover': { borderColor: '#93c5fd', bgcolor: '#dbeafe' },
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
    </Box>
  );
};

export default Job;
