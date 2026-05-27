import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Box, Typography, Button, Card, CardContent, Divider, Grid, 
    Container, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Chip
} from '@mui/material';
import { 
    Add as PlusIcon, 
    Description as FileTextIcon, 
    TrendingUp as TrendingUpIcon, 
    Dashboard as LayoutDashboardIcon,
    NoteAdd as NoteAddIcon,
    CloudUpload as CloudUploadIcon,
    Assignment as AssignmentIcon,
    Folder as FolderIcon,
    Lightbulb as LightbulbIcon,
    TrackChanges as TargetIcon,
    BarChart as ChartIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import CVCard from '../../../components/user/cv-shared/CVCard';
import * as cvService from '../../../service/cvService';
import { useUserStore } from '../../../stores/useUserStore';
import { toast } from 'react-toastify';

/* ── Stat widget ── */
function StatWidget({ icon: Icon, value, label, accent = false }) {
    return (
        <Card sx={{ height: '100%', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, flexShrink: 0, backgroundColor: accent ? '#111827' : '#f3f4f6', color: accent ? '#fff' : '#6b7280' }}>
                <Icon />
            </Box>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: accent ? '#111827' : '#374151', lineHeight: 1 }}>{value}</Typography>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, mt: 0.5, display: 'block' }}>{label}</Typography>
            </Box>
        </Card>
    );
}

function hasDataContent(cv) {
    const d = cv.data || cv;
    const p = d.personal || {};
    if (p.fullName || p.email || p.phone || p.jobTitle) return true;
    if (d.skills?.length || d.experiences?.length || d.educations?.length || d.projects?.length || d.certificates?.length) return true;
    if (cv.fullName || cv.email || cv.phone || cv.jobTitle) return true;
    if (cv.skills?.length || cv.experiences?.length || cv.educations?.length || cv.projects?.length || cv.certificates?.length) return true;
    return false;
}

/* ── Template preview card ── */
const TEMPLATES = [
    { id: 1, name: 'Chuyên nghiệp', gradient: 'linear-gradient(135deg,#6366f1,#22d3ee)', tag: 'Phổ biến', tagColor: '#6366f1' },
    { id: 2, name: 'Sáng tạo', gradient: 'linear-gradient(135deg,#8b5cf6,#c084fc)', tag: 'Nổi bật', tagColor: '#8b5cf6' },
    { id: 3, name: 'Tối giản', gradient: 'linear-gradient(135deg,#475569,#94a3b8)', tag: 'Hiện đại', tagColor: '#475569' },
    { id: 4, name: 'Sang trọng', gradient: 'linear-gradient(135deg,#7e22ce,#8b5cf6)', tag: 'Premium', tagColor: '#7e22ce' },
    { id: 5, name: 'Đẳng cấp', gradient: 'linear-gradient(135deg,#0f172a,#334155)', tag: 'Dark', tagColor: '#0f172a' },
    { id: 6, name: 'Năng động', gradient: 'linear-gradient(135deg,#e11d48,#f472b6)', tag: 'Trẻ trung', tagColor: '#e11d48' },
    { id: 7, name: 'Thiên nhiên', gradient: 'linear-gradient(135deg,#047857,#2dd4bf)', tag: 'Xanh', tagColor: '#047857' },
    { id: 8, name: 'Thanh lịch', gradient: 'linear-gradient(135deg,#94a3b8,#cbd5e1)', tag: 'Nhẹ nhàng', tagColor: '#64748b' },
];

function TemplateCard({ tpl, onClick }) {
    const [hov, setHov] = React.useState(false);
    return (
        <Card onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            sx={{ borderRadius: '14px', border: '1px solid #f3f4f6', overflow: 'hidden', cursor: 'pointer', transition: 'all .25s', boxShadow: hov ? '0 8px 24px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.06)', transform: hov ? 'translateY(-4px)' : 'none' }}>
            <Box sx={{ height: 130, background: tpl.gradient, position: 'relative', overflow: 'hidden' }}>
                {/* Simulated CV layout lines */}
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.8, px: 2, py: 1.5, opacity: 0.28 }}>
                    <Box sx={{ height: 9, width: '55%', borderRadius: 4, bgcolor: '#fff' }} />
                    <Box sx={{ height: 5, width: '35%', borderRadius: 3, bgcolor: '#fff' }} />
                    <Box sx={{ height: 1, bgcolor: 'rgba(255,255,255,0.5)', my: 0.5 }} />
                    {[48, 60, 38, 52].map((w, i) => <Box key={i} sx={{ height: 3.5, borderRadius: 2, bgcolor: '#fff', width: `${w}%` }} />)}
                </Box>
                <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                    <Box sx={{ px: 1.2, py: 0.4, borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{tpl.tag}</Typography>
                    </Box>
                </Box>
                {hov && (
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button onClick={onClick} size="small" variant="contained"
                            sx={{ bgcolor: '#fff', color: '#111827', borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: 12, '&:hover': { bgcolor: '#f9fafb' }, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                            Dùng mẫu này
                        </Button>
                    </Box>
                )}
            </Box>
            <Box sx={{ p: 1.5 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>Mẫu {tpl.id} — {tpl.name}</Typography>
            </Box>
        </Card>
    );
}

/* ── New CV placeholder in grid ── */
function NewCVCard({ onClick }) {
    return (
        <Card onClick={onClick}
            sx={{ height: '100%', minHeight: 260, borderRadius: '16px', border: '2px dashed #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'none', '&:hover': { borderColor: '#6366f1', backgroundColor: '#f5f3ff', transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(99,102,241,0.15)' } }}>
            <Box sx={{ width: 52, height: 52, borderRadius: '14px', backgroundColor: '#ede9fe', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                <PlusIcon fontSize="medium" />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151' }}>Tạo CV mới</Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', mt: 0.5 }}>Bắt đầu với mẫu đẹp</Typography>
        </Card>
    );
}

/* ── Tips section ── */
const TIPS = [
    { key: 'target', title: 'Tùy chỉnh theo công việc', desc: 'Điều chỉnh CV phù hợp với từng vị trí ứng tuyển.' },
    { key: 'chart', title: 'Dùng số liệu cụ thể', desc: 'Thay vì "làm tốt" hãy viết "tăng doanh thu 30%".' },
    { key: 'search', title: 'Tối ưu từ khóa', desc: 'Dùng từ khóa từ mô tả công việc để vượt ATS.' },
];

function TipsSection() {
    return (
        <Box sx={{ mt: 6, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LightbulbIcon sx={{ color: '#eab308' }} /> Mẹo viết CV hiệu quả
            </Typography>
            <Grid container spacing={2}>
                {TIPS.map((t, i) => (
                    <Grid item xs={12} md={4} key={i}>
                        <Card sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #f3f4f6', boxShadow: 'none', height: '100%', background: 'linear-gradient(135deg,#fafafa,#fff)' }}>
                            <Box sx={{ color: '#6366f1', mb: 1.5, display: 'flex' }}>
                                {t.key === 'target' && <TargetIcon sx={{ fontSize: 28 }} />}
                                {t.key === 'chart' && <ChartIcon sx={{ fontSize: 28 }} />}
                                {t.key === 'search' && <SearchIcon sx={{ fontSize: 28 }} />}
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#111827', mb: 0.5 }}>{t.title}</Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280', lineHeight: 1.6 }}>{t.desc}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

/* ── Empty state ── */
function EmptyState({ onCreateClick }) {
    return (
        <Box>
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Box sx={{ width: 72, height: 72, borderRadius: '20px', backgroundColor: '#f3f4f6', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <NoteAddIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>Bạn chưa có CV nào</Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>Chọn một mẫu bên dưới để bắt đầu tạo CV chuyên nghiệp</Typography>
                <Button variant="contained" onClick={() => onCreateClick(1)} startIcon={<PlusIcon />}
                    sx={{ backgroundColor: '#111827', color: '#fff', borderRadius: '10px', textTransform: 'none', px: 3, py: 1.2, fontWeight: 600, '&:hover': { backgroundColor: '#1f2937' } }}>
                    Tạo CV ngay
                </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#374151', mb: 2 }}>Chọn mẫu CV phù hợp với bạn</Typography>
                <Grid container spacing={2}>
                    {TEMPLATES.map(tpl => (
                        <Grid item xs={6} sm={4} md={3} key={tpl.id}>
                            <TemplateCard tpl={tpl} onClick={() => onCreateClick(tpl.id)} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <TipsSection />
        </Box>
    );
}

/* ═══════════════════════════════════════════
   Dashboard Page
   ═══════════════════════════════════════════ */
export default function CVDashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [cvList, setCvList] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cvToDelete, setCvToDelete] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const uploadRef = useRef(null);
    const fileInputRef = useRef(null);

    const { user } = useUserStore();

    const fetchCVs = async () => {
        if (!user) return;
        try {
            const data = await cvService.getMyCVs();
            setCvList(data);
        } catch (e) {
            console.error('Failed to fetch CVs:', e);
            toast.error('Không thể tải danh sách CV');
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchCVs();
    }, [user]);

    // Auto-scroll to upload zone when ?action=upload
    useEffect(() => {
        if (searchParams.get('action') === 'upload' && uploadRef.current) {
            setTimeout(() => {
                uploadRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 400);
        }
    }, [searchParams, mounted]);

    const handleFileUpload = async (file) => {
        if (!file || file.type !== 'application/pdf') {
            toast.error('Chỉ chấp nhận file PDF. Vui lòng chọn lại.');
            return;
        }
        if (!user) {
            toast.error('Vui lòng đăng nhập để tải lên CV.');
            return;
        }
        setUploading(true);
        try {
            // 1. Create empty CV record with filename as name
            const cvPayload = {
                userId: user.userId || user.id,
                name: file.name.replace(/\.pdf$/i, ''),
                templateId: 1,
                status: 'PUBLISHED',
                fullName: '',
                email: '',
                phone: '',
                address: '',
                dob: '',
                jobTitle: '',
                linkedin: '',
                summary: '',
                skills: [],
                experiences: [],
                educations: [],
                projects: [],
                certificates: [],
            };
            const created = await cvService.createCV(cvPayload);

            // 2. Upload the actual PDF file
            const formData = new FormData();
            formData.append('file', file, file.name);
            await cvService.uploadCVFile(created.id, formData);

            toast.success('Tải lên CV thành công!');
            await fetchCVs();
        } catch (err) {
            console.error('Upload CV failed:', err);
            toast.error('Không thể tải lên CV. Vui lòng thử lại.');
        } finally {
            setUploading(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        handleFileUpload(file);
    };

    const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const onDragLeave = () => setDragOver(false);

const generateUUIDv7 = () => {
    // 48-bit timestamp
    const timestamp = Date.now();
    
    // 10 random bytes
    const randomBytes = new Uint8Array(10);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(randomBytes);
    } else {
        for (let i = 0; i < 10; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
        }
    }
    
    // Convert timestamp to 12-char hex (48 bits)
    let hex = timestamp.toString(16).padStart(12, '0');
    
    // Version '7'
    hex += '7';
    
    // Next 12 bits (from random bytes)
    const randPart1 = ((randomBytes[0] << 8) | randomBytes[1]) & 0x0FFF;
    hex += randPart1.toString(16).padStart(3, '0');
    
    // Variant bits (8, 9, a, or b) - set 2 most significant bits to 10
    const variant = (randomBytes[2] & 0x3F) | 0x80;
    hex += variant.toString(16).padStart(2, '0');
    
    // Remaining 56 bits of randomness
    const randPart2 = Array.from(randomBytes.slice(3))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    hex += randPart2;
    
    // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

    const handleCreate = (templateId = 1) => {
        try {
            const uuid = generateUUIDv7();
            const newId = `cv_${uuid}`;

            const draft = {
                id: newId,
                name: 'CV chưa đặt tên',
                templateId,
                data: {
                    personal: {}, skills: [], experience: [],
                    education: [], projects: [], certificates: [],
                },
                updatedAt: new Date().toISOString(),
                isDraft: true,
            };

            localStorage.setItem(`draft_cv_${newId}`, JSON.stringify(draft));
            navigate(`/cv-builder?id=${newId}&template=${templateId}`);
        } catch (err) {
            console.error('Không thể khởi tạo bản nháp:', err);
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    const confirmDelete = (id) => {
        setCvToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!cvToDelete) return;
        try {
            await cvService.deleteCV(cvToDelete);
            const next = cvList.filter(cv => cv.id !== cvToDelete);
            setCvList(next);
            toast.success('Đã xóa CV thành công');
        } catch (e) {
            console.error('Lỗi khi xóa CV:', e);
            toast.error('Đã xảy ra lỗi khi xóa CV. Vui lòng thử lại.');
        } finally {
            setDeleteDialogOpen(false);
            setCvToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setCvToDelete(null);
    };

    if (!mounted) {
        return null;
    }

    const isEmpty = cvList.length === 0;

    // Phân loại CV: CV đã tải lên (chỉ chứa file PDF, không có data builder) vs CV thiết kế trực tuyến
    const builderCVs = cvList.filter(cv => hasDataContent(cv) || !(cv.fileUrl || cv.cvFileUrl));
    const uploadedCVs = cvList.filter(cv => !hasDataContent(cv) && (cv.fileUrl || cv.cvFileUrl));
    return (
        <Box className="plus-jakarta-theme" sx={{ minHeight: '100vh', backgroundColor: '#f9fafb', py: 5 }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .plus-jakarta-theme, .plus-jakarta-theme * {
                    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                }
            `}} />
            <Container maxWidth="lg">
                {/* ── Page header ── */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
                    <Box>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <LayoutDashboardIcon sx={{ color: '#374151', fontSize: 28 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                                CV của tôi
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: '#6b7280', mt: 1, ml: 5 }}>
                            Quản lý và tạo CV chuyên nghiệp để chinh phục nhà tuyển dụng
                        </Typography>
                    </Box>

                    {!isEmpty && (
                        <Button 
                            variant="contained" 
                            onClick={() => handleCreate(1)} 
                            startIcon={<PlusIcon />}
                            sx={{ backgroundColor: '#111827', color: '#fff', borderRadius: '10px', textTransform: 'none', px: 3, '&:hover': { backgroundColor: '#1f2937' }, boxShadow: 'none' }}
                        >
                            Tạo CV mới
                        </Button>
                    )}
                </Box>

                {/* ── Upload Zone ── */}
                <Card
                    ref={uploadRef}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                        mb: 4, p: 4, borderRadius: '16px', cursor: 'pointer',
                        border: dragOver ? '2px dashed #6366f1' : searchParams.get('action') === 'upload' ? '2px dashed #6366f1' : '2px dashed #e5e7eb',
                        backgroundColor: dragOver ? '#eef2ff' : searchParams.get('action') === 'upload' ? '#f5f3ff' : '#fafafa',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#6366f1', backgroundColor: '#f5f3ff' },
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5
                    }}
                >
                    {uploading ? (
                        <>
                            <CircularProgress size={32} sx={{ color: '#6366f1' }} />
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>Đang tải lên...</Typography>
                        </>
                    ) : (
                        <>
                            <Box sx={{ width: 52, height: 52, borderRadius: '14px', backgroundColor: '#ede9fe', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CloudUploadIcon fontSize="medium" />
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>Tải lên CV có sẵn (PDF)</Typography>
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>Kéo thả file PDF vào đây hoặc nhấn để chọn file</Typography>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                    />
                </Card>

                {isEmpty ? (
                    <EmptyState onCreateClick={handleCreate} />
                ) : (
                    <>
                        {/* ── Stats ── */}
                        <Grid container spacing={3} sx={{ mb: 5 }}>
                            <Grid item xs={12} sm={4}>
                                <StatWidget icon={FileTextIcon} value={cvList.length} label="Tổng số CV" accent />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2.5, borderRadius: '16px', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1px solid #bbf7d0', boxShadow: 'none' }}>
                                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#bbf7d0', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, flexShrink: 0 }}><TrendingUpIcon /></Box>
                                    <Box><Typography sx={{ fontWeight: 700, fontSize: 14, color: '#15803d' }}>Cập nhật thường xuyên</Typography><Typography variant="caption" sx={{ color: '#16a34a' }}>CV mới = Cơ hội tốt hơn</Typography></Box>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2.5, borderRadius: '16px', background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '1px solid #bfdbfe', boxShadow: 'none' }}>
                                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', backgroundColor: '#bfdbfe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, flexShrink: 0 }}><NoteAddIcon /></Box>
                                    <Box><Typography sx={{ fontWeight: 700, fontSize: 14, color: '#1d4ed8' }}>8 mẫu CV đẹp</Typography><Typography variant="caption" sx={{ color: '#2563eb' }}>Chuyên nghiệp, hiện đại</Typography></Box>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* ── Section 1: CV Thiết Kế Trực Tuyến ── */}
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1f2937', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <AssignmentIcon sx={{ color: '#4f46e5', fontSize: 20 }} /> CV thiết kế trực tuyến
                            <Chip label={builderCVs.length} size="small" sx={{ bgcolor: '#e0e7ff', color: '#4f46e5', fontWeight: 700, fontSize: 11 }} />
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 6 }}>
                            {builderCVs.map((cv, i) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={cv.id} sx={{ display: 'flex' }}>
                                    <CVCard cv={cv} index={i} onDelete={confirmDelete} />
                                </Grid>
                            ))}
                            <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
                                <NewCVCard onClick={() => handleCreate(1)} />
                            </Grid>
                        </Grid>

                        {/* ── Section 2: CV Tải Lên Từ Máy Tính ── */}
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1f2937', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <FolderIcon sx={{ color: '#ef4444', fontSize: 20 }} /> CV đã tải lên từ máy tính
                            <Chip label={uploadedCVs.length} size="small" sx={{ bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 700, fontSize: 11 }} />
                        </Typography>
                        
                        {uploadedCVs.length === 0 ? (
                            <Card sx={{ p: 4, borderRadius: '16px', border: '1px dashed #e5e7eb', textAlign: 'center', backgroundColor: '#fafafa', mb: 6, boxShadow: 'none' }}>
                                <Typography sx={{ color: '#9ca3af', fontSize: 13, fontWeight: 600 }}>
                                    Chưa có CV nào được tải lên. Bạn có thể kéo thả file PDF vào vùng tải lên phía trên!
                                </Typography>
                            </Card>
                        ) : (
                            <Grid container spacing={3} sx={{ mb: 6 }}>
                                {uploadedCVs.map((cv, i) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={cv.id} sx={{ display: 'flex' }}>
                                        <CVCard cv={cv} index={i} onDelete={confirmDelete} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        <Divider sx={{ my: 5, borderColor: '#e5e7eb' }} />

                        {/* ── Template showcase ── */}
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827' }}>Thư viện mẫu CV</Typography>
                                    <Typography variant="caption" sx={{ color: '#6b7280' }}>Chọn mẫu phù hợp để tạo CV mới</Typography>
                                </Box>
                            </Box>
                            <Grid container spacing={2}>
                                {TEMPLATES.map(tpl => (
                                    <Grid item xs={6} sm={4} md={3} key={tpl.id}>
                                        <TemplateCard tpl={tpl} onClick={() => handleCreate(tpl.id)} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        <TipsSection />
                    </>
                )}
            </Container>

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={deleteDialogOpen} 
                onClose={cancelDelete}
                PaperProps={{ sx: { borderRadius: '12px', padding: '10px' } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', color: '#111827' }}>
                    Xác nhận xóa CV
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#4b5563' }}>
                        Bạn có chắc chắn muốn xóa CV này không? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ padding: '0 24px 16px' }}>
                    <Button onClick={cancelDelete} sx={{ color: '#6b7280', textTransform: 'none', fontWeight: 600 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="error" sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 600, boxShadow: 'none' }}>
                        Xóa CV
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
