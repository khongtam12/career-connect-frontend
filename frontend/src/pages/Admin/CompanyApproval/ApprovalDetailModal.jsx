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
    Paper,
    Divider,
    Stack
} from '@mui/material';
import { 
    Close as CloseIcon, 
    Verified as VerifiedIcon, 
    Business as BusinessIcon,
    Language as LanguageIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    Info as InfoIcon,
    Gavel as GavelIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
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
            toast.error('Không thể lấy thông tin chi tiết công ty');
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleApprove = async () => {
        setActionLoading(true);
        try {
            await approve(companyId);
            toast.success('Đã phê duyệt hồ sơ công ty thành công');
            onClose();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi phê duyệt');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!showRejectNote) {
            setShowRejectNote(true);
            return;
        }
        if (!note.trim()) {
            toast.warning('Vui lòng nhập lý do từ chối');
            return;
        }
        setActionLoading(true);
        try {
            await reject(companyId, note);
            toast.info('Đã từ chối hồ sơ công ty');
            onClose();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi từ chối hồ sơ');
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
                sx: { borderRadius: '20px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }
            }}
        >
            <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        <GavelIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="900" sx={{ lineHeight: 1.2 }}>Thẩm định hồ sơ</Typography>
                        <Typography variant="caption" color="text.secondary">Kiểm tra thông tin pháp lý trước khi cấp phép</Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} sx={{ bgcolor: '#f5f5f5' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4, bgcolor: '#fafafa' }}>
                {loadingDetail ? (
                    <Box sx={{ display: 'flex', flexItem: 'column', alignItems: 'center', justifyContent: 'center', py: 10, gap: 2 }}>
                        <CircularProgress size={40} thickness={4} />
                        <Typography color="text.secondary">Đang tải hồ sơ...</Typography>
                    </Box>
                ) : detail ? (
                    <Box>
                        {/* Company Identity */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eee', mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar 
                                src={detail.logo} 
                                variant="rounded" 
                                sx={{ width: 120, height: 120, p: 1, bgcolor: 'white', border: '1px solid #f0f0f0' }}
                            >
                                <BusinessIcon sx={{ fontSize: 60, color: '#ccc' }} />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h4" fontWeight="900" color="primary.dark">{detail.name}</Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Chip label={`MST: ${detail.taxCode}`} size="small" variant="filled" sx={{ fontWeight: '700', bgcolor: '#f0f0f0' }} />
                                    <Chip label="Chờ xét duyệt" size="small" color="warning" sx={{ fontWeight: '700' }} />
                                </Stack>
                            </Box>
                        </Paper>

                        <Grid container spacing={4}>
                            {/* Detailed Info */}
                            <Grid item xs={12} md={7}>
                                <Typography variant="subtitle2" fontWeight="900" sx={{ mb: 2, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InfoIcon fontSize="small" /> THÔNG TIN DOANH NGHIỆP
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <InfoBlock label="Email liên hệ" value={detail.email} icon={<EmailIcon />} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoBlock label="Số điện thoại" value={detail.phone} icon={<PhoneIcon />} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InfoBlock label="Website" value={detail.website} icon={<LanguageIcon />} isLink />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InfoBlock label="Địa chỉ" value={detail.address} icon={<LocationOnIcon />} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Summary Cards */}
                            <Grid item xs={12} md={5}>
                                <Stack spacing={2}>
                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: 'white', border: '1px solid #e0e0e0' }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="700">QUY MÔ NHÂN SỰ</Typography>
                                        <Typography variant="h5" fontWeight="900" color="primary.main">{detail.companySize || 'N/A'}</Typography>
                                        <Typography variant="caption">Thành viên</Typography>
                                    </Paper>
                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: 'white', border: '1px solid #e0e0e0' }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="700">NĂM THÀNH LẬP</Typography>
                                        <Typography variant="h5" fontWeight="900" color="secondary.main">{detail.foundedYear || 'N/A'}</Typography>
                                        <Typography variant="caption">Năm</Typography>
                                    </Paper>
                                </Stack>
                            </Grid>

                            {/* Legal Section */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, borderRadius: '16px', background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)', color: 'white' }}>
                                    <Typography variant="subtitle1" fontWeight="900" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <VerifiedIcon /> HỒ SƠ PHÁP LÝ ĐÍNH KÈM
                                    </Typography>
                                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>GIẤY PHÉP KINH DOANH (PDF/IMG)</Typography>
                                            <Box sx={{ mt: 1 }}>
                                                {detail.businessLicense ? (
                                                    <Button 
                                                        href={detail.businessLicense} 
                                                        target="_blank" 
                                                        variant="contained" 
                                                        sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: '900', '&:hover': { bgcolor: '#eee' } }}
                                                    >
                                                        XEM TÀI LIỆU GỐC
                                                    </Button>
                                                ) : (
                                                    <Typography variant="body2" color="error.light">Chưa cập nhật tài liệu</Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ opacity: 0.7 }}>MÃ SỐ THUẾ ĐỐI CHIẾU</Typography>
                                            <Typography variant="h6" fontWeight="900" sx={{ mt: 1, letterSpacing: 1 }}>
                                                {detail.submittedTaxCode || detail.taxCode}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Description */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight="900" color="text.secondary" sx={{ mb: 1 }}>MÔ TẢ CÔNG TY</Typography>
                                <Typography variant="body2" sx={{ bgcolor: 'white', p: 3, borderRadius: '12px', border: '1px solid #eee', lineHeight: 1.8 }}>
                                    {detail.description || 'Không có mô tả.'}
                                </Typography>
                            </Grid>
                        </Grid>

                        {showRejectNote && (
                            <Box sx={{ mt: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Lý do từ chối phê duyệt"
                                    placeholder="Nhập lý do chi tiết để nhà tuyển dụng sửa đổi hồ sơ..."
                                    multiline
                                    rows={4}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    color="error"
                                    variant="outlined"
                                    autoFocus
                                    sx={{ bgcolor: 'white' }}
                                />
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Typography color="error" textAlign="center">Lỗi: Không tìm thấy dữ liệu hồ sơ.</Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5', gap: 1 }}>
                <Button onClick={onClose} variant="text" color="inherit" disabled={actionLoading}>
                    Hủy bỏ
                </Button>
                <Box sx={{ flex: 1 }} />
                <Button 
                    onClick={handleReject} 
                    disabled={actionLoading} 
                    variant="outlined" 
                    color="error" 
                    sx={{ borderRadius: '10px', px: 3, fontWeight: '700' }}
                >
                    {showRejectNote ? 'Xác nhận từ chối' : 'Từ chối hồ sơ'}
                </Button>
                {!showRejectNote && (
                    <Button 
                        onClick={handleApprove} 
                        disabled={actionLoading} 
                        variant="contained" 
                        color="success" 
                        sx={{ borderRadius: '10px', px: 4, fontWeight: '700', boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)' }}
                    >
                        {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Phê duyệt ngay'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

const InfoBlock = ({ label, value, icon, isLink }) => (
    <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {icon && React.cloneElement(icon, { sx: { fontSize: 14 } })} {label.toUpperCase()}
        </Typography>
        {isLink && value ? (
            <Link href={value} target="_blank" underline="hover" sx={{ display: 'block', fontWeight: '700', color: 'primary.main', fontSize: '0.9rem' }}>
                {value}
            </Link>
        ) : (
            <Typography variant="body2" fontWeight="700" sx={{ color: '#333' }}>{value || '---'}</Typography>
        )}
    </Box>
);

export default ApprovalDetailModal;
