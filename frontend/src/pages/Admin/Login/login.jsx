import React, { useEffect, useState } from "react";
import { PasswordBox } from "../../../components/Login/PasswordBox";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../../service/authService";
import { useUserStore } from "../../../stores/useUserStore";

export default function Login() {
  const navigate = useNavigate();

  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const handleLoginSuccess = useUserStore((s) => s.handleLoginSuccess);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hydrated = useUserStore.persist.hasHydrated();
  // Redirect sau khi login hoặc reload
  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !user) return;

    if (user.role === "ADMIN") {
      navigate("/admin");
    }

    console.log("USER:", user);
  }, [isAuthenticated, user, navigate]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username, password, type: "ADMIN" });
      await handleLoginSuccess();
    } catch (err) {
      console.error(err);
      setError("Tên đăng nhập hoặc mật khẩu không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm text-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-8">
          Đăng nhập quản trị viên
        </h1>

        <form className="text-left" onSubmit={handleLogin}>
          <label className="text-sm font-medium">Tên đăng nhập</label>
          <input
            type="text"
            placeholder="Nhập tên đăng nhập của bạn"
            className="w-full border rounded-md px-3 py-2 mt-1 mb-4 focus:outline-none focus:border-red-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="text-sm font-medium">Mật khẩu</label>
          <PasswordBox
            placeholder="Nhập mật khẩu của bạn"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-sm text-red-600 mt-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-red-700"
              } bg-red-600 text-white font-semibold py-2 rounded-md mt-5`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <Link
          to="/forgot-password"
          className="block text-sm text-blue-600 mt-3 hover:underline"
        >
          Quên mật khẩu?
        </Link>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-500">
            Hoặc đăng nhập bằng
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="border rounded-md px-6 py-2 flex items-center gap-2 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Google
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-6">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-red-600 font-medium hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}