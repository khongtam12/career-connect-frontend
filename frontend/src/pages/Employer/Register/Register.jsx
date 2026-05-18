import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, KeyRound, Mail, Phone, Shield, User } from "lucide-react";
import { toast } from "react-toastify";
import { login, register, sendOtp, verifyOtp } from "../../../service/authService";
import { useUserStore } from "../../../stores/useUserStore";

export default function EmployerRegister() {
  const navigate = useNavigate();
  const handleLoginSuccess = useUserStore((state) => state.handleLoginSuccess);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    type: "EMPLOYER",
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
    const phoneRegex = /^\+?\d{10,15}$/;

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên người phụ trách phải có ít nhất 2 ký tự!";
    }

    if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại phải gồm 10 đến 15 chữ số!";
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

    const termsChecked = document.getElementById("employer-terms-checkbox")?.checked;
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
      const { otp, confirmPassword, ...registerPayload } = formData;
      const response = await register(registerPayload);

      if (response && (response.status === 201 || response.status === 200 || response.employerId || response.userId)) {
        await login({
          username: formData.email,
          password: formData.password,
          type: "EMPLOYER",
        });
        await handleLoginSuccess();

        toast.success("Tạo tài khoản nhà tuyển dụng thành công!");
        setShowOtpModal(false);
        setTimeout(() => navigate("/employer/recruitment-account"), 1200);
      } else {
        toast.error("Có lỗi xảy ra trong quá trình đăng ký!");
      }
    } catch (error) {
      const serverData = error.response?.data;
      const serverMessage = serverData?.message;
      const serverStatus = serverData?.status;

      if (serverStatus === 1010 || (serverMessage && serverMessage.toLowerCase().includes("email"))) {
        setErrors((prev) => ({ ...prev, email: serverMessage || "Email này đã được sử dụng!" }));
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
    <div className="min-h-screen bg-[#fff8f7] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <div className="hidden lg:flex w-2/5 relative overflow-hidden bg-[#7f1d1d] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_45%),linear-gradient(160deg,_rgba(127,29,29,0.9),_rgba(69,10,10,1))]" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-red-300/20 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-orange-300/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-center px-12">
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Building2 className="h-8 w-8" />
            </div>
            <h2 className="text-5xl font-black leading-tight tracking-tight">
              Tuyển đúng người,
              <br />
              tăng đúng tốc độ.
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-red-100">
              Tạo tài khoản nhà tuyển dụng để đăng tin, quản lý ứng viên và bắt đầu hoàn thiện hồ sơ công ty của bạn.
            </p>
          </div>
        </div>

        <div className="flex w-full lg:w-3/5 items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl rounded-[28px] border border-red-100 bg-white p-8 shadow-[0_20px_60px_rgba(127,29,29,0.08)] md:p-10">
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                Employer Account
              </div>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">Đăng ký tài khoản nhà tuyển dụng</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tạo tài khoản trước, xác thực OTP qua email, sau đó hệ thống sẽ đưa bạn đến bước hoàn thiện hồ sơ công ty.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Họ tên người phụ trách</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User size={18} className="text-red-500" />
                  </div>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Nhập họ và tên"
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 focus:outline-none focus:ring-1 transition ${
                      errors.fullName ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-red-500 focus:ring-red-500"
                    }`}
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.fullName && <p className="ml-1 mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Số điện thoại</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone size={18} className="text-red-500" />
                  </div>
                  <input
                    name="phone"
                    type="text"
                    placeholder="Nhập số điện thoại liên hệ"
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 focus:outline-none focus:ring-1 transition ${
                      errors.phone ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-red-500 focus:ring-red-500"
                    }`}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.phone && <p className="ml-1 mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail size={18} className="text-red-500" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Nhập email công việc"
                    className={`w-full rounded-xl border py-3 pl-10 pr-4 focus:outline-none focus:ring-1 transition ${
                      errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-red-500 focus:ring-red-500"
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && <p className="ml-1 mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Mật khẩu</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Shield size={18} className="text-red-500" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className={`w-full rounded-xl border py-3 pl-10 pr-10 focus:outline-none focus:ring-1 transition ${
                      errors.password ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-red-500 focus:ring-red-500"
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-red-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="ml-1 mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Xác nhận mật khẩu</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Shield size={18} className="text-red-500" />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full rounded-xl border py-3 pl-10 pr-10 focus:outline-none focus:ring-1 transition ${
                      errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-red-500 focus:ring-red-500"
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-red-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="ml-1 mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50/70 px-4 py-3 text-sm text-slate-600">
                Sau khi bấm <span className="font-semibold text-red-700">Đăng ký</span>, hệ thống sẽ gửi OTP đến email của bạn để xác thực tài khoản.
              </div>

              <div className="flex items-start gap-2 text-sm text-slate-600">
                <input type="checkbox" id="employer-terms-checkbox" className="mt-1 accent-red-600" />
                <span>
                  Tôi đồng ý với{" "}
                  <a href="#" className="font-medium text-red-600 hover:underline">Điều khoản dịch vụ</a> và{" "}
                  <a href="#" className="font-medium text-red-600 hover:underline">Chính sách bảo mật</a>.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp || loading}
                className={`w-full rounded-xl py-3 font-bold text-white transition ${
                  isSendingOtp || loading ? "cursor-not-allowed bg-red-300" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isSendingOtp ? "Đang gửi OTP..." : loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Đã có tài khoản nhà tuyển dụng?{" "}
              <Link to="/employer/login" className="font-semibold text-red-600 hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Xác nhận OTP</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Mã xác thực đã được gửi đến <span className="font-medium text-red-600">{formData.email}</span>. Nhập OTP để hoàn tất tạo tài khoản nhà tuyển dụng.
            </p>

            <div className="mt-5">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Mã xác thực</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound size={18} className="text-red-500" />
                </div>
                <input
                  name="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Nhập mã 6 số"
                  className={`w-full rounded-xl border py-3 pl-10 pr-4 focus:outline-none focus:ring-1 transition ${
                    errors.otp ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:border-red-500 focus:ring-red-500"
                  }`}
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>
              {errors.otp && <p className="ml-1 mt-1 text-xs text-red-500">{errors.otp}</p>}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={countdown > 0 || isSendingOtp}
                onClick={handleSendOtp}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  countdown > 0 || isSendingOtp
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                }`}
              >
                {isSendingOtp ? "Đang gửi..." : countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại OTP"}
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleVerifyOtpAndRegister}
                  className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition ${
                    loading ? "cursor-not-allowed bg-red-300" : "bg-red-600 hover:bg-red-700"
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
