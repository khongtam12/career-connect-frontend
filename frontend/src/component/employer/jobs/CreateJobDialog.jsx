import React, { useState, lazy, Suspense, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { INDUSTRIES, JOB_TYPES } from './mockData';

// Lazy load heavy components
const ReactQuill = lazy(() => import('react-quill-new'));
const JobLocationMap = lazy(() => import('./JobLocationMap'));

// Quill toolbar config
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

// Styles cho form fields
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#d1d5db' },
    '&.Mui-focused fieldset': { borderColor: '#10b981' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#10b981' },
  '& .MuiOutlinedInput-input': {
    fontSize: '0.85rem',
    py: 1.05,
  },
  '& .MuiOutlinedInput-input::placeholder': {
    fontSize: '0.85rem',
    color: '#9ca3af',
    opacity: 1,
  },
};

const selectSx = {
  borderRadius: 2,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
  '& .MuiSelect-select': {
    fontSize: '0.85rem',
    py: 1.05,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 18,
  },
};

const sectionLabelSx = {
  fontWeight: 600,
  fontSize: '0.82rem',
  color: '#374151',
  mb: 1,
};

const DEFAULT_MAP_POSITION = [21.0285, 105.8542];

export default function CreateJobDialog({ open, onClose, onSubmit, mode = 'create', initialValues }) {
  const [form, setForm] = useState({
    title: '',
    industry: '',
    address: '',
    jobType: '',
    experience: '',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    description: '',
    requirements: '',
    benefits: '',
  });
  const [mapPosition, setMapPosition] = useState(DEFAULT_MAP_POSITION);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeMessage, setGeocodeMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    if (mode !== 'edit' || !initialValues) return;

    setForm((prev) => ({
      ...prev,
      ...initialValues,
    }));
  }, [open, mode, initialValues]);

  useEffect(() => {
    if (!open) {
      setMapPosition(DEFAULT_MAP_POSITION);
      setIsGeocoding(false);
      setGeocodeMessage('');
      return;
    }

    const query = form.address.trim();
    if (query.length < 6) {
      setGeocodeMessage('');
      return;
    }

    let ignore = false;
    setIsGeocoding(true);

    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Geocoding failed');
        }

        const data = await response.json();
        if (!ignore && Array.isArray(data) && data.length > 0) {
          const lat = Number(data[0].lat);
          const lon = Number(data[0].lon);
          if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
            setMapPosition([lat, lon]);
            setGeocodeMessage('Đã định vị địa chỉ trên bản đồ');
          }
        } else if (!ignore) {
          setGeocodeMessage('Không tìm thấy vị trí phù hợp cho địa chỉ này');
        }
      } catch {
        if (!ignore) {
          setGeocodeMessage('Không thể định vị lúc này, vui lòng thử lại');
        }
      } finally {
        if (!ignore) {
          setIsGeocoding(false);
        }
      }
    }, 650);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [form.address, open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleQuillChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit?.(form);
    // Reset form only for create flow
    if (mode !== 'edit') {
      setForm({
        title: '',
        industry: '',
        address: '',
        jobType: '',
        experience: '',
        salaryMin: '',
        salaryMax: '',
        deadline: '',
        description: '',
        requirements: '',
        benefits: '',
      });
      setMapPosition(DEFAULT_MAP_POSITION);
      setIsGeocoding(false);
      setGeocodeMessage('');
    }
  };

  const isEdit = mode === 'edit';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          pt: 2.5,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PostAddIcon sx={{ color: '#10b981', fontSize: 24 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1f2937' }}>
            {isEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Tạo tin tuyển dụng mới'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#9ca3af' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
        {/* Tiêu đề vị trí */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={sectionLabelSx}>
            <span style={{ color: '#ef4444' }}>*</span> Tiêu đề vị trí
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="VD: Senior Frontend Developer"
            value={form.title}
            onChange={handleChange('title')}
            sx={fieldSx}
          />
        </Box>

        {/* Ngành nghề + Địa chỉ */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}>Ngành nghề</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={form.industry}
                onChange={handleChange('industry')}
                displayEmpty
                sx={selectSx}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      '& .MuiMenuItem-root': { fontSize: '0.85rem' },
                    },
                  },
                }}
                renderValue={(val) => val || (
                  <span style={{ color: '#9ca3af' }}>Chọn ngành nghề</span>
                )}
              >
                {INDUSTRIES.map((ind) => (
                  <MenuItem key={ind} value={ind}>{ind}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}>
              <span style={{ color: '#ef4444' }}>*</span> Địa chỉ làm việc
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập địa chỉ hoặc chọn từ gợi ý..."
              value={form.address}
              onChange={handleChange('address')}
              sx={fieldSx}
            />
            {(isGeocoding || geocodeMessage) && (
              <Typography
                sx={{
                  mt: 0.8,
                  fontSize: '0.78rem',
                  color: isGeocoding ? '#6b7280' : geocodeMessage.includes('Không') ? '#ef4444' : '#10b981',
                }}
              >
                {isGeocoding ? 'Đang định vị địa chỉ trên bản đồ...' : geocodeMessage}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Bản đồ */}
        <Box sx={{ mb: 2.5 }}>
          <Suspense
            fallback={
              <Box
                sx={{
                  height: 220,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f9fafb',
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                }}
              >
                <CircularProgress size={28} sx={{ color: '#10b981' }} />
              </Box>
            }
          >
            <JobLocationMap position={mapPosition} />
          </Suspense>
        </Box>

        {/* Loại hình + Kinh nghiệm */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}>
              <span style={{ color: '#ef4444' }}>*</span> Loại hình công việc
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={form.jobType}
                onChange={handleChange('jobType')}
                displayEmpty
                sx={selectSx}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      '& .MuiMenuItem-root': { fontSize: '0.85rem' },
                    },
                  },
                }}
                renderValue={(val) => val || (
                  <span style={{ color: '#9ca3af' }}>Chọn loại hình</span>
                )}
              >
                {JOB_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}>Kinh nghiệm yêu cầu</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="VD: 2-3 năm"
              value={form.experience}
              onChange={handleChange('experience')}
              sx={fieldSx}
            />
          </Grid>
        </Grid>

        {/* Lương + Lương */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}>Lương tối thiểu (VNĐ)</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="15,000,000"
              value={form.salaryMin}
              onChange={handleChange('salaryMin')}
              sx={fieldSx}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}>Lương tối đa (VNĐ)</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="25,000,000"
              value={form.salaryMax}
              onChange={handleChange('salaryMax')}
              sx={fieldSx}
            />
          </Grid>
        </Grid>

        {/* Hạn nộp */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={sectionLabelSx}>Hạn nộp hồ sơ</Typography>
          <TextField
            fullWidth
            size="small"
            type="date"
            value={form.deadline}
            onChange={handleChange('deadline')}
            InputLabelProps={{ shrink: true }}
            sx={fieldSx}
          />
        </Box>

        {/* Rich Text Editors */}
        <Suspense
          fallback={
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={28} sx={{ color: '#10b981' }} />
            </Box>
          }
        >
          {/* Mô tả công việc */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={sectionLabelSx}>Mô tả công việc</Typography>
            <Box
              sx={{
                '& .ql-toolbar': {
                  borderRadius: '8px 8px 0 0',
                  borderColor: '#e5e7eb',
                  fontSize: '0.85rem',
                },
                '& .ql-container': {
                  borderRadius: '0 0 8px 8px',
                  borderColor: '#e5e7eb',
                  minHeight: 150,
                  fontSize: '0.85rem',
                },
                '& .ql-editor': {
                  minHeight: 150,
                },
              }}
            >
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={handleQuillChange('description')}
                modules={quillModules}
                placeholder="Nhập mô tả công việc..."
              />
            </Box>
          </Box>

          {/* Yêu cầu ứng viên */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={sectionLabelSx}>Yêu cầu ứng viên</Typography>
            <Box
              sx={{
                '& .ql-toolbar': {
                  borderRadius: '8px 8px 0 0',
                  borderColor: '#e5e7eb',
                  fontSize: '0.85rem',
                },
                '& .ql-container': {
                  borderRadius: '0 0 8px 8px',
                  borderColor: '#e5e7eb',
                  minHeight: 150,
                  fontSize: '0.85rem',
                },
                '& .ql-editor': {
                  minHeight: 150,
                },
              }}
            >
              <ReactQuill
                theme="snow"
                value={form.requirements}
                onChange={handleQuillChange('requirements')}
                modules={quillModules}
                placeholder="Nhập yêu cầu ứng viên..."
              />
            </Box>
          </Box>

          {/* Quyền lợi */}
          <Box sx={{ mb: 1 }}>
            <Typography sx={sectionLabelSx}>Quyền lợi</Typography>
            <Box
              sx={{
                '& .ql-toolbar': {
                  borderRadius: '8px 8px 0 0',
                  borderColor: '#e5e7eb',
                  fontSize: '0.85rem',
                },
                '& .ql-container': {
                  borderRadius: '0 0 8px 8px',
                  borderColor: '#e5e7eb',
                  minHeight: 150,
                  fontSize: '0.85rem',
                },
                '& .ql-editor': {
                  minHeight: 150,
                },
              }}
            >
              <ReactQuill
                theme="snow"
                value={form.benefits}
                onChange={handleQuillChange('benefits')}
                modules={quillModules}
                placeholder="Nhập quyền lợi..."
              />
            </Box>
          </Box>
        </Suspense>
      </DialogContent>

      {/* Footer buttons */}
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#d1d5db',
            color: '#6b7280',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              borderColor: '#9ca3af',
              bgcolor: '#f9fafb',
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: '#10b981',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#059669',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
            },
          }}
        >
          {isEdit ? 'Lưu thay đổi' : 'Đăng tin'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
