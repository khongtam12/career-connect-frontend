import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Container, Divider, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { paymentPackage } from '../../../service/paymentService';
import { useUserStore } from '../../../stores/useUserStore';

const formatCurrency = (value) => `₫ ${Number(value || 0).toLocaleString('vi-VN')}`;

const CheckoutPage = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');
    const [submitting, setSubmitting] = useState(false);

    const jobPackage = state?.jobPackage;
    const totalPrice = state?.totalPrice || jobPackage?.price || 0;
    const selectedDurationLabel = state?.selectedDurationLabel || 'Chưa chọn';
    const durationDays = jobPackage?.durationDays || 0;
    const employerId = user?.userId || user?.employerId;
    const companyId = user?.companyId;

    const paymentMethods = useMemo(() => ([
        {
            code: 'VNPAY',
            title: 'VNPAY',
            subtitle: 'Cổng thanh toán nội địa, quen thuộc và phổ biến',
            accent: '#0f62fe',
            background: 'linear-gradient(135deg, rgba(15,98,254,0.12), rgba(255,255,255,0.95))',
            enabled: true,
        },
        {
            code: 'MOMO',
            title: 'MOMO',
            subtitle: 'Backend chưa hỗ trợ phương thức này',
            accent: '#d82d8b',
            background: 'linear-gradient(135deg, rgba(216,45,139,0.12), rgba(255,255,255,0.95))',
            enabled: false,
        },
        {
            code: 'BANK',
            title: 'BANK',
            subtitle: 'Backend chưa hỗ trợ phương thức này',
            accent: '#15803d',
            background: 'linear-gradient(135deg, rgba(21,128,61,0.12), rgba(255,255,255,0.95))',
            enabled: false,
        },
    ]), []);

    const handleConfirmPayment = async () => {
        if (!jobPackage?.packageId) {
            toast.error('Không có gói thanh toán hợp lệ');
            return;
        }

        if (!employerId) {
            toast.error('Bạn cần đăng nhập để thanh toán');
            return;
        }

        if (!companyId) {
            toast.error('Chưa có thông tin công ty. Hãy hoàn thiện hồ sơ tuyển dụng trước.');
            navigate('/employer/recruitment-account');
            return;
        }

        if (!durationDays) {
            toast.error('Không xác định được thời lượng gói');
            return;
        }

        if (paymentMethod !== 'VNPAY') {
            toast.error('Backend hiện chỉ hỗ trợ thanh toán qua VNPAY');
            return;
        }

        try {
            setSubmitting(true);

            const response = await paymentPackage({
                employerId,
                employerEmail: user?.email,
                companyId,
                packageId: jobPackage.packageId,
                durationDays,
                amount: totalPrice,
                paymentMethod,
            });

            if (!response?.paymentUrl) {
                throw new Error('Không nhận được link thanh toán từ backend');
            }

            window.location.assign(response.paymentUrl);
        } catch (error) {
            console.error('Payment error:', error);
            const message = error?.response?.data?.message
                || error?.response?.data
                || error?.message
                || 'Không thể khởi tạo thanh toán';

            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (!jobPackage?.packageId) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Card sx={{ borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={800} mb={1}>
                            Chưa có gói để thanh toán
                        </Typography>
                        <Typography color="text.secondary" mb={3}>
                            Hãy quay lại bảng giá và chọn một gói tin trước.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/employer/pricing')} startIcon={<ArrowBackIcon />}>
                            Quay lại bảng giá
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/employer/pricing')}
                    sx={{ mb: 3, fontWeight: 700 }}
                >
                    Quay lại bảng giá
                </Button>

                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
                    <Card sx={{ borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.06)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h4" fontWeight={900} mb={1}>
                                Xác nhận thanh toán
                            </Typography>
                            <Typography color="text.secondary" mb={4}>
                                Bạn đang thanh toán trực tiếp cho 1 gói tin.
                            </Typography>

                            <div className="flex flex-col gap-4 md:flex-row md:items-start">
                                <div className="h-44 w-full overflow-hidden rounded-3xl bg-slate-100 md:w-72">
                                    {jobPackage.imageUrl ? (
                                        <img src={jobPackage.imageUrl} alt={jobPackage.name} className="h-full w-full object-contain p-3" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
                                            Không có ảnh
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="mb-3 flex items-center gap-2">
                                        <Chip label="1 gói / 1 lần thanh toán" color="secondary" variant="outlined" />
                                        {jobPackage.category && <Chip label={jobPackage.category} variant="outlined" />}
                                    </div>
                                    <Typography variant="h5" fontWeight={800} mb={1}>
                                        {jobPackage.name}
                                    </Typography>
                                    <Typography color="text.secondary" mb={3}>
                                        {jobPackage.description || 'Gói tin đã chọn từ bảng giá nhà tuyển dụng.'}
                                    </Typography>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <Typography variant="body2" color="text.secondary">Thời lượng</Typography>
                                            <Typography fontWeight={800}>{selectedDurationLabel}</Typography>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 p-4">
                                            <Typography variant="body2" color="text.secondary">Mã gói</Typography>
                                            <Typography fontWeight={800}>{jobPackage.packageId}</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.06)', height: 'fit-content' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={900} mb={3}>
                                Tóm tắt đơn hàng
                            </Typography>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Typography color="text.secondary">Gói tin</Typography>
                                    <Typography fontWeight={700}>{jobPackage.name}</Typography>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Typography color="text.secondary">Số lượng</Typography>
                                    <Typography fontWeight={700}>{state?.quantity || 1}</Typography>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Typography color="text.secondary">Thời lượng</Typography>
                                    <Typography fontWeight={700}>{selectedDurationLabel}</Typography>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Typography color="text.secondary">Đơn giá</Typography>
                                    <Typography fontWeight={700}>{formatCurrency(jobPackage.price)}</Typography>
                                </div>
                                {jobPackage.oldPrice && (
                                    <div className="flex items-center justify-between">
                                        <Typography color="text.secondary">Giá niêm yết</Typography>
                                        <Typography sx={{ textDecoration: 'line-through' }}>{formatCurrency(jobPackage.oldPrice)}</Typography>
                                    </div>
                                )}
                            </div>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" fontWeight={900} mb={2}>
                                Hình thức thanh toán
                            </Typography>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => {
                                    const isActive = paymentMethod === method.code;

                                    return (
                                        <button
                                            key={method.code}
                                            type="button"
                                            onClick={() => method.enabled && setPaymentMethod(method.code)}
                                            disabled={!method.enabled}
                                            className="w-full rounded-2xl border text-left transition-all"
                                            style={{
                                                borderColor: isActive ? method.accent : '#e2e8f0',
                                                background: method.background,
                                                boxShadow: isActive ? `0 12px 30px -18px ${method.accent}` : 'none',
                                                padding: '14px 16px',
                                                opacity: method.enabled ? 1 : 0.65,
                                                cursor: method.enabled ? 'pointer' : 'not-allowed',
                                            }}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <Typography fontWeight={900}>{method.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {method.subtitle}
                                                    </Typography>
                                                </div>
                                                <Chip
                                                    label={!method.enabled ? 'Sắp có' : isActive ? 'Đã chọn' : 'Chọn'}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 800,
                                                        color: isActive ? '#fff' : method.accent,
                                                        backgroundColor: isActive ? method.accent : '#fff',
                                                        border: `1px solid ${method.accent}`,
                                                    }}
                                                />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <Divider sx={{ my: 3 }} />

                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h6" fontWeight={900}>Tổng thanh toán</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Phương thức: {paymentMethod}
                                    </Typography>
                                </div>
                                <Typography variant="h5" fontWeight={900} color="#7c3aed">
                                    {formatCurrency(totalPrice)}
                                </Typography>
                            </div>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleConfirmPayment}
                                disabled={submitting}
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 800,
                                    backgroundColor: '#6d28d9',
                                    '&:hover': { backgroundColor: '#5b21b6' },
                                }}
                            >
                                {submitting ? 'Đang chuyển sang cổng thanh toán...' : 'Xác nhận và thanh toán'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </Box>
    );
};

export default CheckoutPage;
