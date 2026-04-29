import React, { useState, useEffect } from 'react';
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
  IconButton,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadCVAvatar } from '../../../service/cvService';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#d1d5db' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#3b82f6' },
  '& .MuiOutlinedInput-input': { fontSize: '0.85rem', py: 1.05 },
  '& .MuiOutlinedInput-input::placeholder': { fontSize: '0.85rem', color: '#9ca3af', opacity: 1 },
};

const sectionLabelSx = { fontWeight: 600, fontSize: '0.82rem', color: '#374151', mb: 1 };

const sectionTitleSx = {
  fontWeight: 700, fontSize: '0.95rem', color: '#1f2937', mb: 2, mt: 1,
  display: 'flex', alignItems: 'center', gap: 1,
  '&::before': { content: '""', width: 4, height: 18, bgcolor: '#3b82f6', borderRadius: 1, display: 'inline-block' },
};

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  dateOfBirth: '',
  address: '',
  experienceYear: '',
  currentJobTitle: '',
  expectedSalary: '',
  avatar: ''
};

export default function CandidateCreateDialog({ open, onClose, onSubmit, mode = 'create', initialValues }) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (open) {
      setPreviewUrl(null);
      setErrors({});
      if (mode === 'edit' && initialValues) {
        setFormData({ ...INITIAL_FORM, ...initialValues });
      } else {
        setFormData({ ...INITIAL_FORM });
      }
    }
  }, [open, mode, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'expectedSalary') {
      const numValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numValue });
      if (errors.expectedSalary) {
        setErrors((prev) => ({ ...prev, expectedSalary: '' }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    const str = String(value);
    const num = str.replace(/[^0-9]/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const validateForm = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{9,11}$/;
    const nameRegex = /^[A-Za-zÀ-ỹ]+(?:\s+[A-Za-zÀ-ỹ]+)+$/;

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Vui lòng nhập họ và tên';
    } else if (!nameRegex.test(formData.fullName.trim())) {
      nextErrors.fullName = 'Họ tên phải có ít nhất 2 từ và không chứa số/ký tự đặc biệt';
    }

    if (!isEdit) {
      if (!formData.email.trim()) {
        nextErrors.email = 'Vui lòng nhập email';
      } else if (!emailRegex.test(formData.email.trim())) {
        nextErrors.email = 'Email không đúng định dạng';
      }

      if (!formData.phone.trim()) {
        nextErrors.phone = 'Vui lòng nhập số điện thoại';
      } else if (!phoneRegex.test(formData.phone.trim())) {
        nextErrors.phone = 'Số điện thoại phải từ 9-11 chữ số';
      }
    }

    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      if (Number.isNaN(dob.getTime())) {
        nextErrors.dateOfBirth = 'Ngày sinh không hợp lệ';
      } else {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age -= 1;
        }
        if (age < 18) {
          nextErrors.dateOfBirth = 'Ứng viên phải đủ 18 tuổi';
        }
      }
    }

    if (formData.experienceYear && !/^\d+$/.test(String(formData.experienceYear))) {
      nextErrors.experienceYear = 'Số năm kinh nghiệm không hợp lệ';
    }

    if (formData.expectedSalary && !/^\d+$/.test(String(formData.expectedSalary))) {
      nextErrors.expectedSalary = 'Mức lương không hợp lệ';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = {
        ...formData,
        password: formData.password.trim() || '123456',
        experienceYear: formData.experienceYear ? parseInt(formData.experienceYear) : 0,
        expectedSalary: formData.expectedSalary ? parseFloat(formData.expectedSalary) : 0
    };
    onSubmit(payload);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setUploading(true);
      const fileUrl = await uploadCVAvatar(file);
      setFormData(prev => ({ ...prev, avatar: fileUrl }));
    } catch (err) {
      console.error("Lỗi upload avatar:", err);
      alert("Lỗi khi tải ảnh lên. Vui lòng thử lại!");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper"
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '92vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 2.5, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddAlt1Icon sx={{ color: '#3b82f6', fontSize: 24 }} />
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1f2937' }}>
            {isEdit ? 'Chỉnh sửa thông tin ứng viên' : 'Thêm mới ứng viên'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#9ca3af' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
          {/* SECTION 1: Avatar & Thông tin tài khoản */}
          <Typography sx={sectionTitleSx}>Thông tin tài khoản</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
            <Box
              sx={{
                width: 70, height: 70, borderRadius: '50%',
                bgcolor: '#f3f4f6', border: '1px dashed #d1d5db',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0
              }}
            >
              {uploading ? (
                <CircularProgress size={24} sx={{ color: '#3b82f6' }} />
              ) : (previewUrl || formData.avatar) ? (
                <img src={previewUrl || formData.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>Avatar</Typography>
              )}
            </Box>
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarUpload}
              />
              <label htmlFor="avatar-upload">
                <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} disabled={uploading} sx={{ borderRadius: 2, textTransform: 'none', color: '#3b82f6', borderColor: '#3b82f6', '&:hover': { borderColor: '#2563eb', bgcolor: '#eff6ff' } }} size="small">
                  {uploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
                </Button>
              </label>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mt: 0.5 }}>
                Định dạng: JPG, PNG, GIF
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Họ và tên</Typography>
              <TextField
                name="fullName"
                fullWidth
                size="small"
                placeholder="VD: Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
                sx={fieldSx}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Email</Typography>
              <TextField
                name="email"
                type="email"
                fullWidth
                size="small"
                placeholder="VD: email@example.com"
                value={formData.email}
                onChange={handleChange}
                sx={fieldSx}
                disabled={isEdit}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Số điện thoại</Typography>
              <TextField
                name="phone"
                fullWidth
                size="small"
                placeholder="VD: 0987654321"
                value={formData.phone}
                onChange={handleChange}
                sx={fieldSx}
                disabled={isEdit}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
              />
            </Grid>
            {!isEdit && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={sectionLabelSx}>Mật khẩu</Typography>
                <TextField
                  name="password"
                  type="password"
                  fullWidth
                  size="small"
                  placeholder="Mặc định: 123456"
                  value={formData.password}
                  onChange={handleChange}
                  sx={fieldSx}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
              </Grid>
            )}
          </Grid>

          {/* SECTION 2: Thông tin cá nhân */}
          <Typography sx={sectionTitleSx}>Thông tin cá nhân</Typography>

          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={sectionLabelSx}>Ngày sinh</Typography>
              <TextField
                name="dateOfBirth"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={handleChange}
                sx={fieldSx}
                error={Boolean(errors.dateOfBirth)}
                helperText={errors.dateOfBirth}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={sectionLabelSx}>Địa chỉ</Typography>
              <TextField name="address" fullWidth size="small" placeholder="VD: Quận 1, TP. HCM" value={formData.address} onChange={handleChange} sx={fieldSx} />
            </Grid>
          </Grid>

          {/* SECTION 3: Thông tin nghề nghiệp */}
          <Typography sx={sectionTitleSx}>Thông tin nghề nghiệp</Typography>

          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={sectionLabelSx}>Chức danh hiện tại</Typography>
              <TextField name="currentJobTitle" fullWidth size="small" placeholder="VD: Frontend Developer" value={formData.currentJobTitle} onChange={handleChange} sx={fieldSx} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={sectionLabelSx}>Số năm kinh nghiệm</Typography>
              <TextField
                name="experienceYear"
                type="number"
                fullWidth
                size="small"
                placeholder="VD: 2"
                value={formData.experienceYear}
                onChange={handleChange}
                sx={fieldSx}
                error={Boolean(errors.experienceYear)}
                helperText={errors.experienceYear}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={sectionLabelSx}>Mức lương mong muốn (VNĐ)</Typography>
              <TextField
                name="expectedSalary"
                type="text"
                fullWidth
                size="small"
                placeholder="VD: 15,000,000"
                value={formatCurrency(formData.expectedSalary)}
                onChange={handleChange}
                sx={fieldSx}
                error={Boolean(errors.expectedSalary)}
                helperText={errors.expectedSalary}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#d1d5db', color: '#6b7280', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' } }}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#3b82f6', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none', '&:hover': { bgcolor: '#2563eb', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' } }}>
            {isEdit ? 'Lưu thay đổi' : 'Lưu ứng viên'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
