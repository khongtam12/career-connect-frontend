import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Slide,
  Grid,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const labelSx = {
  fontSize: '0.75rem',
  color: '#64748b',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.025em',
  mb: 0.5
};

const valueSx = {
  fontSize: '0.9rem',
  color: '#0f172a',
  fontWeight: 600,
  wordBreak: 'break-word',
};

const SectionHeader = ({ title }) => (
  <Typography sx={{
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#1e293b',
    bgcolor: '#f1f5f9',
    px: 1.5,
    py: 0.75,
    borderRadius: 1.5,
    mb: 2,
    mt: 1
  }}>
    {title}
  </Typography>
);

export default function JobDetailDialog({ open, job, onClose, loading, onStatusChange }) {
  if (!job && !loading) return null;

  const handleAction = (status) => {
    onStatusChange(job, status);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 550 },
          height: '100%',
          maxHeight: '100%',
          m: 0,
          position: 'fixed',
          right: 0,
          top: 0,
          borderRadius: { xs: 0, sm: '24px 0 0 24px' },
          boxShadow: '-10px 0 40px rgba(0,0,0,0.1)'
        },
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 3,
        borderBottom: '1px solid #f1f5f9'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ bgcolor: '#eff6ff', p: 1, borderRadius: 2, color: '#3b82f6' }}>
            <WorkOutlineIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b', lineHeight: 1.2 }}>
              Chi tiết tin tuyển dụng
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              ID: {job?.jobId || '---'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8', hover: { bgcolor: '#f1f5f9' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: '#fff' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', h: '300px', py: 10 }}>
            <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
          </Box>
        ) : (
          <Box sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Header Info */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                <Avatar
                  src={job.company?.logoUrl}
                  variant="rounded"
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    p: 1,
                    '& img': { objectFit: 'contain' }
                  }}
                >
                  <BusinessOutlinedIcon sx={{ color: '#94a3b8' }} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', mb: 0.5, lineHeight: 1.3 }}>
                    {job.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#3b82f6', mb: 1.5 }}>
                    {job.company?.name || 'N/A'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      label={
                        job.status === 'ACTIVE' ? 'Đang hiển thị' : 
                        job.status === 'PENDING' ? 'Chờ duyệt' : 
                        job.status === 'CLOSED' ? 'Đã đóng' : 'Đã từ chối'
                      }
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        bgcolor: 
                          job.status === 'ACTIVE' ? '#f0fdf4' : 
                          job.status === 'PENDING' ? '#fffbeb' : 
                          job.status === 'CLOSED' ? '#f1f5f9' : '#fef2f2',
                        color: 
                          job.status === 'ACTIVE' ? '#16a34a' : 
                          job.status === 'PENDING' ? '#d97706' : 
                          job.status === 'CLOSED' ? '#64748b' : '#ef4444',
                        border: '1px solid',
                        borderColor: 
                          job.status === 'ACTIVE' ? '#dcfce7' : 
                          job.status === 'PENDING' ? '#fef3c7' : 
                          job.status === 'CLOSED' ? '#e2e8f0' : '#fee2e2'
                      }}
                    />
                    <Chip label={job.jobType} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', bgcolor: '#f1f5f9', color: '#475569' }} />
                    {job.isTop && <Chip label="TIN NỔI BẬT" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', bgcolor: '#fff7ed', color: '#c2410c' }} />}
                  </Box>
                </Box>
              </Box>

              {/* Stats Overview */}
              <Grid container spacing={2}>
                {[
                  { icon: <RemoveRedEyeOutlinedIcon />, label: 'Lượt xem', value: job.views, color: '#6366f1' },
                  { icon: <PeopleOutlinedIcon />, label: 'Ứng tuyển', value: job.numberOfApplications, color: '#10b981' },
                  { icon: <AttachMoneyOutlinedIcon />, label: 'Mức lương', value: job.salaryNegotiable ? 'Thỏa thuận' : `${job.salaryMin}-${job.salaryMax} triệu`, color: '#f59e0b' },
                  { icon: <CalendarTodayOutlinedIcon />, label: 'Hạn chót', value: job.deadline, color: '#ef4444' }
                ].map((item, idx) => (
                  <Grid item xs={6} key={idx}>
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: item.color }}>
                        {React.cloneElement(item.icon, { sx: { fontSize: 18 } })}
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{item.label}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{item.value || '---'}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Detail Sections */}
              <Box>
                <SectionHeader title="Thông tin chi tiết" />
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography sx={labelSx}>Ngành nghề</Typography>
                    <Typography sx={valueSx}>{job.industry || '---'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={labelSx}>Vị trí/Cấp bậc</Typography>
                    <Typography sx={valueSx}>{job.rank || '---'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={labelSx}>Kinh nghiệm</Typography>
                    <Typography sx={valueSx}>{job.experience || '---'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={labelSx}>Học vấn</Typography>
                    <Typography sx={valueSx}>{job.education || '---'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={labelSx}>Số lượng tuyển</Typography>
                    <Typography sx={valueSx}>{job.quantity || '---'} người</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={labelSx}>Địa điểm</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#475569' }}>
                      <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                      <Typography sx={valueSx}>{job.location || '---'}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                <SectionHeader title="Mô tả công việc" />
                <Typography sx={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {job.description || 'Chưa có mô tả'}
                </Typography>
              </Box>

              <Box>
                <SectionHeader title="Yêu cầu ứng viên" />
                <Typography sx={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {job.candidateRequirements || 'Chưa có yêu cầu'}
                </Typography>
              </Box>

              <Box>
                <SectionHeader title="Quyền lợi & Phúc lợi" />
                <Typography sx={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {job.benefitsDetail || 'Chưa có thông tin quyền lợi'}
                </Typography>
              </Box>

              {/* Tags Section */}
              <Box sx={{ pb: 4 }}>
                <SectionHeader title="Tags & Kỹ năng" />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(() => {
                    const parseTags = (data) => {
                      if (!data) return [];
                      if (Array.isArray(data)) return data;
                      try {
                        const parsed = JSON.parse(data);
                        if (Array.isArray(parsed)) return parsed;
                      } catch (e) {}
                      return data.split(',').map(s => s.trim()).filter(s => s);
                    };

                    const sTags = parseTags(job.skills);
                    const rTags = parseTags(job.requirementTags);
                    
                    // Unify and unique tags
                    const uniqueTags = Array.from(new Set([...sTags, ...rTags]));

                    return (
                      <>
                        {uniqueTags.map((tag, i) => (
                          <Chip 
                            key={i} 
                            label={tag} 
                            size="small" 
                            variant="outlined" 
                            sx={{ 
                              fontSize: '0.75rem', 
                              fontWeight: 600, 
                              color: '#64748b',
                              bgcolor: '#f8fafc',
                              borderColor: '#e2e8f0'
                            }} 
                          />
                        ))}
                      </>
                    );
                  })()}
                </Box>
              </Box>
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9', gap: 1.5, flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          {job?.status === 'PENDING' && (
            <>
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={() => handleAction('ACTIVE')}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 800,
                  py: 1.25,
                  boxShadow: 'none',
                  bgcolor: '#10b981',
                  '&:hover': { boxShadow: 'none', bgcolor: '#059669' }
                }}
              >
                Phê duyệt tin
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => handleAction('REJECTED')}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 800,
                  py: 1.25,
                  boxShadow: 'none',
                  bgcolor: '#ef4444',
                  '&:hover': { boxShadow: 'none', bgcolor: '#dc2626' }
                }}
              >
                Từ chối tin
              </Button>
            </>
          )}
          
          {job?.status === 'ACTIVE' && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleAction('CLOSED')}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 800,
                py: 1.25,
                boxShadow: 'none',
                bgcolor: '#64748b',
                color: '#fff',
                '&:hover': { boxShadow: 'none', bgcolor: '#475569' }
              }}
            >
              Đóng tin (Closed)
            </Button>
          )}

          {job?.status === 'CLOSED' && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleAction('ACTIVE')}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 800,
                py: 1.25,
                boxShadow: 'none',
                bgcolor: '#10b981',
                color: '#fff',
                '&:hover': { boxShadow: 'none', bgcolor: '#059669' }
              }}
            >
              Mở lại tin (Re-open)
            </Button>
          )}
        </Box>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 800,
            py: 1.25,
            color: '#64748b',
            borderColor: '#e2e8f0',
            '&:hover': { bgcolor: '#fff', borderColor: '#cbd5e1' }
          }}
        >
          Đóng cửa sổ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
