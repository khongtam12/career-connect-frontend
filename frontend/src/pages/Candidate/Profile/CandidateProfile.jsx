import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../../../stores/useUserStore";
import { getCandidateProfile, updateCandidateProfile, uploadAvatar, changePassword } from "../../../service/profileService";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

/* ── Inline SVG Icons (professional, no emoji) ── */
const IconUser = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const IconBriefcase = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);
const IconShield = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const IconCamera = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
);
const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);
const IconSave = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
);
const IconX = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);
const IconEyeOff = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

const IconKey = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
);

const NAV_ITEMS = [
    { id: "info", label: "Thông tin cá nhân", Icon: IconUser },
    { id: "career", label: "Thông tin nghề nghiệp", Icon: IconBriefcase },
    { id: "security", label: "Đổi mật khẩu", Icon: IconShield },
];

export default function CandidateProfile() {
    const fetchUser = useUserStore(s => s.fetchUser);
    const [profile, setProfile] = useState(null);
    const [activeSection, setActiveSection] = useState("info");
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileRef = useRef();

    // Password change state
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [savingPw, setSavingPw] = useState(false);

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await getCandidateProfile();
            const data = res.data;
            setProfile(data);
            setForm({
                fullName: data.fullName || "", phone: data.phone || "",
                avatar: data.avatar || "", dateOfBirth: data.dateOfBirth || "",
                address: data.address || "", experienceYear: data.experienceYear || 0,
                currentJobTitle: data.currentJobTitle || "", expectedSalary: data.expectedSalary || 0
            });
        } catch { toast.error("Không thể tải thông tin"); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await updateCandidateProfile(form);
            setProfile(res.data);
            setEditing(false);
            await fetchUser();
            toast.success("Cập nhật thành công!");
        } catch { toast.error("Cập nhật thất bại"); }
        finally { setSaving(false); }
    };

    const handleCancel = () => {
        setForm({
            fullName: profile.fullName || "", phone: profile.phone || "",
            avatar: profile.avatar || "", dateOfBirth: profile.dateOfBirth || "",
            address: profile.address || "", experienceYear: profile.experienceYear || 0,
            currentJobTitle: profile.currentJobTitle || "", expectedSalary: profile.expectedSalary || 0
        });
        setEditing(false);
    };

    const onChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingAvatar(true);
            const url = await uploadAvatar(file);
            onChange("avatar", url);
        } catch { toast.error("Tải ảnh thất bại"); }
        finally { setUploadingAvatar(false); }
    };

    const handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = pwForm;
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin"); return;
        }
        if (newPassword.length < 8) {
            toast.error("Mật khẩu mới phải có ít nhất 8 ký tự"); return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp"); return;
        }
        try {
            setSavingPw(true);
            await changePassword({ currentPassword, newPassword, confirmPassword });
            toast.success("Đổi mật khẩu thành công!");
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
        } finally {
            setSavingPw(false);
        }
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
            <CircularProgress sx={{ color: "#00b14f" }} />
        </div>
    );
    if (!profile) return (
        <div style={{ textAlign: "center", padding: 40, color: "#ef4444" }}>Không tìm thấy thông tin</div>
    );

    const getInitials = (name) => name?.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase() || "U";
    const avatarSrc = editing ? form.avatar : profile.avatar;

    return (
        <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#f4f6f8", minHeight: "100vh", padding: "32px 0" }}>
            <div style={{ maxWidth: 1020, margin: "0 auto", padding: "0 20px" }}>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

                    {/* Sidebar */}
                    <div style={{ width: 248, flexShrink: 0 }}>
                        {/* User card */}
                        <div style={{ background: "#fff", borderRadius: 16, padding: "28px 20px 20px", marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", textAlign: "center" }}>
                            <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
                                {avatarSrc ? (
                                    <img src={avatarSrc} alt="avatar"
                                        style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #dcfce7", boxShadow: "0 2px 8px rgba(0,177,79,0.2)" }} />
                                ) : (
                                    <div style={{
                                        width: 80, height: 80, borderRadius: "50%",
                                        background: "linear-gradient(135deg,#00b14f,#008a3e)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#fff", fontWeight: 700, fontSize: 28, border: "3px solid #dcfce7",
                                        boxShadow: "0 2px 8px rgba(0,177,79,0.2)"
                                    }}>
                                        {getInitials(profile.fullName)}
                                    </div>
                                )}
                                <span style={{
                                    position: "absolute", bottom: 4, right: 4, width: 14, height: 14,
                                    background: "#00b14f", borderRadius: "50%", border: "2.5px solid #fff",
                                    boxShadow: "0 0 0 2px #dcfce7"
                                }} />
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 15.5, color: "#111827", marginBottom: 3 }}>{profile.fullName}</div>
                            <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 10 }}>{profile.email}</div>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 14px", borderRadius: 20, background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", color: "#15803d", fontSize: 12, fontWeight: 700 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Ứng viên
                            </span>
                        </div>

                        {/* Nav */}
                        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                            {NAV_ITEMS.map((item, idx) => {
                                const active = activeSection === item.id;
                                return (
                                    <button key={item.id}
                                        onClick={() => { setActiveSection(item.id); setEditing(false); }}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 11, width: "100%",
                                            padding: "14px 18px",
                                            border: "none",
                                            borderBottom: idx < NAV_ITEMS.length - 1 ? "1px solid #f3f4f6" : "none",
                                            cursor: "pointer", textAlign: "left",
                                            background: active ? "#f0fdf4" : "transparent",
                                            color: active ? "#00b14f" : "#4b5563",
                                            fontWeight: active ? 600 : 400,
                                            fontSize: 13.5,
                                            borderLeft: active ? "3px solid #00b14f" : "3px solid transparent",
                                            transition: "all .15s"
                                        }}>
                                        <item.Icon />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {activeSection === "info" && (
                            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                                <div style={{ padding: "22px 30px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#00b14f" }}>
                                        <IconUser />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Thông tin cá nhân</h2>
                                        <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#6b7280" }}>Cập nhật thông tin hồ sơ của bạn</p>
                                    </div>
                                </div>
                                <div style={{ padding: "28px 30px" }}>
                                    {/* Avatar row */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, padding: "16px 20px", background: "linear-gradient(135deg,#f0fdf4,#f9fafb)", borderRadius: 12, border: "1px solid #dcfce7" }}>
                                        {avatarSrc ? (
                                            <img src={avatarSrc} alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid #bbf7d0" }} />
                                        ) : (
                                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#00b14f,#008a3e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 22 }}>
                                                {getInitials(profile.fullName)}
                                            </div>
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: 2 }}>{profile.fullName}</div>
                                            <div style={{ fontSize: 12.5, color: "#6b7280" }}>{profile.currentJobTitle || "Ứng viên"}</div>
                                        </div>
                                        {editing && (
                                            <div style={{ marginLeft: "auto" }}>
                                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                                                <button onClick={() => fileRef.current?.click()} disabled={uploadingAvatar}
                                                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 500 }}>
                                                    <IconCamera />
                                                    {uploadingAvatar ? "Đang tải..." : "Đổi ảnh"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
                                        <FieldBlock label="Họ và tên *"
                                            value={editing ? form.fullName : profile.fullName}
                                            editing={editing} placeholder="Nhập họ và tên"
                                            onChange={v => onChange("fullName", v)} accent="#00b14f" />
                                        <FieldBlock label="Email"
                                            value={profile.email} editing={false} accent="#00b14f" />
                                        <FieldBlock label="Số điện thoại"
                                            value={editing ? form.phone : (profile.phone || "Chưa cập nhật")}
                                            editing={editing} placeholder="Nhập số điện thoại"
                                            onChange={v => onChange("phone", v)} accent="#00b14f" />
                                        <FieldBlock label="Ngày sinh"
                                            value={editing ? form.dateOfBirth : (profile.dateOfBirth || "Chưa cập nhật")}
                                            editing={editing} type={editing ? "date" : "text"}
                                            onChange={v => onChange("dateOfBirth", v)} accent="#00b14f" />
                                        <FieldBlock label="Địa chỉ"
                                            value={editing ? form.address : (profile.address || "Chưa cập nhật")}
                                            editing={editing} placeholder="Nhập địa chỉ"
                                            onChange={v => onChange("address", v)} accent="#00b14f" />
                                        <FieldBlock label="Ngày tạo"
                                            value={profile.createdAt || "—"} editing={false} accent="#00b14f" />
                                    </div>

                                    <ActionRow editing={editing} saving={saving}
                                        onSave={handleSave} onCancel={handleCancel}
                                        onEdit={() => setEditing(true)} accent="#00b14f" />
                                </div>
                            </div>
                        )}

                        {activeSection === "career" && (
                            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                                <div style={{ padding: "22px 30px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                                        <IconBriefcase />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Thông tin nghề nghiệp</h2>
                                        <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#6b7280" }}>Giúp nhà tuyển dụng hiểu rõ hơn về bạn</p>
                                    </div>
                                </div>
                                <div style={{ padding: "28px 30px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
                                        <FieldBlock label="Vị trí hiện tại"
                                            value={editing ? form.currentJobTitle : (profile.currentJobTitle || "Chưa cập nhật")}
                                            editing={editing} placeholder="VD: Frontend Developer"
                                            onChange={v => onChange("currentJobTitle", v)} accent="#00b14f" />
                                        <FieldBlock label="Kinh nghiệm (năm)"
                                            value={editing ? form.experienceYear : `${profile.experienceYear || 0} năm`}
                                            editing={editing} type={editing ? "number" : "text"}
                                            placeholder="Số năm kinh nghiệm"
                                            onChange={v => onChange("experienceYear", +v)} accent="#00b14f" />
                                        <div style={{ gridColumn: "1 / -1" }}>
                                            <FieldBlock label="Lương mong muốn (VNĐ)"
                                                value={editing ? form.expectedSalary : `${(profile.expectedSalary || 0).toLocaleString("vi-VN")} VNĐ`}
                                                editing={editing} type={editing ? "number" : "text"}
                                                placeholder="VD: 15000000"
                                                onChange={v => onChange("expectedSalary", +v)} accent="#00b14f" />
                                        </div>
                                    </div>

                                    <ActionRow editing={editing} saving={saving}
                                        onSave={handleSave} onCancel={handleCancel}
                                        onEdit={() => setEditing(true)} accent="#00b14f" />
                                </div>
                            </div>
                        )}

                        {activeSection === "security" && (
                            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                                <div style={{ padding: "22px 30px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
                                        <IconShield />
                                    </div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Đổi mật khẩu</h2>
                                        <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#6b7280" }}>Bảo vệ tài khoản bằng mật khẩu mạnh</p>
                                    </div>
                                </div>
                                <div style={{ padding: "28px 30px" }}>
                                    <div style={{ display: "grid", gap: 20, maxWidth: 480 }}>
                                        <PasswordField label="Mật khẩu hiện tại *" value={pwForm.currentPassword}
                                            placeholder="Nhập mật khẩu hiện tại" accent="#00b14f"
                                            onChange={v => setPwForm(f => ({ ...f, currentPassword: v }))} />
                                        <PasswordField label="Mật khẩu mới *" value={pwForm.newPassword}
                                            placeholder="Tối thiểu 8 ký tự" accent="#00b14f"
                                            onChange={v => setPwForm(f => ({ ...f, newPassword: v }))} />
                                        <PasswordField label="Xác nhận mật khẩu mới *" value={pwForm.confirmPassword}
                                            placeholder="Nhập lại mật khẩu mới" accent="#00b14f"
                                            onChange={v => setPwForm(f => ({ ...f, confirmPassword: v }))} />
                                    </div>
                                    <div style={{ marginTop: 24 }}>
                                        <button onClick={handleChangePassword} disabled={savingPw}
                                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 9, border: "none", background: savingPw ? "#9ca3af" : "#00b14f", color: "#fff", fontWeight: 600, fontSize: 14, cursor: savingPw ? "default" : "pointer" }}>
                                            <IconKey /> {savingPw ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
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

function PasswordField({ label, value, onChange, placeholder, accent = "#00b14f" }) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {label}
            </label>
            <div style={{ position: "relative" }}>
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "10px 44px 10px 13px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s", background: "#fff" }}
                    onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}22`; }}
                    onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center", padding: 0 }}>
                    {show ? <IconEyeOff /> : <IconEye />}
                </button>
            </div>
        </div>
    );
}

function FieldBlock({ label, value, editing, onChange, placeholder, type = "text", valueColor, accent = "#00b14f" }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {label}
            </label>
            {editing ? (
                <input type={type} value={value} onChange={e => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s", background: "#fff" }}
                    onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}22`; }}
                    onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
                />
            ) : (
                <div style={{ padding: "10px 13px", borderRadius: 9, background: "#f9fafb", border: "1.5px solid #f3f4f6", fontSize: 14, color: valueColor || "#1f2937", fontWeight: valueColor ? 600 : 400, minHeight: 40 }}>
                    {value || "—"}
                </div>
            )}
        </div>
    );
}

function ActionRow({ editing, saving, onSave, onCancel, onEdit, accent = "#00b14f" }) {
    return (
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
            {editing ? (
                <>
                    <button onClick={onSave} disabled={saving}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 24px", borderRadius: 9, border: "none", background: saving ? "#9ca3af" : accent, color: "#fff", fontWeight: 600, fontSize: 14, cursor: saving ? "default" : "pointer", transition: "opacity .15s" }}>
                        <IconSave /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button onClick={onCancel}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 9, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
                        <IconX /> Hủy
                    </button>
                </>
            ) : (
                <button onClick={onEdit}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 9, border: `1.5px solid ${accent}`, background: "#fff", color: accent, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                    <IconEdit /> Chỉnh sửa thông tin
                </button>
            )}
        </div>
    );
}
