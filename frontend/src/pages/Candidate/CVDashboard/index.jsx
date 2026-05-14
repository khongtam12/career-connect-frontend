import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Button, Card, CardContent, Divider, Grid, 
    Container, Stack, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
    Add as PlusIcon, 
    Description as FileTextIcon, 
    TrendingUp as TrendingUpIcon, 
    Dashboard as LayoutDashboardIcon,
    NoteAdd as NoteAddIcon
} from '@mui/icons-material';
import CVCard from '../../../components/user/cv-shared/CVCard';
import * as cvService from '../../../service/cvService';
import { useUserStore } from '../../../stores/useUserStore';
import { toast } from 'react-toastify';

/* ── Stat card (small widget) ── */
function StatWidget({ icon: Icon, value, label, accent = false }) {
    return (
        <Card sx={{ height: '100%', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: '#fff', display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ 
                width: 48, height: 48, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, flexShrink: 0,
                backgroundColor: accent ? '#111827' : '#f3f4f6',
                color: accent ? '#fff' : '#6b7280'
            }}>
                <Icon />
            </Box>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: accent ? '#111827' : '#374151', lineHeight: 1 }}>
                    {value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, mt: 0.5, display: 'block' }}>
                    {label}
                </Typography>
            </Box>
        </Card>
    );
}

/* ── "Tạo CV mới" card placeholder in grid ── */
function NewCVCard({ onClick }) {
    return (
        <Card 
            onClick={onClick}
            sx={{ 
                height: '100%', minHeight: 260, borderRadius: '16px', 
                border: '2px dashed #e5e7eb', backgroundColor: '#f9fafb',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s ease-in-out',
                boxShadow: 'none',
                '&:hover': {
                    borderColor: '#9ca3af', backgroundColor: '#f3f4f6',
                    transform: 'translateY(-4px)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }
            }}
        >
            <Box sx={{ 
                width: 56, height: 56, borderRadius: '16px', backgroundColor: '#e5e7eb', color: '#6b7280',
                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2,
                transition: 'all 0.2s',
                '.MuiCard-root:hover &': { backgroundColor: '#d1d5db', color: '#111827', transform: 'scale(1.1)' }
            }}>
                <PlusIcon fontSize="medium" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
                Tạo CV mới
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Bắt đầu với mẫu đẹp
            </Typography>
        </Card>
    );
}

/* ── Empty state ── */
function EmptyState({ onCreateClick }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <Card sx={{ maxWidth: 400, width: '100%', textAlign: 'center', border: '2px dashed #e5e7eb', borderRadius: '16px', boxShadow: 'none' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, px: 4 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '16px', backgroundColor: '#f3f4f6', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <NoteAddIcon fontSize="large" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                        Bạn chưa có CV nào
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 4, px: 2 }}>
                        Hãy tạo CV đầu tiên để bắt đầu hành trình tìm việc của bạn.
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={onCreateClick}
                        startIcon={<PlusIcon />}
                        sx={{ backgroundColor: '#111827', color: '#fff', borderRadius: '10px', textTransform: 'none', px: 3, py: 1, '&:hover': { backgroundColor: '#1f2937' } }}
                    >
                        Tạo CV ngay
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}

/* ═══════════════════════════════════════════
   Dashboard Page
   ═══════════════════════════════════════════ */
export default function CVDashboard() {
    const navigate = useNavigate();
    const [cvList, setCvList] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cvToDelete, setCvToDelete] = useState(null);

    const { user } = useUserStore();

    useEffect(() => {
        setMounted(true);
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
        fetchCVs();
    }, [user]);

    const handleCreate = () => {
        try {
            const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const newId = `cv_${uuid}`;

            const draft = {
                id: newId,
                name: 'CV chưa đặt tên',
                templateId: 1,
                data: {
                    personal: {}, skills: [], experience: [],
                    education: [], projects: [], certificates: [],
                },
                updatedAt: new Date().toISOString(),
                isDraft: true,
            };

            localStorage.setItem(`draft_cv_${newId}`, JSON.stringify(draft));
            navigate(`/cv-builder?id=${newId}`);
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

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb', py: 5 }}>
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
                            onClick={handleCreate} 
                            startIcon={<PlusIcon />}
                            sx={{ backgroundColor: '#111827', color: '#fff', borderRadius: '10px', textTransform: 'none', px: 3, '&:hover': { backgroundColor: '#1f2937' }, boxShadow: 'none' }}
                        >
                            Tạo CV mới
                        </Button>
                    )}
                </Box>

                {isEmpty ? (
                    <EmptyState onCreateClick={handleCreate} />
                ) : (
                    <>
                        {/* ── Stats bar ── */}
                        <Grid container spacing={3} sx={{ mb: 5 }}>
                            <Grid item xs={12} md={4}>
                                <StatWidget icon={FileTextIcon} value={cvList.length} label="Tổng CV" accent />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 3, borderRadius: '16px', background: 'linear-gradient(to right, #eff6ff, #eef2ff)', border: '1px solid #dbeafe', boxShadow: 'none' }}>
                                    <Box sx={{ width: 48, height: 48, borderRadius: '12px', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, flexShrink: 0 }}>
                                        <TrendingUpIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
                                            Mẹo: CV tốt = Cơ hội tốt!
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#3b82f6', mt: 0.5 }}>
                                            Luôn cập nhật CV để thu hút nhà tuyển dụng
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>

                        <Divider sx={{ mb: 5, borderColor: '#e5e7eb' }} />

                        {/* ── CV Grid ── */}
                        <Grid container spacing={3}>
                            {cvList.map((cv, i) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={cv.id}>
                                    <CVCard
                                        cv={cv}
                                        index={i}
                                        onDelete={confirmDelete}
                                    />
                                </Grid>
                            ))}
                            {/* New CV card always last */}
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <NewCVCard onClick={handleCreate} />
                            </Grid>
                        </Grid>
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
