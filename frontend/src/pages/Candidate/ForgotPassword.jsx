import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Shield, Lock, ArrowLeft } from "lucide-react";
import { 
  TextField, 
  InputAdornment, 
  Button, 
  Stepper, 
  Step, 
  StepLabel 
} from "@mui/material";
import { forgotPassword, resetPassword } from "../../service/authService";
import { toast } from "react-toastify";

import { useSearchParams } from "react-router-dom";

const steps = ["Nhập Email", "Xác thực OTP", "Mật khẩu mới"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "CANDIDATE";
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email, type);
      toast.success("Mã OTP đã được gửi tới email của bạn!");
      setActiveStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Email không tồn tại trong vai trò này!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 số!");
      return;
    }
    setActiveStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword }, type);
      toast.success("Đặt lại mật khẩu thành công!");
      const loginPath = type === "EMPLOYER" ? "/employer/login" : "/login";
      navigate(loginPath);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đặt lại mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
            <h1 className="text-3xl font-extrabold italic tracking-tighter">
                Career<span className="text-[#00b14f]">Connect</span>
            </h1>
        </div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Quên mật khẩu?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại mật khẩu nhanh chóng.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          
          <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
            {steps.map((label) => (
              <Step key={label} sx={{
                '& .MuiStepIcon-root.Mui-active': { color: '#00b14f' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#00b14f' },
              }}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  placeholder="name@example.com"
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
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ py: 1.5, bgcolor: '#00b14f', '&:hover': { bgcolor: '#009a44' }, fontWeight: 'bold' }}
              >
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </Button>
            </form>
          )}

          {activeStep === 1 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Chúng tôi đã gửi mã tới <span className="font-bold">{email}</span>
                </label>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  placeholder="Nhập 6 số OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  style={{ textAlign: 'center' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Shield size={20} className="text-[#00b14f]" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ py: 1.5, bgcolor: '#00b14f', '&:hover': { bgcolor: '#009a44' }, fontWeight: 'bold' }}
              >
                Tiếp tục
              </Button>
              <button 
                type="button"
                onClick={() => setActiveStep(0)}
                className="w-full text-sm text-gray-500 hover:underline"
              >
                Đổi email khác
              </button>
            </form>
          )}

          {activeStep === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} className="text-[#00b14f]" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} className="text-[#00b14f]" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ py: 1.5, bgcolor: '#00b14f', '&:hover': { bgcolor: '#009a44' }, fontWeight: 'bold' }}
              >
                {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
              </Button>
            </form>
          )}

          <div className="mt-6">
            <Link to="/login" className="flex items-center justify-center text-sm font-medium text-[#00b14f] hover:text-[#009a44]">
              <ArrowLeft size={16} className="mr-2" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
