'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    IconButton,
    Typography,
    Grid,
    Container,
    Box,
    Select,
    MenuItem,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import {
    InfoOutlined as InfoIcon,
    Close as CloseIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    AddShoppingCart as AddShoppingCartIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';

import { getPackage } from '../../../service/paymentService';
import { toast } from 'react-toastify';
import { useCartStore } from '../../../stores/useCartStore';
import { useUserStore } from '../../../stores/useUserStore';
import { getMarketingPackageBadge } from '../../../lib/marketingPackageLabels';

// Icons for categories
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CampaignIcon from '@mui/icons-material/Campaign';

const PricingSection = () => {
    const navigate = useNavigate();
    const isAuthenticated = useUserStore((s) => s.isAuthenticated);
    const [selectedTab, setSelectedTab] = useState('JOB_POSTING');
    const [rawPackages, setRawPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDurations, setSelectedDurations] = useState({});
    const [localQuantities, setLocalQuantities] = useState({});

    // Cart store
    const { items, addToCart, removeFromCart, clearCart } = useCartStore();

    const [openCartModal, setOpenCartModal] = useState(false);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getPackage();
                setRawPackages(data);
            } catch (error) {
                console.error("Failed to fetch packages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const categoryLabels = {
        'JOB_POSTING': 'Tin đăng tuyển dụng',
        'HIGHLIGHT': 'Gia tăng độ hiển thị',
        'EFFECT': 'Hiệu ứng nổi bật tin',
        'POINTS': 'Điểm dịch vụ',
        'BRANDING': 'Quảng bá thương hiệu'
    };

    const categoryIcons = {
        JOB_POSTING: <DescriptionIcon />,
        HIGHLIGHT: <AssessmentIcon />,
        EFFECT: <AutoAwesomeIcon />,
        POINTS: <MilitaryTechIcon />,
        BRANDING: <CampaignIcon />,
    };

    const badgeColorMap = {
        'red': 'bg-red-500',
        'yellow': 'bg-yellow-400',
        'orange': 'bg-orange-600',
    };

    const getDurationText = (days) => {
        if (days >= 28) return `${Math.floor(days / 7)} tuần`;
        if (days > 0) return `${days / 7} tuần`;
        return '1 Tuần';
    };

    const parseDurationToWeeks = (durationText) => {
        const durationValue = parseFloat(String(durationText).replace(',', '.'));
        return isNaN(durationValue) ? 1 : durationValue;
    };

    const getCalculatedPrice = (item, durationText) => {
        const baseWeeks = Math.max((item?.durationDays || 7) / 7, 1);
        const selectedWeeks = parseDurationToWeeks(durationText || getDurationText(item?.durationDays));
        const durationMultiplier = selectedWeeks / baseWeeks;
        return Math.round((item?.price || 0) * durationMultiplier);
    };

    const handleAddToCart = (id) => {
        if (!isAuthenticated) {
            navigate('/employer/login');
            return;
        }
        const item = rawPackages.find(p => p.packageId === id);
        const duration = selectedDurations[id] || '1 Tuần';
        const quantity = localQuantities[id] || 1;

        if (!item) return;

        addToCart({
            id: item.packageId,
            name: item.name,
            image: item.imageUrl,
            price: getCalculatedPrice(item, duration),
            duration: duration,
            quantity: quantity,
            category: item.category,
            jobPostLimit: item.jobPostLimit
        });

        toast.success(`Đã thêm ${item.name} vào giỏ hàng`);
    };

    const updateDuration = (id, value) => {
        setSelectedDurations((prev) => ({ ...prev, [id]: value }));
    };

    const updateLocalQuantity = (id, delta) => {
        setLocalQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta)
        }));
    };

    const handleCheckout = () => {
        if (items.length === 0) return;
        if (!isAuthenticated) {
            navigate('/employer/login');
            return;
        }
        navigate('/employer/payment');
    };

    const pricingData = Object.entries(categoryLabels).map(([key, label]) => ({
        key,
        section: label,
        items: rawPackages.filter(p => p.category === key).map(p => ({
            ...p,
            id: p.packageId,
            desc: p.description,
            image: p.imageUrl,
            duration: getDurationText(p.durationDays),
                        badge: p.badge || getMarketingPackageBadge(p.type)?.label || '',
                        badgeColor: badgeColorMap[p.badgeColor] || getMarketingPackageBadge(p.type)?.tailwindClass || 'bg-gray-500',
                        cardBorder: p.type === 'TRENDING_POST'
                            ? 'border-yellow-400'
                            : (p.type === 'URGENT_JOB_POST'
                                ? 'border-orange-500'
                                : (p.type === 'INDUSTRY_PRIORITY' ? 'border-orange-600' : '')),
        }))
    })).filter((section) => section.items.length > 0);

    const visibleCategories = pricingData.map((section) => ({
        key: section.key,
        icon: categoryIcons[section.key],
        label: section.section,
    }));

    useEffect(() => {
        if (visibleCategories.length === 0) return;
        if (!visibleCategories.some((category) => category.key === selectedTab)) {
            setSelectedTab(visibleCategories[0].key);
        }
    }, [visibleCategories, selectedTab]);

    const PricingCard = ({ item }) => {
        const selectedDuration = selectedDurations[item.id] || '1 Tuần';
        const currentQty = localQuantities[item.id] || 1;
        const calculatedPrice = getCalculatedPrice(item, selectedDuration) * currentQty;

        const isInCart = items.some(cartItem => cartItem.id === item.id && cartItem.duration === selectedDuration);

        return (
            <Card
                sx={{
                    mb: 3, borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    border: item.cardBorder ? `2px solid` : '1px solid #e5e7eb',
                    borderColor: item.cardBorder ? (item.cardBorder === 'border-yellow-400' ? '#facc15' : '#ea580c') : '#e5e7eb',
                    position: 'relative', overflow: 'visible', minHeight: '160px'
                }}
            >
                {item.badge && (
                    <div className={`absolute -top-3 left-0 ${item.badgeColor} text-white text-[10px] font-black px-3 py-1 rounded-sm shadow-md italic`}>
                        {item.badge}
                    </div>
                )}
                <div className="flex flex-col lg:flex-row items-stretch min-h-[inherit]">
                    <div
                        onClick={() => { setPreviewImage(item.image); setOpenImageModal(true); }}
                        className="w-full lg:w-48 bg-gray-50/50 flex items-center justify-center shrink-0 overflow-hidden cursor-zoom-in self-stretch p-4"
                        style={{ borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}
                    >
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-5 gap-4 items-center">
                        <div className="flex-1">
                            <div className="flex items-center gap-1 mb-1">
                                <Typography variant="h6" className="text-sm sm:text-base font-black text-gray-800">{item.name}</Typography>
                                <Tooltip title={item.desc}><InfoIcon sx={{ fontSize: 16, color: '#9ca3af', cursor: 'pointer' }} /></Tooltip>
                            </div>
                            <Typography variant="body2" className="text-gray-500 text-xs leading-relaxed">{item.desc}</Typography>
                        </div>

                        <div className="w-full lg:w-[480px] grid grid-cols-4 gap-3 items-center border-l border-gray-100 lg:pl-6">
                            <div className="flex flex-col">
                                <Typography variant="caption" className="text-gray-400 text-center mb-1 font-bold">Số lượng</Typography>
                                <div className="flex items-center justify-between border rounded-lg px-1 py-1 border-gray-200 bg-white">
                                    <IconButton size="small" onClick={() => updateLocalQuantity(item.id, -1)} disabled={isInCart}><RemoveIcon sx={{ fontSize: 16 }} /></IconButton>
                                    <span className="text-sm font-bold w-6 text-center">{currentQty}</span>
                                    <IconButton size="small" onClick={() => updateLocalQuantity(item.id, 1)} disabled={isInCart}><AddIcon sx={{ fontSize: 16 }} /></IconButton>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <Typography variant="caption" className="text-gray-400 text-center mb-1 font-bold">Thời lượng</Typography>
                                <Select
                                    size="small"
                                    value={selectedDuration}
                                    onChange={(e) => updateDuration(item.id, e.target.value)}
                                    disabled={isInCart}
                                    sx={{ borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}
                                >
                                    <MenuItem value="1 Tuần">1 Tuần</MenuItem>
                                    <MenuItem value="2 Tuần">2 Tuần</MenuItem>
                                    <MenuItem value="4 Tuần">4 Tuần</MenuItem>
                                    <MenuItem value="13 Tuần">13 Tuần</MenuItem>
                                </Select>
                            </div>

                            <div className="flex flex-col items-center">
                                <Typography variant="caption" className="text-gray-400 mb-1 font-bold">Giá bán</Typography>
                                <Typography className="text-purple-700 font-black text-base whitespace-nowrap">
                                    {calculatedPrice === 0 ? '₫ 0' : `₫ ${calculatedPrice.toLocaleString('vi-VN')}`}
                                </Typography>
                                {currentQty > 1 && item.jobPostLimit > 0 && (
                                    <Typography variant="caption" className="text-blue-600 font-bold block text-center mt-0.5" sx={{ fontSize: '0.65rem' }}>
                                        Tổng: {item.jobPostLimit * currentQty} tin ({item.jobPostLimit}x{currentQty})
                                    </Typography>
                                )}
                            </div>

                            <div className="flex items-center justify-end">
                                <Button
                                    variant="outlined"
                                    onClick={() => handleAddToCart(item.id)}
                                    disabled={isInCart}
                                    startIcon={<AddShoppingCartIcon sx={{ fontSize: 18 }} />}
                                    sx={{
                                        borderRadius: '8px', py: 1, px: 1.5, textTransform: 'none',
                                        backgroundColor: isInCart ? '#f3f4f6' : '#f9f0ff',
                                        borderColor: isInCart ? '#d1d5db' : '#722ed1',
                                        color: isInCart ? '#9ca3af' : '#722ed1',
                                        fontWeight: 700, fontSize: '0.7rem', whiteSpace: 'nowrap',
                                        '&:hover': { backgroundColor: isInCart ? '#f3f4f6' : '#722ed1', color: isInCart ? '#9ca3af' : 'white' }
                                    }}
                                >
                                    {isInCart ? 'Đã trong giỏ' : 'Thêm vào giỏ'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    if (loading) return null;

    return (
        <div className="w-full bg-[#f8fafc] min-h-screen pt-5 pl-20 pr-20 relative">
            <Container maxWidth="lg">
                <div className="text-center mb-10">
                    <Typography variant="h4" className="font-black text-gray-800 mb-2">Bảng giá linh hoạt cho Nhà tuyển dụng</Typography>
                </div>

                <Grid container spacing={2} mb={8} justifyContent="center">
                    {visibleCategories.map((cat) => (
                        <Grid item xs={6} md={2.4} key={cat.key}>
                            <div
                                onClick={() => {
                                    setSelectedTab(cat.key);
                                    const element = document.getElementById(`section-${cat.key}`);
                                    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className={`cursor-pointer h-full transition-all duration-300 transform ${selectedTab === cat.key ? 'scale-105' : 'hover:scale-102'}`}
                            >
                                <div className={`h-full p-5 text-center rounded-[20px] bg-white shadow-sm border-2 ${selectedTab === cat.key ? 'border-purple-600 shadow-xl shadow-purple-50' : 'border-transparent hover:border-gray-100'}`}>
                                    <div className={`mb-2 flex justify-center ${selectedTab === cat.key ? 'text-purple-600' : 'text-gray-400'}`}>
                                        {React.cloneElement(cat.icon, { sx: { fontSize: 28 } })}
                                    </div>
                                    <Typography className={`text-xs font-bold ${selectedTab === cat.key ? 'text-gray-900' : 'text-gray-500'}`}>{cat.label}</Typography>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>

                {pricingData.map((section) => (
                    <div key={section.key} id={`section-${section.key}`} className="mb-14 scroll-mt-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-purple-600 rounded-full"></div>
                            <Typography variant="h5" className="font-black text-gray-800 uppercase tracking-tight text-xl">{section.section}</Typography>
                        </div>
                        {section.items.map((item) => <PricingCard key={item.id} item={item} />)}
                    </div>
                ))}
                <Box sx={{ height: 120 }} />
            </Container>

            {/* Cart Footer Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[1000] py-3 px-4 sm:px-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outlined"
                            onClick={() => setOpenCartModal(true)}
                            startIcon={<AddShoppingCartIcon />}
                            endIcon={<KeyboardArrowUpIcon />}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, borderColor: '#e5e7eb', color: '#374151', px: 3 }}
                        >
                            {items.length} sản phẩm
                        </Button>
                        <Button variant="text" size="small" className="text-gray-400 hover:text-red-500 font-bold" onClick={clearCart}>Xóa giỏ hàng</Button>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Tổng giá (Chưa bao gồm thuế VAT)</span>
                            <span className="text-xl font-black text-blue-600">₫ {items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('vi-VN')}</span>
                        </div>
                        <Button
                            variant="contained"
                            onClick={handleCheckout}
                            disabled={items.length === 0}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 900, px: 6, py: 1.5, backgroundColor: '#5b21b6', '&:hover': { backgroundColor: '#4c1d95' } }}
                        >
                            Đặt hàng
                        </Button>
                    </div>
                </div>
            </div>

            {/* Cart Overview Modal */}
            <Dialog
                open={openCartModal}
                onClose={() => setOpenCartModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px', position: 'fixed', bottom: 80, left: { xs: 20, sm: 80 }, m: 0, maxHeight: '400px'
                    }
                }}
            >
                <DialogTitle className="flex justify-between items-center border-b py-3 px-4">
                    <div className="flex items-center gap-2">
                        <AddShoppingCartIcon sx={{ color: '#722ed1', fontSize: 20 }} />
                        <Typography variant="subtitle1" className="font-black text-gray-800">
                            Giỏ hàng <span className="text-gray-400 font-bold">({items.length})</span>
                        </Typography>
                    </div>
                    <IconButton size="small" onClick={() => setOpenCartModal(false)}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
                </DialogTitle>
                <DialogContent className="p-0">
                    <div className="max-h-[300px] overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <AddShoppingCartIcon sx={{ fontSize: 40, color: '#93c5fd', mb: 2 }} />
                                <Typography className="text-gray-400 font-bold text-sm">Chưa có sản phẩm</Typography>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {items.map((item, idx) => (
                                    <div key={`${item.id}-${idx}`} className="p-4 flex gap-4 items-center hover:bg-gray-50">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-gray-50 rounded" />
                                        <div className="flex-1 min-w-0">
                                            <Typography className="font-bold text-gray-800 text-sm truncate">{item.name}</Typography>
                                            <div className="flex gap-2 items-center mt-0.5">
                                                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">{item.duration} x {item.quantity}</span>
                                                <span className="text-[10px] text-purple-600 font-bold">₫ {(item.price * item.quantity).toLocaleString('vi-VN')}</span>
                                            </div>
                                        </div>
                                        <IconButton size="small" color="error" onClick={() => removeFromCart(item.id, item.duration)}>
                                            <CloseIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openImageModal} onClose={() => setOpenImageModal(false)} maxWidth="lg" PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none', overflow: 'visible' } }}>
                <Box sx={{ position: 'relative' }}>
                    <IconButton onClick={() => setOpenImageModal(false)} sx={{ position: 'absolute', top: -16, right: -16, bgcolor: '#374151', color: 'white', zIndex: 1300, border: '2px solid white' }} size="small"><CloseIcon fontSize="small" /></IconButton>
                    <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px' }} />
                </Box>
            </Dialog>
        </div>
    );
};

export default PricingSection;
