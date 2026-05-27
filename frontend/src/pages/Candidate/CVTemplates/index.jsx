import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Grid, Container, Typography, Box, Button, Card, Stack, Chip
} from '@mui/material';
import {
    TrendingUp as SmartIcon,
    ArrowForward as ArrowForwardIcon,
    ChevronLeft as ChevronLeftIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const TEMPLATES = [
    { id: 1, name: 'Chuyên nghiệp', gradient: 'linear-gradient(135deg,#6366f1,#22d3ee)', tag: 'Phổ biến', desc: 'Thiết kế hai cột truyền thống, phù hợp cho mọi ngành nghề.' },
    { id: 2, name: 'Sáng tạo', gradient: 'linear-gradient(135deg,#8b5cf6,#c084fc)', tag: 'Nổi bật', desc: 'Tone tím hiện đại, làm nổi bật cá tính và sự sáng tạo.' },
    { id: 3, name: 'Tối giản', gradient: 'linear-gradient(135deg,#475569,#94a3b8)', tag: 'Mới nhất', desc: 'Cổ điển, sang trọng xám. Trình bày tinh giản, khoa học.' },
    { id: 4, name: 'Sang trọng', gradient: 'linear-gradient(135deg,#7e22ce,#8b5cf6)', tag: 'Premium', desc: 'Ấn tượng tím đậm, dành cho các vị trí quản lý, cấp cao.' },
    { id: 5, name: 'Đẳng cấp', gradient: 'linear-gradient(135deg,#0f172a,#334155)', tag: 'Dark Mode', desc: 'Layout tối màu huyền bí, đẳng cấp vượt thời gian.' },
    { id: 6, name: 'Năng động', gradient: 'linear-gradient(135deg,#e11d48,#f472b6)', tag: 'Trẻ trung', desc: 'Tone hồng đỏ nhiệt huyết, thích hợp cho ngành Sales, Marketing.' },
    { id: 7, name: 'Thiên nhiên', gradient: 'linear-gradient(135deg,#047857,#2dd4bf)', tag: 'Sinh thái', desc: 'Xanh ngọc mát mắt, tượng trưng cho sự tăng trưởng và cân bằng.' },
    { id: 8, name: 'Thanh lịch', gradient: 'linear-gradient(135deg,#94a3b8,#cbd5e1)', tag: 'Nhẹ nhàng', desc: 'Xám nhạt dịu mắt, dễ chịu và cực kỳ tinh tế.' },
];

const TEMPLATE_COLORS = {
    1: { primary: '#0c7fda', secondary: '#f0f7ff', accent: '#1d4ed8' },
    2: { primary: '#7c3aed', secondary: '#f5f3ff', accent: '#5b21b6' },
    3: { primary: '#374151', secondary: '#f9fafb', accent: '#111827' },
    4: { primary: '#4c1d95', secondary: '#f5f3ff', accent: '#2e1065' },
    5: { primary: '#111827', secondary: '#f9fafb', accent: '#000000' },
    6: { primary: '#be185d', secondary: '#fdf2f8', accent: '#9d174d' },
    7: { primary: '#065f46', secondary: '#ecfdf5', accent: '#064e3b' },
    8: { primary: '#64748b', secondary: '#f8fafc', accent: '#475569' },
};

const renderMiniCVSnapshot = (tpl) => {
    const colors = TEMPLATE_COLORS[tpl.id] || TEMPLATE_COLORS[1];

    // Layout 1: Templates 1 and 7 (Two-column layout)
    if ([1, 7].includes(tpl.id)) {
        return (
            <Box sx={{ width: '100%', height: '100%', bgcolor: '#fff', display: 'flex', flexDirection: 'column', fontSize: '3px', position: 'relative' }}>
                {/* Mini Header: gradient background */}
                <Box sx={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                    height: '42px', px: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0
                }}>
                    {/* Mini Avatar */}
                    <Box sx={{ width: 15, height: 15, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', bgcolor: '#fff', flexShrink: 0 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                        <Box sx={{ height: 4, width: '55%', bgcolor: '#fff', borderRadius: 0.5 }} />
                        <Box sx={{ height: 2.5, width: '30%', bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 0.5 }} />
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Box sx={{ height: 1.5, width: 8, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 0.2 }} />
                            <Box sx={{ height: 1.5, width: 8, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 0.2 }} />
                            <Box sx={{ height: 1.5, width: 8, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 0.2 }} />
                        </Box>
                    </Box>
                </Box>

                {/* Mini Body: 2 Columns */}
                <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Left Column (35% width, colored secondary bg) */}
                    <Box sx={{ width: '35%', bgcolor: colors.secondary, p: 0.8, display: 'flex', flexDirection: 'column', gap: 1.2, borderRight: `1px solid rgba(0,0,0,0.03)` }}>
                        {/* Section: Mục tiêu */}
                        <Box>
                            <Box sx={{ height: 3.5, width: '70%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                            <Box sx={{ height: 1.8, width: '100%', bgcolor: '#94a3b8', borderRadius: 0.2, mb: 0.4 }} />
                            <Box sx={{ height: 1.8, width: '85%', bgcolor: '#94a3b8', borderRadius: 0.2 }} />
                        </Box>
                        {/* Section: Kỹ năng */}
                        <Box>
                            <Box sx={{ height: 3.5, width: '60%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                            {[75, 90, 60].map((val, idx) => (
                                <Box key={idx} sx={{ mb: 0.5 }}>
                                    <Box sx={{ height: 1.5, width: '100%', bgcolor: 'rgba(0,0,0,0.06)', borderRadius: 0.5, overflow: 'hidden' }}>
                                        <Box sx={{ height: '100%', width: `${val}%`, background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        {/* Section: Học vấn */}
                        <Box>
                            <Box sx={{ height: 3.5, width: '60%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                            <Box sx={{ height: 2, width: '90%', bgcolor: '#1e293b', borderRadius: 0.2, mb: 0.4 }} />
                            <Box sx={{ height: 1.5, width: '70%', bgcolor: colors.primary, borderRadius: 0.2 }} />
                        </Box>
                    </Box>

                    {/* Right Column (65% width, white bg) */}
                    <Box sx={{ width: '65%', p: 0.8, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                        {/* Section: Kinh nghiệm */}
                        <Box>
                            <Box sx={{ height: 3.5, width: '50%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.8 }} />
                            {/* Experience Items */}
                            {[1, 2].map((item) => (
                                <Box key={item} sx={{ display: 'flex', gap: 1, mb: 0.8, pl: 0.8, position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', left: 2, top: 0, bottom: 0, width: '0.4px', bgcolor: 'rgba(0,0,0,0.1)' }} />
                                    <Box sx={{ position: 'absolute', left: 1.2, top: 1.8, width: 1.8, height: 1.8, borderRadius: '50%', bgcolor: colors.primary }} />

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, flex: 1, pl: 0.6 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ height: 2.2, width: '60%', bgcolor: '#1e293b', borderRadius: 0.2 }} />
                                            <Box sx={{ height: 1.8, width: '25%', bgcolor: '#cbd5e1', borderRadius: 0.2 }} />
                                        </Box>
                                        <Box sx={{ height: 1.8, width: '40%', bgcolor: colors.primary, borderRadius: 0.2 }} />
                                        <Box sx={{ height: 1.2, width: '90%', bgcolor: '#94a3b8', borderRadius: 0.2 }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        {/* Section: Dự án */}
                        <Box>
                            <Box sx={{ height: 3.5, width: '40%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                            <Box sx={{ display: 'flex', gap: 1, pl: 0.8, position: 'relative' }}>
                                <Box sx={{ position: 'absolute', left: 2, top: 0, bottom: 0, width: '0.4px', bgcolor: 'rgba(0,0,0,0.1)' }} />
                                <Box sx={{ position: 'absolute', left: 1.2, top: 1.8, width: 1.8, height: 1.8, borderRadius: '50%', bgcolor: colors.primary }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, flex: 1, pl: 0.6 }}>
                                    <Box sx={{ height: 2.2, width: '50%', bgcolor: '#1e293b', borderRadius: 0.2 }} />
                                    <Box sx={{ height: 1.2, width: '85%', bgcolor: '#94a3b8', borderRadius: 0.2 }} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    // Layout 2: Templates 2, 6, and 8 (Sidebar layout)
    if ([2, 6, 8].includes(tpl.id)) {
        return (
            <Box sx={{ width: '100%', height: '100%', bgcolor: '#fff', display: 'flex', fontSize: '3px', position: 'relative', overflow: 'hidden' }}>
                {/* Left Sidebar (32% width, gradient bg) */}
                <Box sx={{
                    width: '32%',
                    background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})`,
                    p: 0.8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.2, flexShrink: 0
                }}>
                    {/* Mini Avatar */}
                    <Box sx={{ width: 15, height: 15, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', bgcolor: '#fff', mb: 0.2 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center', width: '100%' }}>
                        <Box sx={{ height: 3.5, width: '75%', bgcolor: '#fff', borderRadius: 0.5 }} />
                        <Box sx={{ height: 2, width: '55%', bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 0.5 }} />
                    </Box>

                    {/* Divider */}
                    <Box sx={{ width: '80%', height: '0.4px', bgcolor: 'rgba(255,255,255,0.2)', my: 0.2 }} />

                    {/* Info */}
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.8, px: 0.2 }}>
                        {[1, 2, 3].map((val) => (
                            <Box key={val} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <Box sx={{ width: 1.5, height: 1.5, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.6)' }} />
                                <Box sx={{ height: 1.5, width: '70%', bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 0.2 }} />
                            </Box>
                        ))}
                    </Box>

                    {/* Skills in Sidebar */}
                    <Box sx={{ width: '100%', px: 0.2 }}>
                        <Box sx={{ height: 3, width: '60%', bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 0.5, mb: 0.6 }} />
                        {[80, 65, 85].map((val, idx) => (
                            <Box key={idx} sx={{ mb: 0.5, width: '100%' }}>
                                <Box sx={{ height: 1.5, width: '100%', bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 0.5, overflow: 'hidden' }}>
                                    <Box sx={{ height: '100%', width: `${val}%`, bgcolor: '#fff' }} />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Right Column (68% width, white bg) */}
                <Box sx={{ width: '68%', p: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Section: Mục tiêu */}
                    <Box>
                        <Box sx={{ height: 3.5, width: '45%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                        <Box sx={{ height: 1.8, width: '100%', bgcolor: '#cbd5e1', borderRadius: 0.2, mb: 0.4 }} />
                        <Box sx={{ height: 1.8, width: '90%', bgcolor: '#cbd5e1', borderRadius: 0.2 }} />
                    </Box>

                    {/* Section: Kinh nghiệm */}
                    <Box>
                        <Box sx={{ height: 3.5, width: '55%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.8 }} />
                        {/* Timeline Items */}
                        {[1, 2].map((item) => (
                            <Box key={item} sx={{ display: 'flex', gap: 1, mb: 0.8, pl: 0.8, position: 'relative' }}>
                                <Box sx={{ position: 'absolute', left: 2, top: 0, bottom: 0, width: '0.4px', bgcolor: 'rgba(0,0,0,0.1)' }} />
                                <Box sx={{ position: 'absolute', left: 1.2, top: 1.8, width: 1.8, height: 1.8, borderRadius: '50%', bgcolor: colors.primary }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, flex: 1, pl: 0.6 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ height: 2.2, width: '60%', bgcolor: '#1e293b', borderRadius: 0.2 }} />
                                        <Box sx={{ height: 1.8, width: '20%', bgcolor: '#cbd5e1', borderRadius: 0.2 }} />
                                    </Box>
                                    <Box sx={{ height: 1.8, width: '35%', bgcolor: colors.primary, borderRadius: 0.2 }} />
                                    <Box sx={{ height: 1.2, width: '90%', bgcolor: '#94a3b8', borderRadius: 0.2 }} />
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* Section: Chứng chỉ */}
                    <Box>
                        <Box sx={{ height: 3.5, width: '35%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Box sx={{ height: 5, width: '45%', bgcolor: colors.secondary, border: `1px solid ${colors.primary}20`, borderRadius: 0.5 }} />
                            <Box sx={{ height: 5, width: '45%', bgcolor: colors.secondary, border: `1px solid ${colors.primary}20`, borderRadius: 0.5 }} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    // Layout 3: Templates 3, 4, and 5 (Dark Header layout)
    return (
        <Box sx={{ width: '100%', height: '100%', bgcolor: '#fff', display: 'flex', flexDirection: 'column', fontSize: '3px', position: 'relative' }}>
            {/* Top Header: Dark gradient header */}
            <Box sx={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                height: '38px', px: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0
            }}>
                {/* Mini Square Avatar */}
                <Box sx={{ width: 13, height: 13, borderRadius: 0.5, border: '1px solid rgba(255,255,255,0.4)', bgcolor: '#fff', flexShrink: 0 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                    <Box sx={{ height: 4, width: '35%', bgcolor: '#fff', borderRadius: 0.5 }} />
                    <Box sx={{ height: 2, width: '20%', bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 0.5 }} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, alignItems: 'flex-end' }}>
                    <Box sx={{ height: 1.5, width: 14, bgcolor: 'rgba(255,255,255,0.6)', borderRadius: 0.2 }} />
                    <Box sx={{ height: 1.5, width: 14, bgcolor: 'rgba(255,255,255,0.6)', borderRadius: 0.2 }} />
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1, overflow: 'hidden' }}>
                {/* Mục tiêu */}
                <Box>
                    <Box sx={{ height: 3.5, width: '25%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                    <Box sx={{ height: 1.8, width: '100%', bgcolor: '#94a3b8', borderRadius: 0.2 }} />
                </Box>

                {/* 2 sub-columns */}
                <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                    {/* Left Column (55% width) - Experience & Projects */}
                    <Box sx={{ width: '55%', display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                        <Box>
                            <Box sx={{ height: 3.5, width: '70%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                            {[1, 2].map((item) => (
                                <Box key={item} sx={{ display: 'flex', gap: 0.5, mb: 0.6, pl: 0.8, position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', left: 1, top: 0, bottom: 0, width: '0.3px', bgcolor: 'rgba(0,0,0,0.1)' }} />
                                    <Box sx={{ position: 'absolute', left: 0.4, top: 1.5, width: 1.5, height: 1.5, borderRadius: '50%', bgcolor: colors.primary }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, flex: 1, pl: 0.5 }}>
                                        <Box sx={{ height: 2, width: '80%', bgcolor: '#1e293b', borderRadius: 0.2 }} />
                                        <Box sx={{ height: 1.8, width: '50%', bgcolor: colors.primary, borderRadius: 0.2 }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Right Column (45% width) - Skills & Education */}
                    <Box sx={{ width: '45%', display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                        {/* Skills */}
                        <Box>
                            <Box sx={{ height: 3.5, width: '60%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                            {[85, 70].map((val, idx) => (
                                <Box key={idx} sx={{ mb: 0.5 }}>
                                    <Box sx={{ height: 1.5, width: '100%', bgcolor: 'rgba(0,0,0,0.06)', borderRadius: 0.5, overflow: 'hidden' }}>
                                        <Box sx={{ height: '100%', width: `${val}%`, bgcolor: colors.primary }} />
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                        {/* Education */}
                        <Box>
                            <Box sx={{ height: 3.5, width: '60%', bgcolor: colors.primary, borderRadius: 0.5, mb: 0.6 }} />
                            <Box sx={{ height: 2, width: '90%', bgcolor: '#1e293b', borderRadius: 0.2 }} />
                            <Box sx={{ height: 1.5, width: '60%', bgcolor: colors.primary, borderRadius: 0.2, mt: 0.3 }} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const generateUUIDv7 = () => {
    const timestamp = Date.now();
    const randomBytes = new Uint8Array(10);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(randomBytes);
    } else {
        for (let i = 0; i < 10; i++) randomBytes[i] = Math.floor(Math.random() * 256);
    }
    let hex = timestamp.toString(16).padStart(12, '0');
    hex += '7';
    const randPart1 = ((randomBytes[0] << 8) | randomBytes[1]) & 0x0FFF;
    hex += randPart1.toString(16).padStart(3, '0');
    const variant = (randomBytes[2] & 0x3F) | 0x80;
    hex += variant.toString(16).padStart(2, '0');
    const randPart2 = Array.from(randomBytes.slice(3)).map(b => b.toString(16).padStart(2, '0')).join('');
    hex += randPart2;
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export default function CVTemplates() {
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);

    const handleSelectTemplate = (templateId) => {
        try {
            const newId = `cv_${generateUUIDv7()}`;
            const draft = {
                id: newId,
                name: 'CV chưa đặt tên',
                templateId,
                data: { personal: {}, skills: [], experience: [], education: [], projects: [], certificates: [] },
                updatedAt: new Date().toISOString(),
                isDraft: true,
            };
            localStorage.setItem(`draft_cv_${newId}`, JSON.stringify(draft));
            toast.success(`Đang khởi tạo Mẫu ${templateId}...`);
            navigate(`/cv-builder?id=${newId}&template=${templateId}`);
        } catch (err) {
            console.error('Lỗi khi khởi tạo bản nháp CV:', err);
            toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <Box className="plus-jakarta-theme" sx={{ minHeight: '100vh', backgroundColor: '#f9fafb', py: 6, px: 2 }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .plus-jakarta-theme, .plus-jakarta-theme * {
                    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                }
            `}} />
            <Container maxWidth="lg">
                {/* Back */}
                <Button startIcon={<ChevronLeftIcon />} onClick={() => navigate('/cv-dashboard')}
                    sx={{ color: '#4b5563', textTransform: 'none', fontWeight: 600, mb: 4, '&:hover': { backgroundColor: '#f3f4f6' } }}>
                    Về Trang quản lý CV
                </Button>

                {/* Hero */}
                <Box sx={{ textAlign: 'center', mb: 7 }}>
                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1.5 }}>
                        <SmartIcon sx={{ color: '#6366f1', fontSize: 24 }} />
                        <Typography sx={{ color: '#6366f1', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            Trình Thiết Kế CV Thông Minh
                        </Typography>
                    </Stack>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 2, letterSpacing: '-1px' }}>
                        Chọn mẫu CV phù hợp để bắt đầu
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 600, mx: 'auto', fontSize: 15 }}>
                        Tất cả các mẫu đều được tối ưu hóa chuẩn ATS, tương thích hiển thị trên di động và xuất PDF sắc nét chỉ với 1 cú click.
                    </Typography>
                </Box>

                {/* Grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: 4.5,
                    width: '100%'
                }}>
                    {TEMPLATES.map((tpl) => {
                        const isHovered = hoveredId === tpl.id;
                        return (
                            <Box key={tpl.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    style={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}
                                >
                                    <Card
                                        onMouseEnter={() => setHoveredId(tpl.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        onClick={() => handleSelectTemplate(tpl.id)}
                                        sx={{
                                            borderRadius: '20px', border: '1px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer',
                                            boxShadow: isHovered ? '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                                            transition: 'box-shadow 0.25s ease', display: 'flex', flexDirection: 'column',
                                            height: '100%'
                                        }}
                                    >
                                        {/* Preview */}
                                        <Box sx={{ height: 210, position: 'relative', overflow: 'hidden', borderBottom: '1px solid #f3f4f6' }}>
                                            {renderMiniCVSnapshot(tpl)}
                                            {/* Tag */}
                                            {/* <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
                                                <Chip label={tpl.tag} size="small"
                                                    sx={{ bgcolor: 'rgba(15, 23, 42, 0.75)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 700, fontSize: 10 }} />
                                            </Box> */}
                                            {/* Hover overlay */}
                                            <Box sx={{
                                                position: 'absolute', inset: 0, bgcolor: 'rgba(15,23,42,0.4)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease',
                                                zIndex: 20
                                            }}>
                                                <Button variant="contained"
                                                    onClick={(e) => { e.stopPropagation(); handleSelectTemplate(tpl.id); }}
                                                    sx={{
                                                        bgcolor: '#fff', color: '#111827', borderRadius: '12px', textTransform: 'none', fontWeight: 700,
                                                        px: 3, py: 1, fontSize: 13, '&:hover': { bgcolor: '#f9fafb' }, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)'
                                                    }}>
                                                    Sử dụng mẫu này
                                                </Button>
                                            </Box>
                                        </Box>
                                        {/* Desc */}
                                        <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography sx={{ fontWeight: 850, fontSize: 15, color: '#111827', mb: 0.8 }}>Mẫu {tpl.id} — {tpl.name}</Typography>
                                                <Typography sx={{ color: '#6b7280', fontSize: 12, lineHeight: 1.5 }}>{tpl.desc}</Typography>
                                            </Box>
                                            <Box sx={{ mt: 2.5, pt: 1.5, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6366f1' }}>
                                                <Typography sx={{ fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CheckCircleIcon sx={{ fontSize: 13 }} /> Bản in A4 chuẩn
                                                </Typography>
                                                <ArrowForwardIcon sx={{ fontSize: 16, transform: isHovered ? 'translateX(4px)' : 'none', transition: 'transform 0.2s' }} />
                                            </Box>
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Box>
                        );
                    })}
                </Box>

                {/* AI note */}
                <Box sx={{ mt: 8, p: 4, borderRadius: '24px', backgroundColor: '#eef2ff', border: '1px solid #e0e7ff', display: 'flex', alignItems: 'center', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '16px', backgroundColor: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <SmartIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography sx={{ fontWeight: 800, color: '#1e1b4b', fontSize: 15, mb: 0.5 }}>
                            Bạn muốn tạo CV chuyên nghiệp tự động bằng Trí tuệ nhân tạo (AI)?
                        </Typography>
                        <Typography sx={{ color: '#4338ca', fontSize: 13 }}>
                            Hãy chọn một mẫu bất kỳ phía trên để vào không gian thiết kế. Sau đó sử dụng tab <b>AI Phân Tích</b> để viết mục tiêu nghề nghiệp, dự án và kinh nghiệm của bạn chỉ trong vài giây.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
