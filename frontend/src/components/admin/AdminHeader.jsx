import React, { useState } from "react";
import {
  FiBell,
  FiSearch,
  FiMenu,
  FiLogOut,
  FiChevronDown,
  FiMail,
  FiMaximize,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

const AdminHeader = ({ setSidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${user?.fullName || "Admin"}&background=10B981&color=fff`;

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-emerald-100 bg-white/95 px-8 shadow-sm backdrop-blur">
      <div className="flex flex-1 items-center gap-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <FiMenu size={24} />
        </button>

        <div className="group relative hidden max-w-md w-full md:flex">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600" />
          <input
            className="w-full rounded-full border border-emerald-100 bg-emerald-50/60 py-2.5 pl-12 pr-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            placeholder="Tìm kiếm nhanh..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="mr-2 hidden items-center gap-2 border-r border-emerald-100 pr-4 sm:flex">
          <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600">
            <FiMail size={20} />
          </button>

          <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600">
            <FiBell size={20} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          <button className="rounded-xl p-2.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600">
            <FiMaximize size={20} />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 rounded-2xl border border-emerald-100 p-1.5 pr-3 hover:border-emerald-200 hover:bg-emerald-50"
          >
            <div className="relative">
              <img className="h-10 w-10 rounded-xl object-cover" src={avatarSrc} alt="" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></span>
            </div>

            <div className="hidden flex-col items-start md:flex">
              <span className="text-sm font-bold text-slate-800">{user?.fullName || "Admin"}</span>
              <span className="text-[10px] font-bold uppercase text-emerald-600">{user?.role || "ADMIN"}</span>
            </div>

            <FiChevronDown className={`text-slate-400 transition ${showProfileMenu ? "rotate-180" : ""}`} />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />

              <div className="absolute right-0 z-50 mt-3 w-72 rounded-2xl border border-emerald-100 bg-white py-2 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-emerald-100 px-4 py-3">
                  <img className="h-12 w-12 rounded-xl object-cover" src={avatarSrc} alt="" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user?.fullName || "Admin"}</p>
                    <p className="text-xs text-gray-500">Tài khoản quản trị</p>
                    <p className="text-xs text-gray-500">
                      ID {user?.userId || user?.adminId || "ADMIN"} | {user?.email || "admin@system.com"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate("/admin/profile");
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-emerald-50"
                >
                  <FiUser size={16} />
                  Thông tin cá nhân
                </button>

                <button
                  onClick={() => {
                    navigate("/admin/notifications");
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-emerald-50"
                >
                  <FiBell size={16} />
                  Thông báo
                </button>

                <div className="my-1 border-t border-emerald-100"></div>

                <button
                  onClick={async () => {
                    await logout();
                    navigate("/admin/login");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-50"
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
