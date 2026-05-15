import React, { useState } from "react";
import {
  FiBell,
  FiSearch,
  FiMenu,
  FiLogOut,
  FiChevronDown,
  FiMail,
  FiMaximize,
  FiUser
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

const AdminHeader = ({ setSidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur border-b border-emerald-100 h-20 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-500 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"
        >
          <FiMenu size={24} />
        </button>

        <div className="hidden md:flex relative max-w-md w-full group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600" />
          <input
            className="w-full pl-12 pr-4 py-2.5 bg-emerald-50/60 border border-emerald-100 rounded-full text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400"
            placeholder="Tìm kiếm nhanh..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 border-r border-emerald-100 pr-4 mr-2">
          <button className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl relative">
            <FiMail size={20} />
          </button>

          <button className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl relative">
            <FiBell size={20} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          <button className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl">
            <FiMaximize size={20} />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-emerald-50 rounded-2xl border border-emerald-100 hover:border-emerald-200"
          >
            <div className="relative">
              <img
                className="h-10 w-10 rounded-xl object-cover"
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.fullName}&background=10B981&color=fff`
                }
                alt=""
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-bold text-slate-800">
                {user?.fullName || "Admin"}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase">
                {user?.role || "ADMIN"}
              </span>
            </div>

            <FiChevronDown
              className={`text-slate-400 transition ${showProfileMenu ? "rotate-180" : ""}`}
            />
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />

              <div className="absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl bg-white border border-emerald-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-emerald-100">
                  <p className="text-xs text-gray-400">Đã đăng nhập với</p>
                  <p className="text-sm font-bold">
                    {user?.email || "admin@system.com"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigate("/admin/profile");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 flex items-center gap-3"
                >
                  <FiUser size={16} />
                  Thông tin cá nhân
                </button>

                <button
                  onClick={() => {
                    navigate("/admin/notifications");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 flex items-center gap-3"
                >
                  <FiBell size={16} />
                  Thông báo
                </button>

                <div className="border-t border-emerald-100 my-1"></div>

                <button
                  onClick={async () => {
                    await logout();
                    navigate("/admin/login");
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-3"
                >
                  <FiLogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
