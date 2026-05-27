import React, { useState, useMemo } from 'react';
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
    Star as StarIcon,
    PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import CVPreview from '../../../pages/Candidate/CVBuilder/components/CVPreview';

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
 * hasDataContent — checks if the CV actually has some user-entered data
 * (not just the bare default/empty shell)
 */
function hasDataContent(cv) {
    const d = cv.data || cv;
    const p = d.personal || {};
    if (p.fullName || p.email || p.phone || p.jobTitle) return true;
    if (d.skills?.length || d.experiences?.length || d.educations?.length || d.projects?.length || d.certificates?.length) return true;
    if (cv.fullName || cv.email || cv.phone || cv.jobTitle) return true;
    if (cv.skills?.length || cv.experiences?.length || cv.educations?.length || cv.projects?.length || cv.certificates?.length) return true;
    return false;
}

/**
 * CVCard — MUI Version with Unified Live Snapshot
 */
export default function CVCard({ cv, index = 0, onDelete, isDefault = false }) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    const gradient = TEMPLATE_GRADIENTS[cv.templateId] || TEMPLATE_GRADIENTS[1];
    const p = cv.data?.personal || cv || {};
    const hasContent = hasDataContent(cv);
    const hasPdfFile = !!(cv.fileUrl || cv.cvFileUrl) && !hasContent;

    // Build data object for CVPreview
    const previewData = useMemo(() => {
        if (cv.data) return cv.data;
        // Flatten from top-level fields
        return {
            personal: {
                fullName: cv.fullName || '',
                email: cv.email || '',
                phone: cv.phone || '',
                address: cv.address || '',
                dob: cv.dob || '',
                jobTitle: cv.jobTitle || '',
                linkedin: cv.linkedin || '',
                summary: cv.summary || '',
            },
            skills: cv.skills || [],
            experience: cv.experiences || [],
            education: cv.educations || [],
            projects: cv.projects || [],
            certificates: cv.certificates || [],
        };
    }, [cv]);

    const pdfUrl = cv.fileUrl || cv.cvFileUrl;
    const handleEdit = () => {
        if (hasPdfFile && pdfUrl) {
            window.open(pdfUrl, '_blank');
        } else {
            navigate(`/cv-builder?id=${cv.id}`);
        }
    };
    const handlePDF  = () => {
        if (hasPdfFile && pdfUrl) {
            window.open(pdfUrl, '_blank');
        } else {
            navigate(`/cv-builder?id=${cv.id}&print=1`);
        }
    };

    return (
        <Card
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '18px',
                border: hovered ? '1px solid rgba(99,102,241,0.2)' : '1px solid #e5e7eb',
                boxShadow: hovered 
                    ? '0 12px 25px -4px rgba(15,23,42,0.1), 0 4px 12px -2px rgba(15,23,42,0.05)' 
                    : '0 2px 6px -1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                cursor: 'pointer',
                animation: `fadeInUp 0.5s ease-out ${index * 0.07}s both`,
                '&:hover': {
                    transform: 'translateY(-6px)',
                },
                '@keyframes fadeInUp': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                }
            }}
        >
            {/* ── Thumbnail / Live Snapshot ── */}
            <Box
                onClick={handleEdit}
                sx={{
                    position: 'relative',
                    height: 200,
                    background: gradient,
                    flexShrink: 0,
                    overflow: 'hidden',
                }}
            >
                {/* Live snapshot via CVPreview (builder CVs with content) */}
                {hasContent && !hasPdfFile && (
                    <Box sx={{
                        position: 'absolute', inset: 0, zIndex: 1,
                        pointerEvents: 'none',
                        overflow: 'hidden',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Box sx={{
                            transform: 'scale(0.15)', /* Perfectly scales down the entire A4 sheet */
                            transformOrigin: 'center center',
                            width: '794px',   /* A4 width */
                            height: '1123px',  /* A4 height */
                            boxShadow: '0 12px 30px rgba(15,23,42,0.15), 0 3px 10px rgba(15,23,42,0.08)',
                            border: '1px solid #cbd5e1',
                            bgcolor: 'white',
                            flexShrink: 0
                        }}>
                            <CVPreview data={previewData} templateId={cv.templateId || 1} />
                        </Box>
                    </Box>
                )}

                {/* Uploaded PDF indicator / Live PDF Preview */}
                {hasPdfFile && (
                    <Box sx={{ 
                        position: 'absolute', inset: 0, zIndex: 1, 
                        overflow: 'hidden', bgcolor: '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Box sx={{
                            width: '135px',  // Fits exactly in A4 aspect ratio scaled to card box
                            height: '190px',
                            boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid #cbd5e1',
                            bgcolor: 'white',
                            flexShrink: 0
                        }}>
                            <iframe
                                src={`${cv.fileUrl || cv.cvFileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                width="100%"
                                height="100%"
                                style={{ border: 'none', pointerEvents: 'none', overflow: 'hidden' }}
                                title={`PDF Preview ${cv.name}`}
                            />
                        </Box>
                        {/* Glassmorphic PDF badge indicator */}
                        <Box sx={{
                            position: 'absolute', bottom: 12, left: 12, right: 12,
                            bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(228, 228, 231, 0.8)',
                            borderRadius: '8px',
                            py: 0.5, px: 1.2, display: 'flex', alignItems: 'center', gap: 1,
                            zIndex: 2,
                            boxShadow: '0 4px 12px rgba(15,23,42,0.05)'
                        }}>
                            <PdfIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                            <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#374151' }}>
                                PDF tải lên từ máy
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* Fallback: decorative lines (empty builder CVs) */}
                {!hasContent && !hasPdfFile && (
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.2, px: 3, py: 2.5, opacity: 0.25 }}>
                        <Box sx={{ height: 11, width: '60%', borderRadius: 5, bgcolor: '#fff' }} />
                        <Box sx={{ height: 7, width: '40%', borderRadius: 3, bgcolor: '#fff' }} />
                        <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.85 }}>
                            {[50, 70, 42, 58].map((w, i) => (
                                <Box key={i} sx={{ height: 5, borderRadius: 2.5, bgcolor: '#fff', width: `${w}%` }} />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1, zIndex: 5 }}>
                    {!hasPdfFile && (
                        <Chip 
                            label={`Mẫu ${cv.templateId}`} 
                            size="small" 
                            sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: hasContent ? '#1e293b' : '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 10.5 }} 
                        />
                    )}
                    {isDefault && (
                        <Chip 
                            icon={<StarIcon sx={{ color: '#b45309 !important', fontSize: 13 }} />} 
                            label="Mặc định" 
                            size="small" 
                            sx={{ bgcolor: 'rgba(251,191,36,0.95)', color: '#78350f', border: '1px solid rgba(252,211,77,0.5)', fontWeight: 700, fontSize: 10.5 }} 
                        />
                    )}
                </Box>

                {/* Hover overlay */}
                <Fade in={hovered} timeout={200}>
                    <Box sx={{
                        position: 'absolute', inset: 0, bgcolor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(3px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, zIndex: 10
                    }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                            startIcon={hasPdfFile ? <VisibilityIcon sx={{ fontSize: 14 }} /> : <EditIcon sx={{ fontSize: 14 }} />}
                            sx={{ bgcolor: '#fff', color: '#0f172a', borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: 11.5, px: 2, py: 0.75, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', '&:hover': { bgcolor: '#f8fafc' } }}
                        >
                            {hasPdfFile ? 'Xem tệp PDF' : 'Chỉnh sửa'}
                        </Button>
                        {!hasPdfFile && (
                            <>
                                <IconButton
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } }}
                                    title="Xem trước"
                                >
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handlePDF(); }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } }}
                                    title="Xuất PDF"
                                >
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Fade>
            </Box>

            {/* ── Info ── */}
            <Box onClick={handleEdit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, p: 2.5, flexGrow: 1 }}>
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', '&:hover': { color: '#4f46e5' }, transition: 'color 0.2s' }}>
                        {cv.name || 'Chưa đặt tên'}
                    </Typography>
                    {(p.fullName || cv.fullName) && (
                        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.75, color: '#64748b' }}>
                            <FileTextIcon sx={{ fontSize: 14 }} />
                            <Typography sx={{ fontSize: 11.5, fontWeight: 500 }}>{p.fullName || cv.fullName}</Typography>
                        </Stack>
                    )}
                </Box>

                {(p.jobTitle || cv.jobTitle) && (
                    <Box sx={{ 
                        bgcolor: '#e0e7ff', 
                        color: '#3730a3', 
                        px: 1.2, 
                        py: 0.5, 
                        borderRadius: '6px', 
                        alignSelf: 'flex-start',
                        border: '1px solid #c7d2fe',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {p.jobTitle || cv.jobTitle}
                        </Typography>
                    </Box>
                )}

                <Typography sx={{ color: '#94a3b8', fontSize: 10.5, fontWeight: 500, mt: 'auto' }}>
                    Đã cập nhật: {fmtDate(cv.updatedAt)}
                </Typography>
            </Box>

            {/* ── Footer actions (always visible) ── */}
            <Box onClick={e => e.stopPropagation()} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.25, px: 2.5, pb: 2.5 }}>
                <Button 
                    variant="contained" 
                    size="small" 
                    onClick={handleEdit} 
                    startIcon={hasPdfFile ? <VisibilityIcon sx={{ fontSize: 14 }} /> : <EditIcon sx={{ fontSize: 14 }} />}
                    sx={{ 
                        flex: 1, 
                        bgcolor: hasPdfFile ? '#475569' : '#111827', 
                        color: '#fff',
                        textTransform: 'none', 
                        borderRadius: '10px', 
                        fontWeight: 700, 
                        fontSize: 11,
                        py: 0.8,
                        boxShadow: 'none',
                        '&:hover': { 
                            bgcolor: hasPdfFile ? '#334155' : '#1f2937',
                            boxShadow: '0 4px 12px rgba(17,24,39,0.15)'
                        } 
                    }}
                >
                    {hasPdfFile ? 'Xem tệp PDF' : 'Chỉnh sửa'}
                </Button>
                {!hasPdfFile && (
                    <IconButton
                        size="small"
                        onClick={handlePDF}
                        title="Xuất PDF"
                        sx={{ 
                            color: '#4b5563', 
                            bgcolor: '#f3f4f6',
                            borderRadius: '10px',
                            p: 0.85,
                            '&:hover': { color: '#111827', bgcolor: '#e5e7eb' } 
                        }}
                    >
                        <DownloadIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                )}
                <IconButton
                    size="small"
                    onClick={() => onDelete?.(cv.id)}
                    title="Xóa CV"
                    sx={{ 
                        color: '#4b5563', 
                        bgcolor: '#f3f4f6',
                        borderRadius: '10px',
                        p: 0.85,
                        '&:hover': { color: '#dc2626', bgcolor: '#fee2e2' } 
                    }}
                >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Box>
        </Card>
    );
}
