import React, { useState, useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import JobStatsCards from '../../../component/employer/jobs/JobStatsCards';
import JobSearchFilter from '../../../component/employer/jobs/JobSearchFilter';
import JobTable from '../../../component/employer/jobs/JobTable';
import CreateJobDialog from '../../../component/employer/jobs/CreateJobDialog';
import PushTopDialog from '../../../component/employer/jobs/PushTopDialog';
import { MOCK_JOBS } from '../../../component/employer/jobs/mockData';

// Import Quill CSS globally
import 'react-quill-new/dist/quill.snow.css';

const ITEMS_PER_PAGE = 10;

export default function JobManagement() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [editingJob, setEditingJob] = useState(null);
  const [pushTopDialogOpen, setPushTopDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [walletBalance, setWalletBalance] = useState(15500000);

  const toISODateInput = (deadline) => {
    if (!deadline || typeof deadline !== 'string') return '';
    const value = deadline.trim();
    if (!value || value.toLowerCase() === 'chưa cập nhật') return '';

    const viMatch = value.match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/);
    if (viMatch) {
      const day = viMatch[1].padStart(2, '0');
      const month = viMatch[2].padStart(2, '0');
      const year = viMatch[3];
      return `${year}-${month}-${day}`;
    }

    // Fallback attempt
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Tính stats
  const stats = useMemo(() => ({
    active: jobs.filter((j) => j.status === 'active').length,
    paused: jobs.filter((j) => j.status === 'paused').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
    totalApplicants: jobs.reduce((acc, j) => acc + (j.applicants || 0), 0),
  }), [jobs]);

  // Lọc + tìm kiếm
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((j) => j.title.toLowerCase().includes(term));
    }

    if (statusFilter !== 'all') {
      result = result.filter((j) => j.status === statusFilter);
    }

    return result;
  }, [jobs, searchTerm, statusFilter]);

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Handlers
  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPage(1);
  };

  const handleCreateJob = (formData) => {
    const newJob = {
      id: Date.now(),
      title: formData.title || 'Vị trí mới',
      isTop: false,
      location: formData.address || 'Chưa cập nhật',
      type: formData.jobType || 'Toàn thời gian',
      salaryMin: parseInt(formData.salaryMin) || 0,
      salaryMax: parseInt(formData.salaryMax) || 0,
      applicants: 0,
      views: 0,
      deadline: formData.deadline
        ? new Date(formData.deadline).toLocaleDateString('vi-VN')
        : 'Chưa cập nhật',
      status: 'active',
    };
    setJobs((prev) => [newJob, ...prev]);
    setDialogOpen(false);
  };

  const handleUpdateJob = (job, formData) => {
    if (!job) return;

    setJobs((prev) => prev.map((j) => {
      if (j.id !== job.id) return j;
      return {
        ...j,
        title: formData.title || j.title,
        location: formData.address || j.location,
        type: formData.jobType || j.type,
        salaryMin: formData.salaryMin !== '' ? (parseInt(formData.salaryMin) || 0) : j.salaryMin,
        salaryMax: formData.salaryMax !== '' ? (parseInt(formData.salaryMax) || 0) : j.salaryMax,
        deadline: formData.deadline
          ? new Date(formData.deadline).toLocaleDateString('vi-VN')
          : j.deadline,
      };
    }));

    setDialogOpen(false);
    setEditingJob(null);
    setDialogMode('create');
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handlePushTop = (job) => {
    setSelectedJob(job);
    setPushTopDialogOpen(true);
  };

  const handleConfirmPushTop = (job, pushPackage) => {
    if (!job || !pushPackage || walletBalance < pushPackage.price) return;

    setWalletBalance((prev) => prev - pushPackage.price);
    setJobs((prev) => {
      const updated = prev.map((j) =>
        j.id === job.id
          ? { ...j, isTop: true, views: (j.views || 0) + 300 }
          : j
      );

      const target = updated.find((j) => j.id === job.id);
      return target
        ? [target, ...updated.filter((j) => j.id !== job.id)]
        : updated;
    });

    setPushTopDialogOpen(false);
    setSelectedJob(null);
  };

  const handleDelete = (job) => {
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Page Header */}
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
            Tạo và quản lý các tin tuyển dụng
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogMode('create');
              setEditingJob(null);
              setDialogOpen(true);
            }}
            sx={{
              bgcolor: '#10b981',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#059669',
                boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
              },
            }}
          >
            Đăng tin mới
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <JobStatsCards stats={stats} />

      {/* Search & Filter */}
      <JobSearchFilter
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

      {/* Job Table */}
      <JobTable
        jobs={paginatedJobs}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onPushTop={handlePushTop}
        onDelete={handleDelete}
      />

      {/* Create Job Dialog */}
      <CreateJobDialog
        open={dialogOpen}
        mode={dialogMode}
        initialValues={dialogMode === 'edit' && editingJob ? {
          title: editingJob.title || '',
          address: editingJob.location || '',
          jobType: editingJob.type || '',
          salaryMin: editingJob.salaryMin ?? '',
          salaryMax: editingJob.salaryMax ?? '',
          deadline: toISODateInput(editingJob.deadline),
        } : undefined}
        onClose={() => {
          setDialogOpen(false);
          setEditingJob(null);
          setDialogMode('create');
        }}
        onSubmit={(formData) => {
          if (dialogMode === 'edit') {
            handleUpdateJob(editingJob, formData);
          } else {
            handleCreateJob(formData);
          }
        }}
      />

      <PushTopDialog
        open={pushTopDialogOpen}
        job={selectedJob}
        walletBalance={walletBalance}
        onClose={() => {
          setPushTopDialogOpen(false);
          setSelectedJob(null);
        }}
        onConfirm={handleConfirmPushTop}
      />
    </Box>
  );
}
