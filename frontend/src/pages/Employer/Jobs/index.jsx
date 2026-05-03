import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import JobStatsCards from '../../../components/employer/jobs/JobStatsCards';
import JobSearchFilter from '../../../components/employer/jobs/JobSearchFilter';
import JobTable from '../../../components/employer/jobs/JobTable';
import CreateJobDialog from '../../../components/employer/jobs/CreateJobDialog';
import {
  getMyJobs,
  getMyStats,
  createJob,
  updateJob,
  deleteJob,
  changeJobStatus,
} from '../../../service/jobService';
import { getCompanySubscriptions } from '../../../service/companyService';
import { useUserStore } from '../../../stores/useUserStore';

// Import Quill CSS globally
import 'react-quill-new/dist/quill.snow.css';

const ITEMS_PER_PAGE = 10;

// jobType: { label (hiển thị tiếng Việt), value (enum gửi BE) }
const JOB_TYPE = [
  { label: 'Toàn thời gian', value: 'FULL_TIME'   },
  { label: 'Bán thời gian', value: 'PART_TIME'   },
  { label: 'Thực tập',      value: 'INTERNSHIP'  },
  { label: 'Freelance',      value: 'FREELANCE'   },
  { label: 'Remote',         value: 'REMOTE'      },
];

// enum BE → label tiếng Việt
const jobTypeLabel = (enumVal) =>
  JOB_TYPE.find((t) => t.value === enumVal)?.label ?? enumVal ?? '';

// label tiếng Việt → enum BE (khi submit)
const jobTypeValue = (label) =>
  JOB_TYPE.find((t) => t.label === label)?.value ?? label ?? '';

/**
 * Chuyển đổi job từ BE response → format mà FE components đang dùng
 */
function mapJobFromApi(job) {
  return {
    id: job.jobId,
    title: job.title || '',
    packageLabel: job.packageLabel || '',
    location: job.location || '',
    jobType: job.jobType || '',
    type: jobTypeLabel(job.jobType),
    salaryMin: job.salaryMin || 0,
    salaryMax: job.salaryMax || 0,
    salaryNegotiable: job.salaryNegotiable || false,
    applicants: job.applicants || 0,
    views: job.views || 0,
    deadline: job.deadline || 'Chưa cập nhật',
    status: job.status || 'active',
    // Extended fields
    experience: job.experience || '',
    industry: job.industry || '',
    rank: job.rank || '',
    education: job.education || '',
    quantity: job.quantity || '',
    ageRange: job.ageRange || '',
    requirementTags: job.requirementTags || [],
    benefitTags: job.benefitTags || [],
    specialties: job.specialties || [],
    description: job.description || '',
    candidateRequirements: job.candidateRequirements || '',
    salaryDetail: job.salaryDetail || '',
    benefitsDetail: job.benefitsDetail || '',
    workSchedule: job.workSchedule || '',
    relatedCategories: job.relatedCategories || [],
    skills: job.skills || [],
  };
}

export default function JobManagement() {
  const { user } = useUserStore();
  const companyId = user?.companyId;

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ active: 0, paused: 0, closed: 0, totalApplicants: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [editingJob, setEditingJob] = useState(null);

  // ── Snackbar notification ──
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const showSnack = (message, severity = 'success') =>
    setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // ── Fetch jobs ──
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyJobs({
        search: searchTerm || undefined,
        status: statusFilter,
        page,
        size: ITEMS_PER_PAGE,
      });
      const mapped = (data.content || []).map(mapJobFromApi);
      setJobs(mapped);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Lỗi khi tải danh sách tin:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, page]);

  // ── Fetch stats ──
  const fetchStats = useCallback(async () => {
    try {
      const data = await getMyStats();
      setStats({
        active: data.active || 0,
        paused: data.paused || 0,
        closed: data.closed || 0,
        totalApplicants: data.totalApplicants || 0,
      });
    } catch (err) {
      console.error('Lỗi khi tải thống kê:', err);
    }
  }, []);

  // ── Load on mount & when filters change ──
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const fetchSubscriptions = useCallback(async () => {
    if (!companyId) {
      setSubscriptionOptions([]);
      return;
    }

    setSubscriptionsLoading(true);
    try {
      const subscriptions = await getCompanySubscriptions(companyId);
      const options = (subscriptions || [])
        .filter((sub) => String(sub.status || '').toUpperCase() === 'ACTIVE')
        .map((sub) => {
          const limit = sub.jobPostLimit ?? 0;
          const posted = sub.jobPostedCount ?? 0;
          const remaining = Math.max(limit - posted, 0);
          const labelBase = sub.packageLabel || sub.packageId;
          return {
            id: sub.id,
            packageId: sub.packageId,
            remaining,
            limit,
            label: `${labelBase} (còn lại ${remaining}/${limit})`,
          };
        })
        .filter((option) => option.remaining > 0);

      setSubscriptionOptions(options);
    } catch (err) {
      console.error('Lỗi khi tải gói tin đã mua:', err);
      setSubscriptionOptions([]);
    } finally {
      setSubscriptionsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

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

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // ── Handlers ──
  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPage(1);
    fetchStats();
  };

  const handleCreateJob = async (formData, isDraft = false) => {
    try {
      if (!isDraft && !formData.companySubscriptionId) {
        showSnack('Vui lòng chọn gói tin đã mua để đăng tin.', 'error');
        return;
      }

      const payload = {
        title: formData.title,
        industry: formData.industry,
        address: formData.address,
        jobType: jobTypeValue(formData.jobType),
        experience: formData.experience,
        salaryMin: formData.salaryNegotiable ? 0 : parseFloat(String(formData.salaryMin).replace(/,/g, '')) || 0,
        salaryMax: formData.salaryNegotiable ? 0 : parseFloat(String(formData.salaryMax).replace(/,/g, '')) || 0,
        salaryNegotiable: formData.salaryNegotiable || false,
        deadline: formData.deadline || null,
        rank: formData.rank,
        education: formData.education,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        ageRange: formData.ageRange,
        requirementTags: formData.requirementTags || [],
        benefitTags: formData.benefitTags || [],
        specialties: formData.specialties || [],
        description: formData.description,
        candidateRequirements: formData.candidateRequirements,
        salaryDetail: formData.salaryDetail,
        benefitsDetail: formData.benefitsDetail,
        workSchedule: formData.workSchedule,
        relatedCategories: formData.relatedCategories || [],
        skills: formData.skills || [],
        companySubscriptionId: formData.companySubscriptionId || null,
        saveAsDraft: isDraft,
      };
      await createJob(payload);
      setDialogOpen(false);
      fetchJobs();
      fetchStats();
      fetchSubscriptions();
      showSnack(isDraft ? 'Đã lưu bản nháp!' : 'Đăng tin tuyển dụng thành công!');
    } catch (err) {
      console.error('Lỗi khi tạo tin:', err);
      showSnack((isDraft ? 'Lưu nháp thất bại: ' : 'Tạo tin thất bại: ') + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleUpdateJob = async (job, formData) => {
    if (!job) return;
    try {
      const payload = {
        title: formData.title,
        industry: formData.industry,
        address: formData.address,
        jobType: jobTypeValue(formData.jobType),
        experience: formData.experience,
        salaryMin: formData.salaryNegotiable ? 0 : parseFloat(String(formData.salaryMin).replace(/,/g, '')) || 0,
        salaryMax: formData.salaryNegotiable ? 0 : parseFloat(String(formData.salaryMax).replace(/,/g, '')) || 0,
        salaryNegotiable: formData.salaryNegotiable ?? false,
        deadline: formData.deadline || null,
        rank: formData.rank,
        education: formData.education,
        quantity: formData.quantity ? parseInt(formData.quantity) : null,
        ageRange: formData.ageRange,
        requirementTags: formData.requirementTags || [],
        benefitTags: formData.benefitTags || [],
        specialties: formData.specialties || [],
        description: formData.description,
        candidateRequirements: formData.candidateRequirements,
        salaryDetail: formData.salaryDetail,
        benefitsDetail: formData.benefitsDetail,
        workSchedule: formData.workSchedule,
        relatedCategories: formData.relatedCategories || [],
        skills: formData.skills || [],
      };
      await updateJob(job.id, payload);
      setDialogOpen(false);
      setEditingJob(null);
      setDialogMode('create');
      fetchJobs();
      fetchStats();
      showSnack('Cập nhật tin tuyển dụng thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật tin:', err);
      showSnack('Cập nhật thất bại: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDelete = async (job) => {
    if (!window.confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return;
    try {
      await deleteJob(job.id);
      fetchJobs();
      fetchStats();
      showSnack('Xóa tin tuyển dụng thành công!');
    } catch (err) {
      console.error('Lỗi khi xóa tin:', err);
      showSnack('Xóa thất bại: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleChangeStatus = async (job, newStatus) => {
    try {
      await changeJobStatus(job.id, newStatus);
      fetchJobs();
      fetchStats();
      const STATUS_LABEL = {
        PAUSED: 'Tạm dừng', ACTIVE: 'Tiếp tục đăng', CLOSED: 'Đóng tin', PENDING: 'Gửi duyệt',
      };
      showSnack(`Đã chuyển trạng thái: ${STATUS_LABEL[newStatus] || newStatus}`);
    } catch (err) {
      console.error('Lỗi khi đổi trạng thái:', err);
      showSnack('Không thể đổi trạng thái: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 3 } }}>
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

      {!subscriptionsLoading && subscriptionOptions.length === 0 && (
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
          {/* Icon + text */}
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

          {/* CTA Button */}
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
      )}

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
        jobs={jobs}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangeStatus={handleChangeStatus}
      />

      {/* Create Job Dialog */}
      <CreateJobDialog
        open={dialogOpen}
        mode={dialogMode}
        initialValues={dialogMode === 'edit' && editingJob ? {
          title: editingJob.title || '',
          address: editingJob.location || '',
          jobType: jobTypeLabel(editingJob.jobType) || editingJob.type || '',
          salaryMin: editingJob.salaryMin ?? '',
          salaryMax: editingJob.salaryMax ?? '',
          salaryNegotiable: editingJob.salaryNegotiable || false,
          deadline: toISODateInput(editingJob.deadline),
          experience: editingJob.experience || '',
          industry: editingJob.industry || '',
          rank: editingJob.rank || '',
          education: editingJob.education || '',
          quantity: editingJob.quantity ?? '',
          ageRange: editingJob.ageRange || '',
          requirementTags: editingJob.requirementTags || [],
          benefitTags: editingJob.benefitTags || [],
          specialties: editingJob.specialties || [],
          description: editingJob.description || '',
          candidateRequirements: editingJob.candidateRequirements || '',
          salaryDetail: editingJob.salaryDetail || '',
          benefitsDetail: editingJob.benefitsDetail || '',
          workSchedule: editingJob.workSchedule || '',
          relatedCategories: editingJob.relatedCategories || [],
          skills: editingJob.skills || [],
        } : undefined}
        onClose={() => {
          setDialogOpen(false);
          setEditingJob(null);
          setDialogMode('create');
        }}
        onSubmit={(formData, isDraft) => {
          if (dialogMode === 'edit') {
            handleUpdateJob(editingJob, formData);
          } else {
            handleCreateJob(formData, isDraft);
          }
        }}
        subscriptionOptions={subscriptionOptions}
        subscriptionsLoading={subscriptionsLoading}
      />

      {/* thông báo */}
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
