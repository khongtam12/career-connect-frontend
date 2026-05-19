import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../../../stores/useUserStore";
import { getEmployerProfile, updateEmployerProfile, getCompanyProfile, updateCompanyProfile, uploadAvatar, changePassword } from "../../../service/profileService";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

const SvgUser = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const SvgBuilding = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h6M9 3v18"/></svg>;
const SvgShield = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const SvgCamera = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const SvgEdit = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const SvgSave = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const SvgKey = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const SvgEye = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const SvgEyeOff = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

const NAV_ITEMS = [
    { id: "info", label: "Thông tin tài khoản", Icon: SvgUser },
    { id: "company", label: "Thông tin công ty", Icon: SvgBuilding },
    { id: "security", label: "Đổi mật khẩu", Icon: SvgShield },
];

export default function EmployerProfile() {
    const fetchUser = useUserStore(s => s.fetchUser);
    const [profile, setProfile] = useState(null);
    const [company, setCompany] = useState(null);
    const [activeSection, setActiveSection] = useState("info");
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(false);
    const [pForm, setPForm] = useState({});
    const [cForm, setCForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileRef = useRef();
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [savingPw, setSavingPw] = useState(false);

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await getEmployerProfile();
            const data = res.data;
            setProfile(data);
            setPForm({ fullName: data.fullName || "", phone: data.phone || "", avatar: data.avatar || "", position: data.position || "" });
            if (data.companyId) {
                try {
                    const cd = await getCompanyProfile(data.companyId);
                    setCompany(cd);
                    setCForm({ name: cd.name || "", website: cd.website || "", email: cd.email || "", phone: cd.phone || "", address: cd.address || "", description: cd.description || "", companySize: cd.companySize || 1, foundedYear: cd.foundedYear || 2020 });
                } catch (e) { console.error(e); }
            }
        } catch { toast.error("Không thể tải thông tin"); }
        finally { setLoading(false); }
    };

    const savePersonal = async () => {
        try {
            setSaving(true);
            const res = await updateEmployerProfile(pForm);
            setProfile(res.data);
            setEditingPersonal(false);
            await fetchUser();
            toast.success("Cập nhật thành công!");
        } catch { toast.error("Cập nhật thất bại"); }
        finally { setSaving(false); }
    };

    const saveCompany = async () => {
        if (!profile?.companyId) return;
        try {
            setSaving(true);
            const res = await updateCompanyProfile(profile.companyId, cForm);
            setCompany(res);
            setEditingCompany(false);
            toast.success("Cập nhật công ty thành công!");
        } catch { toast.error("Cập nhật công ty thất bại"); }
        finally { setSaving(false); }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingAvatar(true);
            const url = await uploadAvatar(file);
            setPForm(f => ({ ...f, avatar: url }));
        } catch { toast.error("Tải ảnh thất bại"); }
        finally { setUploadingAvatar(false); }
    };

    const handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = pwForm;
        if (!currentPassword || !newPassword || !confirmPassword) { toast.error("Vui lòng điền đầy đủ thông tin"); return; }
        if (newPassword.length < 8) { toast.error("Mật khẩu mới phải có ít nhất 8 ký tự"); return; }
        if (newPassword !== confirmPassword) { toast.error("Mật khẩu xác nhận không khớp"); return; }
        try {
            setSavingPw(true);
            await changePassword({ currentPassword, newPassword, confirmPassword });
            toast.success("Đổi mật khẩu thành công!");
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
        } finally { setSavingPw(false); }
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
            <CircularProgress sx={{ color: "#00b14f" }} />
        </div>
    );
    if (!profile) return (
        <div style={{ textAlign: "center", padding: 40, color: "#ef4444" }}>Không tìm thấy thông tin</div>
    );

    const getInitials = (name) => name?.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase() || "E";
    const avatarSrc = editingPersonal ? pForm.avatar : profile.avatar;

    const statusLabel = company?.statusCompany;
    const statusColor = statusLabel === "APPROVED" ? "#00b14f" : statusLabel === "PENDING" ? "#f59e0b" : "#ef4444";
    const statusText = statusLabel === "APPROVED" ? "Đã xác thực" : statusLabel === "PENDING" ? "Chờ duyệt" : (statusLabel || "—");

    return (
        <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#f5f5f5", minHeight: "100vh", padding: "24px 0" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px" }}>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

                    {/* Sidebar */}
                    <div style={{ width: 240, flexShrink: 0 }}>
                        <div style={{ background: "#fff", borderRadius: 12, padding: "24px 16px", marginBottom: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", textAlign: "center" }}>
                            <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
                                {avatarSrc ? (
                                    <img src={avatarSrc} alt="avatar" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid #fef3c7" }} />
                                ) : (
                                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 24, border: "3px solid #fef3c7" }}>
                                        {getInitials(profile.fullName)}
                                    </div>
                                )}
                                <span style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, background: "#00b14f", borderRadius: "50%", border: "2px solid #fff" }} />
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 2 }}>{profile.fullName}</div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{profile.email}</div>
                            {profile.position && <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>{profile.position}</div>}
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 14px", borderRadius: 20, background: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#b45309", fontSize: 12, fontWeight: 700 }}>
                                <SvgUser /> Nhà tuyển dụng
                            </span>
                            {company && (
                                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f3f4f6", fontSize: 12.5, color: "#374151", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                                    <SvgBuilding /> {company.name}
                                </div>
                            )}
                        </div>

                        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                            {NAV_ITEMS.map((item, idx) => (
                                <button key={item.id}
                                    onClick={() => { setActiveSection(item.id); setEditingPersonal(false); setEditingCompany(false); }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                                        padding: "13px 16px", border: "none",
                                        borderBottom: idx < NAV_ITEMS.length - 1 ? "1px solid #f3f4f6" : "none",
                                        cursor: "pointer", textAlign: "left",
                                        background: activeSection === item.id ? "#fffbeb" : "transparent",
                                        color: activeSection === item.id ? "#b45309" : "#4b5563",
                                        fontWeight: activeSection === item.id ? 600 : 400,
                                        fontSize: 13.5, borderLeft: activeSection === item.id ? "3px solid #f59e0b" : "3px solid transparent",
                                        transition: "all .15s"
                                    }}>
                                    <item.Icon />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main */}
                    <div style={{ flex: 1 }}>
                        {/* Personal info */}
                        {activeSection === "info" && (
                            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                                <div style={{ padding: "20px 28px", borderBottom: "1px solid #f3f4f6" }}>
                                    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Cài đặt thông tin tài khoản</h2>
                                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>(*) Các trường bắt buộc</p>
                                </div>
                                <div style={{ padding: "28px" }}>
                                    {/* Avatar */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, padding: "16px 20px", background: "#f9fafb", borderRadius: 10 }}>
                                        {avatarSrc ? (
                                            <img src={avatarSrc} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }} />
                                        ) : (
                                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 22 }}>
                                                {getInitials(profile.fullName)}
                                            </div>
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: 2 }}>{profile.fullName}</div>
                                            <div style={{ fontSize: 12.5, color: "#6b7280" }}>{profile.position || "Nhà tuyển dụng"}{company ? ` · ${company.name}` : ""}</div>
                                        </div>
                                        {editingPersonal && (
                                            <div style={{ marginLeft: "auto" }}>
                                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                                                <button onClick={() => fileRef.current?.click()} disabled={uploadingAvatar}
                                                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 500 }}>
                                                    <SvgCamera /> {uploadingAvatar ? "Đang tải..." : "Đổi ảnh"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
                                        <FieldBlock label="Họ và tên *"
                                            value={editingPersonal ? pForm.fullName : profile.fullName}
                                            editing={editingPersonal} placeholder="Nhập họ và tên"
                                            onChange={v => setPForm(f => ({ ...f, fullName: v }))} />
                                        <FieldBlock label="Email"
                                            value={profile.email} editing={false} />
                                        <FieldBlock label="Số điện thoại"
                                            value={editingPersonal ? pForm.phone : (profile.phone || "Chưa cập nhật")}
                                            editing={editingPersonal} placeholder="Nhập số điện thoại"
                                            onChange={v => setPForm(f => ({ ...f, phone: v }))} />
                                        <FieldBlock label="Chức vụ"
                                            value={editingPersonal ? pForm.position : (profile.position || "Chưa cập nhật")}
                                            editing={editingPersonal} placeholder="VD: HR Manager"
                                            onChange={v => setPForm(f => ({ ...f, position: v }))} />
                                        <FieldBlock label="Công ty"
                                            value={profile.companyName || "Chưa liên kết"} editing={false} />
                                        <FieldBlock label="Ngày tạo"
                                            value={profile.createdAt || "—"} editing={false} />
                                    </div>

                                    <ActionRow editing={editingPersonal} saving={saving}
                                        onSave={savePersonal} onCancel={() => { setEditingPersonal(false); setPForm({ fullName: profile.fullName || "", phone: profile.phone || "", avatar: profile.avatar || "", position: profile.position || "" }); }}
                                        onEdit={() => setEditingPersonal(true)} accent="#f59e0b" />
                                </div>
                            </div>
                        )}

                        {/* Company info */}
                        {activeSection === "company" && company && (
                            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                                <div style={{ padding: "20px 28px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Thông tin công ty</h2>
                                        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Thông tin công ty hiển thị với ứng viên</p>
                                    </div>
                                    <span style={{ padding: "4px 14px", borderRadius: 20, background: statusColor + "1a", color: statusColor, fontSize: 12, fontWeight: 700 }}>
                                        {statusText}
                                    </span>
                                </div>
                                <div style={{ padding: "28px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
                                        <FieldBlock label="Tên công ty *"
                                            value={editingCompany ? cForm.name : company.name}
                                            editing={editingCompany} placeholder="Tên công ty"
                                            onChange={v => setCForm(f => ({ ...f, name: v }))} />
                                        <FieldBlock label="Website"
                                            value={editingCompany ? cForm.website : (company.website || "—")}
                                            editing={editingCompany} placeholder="https://..."
                                            onChange={v => setCForm(f => ({ ...f, website: v }))} />
                                        <FieldBlock label="Email công ty"
                                            value={editingCompany ? cForm.email : (company.email || "—")}
                                            editing={editingCompany} placeholder="contact@company.com"
                                            onChange={v => setCForm(f => ({ ...f, email: v }))} />
                                        <FieldBlock label="SĐT công ty"
                                            value={editingCompany ? cForm.phone : (company.phone || "—")}
                                            editing={editingCompany} placeholder="Số điện thoại"
                                            onChange={v => setCForm(f => ({ ...f, phone: v }))} />
                                        <FieldBlock label="Quy mô (nhân sự)"
                                            value={editingCompany ? cForm.companySize : `${company.companySize} nhân sự`}
                                            editing={editingCompany} type={editingCompany ? "number" : "text"}
                                            placeholder="Số lượng nhân sự"
                                            onChange={v => setCForm(f => ({ ...f, companySize: +v }))} />
                                        <FieldBlock label="Năm thành lập"
                                            value={editingCompany ? cForm.foundedYear : company.foundedYear}
                                            editing={editingCompany} type={editingCompany ? "number" : "text"}
                                            onChange={v => setCForm(f => ({ ...f, foundedYear: +v }))} />
                                        <div style={{ gridColumn: "1 / -1" }}>
                                            <FieldBlock label="Địa chỉ"
                                                value={editingCompany ? cForm.address : (company.address || "—")}
                                                editing={editingCompany} placeholder="Địa chỉ công ty"
                                                onChange={v => setCForm(f => ({ ...f, address: v }))} />
                                        </div>
                                        <div style={{ gridColumn: "1 / -1" }}>
                                            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Mô tả</label>
                                            {editingCompany ? (
                                                <textarea value={cForm.description} onChange={e => setCForm(f => ({ ...f, description: e.target.value }))}
                                                    placeholder="Mô tả về công ty..."
                                                    rows={4}
                                                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, color: "#111827", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                                                    onFocus={e => e.target.style.borderColor = "#f59e0b"}
                                                    onBlur={e => e.target.style.borderColor = "#d1d5db"}
                                                />
                                            ) : (
                                                <div style={{ padding: "9px 12px", borderRadius: 8, background: "#f9fafb", border: "1px solid #f3f4f6", fontSize: 14, color: "#111827", minHeight: 80, whiteSpace: "pre-wrap" }}>
                                                    {company.description || "—"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <ActionRow editing={editingCompany} saving={saving}
                                        onSave={saveCompany}
                                        onCancel={() => { setEditingCompany(false); setCForm({ name: company.name || "", website: company.website || "", email: company.email || "", phone: company.phone || "", address: company.address || "", description: company.description || "", companySize: company.companySize || 1, foundedYear: company.foundedYear || 2020 }); }}
                                        onEdit={() => setEditingCompany(true)}
                                        editLabel="Chỉnh sửa thông tin công ty"
                                        accent="#f59e0b" />
                                </div>
                            </div>
                        )}

                        {activeSection === "company" && !company && (
                            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "56px 28px", textAlign: "center" }}>
                                <div style={{ width: 64, height: 64, borderRadius: 16, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#b45309" }}>
                                    <SvgBuilding />
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Chưa liên kết công ty</div>
                                <div style={{ fontSize: 13.5, color: "#6b7280" }}>Tài khoản của bạn chưa được liên kết với công ty nào</div>
                            </div>
                        )}

                        {activeSection === "security" && (
                            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                                <div style={{ padding: "22px 28px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
                                        <SvgShield />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Đổi mật khẩu</h2>
                                        <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>Bảo vệ tài khoản bằng mật khẩu mạnh</p>
                                    </div>
                                </div>
                                <div style={{ padding: 28 }}>
                                    <div style={{ display: "grid", gap: 20, maxWidth: 480 }}>
                                        <PwField label="Mật khẩu hiện tại *" value={pwForm.currentPassword} placeholder="Nhập mật khẩu hiện tại" accent="#f59e0b" onChange={v => setPwForm(f => ({ ...f, currentPassword: v }))} />
                                        <PwField label="Mật khẩu mới *" value={pwForm.newPassword} placeholder="Tối thiểu 8 ký tự" accent="#f59e0b" onChange={v => setPwForm(f => ({ ...f, newPassword: v }))} />
                                        <PwField label="Xác nhận mật khẩu mới *" value={pwForm.confirmPassword} placeholder="Nhập lại mật khẩu mới" accent="#f59e0b" onChange={v => setPwForm(f => ({ ...f, confirmPassword: v }))} />
                                    </div>
                                    <div style={{ marginTop: 24 }}>
                                        <button onClick={handleChangePassword} disabled={savingPw}
                                            style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 24px", borderRadius: 9, border: "none", background: savingPw ? "#9ca3af" : "#f59e0b", color: "#fff", fontWeight: 600, fontSize: 14, cursor: savingPw ? "default" : "pointer" }}>
                                            <SvgKey /> {savingPw ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PwField({ label, value, onChange, placeholder, accent = "#f59e0b" }) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
            <div style={{ position: "relative" }}>
                <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    style={{ width: "100%", padding: "9px 44px 9px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }}
                    onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}22`; }}
                    onBlur={e => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none"; }} />
                <button type="button" onClick={() => setShow(s => !s)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", padding: 0 }}>
                    {show ? <SvgEyeOff /> : <SvgEye />}
                </button>
            </div>
        </div>
    );
}

function FieldBlock({ label, value, editing, onChange, placeholder, type = "text", valueColor }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                {label}
            </label>
            {editing ? (
                <input type={type} value={value} onChange={e => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                    onFocus={e => e.target.style.borderColor = "#f59e0b"}
                    onBlur={e => e.target.style.borderColor = "#d1d5db"}
                />
            ) : (
                <div style={{ padding: "9px 12px", borderRadius: 8, background: "#f9fafb", border: "1px solid #f3f4f6", fontSize: 14, color: valueColor || "#111827", fontWeight: valueColor ? 600 : 400, minHeight: 38 }}>
                    {value || "—"}
                </div>
            )}
        </div>
    );
}

function ActionRow({ editing, saving, onSave, onCancel, onEdit, editLabel = "Chỉnh sửa thông tin", accent = "#f59e0b" }) {
    return (
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
            {editing ? (
                <>
                    <button onClick={onSave} disabled={saving}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 24px", borderRadius: 9, border: "none", background: saving ? "#9ca3af" : accent, color: "#fff", fontWeight: 600, fontSize: 14, cursor: saving ? "default" : "pointer" }}>
                        <SvgSave /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button onClick={onCancel}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
                        Hủy
                    </button>
                </>
            ) : (
                <button onClick={onEdit}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 9, border: `1.5px solid ${accent}`, background: "#fff", color: accent, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                    <SvgEdit /> {editLabel}
                </button>
            )}
        </div>
    );
}
