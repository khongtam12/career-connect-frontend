import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Container, Divider, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toast } from 'react-toastify';
import { paymentPackage } from '../../../service/paymentService';
import { useUserStore } from '../../../stores/useUserStore';
import { useCartStore } from '../../../stores/useCartStore';

const formatCurrency = (value) => `₫ ${Number(value || 0).toLocaleString('vi-VN')}`;

const CheckoutPage = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const { items, removeFromCart, clearCart } = useCartStore();
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');
    const [submitting, setSubmitting] = useState(false);

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
        }
    ]), []);

    const parseDurationToDays = (durationText) => {
        const val = parseFloat(String(durationText).replace(',', '.'));
        return isNaN(val) ? 7 : Math.round(val * 7);
    };

    const handleConfirmPayment = async () => {
        if (items.length === 0) {
            toast.error('Giỏ hàng trống');
            return;
        }

        if (!employerId) {
            toast.error('Bạn cần đăng nhập để thanh toán');
            return;
        }

        if (!companyId) {
            toast.error('Chưa có hồ sơ công ty');
            navigate('/employer/recruitment-account');
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                employerId,
                employerEmail: user?.email,
                companyId,
                amount: totalPrice,
                paymentMethod,
                items: items.map(item => ({
                    packageId: item.id,
                    packageName: item.name,
                    amount: item.price * item.quantity,
                    durationDays: parseDurationToDays(item.duration),
                    quantity: item.quantity
                }))
            };

            const response = await paymentPackage(payload);

            if (!response?.paymentUrl) {
                throw new Error('Không nhận được link thanh toán từ hệ thống');
            }

            window.location.assign(response.paymentUrl);
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error?.response?.data?.message || 'Lỗi thanh toán');
        } finally {
            setSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Card sx={{ borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight={800} mb={2}>Giỏ hàng của bạn đang trống</Typography>
                        <Button variant="contained" onClick={() => navigate('/employer/pricing')} startIcon={<ArrowBackIcon />}>Về trang bảng giá</Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate('/employer/pricing')} sx={{ mb: 3, fontWeight: 700 }}>Bảng giá</Button>

                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <div className="space-y-4">
                        <Typography variant="h4" fontWeight={900}>Xác nhận thanh toán</Typography>
                        <Typography color="text.secondary">Kiểm tra lại các gói tin trong giỏ hàng của bạn.</Typography>
                        
                        {items.map((item, idx) => (
                            <Card key={`${item.id}-${idx}`} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                                <CardContent sx={{ p: 3, display: 'flex', gap: 3, alignItems: 'center' }}>
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-2" />
                                    <div className="flex-1">
                                        <Typography variant="h6" fontWeight={800}>{item.name}</Typography>
                                        <div className="flex gap-2 items-center mt-1">
                                            <Chip label={`${item.quantity} suất`} size="small" className="bg-blue-50 text-blue-700 font-bold" />
                                            <Chip label={item.duration} size="small" variant="outlined" />
                                            <Chip 
                                                label={item.jobPostLimit > 0 ? `${item.jobPostLimit} tin đăng` : 'Không giới hạn tin'} 
                                                size="small" 
                                                variant="outlined" 
                                                className="bg-purple-50 text-purple-700 font-bold border-purple-100" 
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Typography fontWeight={900} color="primary">{formatCurrency(item.price * item.quantity)}</Typography>
                                        <IconButton size="small" color="error" onClick={() => removeFromCart(item.id, item.duration)} sx={{ mt: 1 }}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card sx={{ borderRadius: 4, border: '1px solid #e5e7eb', height: 'fit-content', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={900} mb={3}>Tóm tắt đơn hàng</Typography>
                            <div className="space-y-3">
                                <div className="flex justify-between"><Typography color="text.secondary">Số lượng gói</Typography><Typography fontWeight={700}>{items.length}</Typography></div>
                                <div className="flex justify-between"><Typography color="text.secondary">Tạm tính</Typography><Typography fontWeight={700}>{formatCurrency(totalPrice)}</Typography></div>
                            </div>
                            <Divider sx={{ my: 3 }} />
                            
                            <Typography variant="h6" fontWeight={900} mb={2}>Thanh toán qua</Typography>
                            {paymentMethods.map((method) => {
                                const isActive = paymentMethod === method.code;
                                return (
                                    <button
                                        key={method.code}
                                        onClick={() => method.enabled && setPaymentMethod(method.code)}
                                        className={`w-full p-4 mb-3 rounded-2xl border text-left transition-all ${isActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'}`}
                                        disabled={!method.enabled}
                                        style={{ opacity: method.enabled ? 1 : 0.5 }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div><Typography fontWeight={900}>{method.title}</Typography><Typography variant="body2" color="text.secondary">{method.subtitle}</Typography></div>
                                            <Chip label={isActive ? 'Đã chọn' : 'Chọn'} size="small" color={isActive ? 'primary' : 'default'} />
                                        </div>
                                    </button>
                                );
                            })}
                            <Divider sx={{ my: 3 }} />
                            <div className="flex justify-between items-end">
                                <div><Typography variant="h6" fontWeight={900}>Tổng cộng</Typography><Typography variant="caption" color="text.secondary">Đã bao gồm VAT (nếu có)</Typography></div>
                                <Typography variant="h5" fontWeight={900} color="primary">{formatCurrency(totalPrice)}</Typography>
                            </div>
                            <Button fullWidth variant="contained" size="large" onClick={handleConfirmPayment} disabled={submitting} sx={{ mt: 4, py: 1.5, borderRadius: 3, fontWeight: 900, backgroundColor: '#5b21b6' }}>
                                {submitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </Box>
    );
};

export default CheckoutPage;
