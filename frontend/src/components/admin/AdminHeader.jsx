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
    <header className="sticky top-0 z-20 w-full bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-500 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100"
        >
          <FiMenu size={24} />
        </button>

        <div className="hidden md:flex relative max-w-md w-full group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" />
          <input
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50"
            placeholder="Tìm kiếm nhanh..."
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Quick actions */}
        <div className="hidden sm:flex items-center gap-2 border-r border-slate-200 pr-4 mr-2">
          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl relative">
            <FiMail size={20} />
          </button>

          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl relative">
            <FiBell size={20} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl">
            <FiMaximize size={20} />
          </button>
        </div>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-xl border hover:border-slate-200"
          >
            <div className="relative">
              <img
                className="h-10 w-10 rounded-xl object-cover"
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.fullName}&background=4F46E5&color=fff`
                }
                alt=""
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-bold text-slate-800">
                {user?.fullName || "Admin"}
              </span>
              <span className="text-[10px] text-indigo-600 font-bold uppercase">
                {user?.role || "ADMIN"}
              </span>
            </div>

            <FiChevronDown
              className={`text-slate-400 transition ${showProfileMenu ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* DROPDOWN */}
          {showProfileMenu && (
            <>
              {/* overlay click ngoài */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />

              <div className="absolute right-0 mt-3 w-60 rounded-2xl shadow-2xl bg-white border py-2 z-50 animate-in fade-in slide-in-from-top-2">

                {/* Info */}
                <div className="px-4 py-3 border-b">
                  <p className="text-xs text-gray-400">Đã đăng nhập với</p>
                  <p className="text-sm font-bold">
                    {user?.email || "admin@system.com"}
                  </p>
                </div>

                {/* Cá nhân */}
                <button
                  onClick={() => {
                    navigate("/admin/profile");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <FiUser size={16} />
                  Thông tin cá nhân
                </button>

                {/* Thông báo */}
                <button
                  onClick={() => {
                    navigate("/admin/notifications");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3"
                >
                  <FiBell size={16} />
                  Thông báo
                </button>

                <div className="border-t my-1"></div>

                {/* Logout */}
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