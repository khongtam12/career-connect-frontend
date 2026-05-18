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
    if (user.role === "CANDIDATE") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate, hydrated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username: email, password, type: "CANDIDATE" });
      await handleLoginSuccess();
      toast.success("Đăng nhập thành công!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Email hoặc mật khẩu không chính xác!";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center px-8 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-[28px] font-bold text-[#00b14f] mb-2">
              Chào mừng bạn đã quay trở lại
            </h1>
            <p className="text-gray-500">
              Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                      <Mail size={20} className="text-[#00b14f]" />
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
                      <Shield size={20} className="text-[#00b14f]" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Divider sx={{ mb: 4 }}>
              <span className="text-gray-400 text-sm px-2">Hoặc đăng nhập bằng</span>
            </Divider>

            <div className="grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2.5 hover:bg-red-50 text-red-600 font-semibold transition">
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
                <span className="hidden md:inline">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2.5 hover:bg-blue-50 text-[#1877f2] font-semibold transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="hidden md:inline">Facebook</span>
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-md py-2.5 hover:bg-blue-50 text-[#0077b5] font-semibold transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="hidden md:inline">LinkedIn</span>
              </button>
            </div>

            <p className="mt-8 text-sm text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="text-[#00b14f] font-bold hover:underline">
                Đăng ký ngay
              </Link>
            </p>

            <Divider sx={{ my: 4 }} />

            <div className="text-gray-500 text-[13px] space-y-1">
              <p className="font-semibold text-gray-700">Bạn gặp khó khăn khi tạo tài khoản?</p>
              <p>Vui lòng gọi tới số <span className="text-[#00b14f] font-bold">1900 068 889 | Nhánh 2</span> (giờ hành chính).</p>
            </div>

            <p className="text-[11px] text-gray-400 mt-10">
              © 2016 - 2024 All Rights Reserved. TopCV Vietnam JSC.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-2/5 md:bg-gradient-to-br from-[#172b22] to-[#0a1a15] relative overflow-hidden items-center justify-center text-white px-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-20"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
            <h2 className="text-4xl font-extrabold leading-tight italic tracking-tighter">
              Career<span className="text-[#00b14f]">Connect</span>
            </h2>
          </div>

          <h3 className="text-4xl font-bold mb-6 leading-tight">
            Tiếp lợi thế <br /> Nối thành công
          </h3>
          <p className="text-gray-300 text-lg max-w-sm mx-auto">
            CareerConnect - Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt Nam
          </p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full animate-pulse-slow delay-700"></div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse-slow {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.2; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 10s infinite ease-in-out;
          }
        ` }} />

        <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-[#00b14f] opacity-20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
