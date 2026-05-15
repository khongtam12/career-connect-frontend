import { useState, useEffect } from "react";
import { useUserStore } from "../../../stores/useUserStore";
import { getCandidateProfile, updateCandidateProfile, uploadAvatar } from "../../../service/profileService";
import {
    Box, Card, CardContent, Avatar, Typography, TextField, Button,
    Divider, Stack, Chip, CircularProgress, Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";

export default function CandidateProfile() {
    const fetchUser = useUserStore((s) => s.fetchUser);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await getCandidateProfile();
            const data = res.data;
            setProfile(data);
            setForm({ fullName: data.fullName||"", phone: data.phone||"", avatar: data.avatar||"", dateOfBirth: data.dateOfBirth||"", address: data.address||"", experienceYear: data.experienceYear||0, currentJobTitle: data.currentJobTitle||"", expectedSalary: data.expectedSalary||0 });
        } catch (err) {
            toast.error("Không thể tải thông tin");
        } finally { setLoading(false); }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await updateCandidateProfile(form);
            setProfile(res.data);
            setEditing(false);
            await fetchUser();
            toast.success("Cập nhật thành công!");
        } catch (err) {
            toast.error("Cập nhật thất bại");
        } finally { setSaving(false); }
    };

    const handleCancel = () => {
        setForm({ fullName: profile.fullName||"", phone: profile.phone||"", avatar: profile.avatar||"", dateOfBirth: profile.dateOfBirth||"", address: profile.address||"", experienceYear: profile.experienceYear||0, currentJobTitle: profile.currentJobTitle||"", expectedSalary: profile.expectedSalary||0 });
        setEditing(false);
    };

    const onChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

    if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
    if (!profile) return <Box display="flex" justifyContent="center" mt={4}><Alert severity="error">Không tìm thấy</Alert></Box>;

    const fields = [
        { label: "Email", value: profile.email },
        { label: "Họ và tên", value: profile.fullName },
        { label: "Số điện thoại", value: profile.phone || "Chưa cập nhật" },
        { label: "Ngày sinh", value: profile.dateOfBirth || "Chưa cập nhật" },
        { label: "Địa chỉ", value: profile.address || "Chưa cập nhật" },
        { label: "Kinh nghiệm", value: `${profile.experienceYear} năm` },
        { label: "Vị trí hiện tại", value: profile.currentJobTitle || "Chưa cập nhật" },
        { label: "Lương mong muốn", value: `${profile.expectedSalary?.toLocaleString("vi-VN")} VNĐ` },
        { label: "Ngày tạo", value: profile.createdAt },
    ];

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 3, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                    Hồ sơ cá nhân
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Quản lý thông tin cá nhân và cập nhật hồ sơ để thu hút nhà tuyển dụng
                </Typography>
            </Box>

            <Card sx={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={3} alignItems="center" mb={4}>
                        <Avatar src={profile.avatar||""} sx={{ width: 88, height: 88, border: '2px solid #f0f0f0' }}>
                            {profile.fullName?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
                                {profile.fullName}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={1}>
                                <Chip label="Ứng viên" color="success" size="small" variant="tonal" sx={{ fontWeight: 600, borderRadius: '8px' }} />
                                {profile.currentJobTitle && <Chip label={profile.currentJobTitle} size="small" variant="outlined" sx={{ borderRadius: '8px' }} />}
                            </Stack>
                        </Box>
                    </Stack>
                    
                    <Divider sx={{ mb: 4, borderColor: '#f3f4f6' }} />
                    
                    {editing ? (
                        <Stack spacing={3}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Họ và tên" value={form.fullName} onChange={e => onChange("fullName", e.target.value)} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Số điện thoại" value={form.phone} onChange={e => onChange("phone", e.target.value)} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Ngày sinh" type="date" value={form.dateOfBirth} onChange={e => onChange("dateOfBirth", e.target.value)} fullWidth size="small" slotProps={{ inputLabel: { shrink: true } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Địa chỉ" value={form.address} onChange={e => onChange("address", e.target.value)} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField label="Kinh nghiệm (năm)" type="number" value={form.experienceYear} onChange={e => onChange("experienceYear", +e.target.value)} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField label="Vị trí hiện tại" value={form.currentJobTitle} onChange={e => onChange("currentJobTitle", e.target.value)} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField label="Lương mong muốn (VNĐ)" type="number" value={form.expectedSalary} onChange={e => onChange("expectedSalary", +e.target.value)} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                            </Grid>
                            
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                                <Button variant="outlined" component="label" disabled={uploadingAvatar} sx={{ borderRadius: '10px', textTransform: 'none' }}>
                                    {uploadingAvatar ? "Đang tải ảnh..." : "Chọn ảnh đại diện (Tải lên)"}
                                    <input type="file" hidden accept="image/*" onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                setUploadingAvatar(true);
                                                const url = await uploadAvatar(file);
                                                onChange("avatar", url);
                                            } catch (err) {
                                                toast.error("Tải ảnh thất bại");
                                            } finally {
                                                setUploadingAvatar(false);
                                            }
                                        }
                                    }} />
                                </Button>
                                {form.avatar && <Avatar src={form.avatar} sx={{ width: 48, height: 48 }} />}
                            </Stack>
                            
                            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving} sx={{ borderRadius: '10px', textTransform: 'none', px: 4 }}>
                                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                                <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel} sx={{ borderRadius: '10px', textTransform: 'none', color: '#6b7280', borderColor: '#e5e7eb', '&:hover': { backgroundColor: '#f9fafb', borderColor: '#d1d5db' } }}>
                                    Hủy
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <>
                            <Grid container spacing={4}>
                                {fields.map(item => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
                                        <Box sx={{ p: 2, backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                                            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                {item.label}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#111827', fontWeight: 500, mt: 0.5 }}>
                                                {item.value}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box mt={4}>
                                <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditing(true)} sx={{ borderRadius: '10px', textTransform: 'none', px: 3 }}>
                                    Chỉnh sửa hồ sơ
                                </Button>
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
