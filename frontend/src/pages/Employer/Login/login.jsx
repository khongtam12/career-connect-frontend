import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Shield, Eye, EyeOff } from "lucide-react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { login } from "../../../service/authService";
import { useUserStore } from "../../../stores/useUserStore";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const handleLoginSuccess = useUserStore((s) => s.handleLoginSuccess);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hydrated = useUserStore.persist.hasHydrated();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !user) return;

    if (user.role === "EMPLOYER") {
      navigate("/employer");
    } else if (user.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate, hydrated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username: email, password, type: "EMPLOYER" });
      await handleLoginSuccess();
      toast.success("Chào mừng nhà tuyển dụng trở lại!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác!";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-x-hidden">
      <div className="w-full lg:w-3/5 flex flex-col px-8 md:px-16 py-8 justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-extrabold italic tracking-tighter">
                Career<span className="text-[#00b14f]">Connect</span>
              </h1>
            </Link>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-[26px] font-bold text-[#00b14f] mb-3">
              Chào mừng bạn đã quay trở lại
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI và Hiring Funnel.
            </p>
          </div>

          <div className="space-y-6">
            <Button
              fullWidth
              variant="outlined"
              startIcon={<img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />}
              sx={{
                py: 1.5,
                borderColor: "#4285f4",
                color: "white",
                backgroundColor: "#4285f4",
                "&:hover": { backgroundColor: "#3367d6", borderColor: "#3367d6" },
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "15px",
                borderRadius: "6px",
              }}
            >
              Đăng nhập bằng Google
            </Button>

            <div className="relative">
              <Divider />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} className="text-[#00b14f]" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#00b14f" },
                      "&.Mui-focused fieldset": { borderColor: "#00b14f" },
                    },
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Shield size={18} className="text-[#00b14f]" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#00b14f" },
                      "&.Mui-focused fieldset": { borderColor: "#00b14f" },
                    },
                  }}
                />
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" size="small" className="text-sm text-[#00b14f] hover:underline font-medium">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  backgroundColor: "#00b14f",
                  "&:hover": { backgroundColor: "#009a44" },
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "16px",
                  borderRadius: "6px",
                }}
              >
                {loading ? "Đang xác nhận..." : "Đăng nhập"}
              </Button>
            </form>
          </div>

          <p className="mt-8 text-center text-[15px] text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link to="/employer/register" className="text-[#00b14f] font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </p>

          <footer className="mt-16 text-center text-xs text-gray-400">
            © 2014 - 2024 TopCV Vietnam JSC. All rights reserved.
          </footer>
        </div>
      </div>

      <div className="hidden lg:flex w-2/5 bg-[#0a1a15] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[#061410] overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00b14f]/10 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#00b14f]/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 w-full text-center text-white">
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Manage your works with <span className="text-[#00b14f]">Campaigns</span>
            </h3>
          </div>

          <div className="relative mx-auto w-full max-w-md bg-[#172b22] rounded-xl border border-white/10 shadow-2xl overflow-hidden p-6 text-left transform hover:rotate-1 transition-transform cursor-pointer">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#00b14f]/20 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[#00b14f] rounded-sm"></div>
              </div>
              <div className="space-y-1">
                <div className="w-32 h-2.5 bg-white/10 rounded-full"></div>
                <div className="w-20 h-2 bg-white/5 rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="h-24 bg-white/5 rounded-lg border border-white/5 p-3">
                <div className="w-full h-full flex flex-col justify-end gap-2">
                  <div className="w-full h-1/2 bg-[#00b14f]/20 rounded-t-sm"></div>
                  <div className="w-1/2 h-2 bg-white/10 rounded-full"></div>
                </div>
              </div>
              <div className="h-24 bg-white/5 rounded-lg border border-white/5 p-3">
                <div className="w-full h-full flex items-end gap-1">
                  <div className="flex-1 h-1/3 bg-[#00b14f]/40 rounded-sm"></div>
                  <div className="flex-1 h-3/4 bg-[#00b14f]/60 rounded-sm"></div>
                  <div className="flex-1 h-1/2 bg-[#00b14f]/40 rounded-sm"></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-1/3 h-2 bg-white/10 rounded-full"></div>
                <div className="w-1/4 h-2 bg-[#00b14f]/40 rounded-full"></div>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-[#00b14f]"></div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h1 className="text-2xl font-extrabold italic tracking-tighter text-white/40">
              Career<span className="text-[#00b14f]/40">Connect</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">Tiếp lợi thế, nối thành công</p>
          </div>
        </div>

        <div className="absolute top-20 right-20 w-32 h-32 bg-[#00b14f] opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#00b14f] opacity-5 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
}
