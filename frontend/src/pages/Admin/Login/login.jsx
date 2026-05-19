import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, User, Eye, EyeOff, LayoutDashboard } from "lucide-react";
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Button, 
  Paper,
  Box,
  Typography
} from "@mui/material";
import { login } from "../../../service/authService";
import { useUserStore } from "../../../stores/useUserStore";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const handleLoginSuccess = useUserStore((s) => s.handleLoginSuccess);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hydrated = useUserStore.persist.hasHydrated();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !user) return;
    if (user.role === "ADMIN") {
      navigate("/admin");
    }
  }, [isAuthenticated, user, navigate, hydrated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username, password, type: "ADMIN" });
      await handleLoginSuccess();
      toast.success("Chào mừng Admin quay trở lại!");
    } catch (err) {
      const msg = "Tên đăng nhập hoặc mật khẩu không chính xác!";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      {/* Cột trái: Giao diện Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-4 shadow-sm border border-emerald-100">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hệ thống Quản trị</h1>
            <p className="text-gray-500 mt-2">Vui lòng đăng nhập để quản lý hệ thống CareerConnect</p>
          </div>

          <Paper elevation={0} className="p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 bg-white">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Tên đăng nhập</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="admin_id"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} className="text-emerald-500" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "&.Mui-focused fieldset": { borderColor: "#10b981" },
                    },
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                  <Link 
                    to="/forgot-password?type=ADMIN" 
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} className="text-emerald-500" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "&.Mui-focused fieldset": { borderColor: "#10b981" },
                    },
                  }}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                  {error}
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.8,
                  borderRadius: "12px",
                  bgcolor: "#10b981",
                  "&:hover": { bgcolor: "#059669" },
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                }}
              >
                {loading ? "Đang xác thực..." : "Đăng nhập vào Dashboard"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-50">
                <div className="flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition cursor-not-allowed">
                     <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">Secured by Enterprise Shield</span>
                </div>
            </div>
          </Paper>

          <p className="mt-8 text-center text-gray-400 text-xs">
            © 2024 CareerConnect Enterprise. Toàn quyền bảo lưu.
          </p>
        </div>
      </div>

      {/* Cột phải: Visual/Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#022c22] relative overflow-hidden items-center justify-center text-white">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:32px_32px]"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 p-12 text-center max-w-lg">
          <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-emerald-200">Admin Control Panel v2.0</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Nơi quản lý <span className="text-emerald-500 italic">sức mạnh</span> của hệ thống
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Theo dõi dữ liệu thực, quản lý người dùng và tối ưu hóa quy trình tuyển dụng toàn diện.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { label: "Bảo mật", desc: "Xác thực 2 lớp Admin", color: "text-emerald-500" },
              { label: "Dữ liệu", desc: "Báo cáo thời gian thực", color: "text-emerald-500" },
              { label: "Quyền hạn", desc: "Phân quyền linh hoạt", color: "text-emerald-500" },
              { label: "Hỗ trợ", desc: "Support 24/7", color: "text-emerald-500" }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition cursor-default">
                <p className={`${item.color} font-bold text-sm mb-1`}>{item.label}</p>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
