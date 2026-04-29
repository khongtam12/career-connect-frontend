import React, { useState } from "react";
import { 
  FiBell, 
  FiSearch, 
  FiMenu, 
  FiLogOut, 
  FiChevronDown,
  FiMail,
  FiMaximize
} from "react-icons/fi";

const AdminHeader = ({ setSidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 shadow-sm">
      
      {/* LEFT: Search & Mobile Toggle */}
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-500 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-all"
        >
          <FiMenu size={24} />
        </button>

        <div className="hidden md:flex relative max-w-md w-full group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 text-sm transition-all"
            placeholder="Tìm kiếm nhanh..."
          />
        </div>
      </div>

      {/* RIGHT: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        
        {/* Quick Actions */}
        <div className="hidden sm:flex items-center gap-2 border-r border-slate-200 pr-4 mr-2">
          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all relative">
            <FiMail size={20} />
          </button>
          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all relative">
            <FiBell size={20} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>
          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
            <FiMaximize size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            <div className="relative">
              <img 
                className="h-10 w-10 rounded-xl bg-slate-200 object-cover shadow-sm" 
                src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff&bold=true" 
                alt="Admin" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-bold text-slate-800 leading-tight">Lê Anh Tuấn</span>
              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Quản trị viên</span>
            </div>
            <FiChevronDown className={`text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} size={16} />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileMenu(false)} 
              />
              <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl bg-white border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-xs text-slate-400 font-medium">Đã đăng nhập với</p>
                  <p className="text-sm font-bold text-slate-800">admin@jobportal.vn</p>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-3">
                  <FiBell size={16} />
                  Thông báo
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center gap-3">
                  <FiLogOut size={16} className="text-rose-500" />
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