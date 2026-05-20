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
  Alert,
  Snackbar
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
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
  fontWeight: 600,
  fontSize: '0.8rem',
  color: '#374151',
  whiteSpace: 'nowrap',
  py: 1.5,
  borderBottom: '2px solid #e5e7eb',
  bgcolor: '#f9fafb',
};

const bodyCellSx = {
  fontSize: '0.85rem',
  color: '#374151',
  py: 1.8,
  borderBottom: '1px solid #f3f4f6',
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

  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const showSnack = (message, severity = 'success') =>
    setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const fetchPackages = async (showToast) => {
    try {
      setError('');
      const data = await getPackage({ includeInactive: true });
      setPackages(Array.isArray(data) ? data : []);
      if (showToast) {
        showSnack('Đã cập nhật danh sách gói dịch vụ');
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
      showSnack('Đã cập nhật gói dịch vụ');
      handleClose();
    } catch (err) {
      console.error('Failed to update package:', err);
      showSnack('Không thể cập nhật gói dịch vụ', 'error');
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
              Quản lý gói dịch vụ
            </Typography>
            <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.3 }}>
              Chỉ cho phép chỉnh sửa thông tin gói đăng ký tuyển dụng
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                borderColor: '#d1d5db',
                color: '#374151',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
              }}
            >
              {refreshing ? 'Đang làm mới...' : 'Làm mới'}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 3,
          }}
        >
          {[
            { label: 'Tổng gói', value: stats.total, color: '#2563eb' },
            { label: 'Giá trung bình', value: formatCurrency(stats.avgPrice), color: '#16a34a' },
            { label: 'Danh mục phổ biến', value: Object.keys(stats.byCategory)[0] || '-', color: '#9333ea' },
          ].map((item) => (
            <Paper
              key={item.label}
              variant="outlined"
              sx={{
                p: 2.5,
                textAlign: 'center',
                borderRadius: 2,
                borderColor: '#e5e7eb',
                bgcolor: '#fff',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 2 },
              }}
            >
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: item.color,
                  lineHeight: 1.2,
                }}
              >
                {item.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  mt: 0.5,
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: '#e5e7eb',
            p: 2,
            mb: 0,
            bgcolor: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
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
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#fff',
                  '& fieldset': { borderColor: '#e5e7eb' },
                  '&:hover fieldset': { borderColor: '#d1d5db' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
                '& .MuiOutlinedInput-input': { fontSize: '0.85rem', py: 1.1 },
                '& .MuiOutlinedInput-input::placeholder': {
                  fontSize: '0.85rem',
                  color: '#9ca3af',
                  opacity: 1,
                },
              }}
            />
            <FormControl
              size="small"
              sx={{ width: { xs: '100%', sm: 220 }, alignSelf: 'flex-start' }}
            >
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
                  '& .MuiSvgIcon-root': { fontSize: 18 },
                }}
              >
                <MenuItem value="" sx={{ fontSize: '0.85rem' }}>Tất cả danh mục</MenuItem>
                {categoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.85rem' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper
          variant="outlined"
          sx={{ borderRadius: 2, borderColor: '#e5e7eb', overflow: 'hidden' }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 900 }}>
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
                        '&:hover': { bgcolor: '#fafafa' },
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <TableCell sx={{ ...bodyCellSx, minWidth: 220 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1f2937' }}>{pkg.name}</Typography>
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
                            bgcolor: (pkg.active ?? pkg.isActive) ? '#dcfce7' : '#fee2e2',
                            color: (pkg.active ?? pkg.isActive) ? '#16a34a' : '#ef4444',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, textAlign: 'center', minWidth: 60 }}>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            onClick={() => openEditDialog(pkg)}
                            size="small"
                          >
                            <EditOutlinedIcon fontSize="small" sx={{ color: '#6b7280' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2,
              borderTop: '1px solid #f3f4f6',
            }}
          >
            <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Hiển thị {filteredPackages.length} / {packages.length} gói
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          },
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
              borderRadius: 2,
              px: 3,
            }}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default ServiceManagement;
