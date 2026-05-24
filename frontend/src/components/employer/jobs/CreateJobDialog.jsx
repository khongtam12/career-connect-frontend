import React, { useState, lazy, Suspense, useEffect, useCallback } from 'react';
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
  Autocomplete,
  IconButton,
  CircularProgress,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  INDUSTRIES,
  JOB_TYPES,
  EDUCATION_OPTIONS,
  RANK_OPTIONS,
} from './jobSelectOptions';
import { DEFAULT_MAP_POSITION, QUILL_MODULES } from './jobDialogConfig';
import {
  fieldSx,
  sectionLabelSx,
  sectionTitleSx,
  quillBoxSx,
  autocompleteSx,
} from './jobDialogStyles';
import useProvinces from './useProvinces';
import useWards from './useWards';

const ReactQuill = lazy(() => import('react-quill-new'));
const JobLocationMap = lazy(() => import('./JobLocationMap'));

const INITIAL_FORM = {
  title: '', industry: '', address: '', provinceCode: '', ward: '', wardCode: '', addressDetail: '', jobType: '', experience: '',
  salaryMin: '', salaryMax: '', salaryNegotiable: false,
  deadline: '', description: '', requirements: '',
  benefits: '',
  // New fields
  requirementTags: [], benefitTags: [], specialties: [],
  candidateRequirements: '', salaryDetail: '', benefitsDetail: '',
  workSchedule: '', rank: '', education: '', quantity: '', ageRange: '',
  relatedCategories: [], skills: [],
  companySubscriptionId: '',
};

/* ── Tag Input Component ── */
function TagInput({ tags, onChange, placeholder }) {
  const [inputVal, setInputVal] = useState('');

  const handleAdd = () => {
    const val = inputVal.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
  };

  const handleDelete = (idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const chipSx = { bgcolor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', fontWeight: 500, fontSize: '0.78rem', borderRadius: '16px', height: 28 };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: tags.length > 0 ? 1 : 0 }}>
        <TextField
          fullWidth size="small" placeholder={placeholder}
          value={inputVal} onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown} sx={fieldSx}
        />
        <IconButton onClick={handleAdd} size="small" sx={{ color: '#10b981' }}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
      {tags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {tags.map((tag, i) => (
            <Chip
              key={i} label={tag} size="small"
              onDelete={() => handleDelete(i)}
              sx={chipSx}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function CreateJobDialog({
  open,
  onClose,
  onSubmit,
  mode = 'create',
  initialValues,
  subscriptionOptions = [],
  subscriptionsLoading = false,
  allowEditSubscription = false,
  fieldErrors = {},
  onClearError,
}) {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [mapPosition, setMapPosition] = useState(DEFAULT_MAP_POSITION);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeMessage, setGeocodeMessage] = useState('');
  const { provinces, loading: provincesLoading, error: provincesError } = useProvinces(open);
  const { wards, loading: wardsLoading, error: wardsError } = useWards(form.provinceCode, open);

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialValues) {
      setForm({ ...INITIAL_FORM, ...initialValues });
    } else if (mode !== 'edit') {
      // reset sạch khi mở form tạo mới
      setForm({ ...INITIAL_FORM });
      setMapPosition(DEFAULT_MAP_POSITION);
    }
  }, [open, mode, initialValues]);

  useEffect(() => {
    if (!open) return;
    if (form.provinceCode || !form.address || provinces.length === 0) return;
    const matched = provinces.find((province) => province.name === form.address);
    if (matched) {
      setForm((prev) => ({ ...prev, provinceCode: matched.code }));
    }
  }, [open, form.address, form.provinceCode, provinces]);

  useEffect(() => {
    if (!open) return;
    if (form.wardCode || !form.ward || wards.length === 0) return;
    const matched = wards.find((ward) => ward.name === form.ward);
    if (matched) {
      setForm((prev) => ({ ...prev, wardCode: matched.code }));
    }
  }, [open, form.ward, form.wardCode, wards]);

  useEffect(() => {
    if (!open) {
      setMapPosition(DEFAULT_MAP_POSITION);
      setIsGeocoding(false);
      setGeocodeMessage('');
      return;
    }
    if (!form.addressDetail.trim()) {
      setIsGeocoding(false);
      setGeocodeMessage('');
      setMapPosition(DEFAULT_MAP_POSITION);
      return;
    }
    const queryParts = [form.addressDetail, form.ward, form.address]
      .map((val) => val.trim())
      .filter(Boolean);
    const query = queryParts.join(', ');
    if (query.length < 6) {
      setIsGeocoding(false);
      setGeocodeMessage('');
      setMapPosition(DEFAULT_MAP_POSITION);
      return;
    }
    let ignore = false;
    setIsGeocoding(true);
    setGeocodeMessage('');
    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Geocoding failed');
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
        if (!ignore) setGeocodeMessage('Không thể định vị lúc này, vui lòng thử lại');
      } finally {
        if (!ignore) setIsGeocoding(false);
      }
    }, 650);
    return () => { ignore = true; clearTimeout(timer); };
  }, [form.address, form.addressDetail, form.ward, open]);

  const handleChange = useCallback((field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    onClearError?.(field);
  }, [onClearError]);

  // Format number with commas: 15000000 -> 15,000,000
  const formatCurrency = (value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString('en-US');
  };

  const handleSalaryChange = useCallback((field) => (e) => {
    const formatted = formatCurrency(e.target.value);
    setForm((prev) => ({ ...prev, [field]: formatted }));
    onClearError?.(field);
  }, [onClearError]);



  const handleQuillChange = useCallback((field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    onClearError?.(field);
  }, [onClearError]);

  const handleTagChange = useCallback((field) => (newTags) => {
    setForm((prev) => ({ ...prev, [field]: newTags }));
  }, []);

  // Không reset form ở đây — parent sẽ đóng dialog khi thành công
  const handleSubmit = (isDraft = false) => {
    onSubmit?.(form, isDraft);
  };

  // Helper hiển thị lỗi dưới field
  const fieldErrorText = (field) => fieldErrors[field] || '';
  const fieldErrorSx = (field) => fieldErrors[field] ? {
    '& .MuiOutlinedInput-root fieldset': { borderColor: '#ef4444 !important' },
  } : {};

  const isEdit = mode === 'edit';
  const showSubscriptionSection = !isEdit || allowEditSubscription;
  const autocompleteSlotProps = {
    paper: {
      sx: {
        borderRadius: 2,
        mt: 0.6,
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
        border: '1px solid #e5e7eb',
      },
    },
    listbox: {
      sx: {
        py: 0.4,
        maxHeight: 260,
        '& .MuiAutocomplete-option': {
          fontSize: '0.82rem',
          px: 1.2,
          py: 0.7,
          borderRadius: 1.5,
          mx: 0.6,
          '&[aria-selected="true"]': { backgroundColor: '#ecfdf5', color: '#065f46' },
          '&.Mui-focused': { backgroundColor: '#f3f4f6' },
        },
      },
    },
  };

  return (
    <Dialog
      open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper"
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '92vh' } }}
    >
      {/* Header */}
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 2.5, px: 3 }}>
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
        {showSubscriptionSection && (
          <>
            <Typography sx={sectionTitleSx}>Gói tin đã mua</Typography>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Chọn gói tin</Typography>
              <Autocomplete
                options={subscriptionOptions}
                getOptionLabel={(option) => option?.label || ''}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                value={subscriptionOptions.find((opt) => opt.id === form.companySubscriptionId) || null}
                autoHighlight
                disableClearable
                popupIcon={<ExpandMoreIcon />}
                onChange={(_, newValue) => {
                  setForm((prev) => ({ ...prev, companySubscriptionId: newValue?.id || '' }));
                  onClearError?.('companySubscriptionId');
                }}
                loading={subscriptionsLoading}
                loadingText="Đang tải gói tin..."
                noOptionsText={subscriptionsLoading ? 'Đang tải gói tin...' : 'Chưa có gói tin phù hợp'}
                sx={autocompleteSx}
                slotProps={autocompleteSlotProps}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Chọn gói tin"
                    error={!!fieldErrors.companySubscriptionId}
                    sx={{...fieldSx, ...fieldErrorSx('companySubscriptionId')}}
                  />
                )}
              />
              {fieldErrors.companySubscriptionId && (
                <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                  {fieldErrors.companySubscriptionId}
                </Typography>
              )}
            </Box>
          </>
        )}

        {/* ═══════ SECTION 1: Thông tin cơ bản ═══════ */}
        <Typography sx={sectionTitleSx}>Thông tin cơ bản</Typography>

        {/* Tiêu đề */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Tiêu đề vị trí</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="VD: Senior Frontend Developer"
            value={form.title}
            onChange={handleChange('title')}
            sx={{...fieldSx, ...fieldErrorSx('title')}}
            error={!!fieldErrors.title}
          />
          {fieldErrors.title && (
            <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
              {fieldErrorText('title')}
            </Typography>
          )}
        </Box>

        {/* Ngành nghề + Địa chỉ */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Ngành nghề</Typography>
            <Autocomplete
              options={INDUSTRIES}
              value={form.industry || null}
              autoHighlight
              disableClearable
              popupIcon={<ExpandMoreIcon />}
              onChange={(_, newValue) => {
                setForm((prev) => ({ ...prev, industry: newValue || '' }));
                onClearError?.('industry');
              }}
              sx={autocompleteSx}
              slotProps={autocompleteSlotProps}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Chọn ngành nghề"
                  error={!!fieldErrors.industry}
                  sx={{...fieldSx, ...fieldErrorSx('industry')}}
                />
              )}
            />
            {fieldErrors.industry && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrors.industry}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Tỉnh/Thành làm việc</Typography>
            <Autocomplete
              options={provinces}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option?.code === value?.code}
              value={provinces.find((province) => province.code === form.provinceCode) || null}
              autoHighlight
              disableClearable
              popupIcon={<ExpandMoreIcon />}
              onChange={(_, newValue) => {
                const nextCode = newValue?.code || '';
                setForm((prev) => ({
                  ...prev,
                  provinceCode: nextCode,
                  address: newValue?.name || '',
                  ward: '',
                  wardCode: '',
                }));
                onClearError?.('address');
                onClearError?.('ward');
              }}
              loading={provincesLoading}
              loadingText="Đang tải tỉnh/thành..."
              noOptionsText="Không có dữ liệu tỉnh/thành"
              sx={autocompleteSx}
              slotProps={autocompleteSlotProps}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Chọn tỉnh/thành"
                  error={!!fieldErrors.address}
                  sx={{...fieldSx, ...fieldErrorSx('address')}}
                />
              )}
            />
            {fieldErrors.address && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrorText('address')}
              </Typography>
            )}
            {provincesError && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {provincesError}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Phường/Xã làm việc</Typography>
            <Autocomplete
              options={wards}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option?.code === value?.code}
              value={wards.find((ward) => ward.code === form.wardCode) || null}
              autoHighlight
              disableClearable
              popupIcon={<ExpandMoreIcon />}
              onChange={(_, newValue) => {
                setForm((prev) => ({
                  ...prev,
                  wardCode: newValue?.code || '',
                  ward: newValue?.name || '',
                }));
                onClearError?.('ward');
              }}
              loading={wardsLoading}
              loadingText="Đang tải phường/xã..."
              noOptionsText={form.provinceCode ? 'Không có dữ liệu phường/xã' : 'Chọn tỉnh/thành trước'}
              disabled={!form.provinceCode}
              sx={autocompleteSx}
              slotProps={autocompleteSlotProps}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Chọn phường/xã"
                  error={!!fieldErrors.ward}
                  sx={{...fieldSx, ...fieldErrorSx('ward')}}
                />
              )}
            />
            {fieldErrors.ward && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrorText('ward')}
              </Typography>
            )}
            {wardsError && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {wardsError}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}>Địa chỉ cụ thể</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Số nhà, đường, tòa nhà, khu..."
              value={form.addressDetail}
              onChange={handleChange('addressDetail')}
              sx={{...fieldSx, ...fieldErrorSx('addressDetail')}}
              error={!!fieldErrors.addressDetail}
            />
            {fieldErrors.addressDetail && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrorText('addressDetail')}
              </Typography>
            )}
            {(isGeocoding || geocodeMessage) && (
              <Typography sx={{ mt: 0.8, fontSize: '0.78rem', color: isGeocoding ? '#6b7280' : geocodeMessage.includes('Không') ? '#ef4444' : '#10b981' }}>
                {isGeocoding ? 'Đang định vị địa chỉ trên bản đồ...' : geocodeMessage}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Bản đồ */}
        <Box sx={{ mb: 2.5 }}>
          <Suspense fallback={<Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}><CircularProgress size={28} sx={{ color: '#10b981' }} /></Box>}>
            <JobLocationMap position={mapPosition} />
          </Suspense>
        </Box>

        {/* Loại hình + Kinh nghiệm */}
        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Loại hình công việc</Typography>
            <Autocomplete
              options={JOB_TYPES}
              value={form.jobType || null}
              autoHighlight
              disableClearable
              popupIcon={<ExpandMoreIcon />}
              onChange={(_, newValue) => {
                setForm((prev) => ({ ...prev, jobType: newValue || '' }));
                onClearError?.('jobType');
              }}
              sx={autocompleteSx}
              slotProps={autocompleteSlotProps}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Chọn loại hình"
                  error={!!fieldErrors.jobType}
                  sx={{...fieldSx, ...fieldErrorSx('jobType')}}
                />
              )}
            />
            {fieldErrors.jobType && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrors.jobType}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Kinh nghiệm yêu cầu</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="VD: 2-3 năm"
              value={form.experience}
              onChange={handleChange('experience')}
              sx={{...fieldSx, ...fieldErrorSx('experience')}}
              error={!!fieldErrors.experience}
            />
            {fieldErrors.experience && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrorText('experience')}
              </Typography>
            )}
          </Grid>
        </Grid>


        {/* Lương */}
        <Box sx={{ mb: 2.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.salaryNegotiable}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    salaryNegotiable: e.target.checked,
                    ...(e.target.checked ? { salaryMin: '', salaryMax: '' } : {}),
                  }));
                  onClearError?.('salaryMin');
                  onClearError?.('salaryMax');
                }}
                sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
              />
            }
            label={<Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Lương thỏa thuận</Typography>}
          />
          {!form.salaryNegotiable && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Lương tối thiểu (VNĐ)</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="15,000,000"
                  value={form.salaryMin}
                  onChange={handleSalaryChange('salaryMin')}
                  sx={{...fieldSx, ...fieldErrorSx('salaryMin')}}
                  error={!!fieldErrors.salaryMin}
                />
                {fieldErrors.salaryMin && (
                  <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                    {fieldErrorText('salaryMin')}
                  </Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Lương tối đa (VNĐ)</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="25,000,000"
                  value={form.salaryMax}
                  onChange={handleSalaryChange('salaryMax')}
                  sx={{...fieldSx, ...fieldErrorSx('salaryMax')}}
                  error={!!fieldErrors.salaryMax}
                />
                {fieldErrors.salaryMax && (
                  <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                    {fieldErrorText('salaryMax')}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Hạn nộp */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Hạn nộp hồ sơ</Typography>
          <TextField
            fullWidth size="small" type="date"
            value={form.deadline}
            onChange={handleChange('deadline')}
            InputLabelProps={{ shrink: true }}
            sx={{...fieldSx, ...fieldErrorSx('deadline')}}
            error={!!fieldErrors.deadline}
          />
          {fieldErrors.deadline && (
            <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
              {fieldErrorText('deadline')}
            </Typography>
          )}
        </Box>



        {/* ═══════ SECTION 2: Thông tin chung ═══════ */}
        <Typography sx={sectionTitleSx}>Thông tin chung</Typography>

        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Cấp bậc</Typography>
            <Autocomplete
              options={RANK_OPTIONS}
              value={form.rank || null}
              autoHighlight
              disableClearable
              popupIcon={<ExpandMoreIcon />}
              onChange={(_, newValue) => {
                setForm((prev) => ({ ...prev, rank: newValue || '' }));
                onClearError?.('rank');
              }}
              sx={autocompleteSx}
              slotProps={autocompleteSlotProps}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Chọn cấp bậc"
                  error={!!fieldErrors.rank}
                  sx={{...fieldSx, ...fieldErrorSx('rank')}}
                />
              )}
            />
            {fieldErrors.rank && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrors.rank}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Học vấn</Typography>
            <Autocomplete
              options={EDUCATION_OPTIONS}
              value={form.education || null}
              autoHighlight
              disableClearable
              popupIcon={<ExpandMoreIcon />}
              onChange={(_, newValue) => {
                setForm((prev) => ({ ...prev, education: newValue || '' }));
                onClearError?.('education');
              }}
              sx={autocompleteSx}
              slotProps={autocompleteSlotProps}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Chọn trình độ"
                  error={!!fieldErrors.education}
                  sx={{...fieldSx, ...fieldErrorSx('education')}}
                />
              )}
            />
            {fieldErrors.education && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrors.education}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Số lượng tuyển</Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="VD: 4"
              value={form.quantity}
              onChange={handleChange('quantity')}
              sx={{...fieldSx, ...fieldErrorSx('quantity')}}
              error={!!fieldErrors.quantity}
            />
            {fieldErrors.quantity && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrorText('quantity')}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Độ tuổi yêu cầu</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="VD: 18 - 35"
              value={form.ageRange}
              onChange={handleChange('ageRange')}
              sx={{...fieldSx, ...fieldErrorSx('ageRange')}}
              error={!!fieldErrors.ageRange}
            />
            {fieldErrors.ageRange && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrorText('ageRange')}
              </Typography>
            )}
          </Grid>
        </Grid>



        {/* ═══════ SECTION 3: Chi tiết tin tuyển dụng (Tags) ═══════ */}
        <Typography sx={sectionTitleSx}>Chi tiết tin tuyển dụng</Typography>

        {/* Yêu cầu tags */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={sectionLabelSx}>Yêu cầu</Typography>
          <TagInput tags={form.requirementTags} onChange={handleTagChange('requirementTags')} placeholder='VD: 1 năm kinh nghiệm, Cao Đẳng trở lên...' chipColor="blue" />
        </Box>

        {/* Quyền lợi tags */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={sectionLabelSx}>Quyền lợi</Typography>
          <TagInput tags={form.benefitTags} onChange={handleTagChange('benefitTags')} placeholder='VD: Lương tháng 13, Bảo hiểm sức khoẻ...' chipColor="purple" />
        </Box>

        {/* Chuyên môn tags */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={sectionLabelSx}>Chuyên môn</Typography>
          <TagInput tags={form.specialties} onChange={handleTagChange('specialties')} placeholder='VD: Kế toán, Tài chính, Thuế...' chipColor="gray" />
        </Box>



        {/* ═══════ SECTION 4: Mô tả chi tiết (Rich Text) ═══════ */}
        <Typography sx={sectionTitleSx}>Mô tả chi tiết</Typography>

        <Suspense fallback={<Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={28} sx={{ color: '#10b981' }} /></Box>}>
          {/* Mô tả công việc */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={sectionLabelSx}><span style={{ color: '#ef4444' }}>*</span> Mô tả công việc</Typography>
            <Box sx={{...quillBoxSx, ...(fieldErrors.description ? {'& .ql-container': {borderColor: '#ef4444'}, '& .ql-toolbar': {borderColor: '#ef4444'}} : {})}}>
              <ReactQuill theme="snow" value={form.description} onChange={handleQuillChange('description')} modules={QUILL_MODULES} placeholder="Nhập mô tả công việc..." />
            </Box>
            {fieldErrors.description && (
              <Typography sx={{ color: '#ef4444', fontSize: '0.78rem', mt: 0.6 }}>
                {fieldErrors.description}
              </Typography>
            )}
          </Box>

          {/* Yêu cầu ứng viên */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={sectionLabelSx}>Yêu cầu ứng viên</Typography>
            <Box sx={quillBoxSx}>
              <ReactQuill theme="snow" value={form.candidateRequirements} onChange={handleQuillChange('candidateRequirements')} modules={QUILL_MODULES} placeholder="Nhập yêu cầu ứng viên..." />
            </Box>
          </Box>

          {/* Thu nhập chi tiết */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={sectionLabelSx}>Thu nhập</Typography>
            <Box sx={quillBoxSx}>
              <ReactQuill theme="snow" value={form.salaryDetail} onChange={handleQuillChange('salaryDetail')} modules={QUILL_MODULES} placeholder="VD: Lương cứng 14-16 triệu, Thưởng KPI..." />
            </Box>
          </Box>

          {/* Quyền lợi chi tiết */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={sectionLabelSx}>Quyền lợi</Typography>
            <Box sx={quillBoxSx}>
              <ReactQuill theme="snow" value={form.benefitsDetail} onChange={handleQuillChange('benefitsDetail')} modules={QUILL_MODULES} placeholder="VD: Lương tháng 13, BHXH, du lịch hàng năm..." />
            </Box>
          </Box>

          {/* Thời gian làm việc */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={sectionLabelSx}>Thời gian làm việc</Typography>
            <Box sx={quillBoxSx}>
              <ReactQuill theme="snow" value={form.workSchedule} onChange={handleQuillChange('workSchedule')} modules={QUILL_MODULES} placeholder="VD: Thứ 2 - Thứ 6, 8:00 - 17:00..." />
            </Box>
          </Box>
        </Suspense>



        {/* ═══════ SECTION 5: Danh mục & Kỹ năng ═══════ */}
        <Typography sx={sectionTitleSx}>Danh mục & Kỹ năng</Typography>

        {/* Danh mục nghề liên quan */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={sectionLabelSx}>Danh mục Nghề liên quan</Typography>
          <Autocomplete
            multiple
            options={INDUSTRIES}
            value={form.relatedCategories}
            autoHighlight
            onChange={(_, newValue) => {
              setForm((prev) => ({ ...prev, relatedCategories: newValue }));
            }}
            filterSelectedOptions
            sx={autocompleteSx}
            popupIcon={<ExpandMoreIcon />}
            slotProps={autocompleteSlotProps}
            renderTags={(value, getTagProps) => (
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  sx={{ bgcolor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', fontWeight: 500, fontSize: '0.78rem', borderRadius: '16px', height: 28 }}
                />
              ))
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Chọn danh mục nghề..."
                sx={fieldSx}
              />
            )}
          />
        </Box>

        {/* Kỹ năng cần có */}
        <Box sx={{ mb: 1 }}>
          <Typography sx={sectionLabelSx}>Kỹ năng cần có</Typography>
          <TagInput tags={form.skills} onChange={handleTagChange('skills')} placeholder='VD: Excel, MISA, Kế toán tổng hợp...' chipColor="green" />
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined"
          sx={{ borderColor: '#d1d5db', color: '#6b7280', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' } }}
        >
          Hủy
        </Button>

        {/* Chỉ hiện "Lưu nháp" khi tạo mới */}
        {!isEdit && (
          <Button
            onClick={() => handleSubmit(true)}
            variant="outlined"
            sx={{
              borderColor: '#6b7280', color: '#374151', borderRadius: 2,
              textTransform: 'none', fontWeight: 600, px: 3,
              '&:hover': { borderColor: '#374151', bgcolor: '#f3f4f6' },
            }}
          >
            Lưu nháp
          </Button>
        )}

        <Button
          onClick={() => handleSubmit(false)}
          variant="contained"
          disabled={!isEdit && !subscriptionsLoading && subscriptionOptions.length === 0}
          sx={{ bgcolor: '#10b981', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none', '&:hover': { bgcolor: '#059669', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' } }}
        >
          {isEdit ? 'Lưu thay đổi' : 'Đăng tin'}
        </Button>

      </DialogActions>
    </Dialog>
  );
}
