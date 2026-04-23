'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Button,
    IconButton,
    Typography,
    Chip,
    Grid,
    Container,
    Box,
    Select,
    MenuItem,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    ShoppingCart as ShoppingCartIcon,
    InfoOutlined as InfoIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

import { getPackage } from '../../../service/paymentService';

// Icons for categories
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CampaignIcon from '@mui/icons-material/Campaign';
import StarsIcon from '@mui/icons-material/Stars';
import { toast } from 'react-toastify';
import { useCartStore } from '../../../stores/useCartStore';

const PricingSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [rawPackages, setRawPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Global Cart Store
    const { 
        quantities, 
        selectedDurations, 
        addToCart: addToGlobalCart, 
        updateCartQuantity, 
        removeFromCart, 
        clearCart 
    } = useCartStore();

    // Modal states
    const [openUrgentModal, setOpenUrgentModal] = useState(false);
    const [openPointsModal, setOpenPointsModal] = useState(false);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [openCartModal, setOpenCartModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const banners = [
        { id: 1, title: 'GIỮ LỬA TIN ĐĂNG', subtitle: 'MÙNG ĐẠI LỄ', bg: 'bg-gradient-to-r from-red-700 via-red-800 to-red-900', year: '2026' },
        { id: 2, title: 'Ưu đãi đặc biệt', subtitle: 'Gói giải pháp', year: '2026', bg: 'bg-[#f3e5f5]' },
    ];

    const categories = [
        { icon: <DescriptionIcon />, label: 'Tin đăng tuyển dụng' },
        { icon: <AssessmentIcon />, label: 'Gia tăng độ hiển thị' },
        { icon: <AutoAwesomeIcon />, label: 'Hiệu ứng nổi bật tin' },
        { icon: <MilitaryTechIcon />, label: 'Điểm dịch vụ' },
        { icon: <CampaignIcon />, label: 'Quảng bá thương hiệu' },
    ];

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await getPackage();
                setRawPackages(data);
                
                // Initialize local quantities to 1 for all packages
                const initialLocals = {};
                data.forEach(p => {
                    initialLocals[p.packageId] = 1;
                });
                setLocalQuantities(initialLocals);
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

    const badgeColorMap = {
        'red': 'bg-red-500',
        'yellow': 'bg-yellow-400',
        'orange': 'bg-orange-600',
    };

    const boxTypeLabels = {
        'TRANG_CHU': 'Trang chủ',
        'TUYEN_GAP': 'Tuyển gấp',
        'UU_TIEN': 'Ưu tiên',
        'NGANH': 'Trang ngành'
    };

    const getDurationText = (days) => {
        if (days >= 28) return `${Math.floor(days / 7)} tuần`;
        if (days > 0) return `${days / 7} tuần`;
        return 'Chọn thời lượng';
    };

    const pricingData = Object.entries(categoryLabels).map(([key, label]) => ({
        section: label,
        items: rawPackages.filter(p => p.category === key).map(p => ({
            ...p,
            id: p.packageId,
            desc: p.description,
            image: p.imageUrl,
            duration: getDurationText(p.durationDays),
            badgeColor: badgeColorMap[p.badgeColor] || 'bg-gray-500',
            cardBorder: p.type === 'TRENDING_POST' ? 'border-yellow-400' : (p.type === 'INDUSTRY_PRIORITY' ? 'border-orange-600' : ''),
            isLargeThumbnail: p.category === 'POINTS'
        }))
    }));


    const [localQuantities, setLocalQuantities] = useState({});

    const updateLocalQuantity = (id, delta) => {
        setLocalQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta)
        }));
    };

    const addToCart = (id) => {
        const qty = localQuantities[id] || 1;
        const item = rawPackages.find(p => p.packageId === id);
        const duration = selectedDurations[id] || getDurationText(item?.durationDays);

        addToGlobalCart(id, qty, duration);
        toast.success(`Đã thêm ${qty} ${item?.name} vào giỏ hàng`);

        // Reset local quantity to 1 after adding to cart
        setLocalQuantities(prev => ({ ...prev, [id]: 1 }));
    };

    const updateDuration = (id, value) => {
        // We still use useCartStore's set logic but it's handled via addToGlobalCart or we can add a specific action
        // For convenience in the UI, we'll use a local state for the UI dropdown, 
        // and only commit the duration when clicking 'Add to Cart' OR update the store directly.
        // Actually, let's keep selectedDurations in the store.
        useCartStore.setState((state) => ({
            selectedDurations: {
                ...state.selectedDurations,
                [id]: value
            }
        }));
    };

    const handleCheckout = () => {
        const cartItems = Object.entries(quantities)
            .filter(([_, q]) => q > 0)
            .map(([id, q]) => {
                const item = rawPackages.find(p => p.packageId === id);
                return {
                    id,
                    name: item?.name,
                    quantity: q,
                    duration: selectedDurations[id] || getDurationText(item?.durationDays),
                    price: item?.price
                };
            });

        if (cartItems.length === 0) {
            toast.error("Vui lòng chọn sản phẩm vào giỏ hàng!");
            return;
        }

        console.log("Submitting order:", cartItems);
        toast.success("Đã gửi đơn hàng thành công!");
        // Reset quantities after order
        clearCart();
    };

    const PricingCard = ({ item }) => (
        <Card
            sx={{
                mb: 3,
                borderRadius: '12px',
                boxShadow: localQuantities[item.id] > 0 ? '0 10px 15px -3px rgb(147 51 234 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                border: item.cardBorder ? `2px solid` : '1px solid #e5e7eb',
                borderColor: item.cardBorder ? (item.cardBorder === 'border-yellow-400' ? '#facc15' : '#ea580c') : '#e5e7eb',
                position: 'relative',
                overflow: 'visible',
                transition: 'all 0.3s',
                minHeight: '180px'
            }}
        >
            {item.badge && (
                <div className={`absolute -top-3 left-0 ${item.badgeColor} text-white text-[10px] font-black px-3 py-1 rounded-sm shadow-md italic`}>
                    {item.badge}
                </div>
            )}
            <div className="flex flex-col lg:flex-row items-stretch min-h-[inherit]">
                {/* Left Side: Image - Full Height */}
                <div
                    onClick={() => { setPreviewImage(item.image); setOpenImageModal(true); }}
                    className="w-full lg:w-56 bg-gray-50/50 flex items-center justify-center shrink-0 overflow-hidden cursor-zoom-in hover:opacity-95 transition-opacity self-stretch"
                    style={{
                        borderTopLeftRadius: '12px',
                        borderBottomLeftRadius: '12px'
                    }}
                >
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                </div>

                <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-6 items-stretch">
                    {/* Middle: Content */}
                    <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                            <Typography variant="h6" className="text-sm sm:text-base font-black text-gray-800">
                                {item.name}
                            </Typography>
                            <Tooltip title={item.desc}>
                                <InfoIcon sx={{ fontSize: 16, color: '#9ca3af', cursor: 'pointer' }} />
                            </Tooltip>
                            {item.showDetails && (
                                <button
                                    onClick={() => setOpenUrgentModal(true)}
                                    className="text-[10px] font-bold text-blue-500 hover:underline ml-2"
                                >
                                    Tìm hiểu thêm
                                </button>
                            )}
                        </div>
                        <Typography variant="body2" className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                            {item.desc}
                        </Typography>

                        {item.allowedBoxTypes && item.allowedBoxTypes.length > 0 && (
                            <div className="mt-4">
                                <Typography variant="caption" className="text-gray-400 block mb-1">Vị trí hiển thị (Box tin)</Typography>
                                {item.allowedBoxTypes.length === 1 ? (
                                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
                                        {boxTypeLabels[item.allowedBoxTypes[0]] || item.allowedBoxTypes[0]}
                                    </div>
                                ) : (
                                    <Select size="small" fullWidth defaultValue={item.allowedBoxTypes[0]} sx={{ borderRadius: '8px', fontSize: '0.8rem', maxWidth: '200px' }}>
                                        {item.allowedBoxTypes.map(type => (
                                            <MenuItem key={type} value={type}>
                                                {boxTypeLabels[type] || type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Pricing Table Style */}
                    <div className="w-full lg:w-[380px] grid grid-cols-3 gap-2 sm:gap-4 items-center border-l border-gray-100 lg:pl-6">
                        {/* Quantity */}
                        <div className="flex flex-col">
                            <Typography variant="caption" className="text-gray-400 text-center mb-1">Số lượng</Typography>
                            <div className="flex items-center justify-center border rounded-lg px-1 border-gray-200 bg-white">
                                <IconButton size="small" onClick={() => updateLocalQuantity(item.id, -1)} disabled={(localQuantities[item.id] || 1) <= 1}>
                                    <RemoveIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                                <span className={`mx-2 text-sm font-bold min-w-[20px] text-center ${localQuantities[item.id] > 0 ? 'text-purple-600' : 'text-gray-700'}`}>
                                    {localQuantities[item.id] || 1}
                                </span>
                                <IconButton size="small" onClick={() => updateLocalQuantity(item.id, 1)}>
                                    <AddIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="flex flex-col">
                            <Typography variant="caption" className="text-gray-400 text-center mb-1">Thời lượng</Typography>
                            <Select
                                size="small"
                                value={selectedDurations[item.id] || item.duration}
                                onChange={(e) => updateDuration(item.id, e.target.value)}
                                disabled={item.name.includes('Tin cơ bản')}
                                sx={{
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    '&.Mui-disabled': {
                                        backgroundColor: '#f3f4f6',
                                        color: '#374151',
                                        WebkitTextFillColor: '#374151'
                                    }
                                }}
                            >
                                {/* Base value */}
                                <MenuItem value={item.duration}>{item.duration}</MenuItem>

                                {/* Additional options for non-fixed packages */}
                                {!item.name.includes('Tin cơ bản') &&
                                    ['2 tuần', '4 tuần', '13 tuần']
                                        .filter(d => d !== item.duration)
                                        .map(d => (
                                            <MenuItem key={d} value={d}>{d}</MenuItem>
                                        ))
                                }
                            </Select>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-end">
                            <Typography variant="caption" className="text-gray-400 mb-1">Giá bán</Typography>
                            {item.oldPrice && (
                                <Typography variant="caption" className="text-gray-400 line-through text-[10px]">
                                    ₫ {(item.oldPrice * Math.max(1, localQuantities[item.id] || 0)).toLocaleString('vi-VN')}
                                </Typography>
                            )}
                            <Typography className="text-purple-700 font-black text-base sm:text-lg">
                                {item.price === 0 ? '₫ 0' : `₫ ${(item.price * Math.max(1, localQuantities[item.id] || 0)).toLocaleString('vi-VN')}`}
                            </Typography>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="flex items-center justify-end lg:pl-4">
                        <Button
                            variant="outlined"
                            onClick={() => addToCart(item.id)}
                            disabled={(localQuantities[item.id] || 0) === 0}
                            startIcon={<ShoppingCartIcon />}
                            className={`${(localQuantities[item.id] || 0) > 0 ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200' : 'bg-purple-50 text-purple-700 border-purple-200'} font-black text-xs capitalize whitespace-nowrap py-2.5 px-5 rounded-xl transition-all active:scale-95`}
                        >
                            Thêm vào giỏ
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <Typography className="text-gray-500 font-bold">Đang tải bảng giá...</Typography>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#f8fafc] min-h-screen pt-5 pl-20 pr-20">
            {/* Banner Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className={`relative ${banners[currentSlide].bg} rounded-[32px] p-10 md:p-16 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10 text-center md:text-left flex-1 py-4">
                        <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/20">
                            <span className="text-yellow-400 font-black text-xs tracking-widest uppercase">Thông báo nghỉ lễ</span>
                        </div>
                        <h2 className="text-4xl sm:text-7xl font-black text-white mb-2 leading-none">
                            {banners[currentSlide].title}
                        </h2>
                        <h3 className="text-3xl sm:text-5xl font-black text-yellow-400 mb-6 italic">
                            {banners[currentSlide].subtitle}
                        </h3>
                        <div className="flex gap-4">
                            <button className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 shadow-blue-900/50">
                                Thông tin chi tiết
                            </button>
                        </div>
                    </div>
                    <div className="relative z-10 w-full md:w-1/2 flex justify-end">
                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-[40px] border border-white/10 shadow-2xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-4 rounded-2xl text-center">
                                    <Typography className="text-[10px] text-white/60 font-bold uppercase">Lễ Giỗ Tổ Hùng Vương</Typography>
                                    <Typography className="text-sm text-yellow-400 font-black">25.04 đến 27.04</Typography>
                                </div>
                                <div className="bg-white/10 p-4 rounded-2xl text-center">
                                    <Typography className="text-[10px] text-white/60 font-bold uppercase">Ngày Chiến thắng & Quốc tế LĐ</Typography>
                                    <Typography className="text-sm text-yellow-400 font-black">30.04 đến 05.05</Typography>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, i) => (
                            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === currentSlide ? 'bg-blue-600 w-6' : 'bg-blue-200'} transition-all`} />
                        ))}
                    </div>
                </div>
            </div>

            <Container maxWidth="lg">
                <div className="text-center mb-12">
                    <Typography variant="h4" className="font-black text-gray-800 mb-2">Bảng giá linh hoạt cho Nhà tuyển dụng</Typography>
                    <Typography className="text-gray-500 italic text-sm">Lưu ý: Bạn cần đăng nhập để thực hiện giao dịch</Typography>
                </div>

                {/* Category Navigation */}
                <Grid container spacing={2} mb={10} justifyContent="center">
                    {categories.map((cat, i) => (
                        <Grid item xs={6} md={2.4} key={i}>
                            <div
                                onClick={() => {
                                    setSelectedTab(i);
                                    const sectionId = `section-${i}`;
                                    const element = document.getElementById(sectionId);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                                className={`cursor-pointer h-full transition-all duration-300 transform ${selectedTab === i ? 'scale-105' : 'hover:scale-102'}`}
                            >
                                <div className={`h-full p-6 text-center rounded-[20px] bg-white shadow-sm border-2 ${selectedTab === i ? 'border-purple-600 shadow-xl shadow-purple-50' : 'border-transparent hover:border-gray-100'}`}>
                                    <div className={`mb-3 flex justify-center ${selectedTab === i ? 'text-purple-600' : 'text-gray-400'}`}>
                                        {React.cloneElement(cat.icon, { sx: { fontSize: 32 } })}
                                    </div>
                                    <Typography className={`text-xs sm:text-sm font-bold ${selectedTab === i ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {cat.label}
                                    </Typography>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>

                {/* Content Sections */}
                {pricingData.map((section, sIndex) => (
                    <div key={sIndex} id={`section-${sIndex}`} className="mb-16 scroll-mt-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-purple-600 rounded-full"></div>
                                <Typography variant="h5" className="font-black text-gray-800 uppercase tracking-tight text-xl">{section.section}</Typography>
                            </div>
                            {section.section === 'Điểm dịch vụ' && (
                                <button
                                    onClick={() => setOpenPointsModal(true)}
                                    className="text-blue-600 font-bold text-xs hover:underline decoration-2 underline-offset-4"
                                >
                                    Mức quy đổi điểm
                                </button>
                            )}
                        </div>
                        {section.items.map((item) => (
                            <PricingCard key={item.id} item={item} />
                        ))}
                    </div>
                ))}
            </Container>

            {/* Tuyển nhanh Modal */}
            <Dialog
                open={openUrgentModal}
                onClose={() => setOpenUrgentModal(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: '24px' } }}
            >
                <DialogTitle className="flex justify-between items-center bg-gray-50 border-b p-6">
                    <Typography variant="h6" className="font-black">Tuyển nhanh</Typography>
                    <IconButton onClick={() => setOpenUrgentModal(false)}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="bg-[#fdf2f2] p-4 rounded-2xl mb-6">
                                <div className="flex items-center gap-2 text-red-600 font-black mb-3">
                                    <StarsIcon fontSize="small" /> Việc đi làm ngay
                                </div>
                                <img src="https://via.placeholder.com/400x250?text=Job+Preview" className="w-full rounded-xl shadow-lg border-2 border-white" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-gray-400 text-xs font-black uppercase mb-3">Lợi ích & Phạm vi</h4>
                                <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm">
                                    <span className="text-gray-500">Thời gian hiệu lực</span><span className="font-bold">7 ngày</span>
                                    <span className="text-gray-500">Quyền lợi</span><span className="font-bold text-red-600">Gắn nhãn "Tuyển nhanh", tăng uy tín, dễ ứng tuyển</span>
                                    <span className="text-gray-500">Thông báo việc làm</span><span>Sẽ gửi tới ứng viên phù hợp (Email/App)</span>
                                    <span className="text-gray-500">Cấp bậc</span><span>Nhân viên, Cộng tác viên</span>
                                    <span className="text-gray-500">Địa điểm</span><span>Hà Nội, TP.HCM, Bình Dương</span>
                                    <span className="text-gray-500">Bảo hành</span><span className="text-green-600 font-bold">Có bảo hành</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Service Points Modal */}
            <Dialog
                open={openPointsModal}
                onClose={() => setOpenPointsModal(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: '24px' } }}
            >
                <DialogTitle className="flex justify-between items-center p-6 text-center">
                    <div className="w-full text-center font-black text-xl">Chi tiết mức quy đổi điểm</div>
                    <IconButton onClick={() => setOpenPointsModal(false)} className="absolute right-4"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent className="p-0">
                    <TableContainer component={Box} className="p-4 sm:p-8">
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#722ed1' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 900 }}>Sản phẩm</TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 900 }}>Số lượng</TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 900 }}>Thời gian hiển thị</TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 900 }}>Số điểm để quy đổi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow sx={{ backgroundColor: '#f9f0ff' }}>
                                    <TableCell colSpan={4} sx={{ fontWeight: 900, color: '#722ed1' }}>Gói đăng tin tuyển dụng</TableCell>
                                </TableRow>
                                <TableRow><TableCell>Combo giải pháp "Tiết kiệm"</TableCell><TableCell align="center">1 Tin</TableCell><TableCell align="center">4 tuần</TableCell><TableCell align="center">0</TableCell></TableRow>
                                <TableRow><TableCell>Combo giải pháp "Tuyển dụng nhanh"</TableCell><TableCell align="center">1 Tin</TableCell><TableCell align="center">4 tuần</TableCell><TableCell align="center">0</TableCell></TableRow>

                                <TableRow sx={{ backgroundColor: '#f9f0ff' }}>
                                    <TableCell colSpan={4} sx={{ fontWeight: 900, color: '#722ed1' }}>Gói lẻ (Hiệu ứng nổi bật) hiển thị tại trang chủ</TableCell>
                                </TableRow>
                                <TableRow><TableCell>Hiệu ứng Hot</TableCell><TableCell align="center">1 Tin</TableCell><TableCell align="center">1 ngày</TableCell><TableCell align="center" className="text-purple-600 font-bold">3</TableCell></TableRow>
                                <TableRow><TableCell>Hiệu ứng đỏ đậm</TableCell><TableCell align="center">1 Tin</TableCell><TableCell align="center">1 ngày</TableCell><TableCell align="center" className="text-purple-600 font-bold">5</TableCell></TableRow>
                                <TableRow><TableCell>Hiệu ứng đóng khung</TableCell><TableCell align="center">1 Tin</TableCell><TableCell align="center">1 ngày</TableCell><TableCell align="center" className="text-purple-600 font-bold">6</TableCell></TableRow>

                                <TableRow sx={{ backgroundColor: '#f9f0ff' }}>
                                    <TableCell colSpan={4} sx={{ fontWeight: 900, color: '#722ed1' }}>Gói lẻ (Hiệu ứng nổi bật) hiển thị tại Trang Ngành</TableCell>
                                </TableRow>
                                <TableRow><TableCell>Hiệu ứng Hot</TableCell><TableCell align="center">1 Tin</TableCell><TableCell align="center">1 ngày</TableCell><TableCell align="center" className="text-purple-600 font-bold">1</TableCell></TableRow>
                                <TableRow><TableCell>Hiệu ứng đỏ đậm</TableCell><TableCell align="center">1 Tin</TableCell><TableCell align="center">1 ngày</TableCell><TableCell align="center" className="text-purple-600 font-bold">2</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>

            {/* Image Preview Modal */}
            <Dialog
                open={openImageModal}
                onClose={() => setOpenImageModal(false)}
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'visible', // Crucial to prevent clipping
                    }
                }}
            >
                <Box sx={{ position: 'relative', p: 0, m: 0 }}>
                    <IconButton
                        onClick={() => setOpenImageModal(false)}
                        sx={{
                            position: 'absolute',
                            top: -16,
                            right: -16,
                            bgcolor: '#374151', // Dark grey/black
                            color: 'white',
                            '&:hover': { bgcolor: '#1f2937' },
                            zIndex: 1300,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            border: '2px solid white'
                        }}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '90vh',
                            display: 'block',
                            borderRadius: '12px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                        }}
                    />
                </Box>
            </Dialog>

            {/* Cart Modal */}
            <Dialog
                open={openCartModal}
                onClose={() => setOpenCartModal(false)}
                PaperProps={{ 
                    sx: { 
                        borderRadius: '24px', 
                        p: 0,
                        position: 'fixed',
                        bottom: 90,
                        left: 40,
                        margin: 0,
                        width: '400px',
                        maxWidth: 'calc(100vw - 80px)',
                        boxShadow: '0 10px 40px -1px rgba(0,0,0,0.2)',
                    } 
                }}
                sx={{
                    '& .MuiDialog-container': {
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                    },
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <DialogTitle className="flex justify-between items-center bg-gray-50/50 border-b p-4 px-6">
                    <div className="flex items-center gap-2">
                        <ShoppingCartIcon className="text-purple-600" />
                        <Typography className="font-black text-gray-800">
                            Giỏ hàng ({Object.values(quantities).reduce((a, b) => a + b, 0)})
                        </Typography>
                    </div>
                    <IconButton onClick={() => setOpenCartModal(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className="p-0">
                    <div className="min-h-[300px] flex flex-col items-center justify-center p-8">
                        {Object.values(quantities).reduce((a, b) => a + b, 0) === 0 ? (
                            <div className="text-center">
                                <Box className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 p-6 overflow-hidden">
                                    <ShoppingCartIcon sx={{ fontSize: 64, color: '#bfdbfe' }} />
                                </Box>
                                <Typography className="text-gray-400 font-bold">Chưa có sản phẩm</Typography>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="max-h-[400px] overflow-y-auto">
                                    {Object.entries(quantities).map(([id, q]) => {
                                        if (q === 0) return null;
                                        const item = rawPackages.find(p => p.packageId === id);
                                        if (!item) return null;
                                        return (
                                            <div key={id} className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <Typography className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{item.name}</Typography>
                                                        <Typography className="text-purple-600 font-black text-xs">₫ {item.price.toLocaleString('vi-VN')}</Typography>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border rounded-lg px-1 bg-white">
                                                        <IconButton size="small" onClick={() => updateCartQuantity(id, -1)} disabled={q <= 1}><RemoveIcon sx={{ fontSize: 12 }} /></IconButton>
                                                        <span className="mx-2 text-xs font-bold text-purple-600">{q}</span>
                                                        <IconButton size="small" onClick={() => updateCartQuantity(id, 1)}><AddIcon sx={{ fontSize: 12 }} /></IconButton>
                                                    </div>
                                                    <IconButton size="small" color="error" onClick={() => removeFromCart(id)}>
                                                        <CloseIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-6 bg-purple-50 flex items-center justify-between">
                                    <Typography className="font-bold text-gray-600 text-sm italic">Tổng cộng</Typography>
                                    <Typography className="font-black text-purple-700 text-xl">
                                        ₫ {Object.entries(quantities).reduce((acc, [id, q]) => {
                                            const item = rawPackages.find(p => p.packageId === id);
                                            return acc + (item ? item.price * q : 0);
                                        }, 0).toLocaleString('vi-VN')}
                                    </Typography>
                                </div>
                                <div className="p-4 flex justify-center">
                                    <Button
                                        variant="contained"
                                        onClick={() => setOpenCartModal(false)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl px-8"
                                    >
                                        Tiếp tục mua hàng
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Bottom Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)] px-6 py-4 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outlined"
                            onClick={() => setOpenCartModal(true)}
                            className="text-purple-700 border-purple-200 rounded-xl px-6 py-2 font-black text-xs capitalize shadow-sm hover:bg-purple-50"
                            startIcon={<ShoppingCartIcon />}
                            endIcon={<Typography component="span" sx={{ fontSize: 10, ml: 1, color: '#9333ea' }}>{Object.values(quantities).reduce((a, b) => a + b, 0) > 0 ? '▼' : '▲'}</Typography>}
                        >
                            {Object.values(quantities).reduce((a, b) => a + b, 0)} sản phẩm
                        </Button>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Tổng giá (Chưa bao gồm thuế VAT)</div>
                            <div className="text-purple-700 font-black text-2xl">
                                ₫ {Object.entries(quantities).reduce((acc, [id, q]) => {
                                    const item = rawPackages.find(p => p.packageId === id);
                                    return acc + (item ? item.price * q : 0);
                                }, 0).toLocaleString('vi-VN')}
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            onClick={handleCheckout}
                            className="bg-purple-700 hover:bg-purple-800 text-white font-black px-12 py-3.5 rounded-2xl shadow-xl shadow-purple-200 capitalize tracking-wide transition-all transform active:scale-95"
                        >
                            Đặt hàng →
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingSection;

