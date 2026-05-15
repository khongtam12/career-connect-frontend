import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import JobStatsCards from '../../../components/employer/jobs/JobStatsCards';
import JobSearchFilter from '../../../components/employer/jobs/JobSearchFilter';
import JobTable from '../../../components/employer/jobs/JobTable';
import CreateJobDialog from '../../../components/employer/jobs/CreateJobDialog';
import SubscriptionWarningBanner from '../../../components/employer/jobs/SubscriptionWarningBanner';
import DeleteJobConfirmDialog from '../../../components/employer/jobs/DeleteJobConfirmDialog';
import JobSnackbar from '../../../components/employer/jobs/JobSnackbar';
import PushTopDialog from '../../../components/employer/jobs/PushTopDialog';
import {
  getMyJobs,
  getMyStats,
  createJob,
  updateJob,
  deleteJob,
  changeJobStatus,
  applyMarketingPackage,
  removeMarketingPackage,
} from '../../../service/jobService';
import {
  getCompanyDetail,
  getCompanySubscriptions,
  getCompanyMarketingEntitlements,
} from '../../../service/companyService';
import { useUserStore } from '../../../stores/useUserStore';
import { validateJobForm } from '../../../validation/jobValidation';

// Import Quill CSS globally
import 'react-quill-new/dist/quill.snow.css';

const ITEMS_PER_PAGE = 10;

// jobType: { label (hiển thị tiếng Việt), value (enum gửi BE) }
const JOB_TYPE = [
  { label: 'Toàn thời gian', value: 'FULL_TIME' },
  { label: 'Bán thời gian', value: 'PART_TIME' },
  { label: 'Thực tập', value: 'INTERNSHIP' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Remote', value: 'REMOTE' },
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
    marketingAssignmentId: job.marketingAssignmentId || '',
    marketingPackageCategory: job.marketingPackageCategory || '',
    marketingPackageType: job.marketingPackageType || '',
    marketingPackageLabel: job.marketingPackageLabel || '',
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

  const [subscriptionOptions, setSubscriptionOptions] = useState([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [companyStatus, setCompanyStatus] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [editingJob, setEditingJob] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, job: null });
  const [marketingDialog, setMarketingDialog] = useState({ open: false, job: null });
  const [marketingEntitlements, setMarketingEntitlements] = useState([]);
  const [marketingLoading, setMarketingLoading] = useState(false);

  // ── Snackbar notification ──
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const showSnack = (message, severity = 'success') =>
    setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const isCompanyVerified = companyStatus === 'VERIFIED';

  const clearFieldError = useCallback((field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // ── Fetch jobs ──
  const fetchJobs = useCallback(async (overrides = {}) => {
    const searchParam = Object.prototype.hasOwnProperty.call(overrides, 'search')
      ? overrides.search
      : (searchTerm || undefined);
    const statusParam = Object.prototype.hasOwnProperty.call(overrides, 'status')
      ? overrides.status
      : statusFilter;
    const pageParam = Object.prototype.hasOwnProperty.call(overrides, 'page')
      ? overrides.page
      : page;
    try {
      const data = await getMyJobs({
        search: searchParam,
        status: statusParam,
        page: pageParam,
        size: ITEMS_PER_PAGE,
      });
      const mapped = (data.content || []).map(mapJobFromApi);
      setJobs(mapped);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Lỗi khi tải danh sách tin:', err);
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
        .filter((sub) => {
          const statusOk = String(sub.status || '').toUpperCase() === 'ACTIVE';
          const category = String(sub.packageCategory || '').toUpperCase();
          const packageId = String(sub.packageId || '').toUpperCase();
          const isJobPostingPackage = category === 'JOB_POSTING' || (!category && packageId.startsWith('JP'));
          return statusOk && isJobPostingPackage;
        })
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

  const fetchCompanyStatus = useCallback(async () => {
    if (!companyId) {
      setCompanyStatus(null);
      return;
    }
    try {
      const company = await getCompanyDetail(companyId);
      setCompanyStatus(company?.statusCompany || null);
    } catch (err) {
      console.error('Lỗi khi tải trạng thái công ty:', err);
      setCompanyStatus(null);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCompanyStatus();
  }, [fetchCompanyStatus]);

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
    fetchJobs({ search: undefined, status: 'all', page: 1 });
    fetchStats();
  };

  const handleCreateJob = async (formData, isDraft = false) => {
    try {
      if (!isDraft && !isCompanyVerified) {
        showSnack('Công ty của bạn chưa được phê duyệt. Vui lòng chờ admin xác minh công ty trước khi đăng tin tuyển dụng.', 'error');
        return;
      }
      if (!isDraft) {
        const errors = validateJobForm(formData, { requireSubscription: true });
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          showSnack('Vui lòng kiểm tra lại các trường bắt buộc.', 'error');
          return;
        }
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
      setFieldErrors({});
      fetchJobs();
      fetchStats();
      fetchSubscriptions();
      showSnack(isDraft ? 'Đã lưu bản nháp!' : 'Đăng tin tuyển dụng thành công!');
    } catch (err) {
      console.error('Lỗi khi tạo tin:', err);
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      showSnack((isDraft ? 'Lưu nháp thất bại: ' : 'Tạo tin thất bại: ') + (backendMessage || err.message), 'error');
    }
  };

  const handleUpdateJob = async (job, formData) => {
    if (!job) return;
    try {
      const errors = validateJobForm(formData, { requireSubscription: false });
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        showSnack('Vui lòng kiểm tra lại các trường bắt buộc.', 'error');
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
      setFieldErrors({});
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
    setFieldErrors({});
  };

  const handleDeleteRequest = (job) => {
    setDeleteConfirm({ open: true, job });
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirm({ open: false, job: null });
  };

  const handleDelete = async () => {
    const { job } = deleteConfirm;
    if (!job) return;
    try {
      await deleteJob(job.id);
      fetchJobs();
      fetchStats();
      showSnack('Xóa tin tuyển dụng thành công!');
    } catch (err) {
      console.error('Lỗi khi xóa tin:', err);
      showSnack('Xóa thất bại: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      handleDeleteConfirmClose();
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

  const handleOpenMarketing = async (job) => {
    if (!companyId) {
      showSnack('Không tìm thấy công ty của tài khoản hiện tại.', 'error');
      return;
    }

    setMarketingDialog({ open: true, job });
    setMarketingLoading(true);
    try {
      const entitlements = await getCompanyMarketingEntitlements(companyId);
      const available = (entitlements || []).filter((item) => {
        const statusOk = String(item.status || '').toUpperCase() === 'ACTIVE';
        const scopeOk = String(item.targetScope || '').toUpperCase() === 'JOB';
        const remaining = Number(item.remainingCount || 0) > 0;
        return statusOk && scopeOk && remaining;
      });
      setMarketingEntitlements(available);
    } catch (err) {
      console.error('Lỗi khi tải gói marketing:', err);
      setMarketingEntitlements([]);
      showSnack('Không thể tải danh sách gói highlight/effect.', 'error');
    } finally {
      setMarketingLoading(false);
    }
  };

  const handleCloseMarketing = () => {
    setMarketingDialog({ open: false, job: null });
    setMarketingEntitlements([]);
    setMarketingLoading(false);
  };

  const handleApplyMarketing = async (job, entitlement) => {
    if (!job?.id || !entitlement?.id) return;
    try {
      await applyMarketingPackage(job.id, { entitlementId: entitlement.id, placement: null });
      showSnack(`Đã áp dụng ${entitlement.packageLabel} cho tin "${job.title}".`);
      handleCloseMarketing();
      fetchJobs();
    } catch (err) {
      console.error('Lỗi khi áp dụng gói marketing:', err);
      const backendMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      showSnack(`Không thể áp dụng gói hiển thị: ${backendMessage}`, 'error');
    }
  };

  const handleRemoveMarketing = async (job) => {
    if (!job?.id) return;
    try {
      await removeMarketingPackage(job.id);
      showSnack(`Đã gỡ gói hiển thị khỏi tin "${job.title}".`);
      if (marketingDialog.open) {
        handleCloseMarketing();
      }
      fetchJobs();
    } catch (err) {
      console.error('Lỗi khi gỡ gói marketing:', err);
      const backendMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      showSnack(`Không thể gỡ gói hiển thị: ${backendMessage}`, 'error');
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
              if (!isCompanyVerified) {
                showSnack('Công ty của bạn chưa được phê duyệt. Vui lòng chờ admin xác minh công ty trước khi đăng tin tuyển dụng.', 'error');
                return;
              }
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
        <SubscriptionWarningBanner />
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
        onDelete={handleDeleteRequest}
        onChangeStatus={handleChangeStatus}
        onOpenMarketing={handleOpenMarketing}
        onRemoveMarketing={handleRemoveMarketing}
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
          setFieldErrors({});
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
        fieldErrors={fieldErrors}
        onClearError={clearFieldError}
      />

      <DeleteJobConfirmDialog
        open={deleteConfirm.open}
        jobTitle={deleteConfirm.job?.title}
        onClose={handleDeleteConfirmClose}
        onConfirm={handleDelete}
      />

      <PushTopDialog
        open={marketingDialog.open}
        job={marketingDialog.job}
        entitlements={marketingEntitlements}
        loading={marketingLoading}
        onClose={handleCloseMarketing}
        onConfirm={handleApplyMarketing}
        onRemove={handleRemoveMarketing}
      />

      <JobSnackbar
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        onClose={closeSnack}
      />
    </Box>
  );
}
