import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Mail, Shield, User } from "lucide-react";
import { toast } from "react-toastify";
import { register, sendOtp, verifyOtp } from "../../../service/authService";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    type: "CANDIDATE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "otp" ? value.replace(/\D/g, "").slice(0, 6) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const startOtpCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Vui lòng nhập email hợp lệ!" }));
      return false;
    }

    setIsSendingOtp(true);
    try {
      await sendOtp(formData.email, formData.type);
      toast.info("Mã OTP đã được gửi đến email của bạn!");
      startOtpCountdown();
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Không thể gửi OTP!";
      if (errorMsg.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: errorMsg }));
      } else {
        toast.error(errorMsg);
      }
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự!";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng!";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự!";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    }

    const termsChecked = document.getElementById("terms-checkbox")?.checked;
    if (!termsChecked) {
      toast.warning("Bạn cần đồng ý với điều khoản dịch vụ!");
      return false;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const otpSent = await handleSendOtp();
    if (!otpSent) {
      return;
    }

    setFormData((prev) => ({ ...prev, otp: "" }));
    setShowOtpModal(true);
  };

  const handleVerifyOtpAndRegister = async () => {
    if (formData.otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "Vui lòng nhập mã OTP 6 số!" }));
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(formData.email, formData.otp);
      const { otp, ...registerPayload } = formData;
      const response = await register(registerPayload);
      if (response && (response.status === 201 || response.status === 200 || response.candidateId || response.userId)) {
        toast.success("Đăng ký tài khoản thành công!");
        setShowOtpModal(false);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error("Có lỗi xảy ra trong quá trình đăng ký!");
      }
    } catch (error) {
      const serverData = error.response?.data;
      const serverMessage = serverData?.message;
      const serverStatus = serverData?.status;

      if (serverStatus === 1010 || (serverMessage && serverMessage.toLowerCase().includes("email"))) {
        setErrors({ email: serverMessage || "Email này đã được sử dụng!" });
        setShowOtpModal(false);
      } else if (serverStatus === 1009 || (serverMessage && serverMessage.toLowerCase().includes("otp"))) {
        setErrors((prev) => ({ ...prev, otp: serverMessage || "Mã OTP không hợp lệ hoặc đã hết hạn!" }));
      } else {
        toast.error(serverMessage || "Đăng ký thất bại, vui lòng kiểm tra lại thông tin!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center px-8 py-12">
        <div className="w-full max-w-lg">
          <h1 className="text-[26px] font-bold text-[#00b14f] mb-2 text-center md:text-left">
            Chào mừng bạn đến với CareerConnect
          </h1>
          <p className="text-gray-500 mb-8 text-center md:text-left">
            Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Họ và tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-[#00b14f]" />
                </div>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  className={`w-full border rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 transition ${
                    errors.fullName ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#00b14f] focus:ring-[#00b14f]"
                  }`}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#00b14f]" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Nhập email"
                  className={`w-full border rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 transition ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#00b14f] focus:ring-[#00b14f]"
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield size={18} className="text-[#00b14f]" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  className={`w-full border rounded-md py-2.5 pl-10 pr-10 focus:outline-none focus:ring-1 transition ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#00b14f] focus:ring-[#00b14f]"
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#00b14f]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield size={18} className="text-[#00b14f]" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận lại mật khẩu"
                  className={`w-full border rounded-md py-2.5 pl-10 pr-10 focus:outline-none focus:ring-1 transition ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#00b14f] focus:ring-[#00b14f]"
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#00b14f]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>

            <div className="rounded-xl border border-[#d8f3e2] bg-[#f7fdf9] px-4 py-3 text-sm text-gray-600">
              Sau khi bấm <span className="font-semibold text-[#00b14f]">Đăng ký</span>, hệ thống sẽ gửi OTP đến email của bạn để xác nhận tài khoản.
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" id="terms-checkbox" className="mt-1 accent-[#00b14f]" />
              <span>
                Tôi đã đọc và đồng ý với{" "}
                <a href="#" className="text-[#00b14f] hover:underline font-medium">Điều khoản dịch vụ</a> và{" "}
                <a href="#" className="text-[#00b14f] hover:underline font-medium">Chính sách bảo mật</a> của CareerConnect
              </span>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp || loading}
              className={`w-full py-3 rounded-md font-bold text-white transition transform active:scale-95 ${
                isSendingOtp || loading ? "bg-green-400 cursor-not-allowed" : "bg-[#00b14f] hover:bg-[#009a44] shadow-md"
              }`}
            >
              {isSendingOtp ? "Đang gửi OTP..." : loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Hoặc đăng ký bằng</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

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

          <p className="text-center text-sm text-gray-600 mt-8">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="text-[#00b14f] font-bold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-2/5 bg-[#172b22] relative overflow-hidden items-center justify-center text-white px-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-20"></div>
        </div>

        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-extrabold mb-4 leading-tight italic tracking-tighter">
            Career<span className="text-[#00b14f]">Connect</span>
          </h2>
          <h3 className="text-3xl font-bold mb-4 leading-tight">
            Tiếp lợi thế <br /> Nối thành công
          </h3>
          <p className="text-gray-300 text-lg">
            Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt Nam
          </p>
        </div>

        <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-[#00b14f] opacity-20 rounded-full blur-3xl"></div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-gray-900">Xác nhận OTP</h3>
              <p className="mt-2 text-sm text-gray-500">
                Mã xác thực đã được gửi đến <span className="font-medium text-[#00b14f]">{formData.email}</span>.
                Nhập OTP để hoàn tất đăng ký tài khoản.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Mã xác thực</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound size={18} className="text-[#00b14f]" />
                </div>
                <input
                  name="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Nhập mã 6 số"
                  className={`w-full border rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 transition ${
                    errors.otp ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#00b14f] focus:ring-[#00b14f]"
                  }`}
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>
              {errors.otp && <p className="text-xs text-red-500 mt-1 ml-1">{errors.otp}</p>}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={countdown > 0 || isSendingOtp}
                onClick={handleSendOtp}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  countdown > 0 || isSendingOtp
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#f0fdf4] text-[#00b14f] border border-[#00b14f] hover:bg-[#00b14f] hover:text-white"
                }`}
              >
                {isSendingOtp ? "Đang gửi..." : countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại OTP"}
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleVerifyOtpAndRegister}
                  className={`rounded-md px-4 py-2 text-sm font-bold text-white transition ${
                    loading ? "bg-green-400 cursor-not-allowed" : "bg-[#00b14f] hover:bg-[#009a44]"
                  }`}
                >
                  {loading ? "Đang xác nhận..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
