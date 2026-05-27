import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    IconButton,
    Tooltip,
    Alert,
} from '@mui/material';
import {
    FiBox, FiCalendar, FiClock, FiSearch, FiXCircle,
    FiRefreshCw, FiShoppingCart, FiChevronRight, FiX,
    FiCheckCircle, FiAlertTriangle, FiFileText,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../../stores/useUserStore';
import { 
    getCompanySubscriptions, 
    getCompanyMarketingEntitlements,
    getActiveMarketingAssignment 
} from '../../../service/companyService';
import { getPackage } from '../../../service/paymentService';
import { 
    applyCompanyMarketingPackage, 
    removeCompanyMarketingPackage 
} from '../../../service/jobService';
import { toast } from 'react-toastify';

// Category config — đồng bộ với PricingSection.jsx
const categoryLabels = {
    JOB_POSTING: 'Tin đăng tuyển dụng',
    HIGHLIGHT: 'Gia tăng độ hiển thị',
    EFFECT: 'Hiệu ứng nổi bật tin',
    POINTS: 'Điểm dịch vụ',
    BRANDING: 'Quảng bá thương hiệu',
};

const categoryColors = {
    JOB_POSTING: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', chipBg: '#eff6ff', chipColor: '#1d4ed8' },
    HIGHLIGHT: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', chipBg: '#fffbeb', chipColor: '#b45309' },
    EFFECT: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', chipBg: '#faf5ff', chipColor: '#7e22ce' },
    POINTS: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', chipBg: '#ecfdf5', chipColor: '#047857' },
    BRANDING: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', chipBg: '#fff1f2', chipColor: '#be123c' },
};

const statusConfig = {
    ACTIVE: { label: 'Đang hoạt động', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    EXPIRED: { label: 'Đã hết hạn', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
};

const TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'ACTIVE', label: 'Đang hoạt động' },
    { key: 'EXPIRED', label: 'Đã hết hạn' },
];

export default function EmployerServices() {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const companyId = user?.companyId;

    const [subscriptions, setSubscriptions] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [activeBrandingAssignment, setActiveBrandingAssignment] = useState(null);
    const [brandingActionLoading, setBrandingActionLoading] = useState(false);

    // Fetch data
    const fetchData = useCallback(async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            const [subs, entitlements] = await Promise.all([
                getCompanySubscriptions(companyId),
                getCompanyMarketingEntitlements(companyId)
            ]);
            
            // Convert entitlements to match subscription format for display
            const mappedEntitlements = (entitlements || []).map(ent => ({
                id: ent.id,
                packageId: ent.packageId,
                packageLabel: ent.packageLabel,
                packageCategory: ent.packageCategory,
                status: ent.status,
                startDate: ent.startDate,
                endDate: ent.endDate,
                // These fields are specific to entitlements but we map them to sub format
                jobPostLimit: ent.usageLimit,
                jobPostedCount: ent.usedCount,
                isMarketingEntitlement: true,
                durationDays: ent.durationDays,
                entitlementId: ent.id // Store for reference
            }));

            // Filter out existing subs if they also appear as entitlements (to avoid duplicates)
            // But usually they are separate types. We combine them.
            setSubscriptions([...subs, ...mappedEntitlements]);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu dịch vụ:', err);
        } finally {
            setLoading(false);
        }
    }, [companyId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Build package lookup map
    const packageMap = useMemo(() => {
        const map = new Map();
        (packages || []).forEach((pkg) => {
            map.set(pkg.packageId, pkg);
        });
        return map;
    }, [packages]);

    // Enrich subscriptions with package info
    const enrichedSubscriptions = useMemo(() => {
        return (subscriptions || []).map((sub) => {
            const pkg = packageMap.get(sub.packageId);
            return {
                ...sub,
                imageUrl: pkg?.imageUrl || null,
                description: pkg?.description || '',
                price: pkg?.price || 0,
                packageName: pkg?.name || sub.packageLabel || sub.packageId,
                daysRemaining: getDaysRemaining(sub.endDate),
            };
        });
    }, [subscriptions, packageMap]);

    // Filtered subscriptions
    const filteredSubscriptions = useMemo(() => {
        let result = [...enrichedSubscriptions];

        // Tab filter
        if (activeTab !== 'all') {
            result = result.filter((sub) =>
                String(sub.status || '').toUpperCase() === activeTab
            );
        }

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            result = result.filter(
                (sub) =>
                    (sub.packageName || '').toLowerCase().includes(q) ||
                    (sub.packageLabel || '').toLowerCase().includes(q) ||
                    (sub.description || '').toLowerCase().includes(q)
            );
        }

        // Sort: ACTIVE first, then by endDate desc
        result.sort((a, b) => {
            const aActive = String(a.status).toUpperCase() === 'ACTIVE' ? 0 : 1;
            const bActive = String(b.status).toUpperCase() === 'ACTIVE' ? 0 : 1;
            if (aActive !== bActive) return aActive - bActive;
            return new Date(b.endDate || 0) - new Date(a.endDate || 0);
        });

        return result;
    }, [enrichedSubscriptions, activeTab, searchQuery]);

    // Stats
    const stats = useMemo(() => {
        const active = enrichedSubscriptions.filter(
            (sub) => String(sub.status).toUpperCase() === 'ACTIVE'
        );
        const expiringSoon = active.filter(
            (sub) => sub.daysRemaining !== null && sub.daysRemaining <= 7 && sub.daysRemaining >= 0
        );
        const totalPostsRemaining = active.reduce((sum, sub) => {
            const remaining = Math.max((sub.jobPostLimit || 0) - (sub.jobPostedCount || 0), 0);
            return sum + remaining;
        }, 0);

        return {
            activeCount: active.length,
            expiringSoonCount: expiringSoon.length,
            totalPostsRemaining,
            totalCount: enrichedSubscriptions.length,
        };
    }, [enrichedSubscriptions]);

    // Open detail drawer
    const handleViewDetail = async (sub) => {
        setSelectedSubscription(sub);
        if (sub.packageCategory === 'BRANDING') {
            try {
                const active = await getActiveMarketingAssignment(companyId, 'COMPANY', companyId);
                setActiveBrandingAssignment(active);
            } catch (err) {
                console.error('Lỗi khi tải trạng thái branding:', err);
                setActiveBrandingAssignment(null);
            }
        }
    };

    const handleApplyBranding = async (sub) => {
        setBrandingActionLoading(true);
        try {
            let entitlementId = sub.entitlementId;

            if (!entitlementId) {
                // If it's a regular subscription, try to find an entitlement that matches its ID or payment ID
                const entitlements = await getCompanyMarketingEntitlements(companyId, 'BRANDING');
                // Note: In some systems, they might be linked by paymentId or packageId + startDate
                const entitlement = (entitlements || []).find(e => 
                    e.subscriptionId === sub.id || e.paymentId === sub.paymentId || (e.packageId === sub.packageId && e.startDate === sub.startDate)
                );
                entitlementId = entitlement?.id;
            }
            
            if (!entitlementId) {
                toast.error('Không tìm thấy quyền lợi tương ứng cho gói này.');
                return;
            }

            await applyCompanyMarketingPackage({ entitlementId: entitlementId });
            toast.success('Đã kích hoạt hiển thị logo nổi bật trên trang chủ!');
            
            // Refresh status
            const active = await getActiveMarketingAssignment(companyId, 'COMPANY', companyId);
            setActiveBrandingAssignment(active);
        } catch (err) {
            console.error('Lỗi khi kích hoạt branding:', err);
            toast.error('Kích hoạt thất bại: ' + (err.response?.data?.message || err.message));
        } finally {
            setBrandingActionLoading(false);
        }
    };

    const handleRemoveBranding = async (assignmentId) => {
        setBrandingActionLoading(true);
        try {
            await removeCompanyMarketingPackage(assignmentId);
            toast.success('Đã gỡ hiển thị logo nổi bật.');
            setActiveBrandingAssignment(null);
        } catch (err) {
            console.error('Lỗi khi gỡ branding:', err);
            toast.error('Gỡ thất bại: ' + (err.response?.data?.message || err.message));
        } finally {
            setBrandingActionLoading(false);
        }
    };

    // Close detail drawer
    const handleCloseDrawer = () => {
        setSelectedSubscription(null);
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', px: { xs: 2, md: 3 }, py: 4 }}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center space-y-3">
                        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                        <Typography className="text-gray-500 font-bold text-sm">Đang tải dịch vụ...</Typography>
                    </div>
                </div>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', px: { xs: 2, md: 3 } }}>
            {/* Page Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.5rem',
                            color: '#1f2937',
                            lineHeight: 1.3,
                        }}
                    >
                        Dịch vụ của tôi
                    </Typography>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.3 }}>
                        Quản lý các gói dịch vụ đã mua và đang sử dụng
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FiRefreshCw />}
                        onClick={fetchData}
                        sx={{
                            borderColor: '#d1d5db',
                            color: '#374151',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
                        }}
                    >
                        Làm mới
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<FiShoppingCart />}
                        onClick={() => navigate('/employer/pricing')}
                        sx={{
                            bgcolor: '#10b981',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#059669',
                                boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                            },
                        }}
                    >
                        Mua thêm dịch vụ
                    </Button>
                </Box>
            </Box>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatsCard
                    icon={<FiBox />}
                    label="Tổng gói dịch vụ"
                    value={stats.totalCount}
                    color="#6366f1"
                    bgColor="#eef2ff"
                />
                <StatsCard
                    icon={<FiCheckCircle />}
                    label="Đang hoạt động"
                    value={stats.activeCount}
                    color="#10b981"
                    bgColor="#ecfdf5"
                />
                <StatsCard
                    icon={<FiAlertTriangle />}
                    label="Sắp hết hạn (≤7 ngày)"
                    value={stats.expiringSoonCount}
                    color="#f59e0b"
                    bgColor="#fffbeb"
                />
                <StatsCard
                    icon={<FiFileText />}
                    label="Tin đăng còn lại"
                    value={stats.totalPostsRemaining}
                    color="#3b82f6"
                    bgColor="#eff6ff"
                />
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Tabs */}
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    activeTab === tab.key
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                                {tab.key === 'ACTIVE' && stats.activeCount > 0 && (
                                    <span className="ml-1.5 bg-emerald-100 text-emerald-700 text-xs font-black px-1.5 py-0.5 rounded-full">
                                        {stats.activeCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex-1 min-w-[200px] relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên gói dịch vụ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white outline-none transition-all text-sm font-medium"
                        />
                    </div>

                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors"
                        >
                            <FiXCircle className="text-xs" /> Xóa lọc
                        </button>
                    )}
                </div>
            </div>

            {/* Subscription Cards */}
            {filteredSubscriptions.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <FiBox className="mx-auto mb-4 text-gray-300" size={48} />
                    <Typography variant="h6" className="text-gray-400 font-bold mb-2">
                        {enrichedSubscriptions.length === 0
                            ? 'Chưa có gói dịch vụ nào'
                            : 'Không tìm thấy gói dịch vụ phù hợp'}
                    </Typography>
                    <Typography className="text-gray-400 text-sm mb-4">
                        {enrichedSubscriptions.length === 0
                            ? 'Bạn chưa mua gói dịch vụ nào. Hãy khám phá bảng giá để bắt đầu!'
                            : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'}
                    </Typography>
                    {enrichedSubscriptions.length === 0 && (
                        <Button
                            variant="contained"
                            startIcon={<FiShoppingCart />}
                            onClick={() => navigate('/employer/pricing')}
                            sx={{
                                bgcolor: '#10b981',
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 4,
                                '&:hover': { bgcolor: '#059669' },
                            }}
                        >
                            Xem bảng giá
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredSubscriptions.map((sub) => (
                        <SubscriptionCard
                            key={sub.id}
                            subscription={sub}
                            onViewDetail={() => handleViewDetail(sub)}
                        />
                    ))}
                </div>
            )}

            {/* Detail Drawer */}
            <AnimatePresence>
                {selectedSubscription && (
                    <DetailDrawer
                        subscription={selectedSubscription}
                        activeBrandingAssignment={activeBrandingAssignment}
                        brandingActionLoading={brandingActionLoading}
                        onApplyBranding={handleApplyBranding}
                        onRemoveBranding={handleRemoveBranding}
                        onClose={handleCloseDrawer}
                    />
                )}
            </AnimatePresence>
        </Box>
    );
}

// ── Stats Card Component ──
function StatsCard({ icon, label, value, color, bgColor }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: bgColor, color }}
            >
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-black text-gray-900">{value}</p>
            </div>
        </div>
    );
}

// ── Subscription Card Component ──
function SubscriptionCard({ subscription, onViewDetail }) {
    const sub = subscription;
    const status = String(sub.status || '').toUpperCase();
    const isActive = status === 'ACTIVE';
    const catColor = categoryColors[sub.packageCategory] || categoryColors.JOB_POSTING;
    const stConfig = statusConfig[status] || statusConfig.EXPIRED;

    const limit = sub.jobPostLimit || 0;
    const posted = sub.jobPostedCount || 0;
    const remaining = Math.max(limit - posted, 0);
    const progress = limit > 0 ? (posted / limit) * 100 : 0;
    const days = sub.daysRemaining;

    return (
        <Card
            sx={{
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                opacity: isActive ? 1 : 0.75,
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {sub.imageUrl ? (
                            <img
                                src={sub.imageUrl}
                                alt={sub.packageName}
                                className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1 shrink-0"
                            />
                        ) : (
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${catColor.bg}`}>
                                <FiBox className={`${catColor.text}`} size={22} />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 text-[15px] truncate" title={sub.packageName}>
                                {sub.packageName}
                            </h3>
                            <Chip
                                label={categoryLabels[sub.packageCategory] || sub.packageCategory}
                                size="small"
                                sx={{
                                    mt: 0.5,
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    height: 22,
                                    bgcolor: catColor.chipBg,
                                    color: catColor.chipColor,
                                    border: 'none',
                                }}
                            />
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div
                        className="px-2.5 py-1 rounded-full text-xs font-black whitespace-nowrap shrink-0"
                        style={{
                            backgroundColor: stConfig.bg,
                            color: stConfig.color,
                            border: `1px solid ${stConfig.border}`,
                        }}
                    >
                        {stConfig.label}
                    </div>
                </div>

                {/* Progress */}
                {limit > 0 && (
                    <div className="mb-3">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs text-gray-500 font-bold">Tin đăng đã dùng</span>
                            <span className="text-xs font-black text-gray-700">
                                {posted}/{limit}
                            </span>
                        </div>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(progress, 100)}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: '#f3f4f6',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    bgcolor: progress >= 90 ? '#ef4444' : progress >= 70 ? '#f59e0b' : '#10b981',
                                },
                            }}
                        />
                        <p className="text-xs text-gray-400 mt-1 font-bold">
                            Còn lại: <span className="text-gray-700">{remaining} tin</span>
                        </p>
                    </div>
                )}

                {/* Dates */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                        <FiCalendar size={13} />
                        {formatDate(sub.startDate)} – {formatDate(sub.endDate)}
                    </span>
                    {isActive && days !== null && (
                        <span
                            className={`flex items-center gap-1 font-bold ${
                                days <= 3 ? 'text-red-500' : days <= 7 ? 'text-amber-500' : 'text-emerald-600'
                            }`}
                        >
                            <FiClock size={13} />
                            {days <= 0 ? 'Hết hạn hôm nay' : `${days} ngày còn lại`}
                        </span>
                    )}
                </div>

                {/* Action */}
                <button
                    onClick={onViewDetail}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all group"
                >
                    Xem chi tiết
                    <FiChevronRight className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" size={16} />
                </button>
            </CardContent>
        </Card>
    );
}

// ── Detail Drawer Component ──
function DetailDrawer({ 
    subscription, 
    activeBrandingAssignment, 
    brandingActionLoading,
    onApplyBranding,
    onRemoveBranding,
    onClose 
}) {
    const sub = subscription;
    const status = String(sub.status || '').toUpperCase();
    const isActive = status === 'ACTIVE';
    const catColor = categoryColors[sub.packageCategory] || categoryColors.JOB_POSTING;
    const stConfig = statusConfig[status] || statusConfig.EXPIRED;

    const limit = sub.jobPostLimit || 0;
    const posted = sub.jobPostedCount || 0;
    const remaining = Math.max(limit - posted, 0);
    const progress = limit > 0 ? (posted / limit) * 100 : 0;
    const days = sub.daysRemaining;

    // Duration in days
    const durationDays = useMemo(() => {
        if (!sub.startDate || !sub.endDate) return null;
        const start = new Date(sub.startDate);
        const end = new Date(sub.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }, [sub.startDate, sub.endDate]);

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-black/30 z-[1200]"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <motion.div
                initial={{ x: '100%', opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[1300] flex flex-col"
            >
                {/* Drawer Header */}
                <div className="shrink-0 px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-white to-gray-50/80">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Chi tiết gói dịch vụ</h2>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">Thông tin chi tiết về gói đã mua</p>
                    </div>
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            bgcolor: '#f3f4f6',
                            '&:hover': { bgcolor: '#e5e7eb' },
                        }}
                    >
                        <FiX size={18} />
                    </IconButton>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Branding Actions */}
                    {sub.packageCategory === 'BRANDING' && isActive && (
                        <div className="bg-white rounded-xl p-5 border border-emerald-200 bg-emerald-50/30">
                            <h4 className="text-sm font-black text-emerald-800 mb-2 flex items-center gap-2">
                                <FiCheckCircle /> Quản lý hiển thị logo
                            </h4>
                            <p className="text-xs text-emerald-700 leading-relaxed mb-4">
                                Gói Branding này cho phép hiển thị logo công ty tại mục "Công ty nổi bật" trên trang chủ ứng viên.
                            </p>
                            
                            {activeBrandingAssignment && activeBrandingAssignment.entitlementId === (sub.entitlementId || sub.id) ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                        <FiCheckCircle /> Đang được kích hoạt
                                    </div>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        disabled={brandingActionLoading}
                                        onClick={() => onRemoveBranding(activeBrandingAssignment.id)}
                                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}
                                    >
                                        Gỡ hiển thị nổi bật
                                    </Button>
                                </div>
                            ) : activeBrandingAssignment ? (
                                <Alert severity="info" sx={{ borderRadius: '10px', fontSize: '0.8rem' }}>
                                    Một gói Branding khác (<strong>{activeBrandingAssignment.packageLabel}</strong>) đang được kích hoạt. Gỡ gói đó trước nếu muốn kích hoạt gói này.
                                </Alert>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={brandingActionLoading}
                                    onClick={() => onApplyBranding(sub)}
                                    sx={{ 
                                        bgcolor: '#10b981', 
                                        '&:hover': { bgcolor: '#059669' },
                                        textTransform: 'none', 
                                        fontWeight: 700, 
                                        borderRadius: '10px' 
                                    }}
                                >
                                    {brandingActionLoading ? 'Đang xử lý...' : 'Kích hoạt logo nổi bật'}
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Package Info */}
                    <div className="flex items-center gap-4">
                        {sub.imageUrl ? (
                            <img
                                src={sub.imageUrl}
                                alt={sub.packageName}
                                className="w-16 h-16 rounded-2xl object-contain bg-gray-50 p-2 border border-gray-100"
                            />
                        ) : (
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${catColor.bg} border ${catColor.border}`}>
                                <FiBox className={catColor.text} size={28} />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <h3 className="font-black text-gray-900 text-lg">{sub.packageName}</h3>
                            <div className="flex items-center gap-2 mt-1.5">
                                <Chip
                                    label={categoryLabels[sub.packageCategory] || sub.packageCategory}
                                    size="small"
                                    sx={{
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        height: 24,
                                        bgcolor: catColor.chipBg,
                                        color: catColor.chipColor,
                                    }}
                                />
                                <div
                                    className="px-2.5 py-0.5 rounded-full text-xs font-black"
                                    style={{
                                        backgroundColor: stConfig.bg,
                                        color: stConfig.color,
                                        border: `1px solid ${stConfig.border}`,
                                    }}
                                >
                                    {stConfig.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {sub.description && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1.5">Mô tả</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{sub.description}</p>
                        </div>
                    )}

                    {/* Detail Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <DetailInfoBox
                            label="Ngày bắt đầu"
                            value={formatDate(sub.startDate)}
                            icon={<FiCalendar size={14} />}
                        />
                        <DetailInfoBox
                            label="Ngày kết thúc"
                            value={formatDate(sub.endDate)}
                            icon={<FiCalendar size={14} />}
                        />
                        <DetailInfoBox
                            label="Thời hạn gói"
                            value={durationDays !== null ? `${durationDays} ngày` : 'N/A'}
                            icon={<FiClock size={14} />}
                        />
                        <DetailInfoBox
                            label="Thời gian còn lại"
                            value={
                                !isActive
                                    ? 'Đã hết hạn'
                                    : days !== null
                                        ? days <= 0
                                            ? 'Hết hạn hôm nay'
                                            : `${days} ngày`
                                        : 'N/A'
                            }
                            icon={<FiClock size={14} />}
                            valueColor={
                                !isActive
                                    ? '#ef4444'
                                    : days !== null && days <= 3
                                        ? '#ef4444'
                                        : days !== null && days <= 7
                                            ? '#f59e0b'
                                            : '#10b981'
                            }
                        />
                    </div>

                    {/* Job Post Usage */}
                    {limit > 0 && (
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-3">
                                Sử dụng tin đăng
                            </p>

                            <div className="flex items-end justify-between mb-3">
                                <div>
                                    <span className="text-3xl font-black text-gray-900">{posted}</span>
                                    <span className="text-gray-400 font-bold text-lg"> / {limit}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold">Còn lại</p>
                                    <p className="text-xl font-black text-emerald-600">{remaining}</p>
                                </div>
                            </div>

                            <LinearProgress
                                variant="determinate"
                                value={Math.min(progress, 100)}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    bgcolor: '#f3f4f6',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 5,
                                        background:
                                            progress >= 90
                                                ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                                                : progress >= 70
                                                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                                                    : 'linear-gradient(90deg, #10b981, #059669)',
                                    },
                                }}
                            />

                            <p className="text-xs text-gray-400 mt-2 font-bold text-center">
                                {Math.round(progress)}% đã sử dụng
                            </p>
                        </div>
                    )}

                    {/* Package ID */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 font-bold">Mã gói</p>
                                <p className="text-gray-700 font-bold mt-0.5">{sub.packageId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold">Mã đăng ký</p>
                                <p className="text-gray-700 font-bold mt-0.5 truncate" title={sub.id}>
                                    {sub.id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Drawer Footer */}
                <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/80">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </motion.div>
        </>
    );
}

// ── Detail Info Box ──
function DetailInfoBox({ label, value, icon, valueColor }) {
    return (
        <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                {icon}
                <span className="text-xs font-bold">{label}</span>
            </div>
            <p
                className="text-sm font-black"
                style={{ color: valueColor || '#1f2937' }}
            >
                {value}
            </p>
        </div>
    );
}
