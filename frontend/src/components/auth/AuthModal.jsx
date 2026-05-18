import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PasswordBox } from "../Login/PasswordBox";
import { login } from "../../service/authService";
import { useUserStore } from "../../stores/useUserStore";

export default function AuthModal() {
  const isOpen = useUserStore((s) => s.isAuthDialogOpen);
  const isClosable = useUserStore((s) => s.isDialogClosable);
  const closeAuthDialog = useUserStore((s) => s.closeAuthDialog);
  const handleLoginSuccess = useUserStore((s) => s.handleLoginSuccess);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ username, password, type: "CANDIDATE" });
      await handleLoginSuccess();
      closeAuthDialog();
    } catch {
      setError("Email hoặc mật khẩu không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && isClosable) {
      closeAuthDialog();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8 animate-in fade-in zoom-in-95 duration-200">
        {isClosable && (
          <button
            onClick={closeAuthDialog}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        )}

        <h2 className="text-2xl font-bold text-red-600 mb-2 text-center">
          Đăng nhập
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Bạn cần đăng nhập để thực hiện thao tác này
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              type="text"
              placeholder="Nhập email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Mật khẩu</label>
            <PasswordBox
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Hoặc</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          type="button"
          className="w-full border rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
          Đăng nhập bằng Google
        </button>

        <p className="text-sm text-center text-gray-500 mt-5">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-red-600 font-medium hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
