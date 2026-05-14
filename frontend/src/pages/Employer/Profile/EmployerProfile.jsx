import { useState, useEffect } from "react";
import { useUserStore } from "../../../stores/useUserStore";
import { getEmployerProfile, updateEmployerProfile, getCompanyProfile, updateCompanyProfile, uploadAvatar } from "../../../service/profileService";
import {
    Box, Card, CardContent, Avatar, Typography, TextField, Button,
    Divider, Stack, Chip, CircularProgress, Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessIcon from "@mui/icons-material/Business";
import { toast } from "react-toastify";

export default function EmployerProfile() {
    const fetchUser = useUserStore(s => s.fetchUser);
    const [profile, setProfile] = useState(null);
    const [company, setCompany] = useState(null);
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(false);
    const [pForm, setPForm] = useState({});
    const [cForm, setCForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await getEmployerProfile();
            const data = res.data;
            setProfile(data);
            setPForm({ fullName: data.fullName||"", phone: data.phone||"", avatar: data.avatar||"", position: data.position||"" });
            if (data.companyId) {
                try {
                    const cd = await getCompanyProfile(data.companyId);
                    setCompany(cd);
                    setCForm({ name: cd.name||"", website: cd.website||"", email: cd.email||"", phone: cd.phone||"", address: cd.address||"", description: cd.description||"", companySize: cd.companySize||1, foundedYear: cd.foundedYear||2020 });
                } catch (e) { console.error(e); }
            }
        } catch (err) {
            toast.error("Không thể tải thông tin");
        } finally { setLoading(false); }
    };

    const savePersonal = async () => {
        try { setSaving(true); const res = await updateEmployerProfile(pForm); setProfile(res.data); setEditingPersonal(false); await fetchUser(); toast.success("Cập nhật thành công!"); }
        catch (e) { toast.error("Cập nhật thất bại"); }
        finally { setSaving(false); }
    };

    const saveCompany = async () => {
        if (!profile?.companyId) return;
        try { setSaving(true); const res = await updateCompanyProfile(profile.companyId, cForm); setCompany(res); setEditingCompany(false); toast.success("Cập nhật công ty thành công!"); }
        catch (e) { toast.error("Cập nhật công ty thất bại"); }
        finally { setSaving(false); }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
    if (!profile) return <Box display="flex" justifyContent="center" mt={4}><Alert severity="error">Không tìm thấy</Alert></Box>;

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 3, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                    Hồ sơ Nhà Tuyển Dụng
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Quản lý thông tin cá nhân và hồ sơ công ty của bạn
                </Typography>
            </Box>

            {/* Personal Info */}
            <Card sx={{ mb: 4, backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
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
                                <Chip label="Nhà tuyển dụng" color="warning" size="small" variant="tonal" sx={{ fontWeight: 600, borderRadius: '8px' }} />
                                {profile.position && <Chip label={profile.position} size="small" variant="outlined" sx={{ borderRadius: '8px' }} />}
                            </Stack>
                        </Box>
                    </Stack>
                    
                    <Divider sx={{ mb: 4, borderColor: '#f3f4f6' }} />
                    
                    {editingPersonal ? (
                        <Stack spacing={3}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Họ và tên" value={pForm.fullName} onChange={e => setPForm({...pForm, fullName: e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField label="Số điện thoại" value={pForm.phone} onChange={e => setPForm({...pForm, phone: e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField label="Chức vụ" value={pForm.position} onChange={e => setPForm({...pForm, position: e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
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
                                                setPForm({...pForm, avatar: url});
                                            } catch (err) {
                                                toast.error("Tải ảnh thất bại");
                                            } finally {
                                                setUploadingAvatar(false);
                                            }
                                        }
                                    }} />
                                </Button>
                                {pForm.avatar && <Avatar src={pForm.avatar} sx={{ width: 48, height: 48 }} />}
                            </Stack>
                            
                            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                                <Button variant="contained" startIcon={<SaveIcon />} onClick={savePersonal} disabled={saving} sx={{ borderRadius: '10px', textTransform: 'none', px: 4 }}>
                                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                                <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => setEditingPersonal(false)} sx={{ borderRadius: '10px', textTransform: 'none', color: '#6b7280', borderColor: '#e5e7eb', '&:hover': { backgroundColor: '#f9fafb', borderColor: '#d1d5db' } }}>
                                    Hủy
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <>
                            <Grid container spacing={4}>
                                {[
                                    { label: "Email", value: profile.email },
                                    { label: "Họ và tên", value: profile.fullName },
                                    { label: "Số điện thoại", value: profile.phone || "Chưa cập nhật" },
                                    { label: "Chức vụ", value: profile.position || "Chưa cập nhật" },
                                    { label: "Công ty", value: profile.companyName || "Chưa liên kết" },
                                ].map(item => (
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
                                <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditingPersonal(true)} sx={{ borderRadius: '10px', textTransform: 'none', px: 3 }}>
                                    Chỉnh sửa hồ sơ
                                </Button>
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Company Info */}
            {company && (
                <Card sx={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" mb={4}>
                            <Avatar variant="rounded" sx={{ bgcolor: 'primary.50', color: 'primary.main', border: '1px solid #e0e0e0', width: 48, height: 48 }}>
                                <BusinessIcon />
                            </Avatar>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
                                Thông tin công ty
                            </Typography>
                        </Stack>
                        
                        <Divider sx={{ mb: 4, borderColor: '#f3f4f6' }} />
                        
                        {editingCompany ? (
                            <Stack spacing={3}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Tên công ty" value={cForm.name} onChange={e => setCForm({...cForm, name: e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Website" value={cForm.website} onChange={e => setCForm({...cForm, website: e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Email công ty" value={cForm.email} onChange={e => setCForm({...cForm, email: e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="SĐT công ty" value={cForm.phone} onChange={e => setCForm({...cForm, phone: e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField label="Địa chỉ" value={cForm.address} onChange={e => setCForm({...cForm, address: e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField label="Mô tả" value={cForm.description} onChange={e => setCForm({...cForm, description: e.target.value})} fullWidth size="small" multiline rows={3} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Quy mô (nhân sự)" type="number" value={cForm.companySize} onChange={e => setCForm({...cForm, companySize: +e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField label="Năm thành lập" type="number" value={cForm.foundedYear} onChange={e => setCForm({...cForm, foundedYear: +e.target.value})} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                    </Grid>
                                </Grid>
                                
                                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                                    <Button variant="contained" startIcon={<SaveIcon />} onClick={saveCompany} disabled={saving} sx={{ borderRadius: '10px', textTransform: 'none', px: 4 }}>
                                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                    </Button>
                                    <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => setEditingCompany(false)} sx={{ borderRadius: '10px', textTransform: 'none', color: '#6b7280', borderColor: '#e5e7eb', '&:hover': { backgroundColor: '#f9fafb', borderColor: '#d1d5db' } }}>
                                        Hủy
                                    </Button>
                                </Stack>
                            </Stack>
                        ) : (
                            <>
                                <Grid container spacing={4}>
                                    {[
                                        { label: "Tên", value: company.name },
                                        { label: "Website", value: company.website || "—" },
                                        { label: "Email", value: company.email || "—" },
                                        { label: "SĐT", value: company.phone || "—" },
                                        { label: "Địa chỉ", value: company.address || "—" },
                                        { label: "Quy mô", value: `${company.companySize} nhân sự` },
                                        { label: "Năm thành lập", value: company.foundedYear },
                                        { label: "Trạng thái", value: company.statusCompany },
                                    ].map(item => (
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
                                    <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditingCompany(true)} sx={{ borderRadius: '10px', textTransform: 'none', px: 3 }}>
                                        Chỉnh sửa công ty
                                    </Button>
                                </Box>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
