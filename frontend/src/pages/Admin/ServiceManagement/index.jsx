import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Tooltip,
  IconButton,
  Skeleton,
  Alert
} from '@mui/material';
import { FiEdit2, FiRefreshCcw } from 'react-icons/fi';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import { getPackage, updatePackage } from '../../../service/paymentService';

const categoryOptions = [
  { value: 'JOB_POSTING', label: 'Tin đăng tuyển dụng' },
  { value: 'HIGHLIGHT', label: 'Gia tăng hiển thị' },
  { value: 'EFFECT', label: 'Hiệu ứng nổi bật' },
  { value: 'POINTS', label: 'Điểm dịch vụ' },
  { value: 'BRANDING', label: 'Quảng bá thương hiệu' }
];

const typeOptions = [
  { value: 'BASIC_JOB_POST', label: 'Tin cơ bản' },
  { value: 'URGENT_JOB_POST', label: 'Tuyển nhanh' },
  { value: 'TRENDING_POST', label: 'Tuyển gấp / trang chủ' },
  { value: 'INDUSTRY_PRIORITY', label: 'Ưu tiên trang ngành' },
  { value: 'AUTO_REFRESH_HOURLY', label: 'Làm mới theo giờ' },
  { value: 'AUTO_REFRESH_DAILY', label: 'Làm mới theo ngày' },
  { value: 'EFFECT_HOT', label: 'Hiệu ứng HOT' },
  { value: 'EFFECT_BOLD', label: 'Hiệu ứng đậm' },
  { value: 'EFFECT_FRAME', label: 'Đóng khung' },
  { value: 'POINT_SERVICE', label: 'Gói điểm dịch vụ' },
  { value: 'BRANDING_LOGO', label: 'Logo thương hiệu' }
];

const boxTypeOptions = [
  { value: 'TRANG_CHU', label: 'Trang chủ' },
  { value: 'TUYEN_GAP', label: 'Tuyển gấp' },
  { value: 'UU_TIEN', label: 'Ưu tiên' },
  { value: 'NGANH', label: 'Ngành' }
];

const headCellSx = {
  fontWeight: 500,
  fontSize: '0.72rem',
  color: '#6b7280',
  whiteSpace: 'nowrap',
  py: 2,
  borderBottom: '2px solid #f3f4f6',
  bgcolor: '#f9fafb',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const bodyCellSx = {
  fontSize: '0.85rem',
  color: '#374151',
  py: 2,
  borderBottom: '1px solid #f3f4f6'
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const ServiceManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({});

  const fetchPackages = async (showToast) => {
    try {
      setError('');
      const data = await getPackage();
      setPackages(Array.isArray(data) ? data : []);
      if (showToast) {
        toast.success('Đã cập nhật danh sách gói dịch vụ');
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
      setError('Không thể tải danh sách gói dịch vụ. Vui lòng thử lại.');
      setPackages([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchPackages(false);
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const total = packages.length;
    const avgPrice = total
      ? Math.round(packages.reduce((sum, item) => sum + (item.price || 0), 0) / total)
      : 0;
    const byCategory = packages.reduce((acc, item) => {
      const key = item.category || 'UNKNOWN';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return { total, avgPrice, byCategory };
  }, [packages]);

  const filteredPackages = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return packages.filter((item) => {
      const matchesKeyword =
        !keyword ||
        item.name?.toLowerCase().includes(keyword) ||
        item.packageId?.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword);
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      return matchesKeyword && matchesCategory;
    });
  }, [packages, searchTerm, categoryFilter]);

  const openEditDialog = (pkg) => {
    const activeValue = pkg.active ?? pkg.isActive ?? false;
    setSelectedPackage(pkg);
    setFormValues({
      packageId: pkg.packageId || '',
      name: pkg.name || '',
      description: pkg.description || '',
      price: pkg.price ?? '',
      oldPrice: pkg.oldPrice ?? '',
      durationDays: pkg.durationDays ?? '',
      jobPostLimit: pkg.jobPostLimit ?? '',
      category: pkg.category || '',
      type: pkg.type || '',
      badge: pkg.badge || '',
      badgeColor: pkg.badgeColor || '',
      imageUrl: pkg.imageUrl || '',
      showDetails: Boolean(pkg.showDetails),
      active: Boolean(activeValue),
      allowedBoxTypes: Array.isArray(pkg.allowedBoxTypes) ? pkg.allowedBoxTypes : []
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedPackage(null);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => (event) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleSave = async () => {
    if (!selectedPackage) {
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formValues.name?.trim(),
        description: formValues.description?.trim(),
        price: formValues.price === '' ? null : Number(formValues.price),
        oldPrice: formValues.oldPrice === '' ? null : Number(formValues.oldPrice),
        durationDays: formValues.durationDays === '' ? null : Number(formValues.durationDays),
        jobPostLimit: formValues.jobPostLimit === '' ? null : Number(formValues.jobPostLimit),
        category: formValues.category || null,
        type: formValues.type || null,
        badge: formValues.badge?.trim() || null,
        badgeColor: formValues.badgeColor?.trim() || null,
        imageUrl: formValues.imageUrl?.trim() || null,
        showDetails: Boolean(formValues.showDetails),
        active: Boolean(formValues.active),
        allowedBoxTypes: formValues.allowedBoxTypes || []
      };

      const updated = await updatePackage(selectedPackage.packageId, payload);
      setPackages((prev) =>
        prev.map((item) => (item.packageId === selectedPackage.packageId ? updated : item))
      );
      toast.success('Đã cập nhật gói dịch vụ');
      handleClose();
    } catch (err) {
      console.error('Failed to update package:', err);
      toast.error('Không thể cập nhật gói dịch vụ');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPackages(true);
    setRefreshing(false);
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          p: { xs: 2, md: 4 },
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 3,
            background:
              'linear-gradient(135deg, rgba(226, 232, 240, 0.6), rgba(248, 250, 252, 0.1)), radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.12), transparent 55%), radial-gradient(circle at 85% 0%, rgba(14, 116, 144, 0.12), transparent 60%)',
            pointerEvents: 'none'
          }}
        />

        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 3
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: '1.75rem',
                  color: '#0f172a',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em'
                }}
              >
                Quản lý gói dịch vụ
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.95rem', mt: 0.5, fontWeight: 500 }}>
                Chỉ cho phép chỉnh sửa thông tin gói đăng ký tuyển dụng
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FiRefreshCcw />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  borderColor: '#e2e8f0',
                  color: '#475569',
                  borderRadius: '14px',
                  px: 2.5,
                  py: 1,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: '#fff',
                  '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f1f5f9' }
                }}
              >
                {refreshing ? 'Đang làm mới...' : 'Làm mới'}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 3
            }}
          >
            {[
              {
                title: 'Tổng gói',
                value: stats.total,
                tone: '#0f172a'
              },
              {
                title: 'Giá trung bình',
                value: formatCurrency(stats.avgPrice),
                tone: '#0f172a'
              },
              {
                title: 'Danh mục phổ biến',
                value: Object.keys(stats.byCategory)[0] || '- ',
                tone: '#0f172a'
              }
            ].map((item) => (
              <Paper
                key={item.title}
                variant="outlined"
                sx={{
                  borderRadius: '18px',
                  borderColor: 'rgba(226, 232, 240, 0.9)',
                  p: 2.5,
                  bgcolor: '#fff',
                  boxShadow: '0 16px 32px rgba(15, 23, 42, 0.08)'
                }}
              >
                <Typography
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '1.4rem', md: '1.7rem' },
                    fontWeight: 700,
                    mt: 1,
                    color: item.tone
                  }}
                >
                  {item.value}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Paper
            variant="outlined"
            sx={{
              borderRadius: '18px',
              borderColor: 'rgba(226, 232, 240, 0.9)',
              p: 2,
              mb: 2,
              bgcolor: '#fff',
              boxShadow: '0 14px 28px rgba(15, 23, 42, 0.06)'
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <TextField
                size="small"
                placeholder="Tìm theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#fff',
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#d1d5db' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                  },
                  '& .MuiOutlinedInput-input': { fontSize: '0.85rem', py: 1.1 },
                  '& .MuiOutlinedInput-input::placeholder': {
                    fontSize: '0.85rem',
                    color: '#9ca3af',
                    opacity: 1
                  }
                }}
              />
              <FormControl size="small" sx={{ width: { xs: '100%', sm: 240 } }}>
                <Select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: 2,
                    bgcolor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                    '& .MuiSelect-select': { fontSize: '0.85rem', py: 1.1 },
                    '& .MuiSvgIcon-root': { fontSize: 18 }
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.85rem' }}>
                    Tất cả danh mục
                  </MenuItem>
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.85rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '24px',
              border: '1px solid #f1f5f9',
              overflowX: 'auto',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.01), 0 1px 2px 0 rgba(0, 0, 0, 0.006)'
            }}
          >
            <Table size="small" stickyHeader sx={{ minWidth: 980 }}>
              <TableHead>
                <TableRow>
                  {[
                    'Tên gói',
                    'Danh mục',
                    'Loại',
                    'Giá',
                    'Thời lượng',
                    'Giới hạn tin',
                    'Hoạt động',
                    'Hành động'
                  ].map((label) => (
                    <TableCell
                      key={label}
                      sx={{
                        ...headCellSx,
                        minWidth: label === 'Hành động' ? 120 : 'auto',
                        textAlign: label === 'Hành động' ? 'center' : 'left'
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell colSpan={8}>
                        <Skeleton height={32} />
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading && filteredPackages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Box sx={{ py: 4, textAlign: 'center', color: '#64748b' }}>
                        Không tìm thấy gói dịch vụ phù hợp
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  filteredPackages.map((pkg) => (
                    <TableRow
                      key={pkg.packageId}
                      hover
                      sx={{
                        '&:hover': { bgcolor: '#f8fafc' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell sx={{ ...bodyCellSx, minWidth: 220 }}>
                        <Typography sx={{ fontWeight: 500, color: '#0f172a' }}>{pkg.name}</Typography>
                        {pkg.badge && (
                          <Chip
                            label={pkg.badge}
                            size="small"
                            sx={{
                              mt: 0.5,
                              bgcolor: pkg.badgeColor || '#0ea5e9',
                              color: '#fff',
                              fontWeight: 500,
                              borderRadius: '10px',
                              height: 22,
                              '& .MuiChip-label': { px: 1 }
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Chip
                          label={pkg.category || '-'}
                          size="small"
                          sx={{
                            bgcolor: '#f1f5f9',
                            fontWeight: 500,
                            borderRadius: '10px',
                            height: 26,
                            border: '1px solid #e2e8f0',
                            '& .MuiChip-label': { px: 1.2 }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Chip
                          label={pkg.type || '-'}
                          size="small"
                          sx={{
                            bgcolor: '#f8fafc',
                            fontWeight: 500,
                            borderRadius: '10px',
                            height: 26,
                            border: '1px solid #e2e8f0',
                            '& .MuiChip-label': { px: 1.2 }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ fontWeight: 500 }}>{formatCurrency(pkg.price)}</Typography>
                        {pkg.oldPrice && (
                          <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            {formatCurrency(pkg.oldPrice)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>{pkg.durationDays ? `${pkg.durationDays} ngày` : '-'}</TableCell>
                      <TableCell sx={bodyCellSx}>{pkg.jobPostLimit ?? '-'}</TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Chip
                          label={(pkg.active ?? pkg.isActive) ? 'Hoạt động' : 'Tạm dừng'}
                          size="small"
                          sx={{
                            bgcolor: (pkg.active ?? pkg.isActive) ? '#f0fdf4' : '#fef2f2',
                            color: (pkg.active ?? pkg.isActive) ? '#16a34a' : '#ef4444',
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 28,
                            borderRadius: '10px',
                            border: '1px solid',
                            borderColor: (pkg.active ?? pkg.isActive) ? '#dcfce7' : '#fee2e2',
                            '& .MuiChip-label': { px: 1.4 }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, textAlign: 'center', minWidth: 120 }}>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            onClick={() => openEditDialog(pkg)}
                            sx={{
                              bgcolor: '#0ea5e9',
                              color: '#fff',
                              boxShadow: '0 10px 18px rgba(14, 116, 144, 0.2)',
                              '&:hover': { bgcolor: '#0284c7' }
                            }}
                          >
                            <FiEdit2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '18px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Chỉnh sửa gói dịch vụ</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '70vh' }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Mã gói"
                value={formValues.packageId || ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Tên gói"
                value={formValues.name || ''}
                onChange={handleChange('name')}
                fullWidth
              />
            </Stack>

            <TextField
              label="Mô tả"
              value={formValues.description || ''}
              onChange={handleChange('description')}
              fullWidth
              multiline
              minRows={3}
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Giá (VND)"
                type="number"
                value={formValues.price}
                onChange={handleChange('price')}
                fullWidth
              />
              <TextField
                label="Giá cũ (VND)"
                type="number"
                value={formValues.oldPrice}
                onChange={handleChange('oldPrice')}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Thời lượng (ngày)"
                type="number"
                value={formValues.durationDays}
                onChange={handleChange('durationDays')}
                fullWidth
              />
              <TextField
                label="Giới hạn tin"
                type="number"
                value={formValues.jobPostLimit}
                onChange={handleChange('jobPostLimit')}
                fullWidth
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  label="Danh mục"
                  value={formValues.category || ''}
                  onChange={handleChange('category')}
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Loại</InputLabel>
                <Select
                  label="Loại"
                  value={formValues.type || ''}
                  onChange={handleChange('type')}
                >
                  {typeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                label="Badge"
                value={formValues.badge || ''}
                onChange={handleChange('badge')}
                fullWidth
              />
              <TextField
                label="Màu badge"
                value={formValues.badgeColor || ''}
                onChange={handleChange('badgeColor')}
                fullWidth
              />
            </Stack>

            <TextField
              label="Hình ảnh (URL)"
              value={formValues.imageUrl || ''}
              onChange={handleChange('imageUrl')}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Vị trí hiển thị</InputLabel>
              <Select
                multiple
                label="Vị trí hiển thị"
                value={formValues.allowedBoxTypes || []}
                onChange={handleChange('allowedBoxTypes')}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {boxTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider />

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(formValues.showDetails)}
                  onChange={handleToggle('showDetails')}
                  color="primary"
                />
              }
              label="Hiển thị chi tiết gói"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(formValues.active)}
                  onChange={handleToggle('active')}
                  color="success"
                />
              }
              label="Đang hoạt động"
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            borderTop: '1px solid #e5e7eb',
            bgcolor: '#fff',
            position: 'sticky',
            bottom: 0
          }}
        >
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            sx={{
              textTransform: 'none',
              borderRadius: '12px',
              px: 3,
              background: 'linear-gradient(120deg, #1d4ed8, #0ea5e9)'
            }}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServiceManagement;
