import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import CandidateStatsCards from '../../../components/admin/candidates/CandidateStatsCards';
import CandidateSearchFilter from '../../../components/admin/candidates/CandidateSearchFilter';
import CandidateTable from '../../../components/admin/candidates/CandidateTable';
import CandidateCreateDialog from '../../../components/admin/candidates/CandidateCreateDialog';
import CandidateResetPasswordDialog from '../../../components/admin/candidates/CandidateResetPasswordDialog';
import CandidateDetailDialog from '../../../components/admin/candidates/CandidateDetailDialog';
import { getCandidates, updateCandidateStatus, getCandidateStats, createCandidate, updateCandidate, resetCandidatePassword } from '../../../service/adminCandidateService';

const ITEMS_PER_PAGE = 10;

function mapCandidateFromApi(candidate) {
  return {
    id: candidate.candidateId || candidate.id,
    email: candidate.email || '',
    fullName: candidate.fullName || '',
    phone: candidate.phone || '',
    avatar: candidate.avatar || '',
    createdAt: candidate.createdAt || '',
    status: candidate.status || 'ACTIVE',
    dateOfBirth: candidate.dateOfBirth || '',
    address: candidate.address || '',
    experienceYear: candidate.experienceYear || '',
    currentJobTitle: candidate.currentJobTitle || '',
    expectedSalary: candidate.expectedSalary || '',
  };
}

function isSameLocalDate(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function countNewToday(candidates) {
  const today = new Date();
  return candidates.reduce((count, candidate) => {
    if (!candidate.createdAt) return count;
    const createdDate = new Date(candidate.createdAt);
    if (Number.isNaN(createdDate.getTime())) return count;
    return isSameLocalDate(createdDate, today) ? count + 1 : count;
  }, 0);
}

export default function CandidateManagement() {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ active: 0, banned: 0, total: 0, newToday: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [formMode, setFormMode] = useState('create');

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const showSnack = (message, severity = 'success') =>
    setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCandidates({
        keyword: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        size: ITEMS_PER_PAGE,
      });
      const mapped = (data.content || []).map(mapCandidateFromApi);
      setCandidates(mapped);
      setTotalPages(data.totalPages || 1);
      setStats((prev) => ({ ...prev, newToday: countNewToday(mapped) }));
    } catch (err) {
      console.error('Lỗi khi tải danh sách ứng viên:', err);
      showSnack('Không thể tải danh sách ứng viên', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, page]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getCandidateStats();
      setStats({
        active: data.active || 0,
        banned: data.banned || 0,
        total: data.total || 0,
        newToday: data.newToday || 0,
      });
    } catch (err) {
      console.error('Lỗi khi tải thống kê:', err);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRefresh = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPage(1);
    fetchStats();
    fetchCandidates();
  };

  const handleChangeStatus = async (candidate, newStatus) => {
    try {
      await updateCandidateStatus(candidate.id, newStatus);
      fetchCandidates();
      fetchStats();
      const statusLabel = newStatus === 'ACTIVE' ? 'Hoạt động' : 'Khóa';
      showSnack(`Đã chuyển trạng thái tài khoản thành: ${statusLabel}`);
    } catch (err) {
      console.error('Lỗi khi đổi trạng thái:', err);
      showSnack('Không thể đổi trạng thái: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleCreateOrUpdateCandidate = async (formData) => {
    try {
      if (formMode === 'edit') {
        await updateCandidate(selectedCandidate.id, formData);
        showSnack('Cập nhật thông tin ứng viên thành công!');
      } else {
        await createCandidate(formData);
        showSnack('Thêm mới ứng viên thành công!');
      }
      setCreateDialogOpen(false);
      fetchCandidates();
      fetchStats();
    } catch (err) {
      console.error('Lỗi khi lưu ứng viên:', err);
      showSnack('Không thể lưu ứng viên: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleResetPassword = async (id, newPassword) => {
    try {
      await resetCandidatePassword(id, newPassword);
      setResetPasswordDialogOpen(false);
      setSelectedCandidate(null);
      showSnack('Reset mật khẩu thành công!');
    } catch (err) {
      console.error('Lỗi khi reset mật khẩu:', err);
      showSnack('Không thể reset mật khẩu: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const openResetPasswordDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setResetPasswordDialogOpen(true);
  };

  const openDetailDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setDetailDialogOpen(true);
  };

  const openCreateDialog = () => {
    setFormMode('create');
    setSelectedCandidate(null);
    setCreateDialogOpen(true);
  };

  const openEditDialog = (candidate) => {
    setFormMode('edit');
    setSelectedCandidate(candidate);
    setCreateDialogOpen(true);
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
            Quản lý ứng viên
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.3 }}>
            Xem danh sách và quản lý tài khoản ứng viên
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
            onClick={openCreateDialog}
            sx={{
              bgcolor: '#3b82f6',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#2563eb',
                boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
              },
            }}
          >
            Thêm mới
          </Button>
        </Box>
      </Box>

      <CandidateStatsCards stats={stats} />

      <CandidateSearchFilter
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

      <CandidateTable
        candidates={candidates}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onChangeStatus={handleChangeStatus}
        onResetPassword={openResetPasswordDialog}
        onViewDetail={openDetailDialog}
        onEdit={openEditDialog}
      />

      <CandidateCreateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateOrUpdateCandidate}
        mode={formMode}
        initialValues={selectedCandidate || {}}
      />

      <CandidateResetPasswordDialog
        open={resetPasswordDialogOpen}
        candidate={selectedCandidate}
        onClose={() => setResetPasswordDialogOpen(false)}
        onSubmit={handleResetPassword}
      />

      <CandidateDetailDialog
        open={detailDialogOpen}
        candidate={selectedCandidate}
        onClose={() => setDetailDialogOpen(false)}
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
