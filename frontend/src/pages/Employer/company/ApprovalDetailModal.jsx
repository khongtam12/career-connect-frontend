import React, { useEffect, useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography, 
    Grid, 
    Box, 
    Avatar, 
    Link,
    TextField,
    CircularProgress,
    IconButton,
    Chip,
    Paper
} from '@mui/material';
import { 
    Close as CloseIcon, 
    Verified as VerifiedIcon, 
    Business as BusinessIcon,
    Language as LanguageIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { toast } from '@/components/ui/use-toast';
import * as companyService from '@/service/companyService';
import useCompanyApprovalStore from '@/stores/useCompanyApprovalStore';

const ApprovalDetailModal = ({ isOpen, onClose, companyId }) => {
    const [detail, setDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showRejectNote, setShowRejectNote] = useState(false);
    const [note, setNote] = useState('');
    
    const { approve, reject } = useCompanyApprovalStore();

    useEffect(() => {
        if (isOpen && companyId) {
            fetchDetail();
            setShowRejectNote(false);
            setNote('');
        }
    }, [isOpen, companyId]);

    const fetchDetail = async () => {
        setLoadingDetail(true);
        try {
            const res = await companyService.getCompanyDetail(companyId);
            setDetail(res?.data || res); 
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Không thể lấy thông tin', variant: 'destructive' });
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleApprove = async () => {
        setActionLoading(true);
        try {
            await approve(companyId);
            toast({ title: 'Đã duyệt', description: 'Công ty đã được phê duyệt' });
            onClose();
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Có lỗi khi duyệt công ty', variant: 'destructive' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!showRejectNote) {
            setShowRejectNote(true);
            return;
        }
        setActionLoading(true);
        try {
            await reject(companyId, note);
            toast({ title: 'Đã từ chối', description: note || 'Yêu cầu bị từ chối' });
            onClose();
        } catch (error) {
            toast({ title: 'Lỗi', description: 'Có lỗi khi từ chối', variant: 'destructive' });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: '16px', p: 1 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">Chi tiết hồ sơ công ty</Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderBottom: 'none', bgcolor: '#fbfbfb' }}>
                {loadingDetail ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : detail ? (
                    <Box sx={{ p: 1 }}>
                        {/* Header Section */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, mb: 4, p: 2, bgcolor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <Avatar 
                                src={detail.logo} 
                                variant="rounded" 
                                sx={{ width: 100, height: 100, bgcolor: 'grey.50', border: '2px solid #eee', p: 1 }}
                            >
                                <BusinessIcon sx={{ fontSize: 60, color: 'grey.300' }} />
                            </Avatar>
                            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                <Typography variant="h4" fontWeight="800" color="primary.dark">{detail.name}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, mt: 0.5 }}>
                                    <Chip label={`MST: ${detail.taxCode}`} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                                    <Chip label="Đang chờ duyệt" size="small" color="warning" sx={{ fontWeight: 'bold' }} />
                                </Box>
                            </Box>
                        </Box>

                        <Grid container spacing={3}>
                            {/* Contact Info Column */}
                            <Grid item xs={12} md={7}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom sx={{ mb: 2 }}>THÔNG TIN LIÊN HỆ</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <InfoItem icon={<EmailIcon fontSize="inherit" />} label="Email" value={detail.email} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InfoItem icon={<PhoneIcon fontSize="inherit" />} label="Điện thoại" value={detail.phone} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InfoItem icon={<LanguageIcon fontSize="inherit" />} label="Website" value={detail.website} isLink />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InfoItem icon={<LocationOnIcon fontSize="inherit" />} label="Địa chỉ trụ sở" value={detail.address} />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            
                            {/* Company Size Column */}
                            <Grid item xs={12} md={5}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', height: '100%' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom sx={{ mb: 2 }}>TỔNG QUAN</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: '8px', textAlign: 'center' }}>
                                            <Typography variant="h6" fontWeight="bold" color="primary.main">{detail.companySize || 'N/A'}</Typography>
                                            <Typography variant="caption" color="primary.main">Nhân viên</Typography>
                                        </Box>
                                        <Box sx={{ p: 1.5, bgcolor: 'secondary.50', borderRadius: '8px', textAlign: 'center' }}>
                                            <Typography variant="h6" fontWeight="bold" color="secondary.main">{detail.foundedYear || 'N/A'}</Typography>
                                            <Typography variant="caption" color="secondary.main">Năm thành lập</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Description Section */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>GIỚI THIỆU CÔNG TY</Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', bgcolor: 'white', p: 3, borderRadius: '12px', border: '1px solid #eee', lineHeight: 1.6, color: 'text.primary' }}>
                                    {detail.description || 'Chưa có mô tả chi tiết.'}
                                </Typography>
                            </Grid>

                            {/* Verification Block */}
                            {detail.businessLicense && (
                                <Grid item xs={12}>
                                    <Box sx={{ 
                                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
                                        color: 'white', 
                                        p: 3, 
                                        borderRadius: '16px', 
                                        boxShadow: '0 4px 20px rgba(25,118,210,0.3)' 
                                    }}>
                                        <Typography variant="subtitle1" fontWeight="900" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                                            <VerifiedIcon /> Hồ sơ pháp lý xác thực
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>MÃ SỐ THUẾ XÁC THỰC</Typography>
                                                <Typography variant="body1" fontWeight="bold" sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: '6px', textAlign: 'center' }}>{detail.submittedTaxCode}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>GIẤY PHÉP KINH DOANH</Typography>
                                                <Button 
                                                    href={detail.businessLicense} 
                                                    target="_blank" 
                                                    variant="contained" 
                                                    size="small"
                                                    sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', '&:hover': { bgcolor: '#f0f0f0' }, width: '100%' }}
                                                >
                                                    Xem tài liệu
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>GHI CHÚ XÁC THỰC</Typography>
                                                <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: '6px', minHeight: '40px' }}>
                                                    {detail.verificationNote ? `"${detail.verificationNote}"` : 'Không có ghi chú.'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>

                        {showRejectNote && (
                            <Box sx={{ mt: 3, p: 2, bgcolor: '#fff5f5', borderRadius: '12px', border: '1px solid #fed7d7' }}>
                                <TextField
                                    fullWidth
                                    label="Lý do từ chối (Gửi cho nhà tuyển dụng)"
                                    multiline
                                    rows={3}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    color="error"
                                    variant="filled"
                                    autoFocus
                                />
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Typography color="error" textAlign="center">Không tìm thấy dữ liệu.</Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: '8px' }}>
                    Đóng
                </Button>
                <Button 
                    onClick={handleReject} 
                    disabled={actionLoading} 
                    variant="contained" 
                    color="error" 
                    sx={{ borderRadius: '8px' }}
                >
                    {showRejectNote ? 'Xác nhận từ chối' : 'Từ chối'}
                </Button>
                {!showRejectNote && (
                    <Button 
                        onClick={handleApprove} 
                        disabled={actionLoading} 
                        variant="contained" 
                        color="success" 
                        sx={{ borderRadius: '8px' }}
                    >
                        Duyệt hồ sơ
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

const InfoItem = ({ icon, label, value, isLink }) => (
    <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {icon} {label}
        </Typography>
        {isLink ? (
            <Link href={value} target="_blank" display="block" variant="body2" fontWeight="500">
                {value || 'N/A'}
            </Link>
        ) : (
            <Typography variant="body2" fontWeight="500">{value || 'N/A'}</Typography>
        )}
    </Box>
);

export default ApprovalDetailModal;
