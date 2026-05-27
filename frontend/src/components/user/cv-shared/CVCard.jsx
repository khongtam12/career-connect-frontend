import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Button, IconButton, Card, Chip, Stack, Fade 
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Visibility as VisibilityIcon, 
    Download as DownloadIcon, 
    DeleteOutline as DeleteIcon, 
    Description as FileTextIcon, 
    Star as StarIcon 
} from '@mui/icons-material';

/* Template gradient map — mirrors CVPreview */
const TEMPLATE_GRADIENTS = {
    1: 'linear-gradient(to bottom right, #6366f1, #22d3ee)',
    2: 'linear-gradient(to bottom right, #8b5cf6, #c084fc)',
    3: 'linear-gradient(to bottom right, #475569, #94a3b8)',
    4: 'linear-gradient(to bottom right, #7e22ce, #8b5cf6)',
    5: 'linear-gradient(to bottom right, #0f172a, #334155)',
    6: 'linear-gradient(to bottom right, #e11d48, #f472b6)',
    7: 'linear-gradient(to bottom right, #047857, #2dd4bf)',
    8: 'linear-gradient(to bottom right, #94a3b8, #cbd5e1)',
};

const fmtDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * CVCard — MUI Version
 */
export default function CVCard({ cv, index = 0, onDelete, isDefault = false }) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    const gradient = TEMPLATE_GRADIENTS[cv.templateId] || TEMPLATE_GRADIENTS[1];
    const p = cv.data?.personal || cv || {};

    const handleEdit = () => navigate(`/cv-builder?id=${cv.id}`);
    const handlePDF  = () => navigate(`/cv-builder?id=${cv.id}&print=1`);

    return (
        <Card
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                cursor: 'pointer',
                animation: `fadeInUp 0.5s ease-out ${index * 0.07}s both`,
                '&:hover': {
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(-6px)',
                },
                '@keyframes fadeInUp': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                }
            }}
        >
            {/* ── Thumbnail / Preview Cover ── */}
            <Box
                onClick={handleEdit}
                sx={{
                    position: 'relative',
                    height: 144,
                    background: gradient,
                    flexShrink: 0,
                    overflow: 'hidden',
                }}
            >
                {/* Decorative CV lines */}
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, px: 2.5, py: 2, opacity: 0.25 }}>
                    <Box sx={{ height: 10, width: '60%', borderRadius: 5, bgcolor: '#fff' }} />
                    <Box sx={{ height: 6, width: '40%', borderRadius: 3, bgcolor: '#fff' }} />
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {[4, 5, 3, 4].map((w, i) => (
                            <Box key={i} sx={{ height: 4, borderRadius: 2, bgcolor: '#fff', width: `${w * 12}%` }} />
                        ))}
                    </Box>
                </Box>

                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
                    <Chip 
                        label={`Mẫu ${cv.templateId}`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600 }} 
                    />
                    {isDefault && (
                        <Chip 
                            icon={<StarIcon sx={{ color: '#b45309 !important', fontSize: 14 }} />} 
                            label="Mặc định" 
                            size="small" 
                            sx={{ bgcolor: 'rgba(251,191,36,0.9)', color: '#78350f', border: '1px solid rgba(252,211,77,0.5)', fontWeight: 600 }} 
                        />
                    )}
                </Box>

                {/* Hover overlay */}
                <Fade in={hovered} timeout={200}>
                    <Box sx={{
                        position: 'absolute', inset: 0, bgcolor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1
                    }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                            startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                            sx={{ bgcolor: '#fff', color: '#0f172a', borderRadius: '8px', textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        >
                            Chỉnh sửa
                        </Button>
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                            title="Xem trước"
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handlePDF(); }}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                            title="Xuất PDF"
                        >
                            <DownloadIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Fade>
            </Box>

            {/* ── Info ── */}
            <Box onClick={handleEdit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, flexGrow: 1 }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cv.name || 'Chưa đặt tên'}
                    </Typography>
                    {p.fullName && (
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, color: '#6b7280' }}>
                            <FileTextIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{p.fullName}</Typography>
                        </Stack>
                    )}
                </Box>

                {p.jobTitle && (
                    <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.jobTitle}
                    </Typography>
                )}

                <Typography variant="caption" sx={{ color: '#9ca3af', mt: 'auto' }}>
                    Cập nhật: {fmtDate(cv.updatedAt)}
                </Typography>
            </Box>

            {/* ── Footer actions (always visible) ── */}
            <Box onClick={e => e.stopPropagation()} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 2, pb: 2 }}>
                <Button 
                    variant="text" 
                    size="small" 
                    onClick={handleEdit} 
                    startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                    sx={{ flex: 1, justifyContent: 'flex-start', color: '#4b5563', textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#f3f4f6', color: '#111827' } }}
                >
                    Chỉnh sửa
                </Button>
                <IconButton
                    size="small"
                    onClick={handlePDF}
                    title="Xuất PDF"
                    sx={{ color: '#6b7280', '&:hover': { color: '#111827', bgcolor: '#f3f4f6' } }}
                >
                    <DownloadIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onDelete?.(cv.id)}
                    title="Xóa CV"
                    sx={{ color: '#6b7280', '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}
                >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </Box>
        </Card>
    );
}
