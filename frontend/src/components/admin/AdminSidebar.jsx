import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FiPieChart,
  FiUsers,
  FiBriefcase,
  FiLayers,
  FiPackage,
  FiFileText,
  FiSearch,
  FiLayout,
  FiCheckSquare,
  FiX
} from 'react-icons/fi';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { name: 'Tổng quan', subtitle: 'Thống kê hệ thống', icon: <FiPieChart />, path: '/admin' },
    { name: 'Nhà tuyển dụng', subtitle: 'Quản lý tài khoản', icon: <FiUsers />, path: '/admin/recruiters' },
    { name: 'Phê duyệt công ty', subtitle: 'Xét duyệt hồ sơ', icon: <FiCheckSquare />, path: '/admin/company-approvals' },
    { name: 'Người dùng', subtitle: 'Quản lý tài khoản', icon: <FiUsers />, path: '/admin/candidates' },
    { name: 'Tin tuyển dụng', subtitle: 'Quản lý tin đăng', icon: <FiBriefcase />, path: '/admin/jobs' },
    { name: 'Gói dịch vụ', subtitle: 'Quản lý gói & giá', icon: <FiPackage />, path: '/admin/services' },
  ];
  const isActive = (path) => location.pathname === path;

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  //
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-[230px] bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 border-r border-emerald-500/10 z-50 transform transition-all duration-300 ease-out flex flex-col shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen lg:z-30`}>

        <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg">
              <FiLayout size={24} />
            </div>
            <div>
              <h1 className="font-bold text-white text-base">JobPortal</h1>
              <p className="text-[8px] text-emerald-200/70 font-semibold uppercase tracking-widest">
                Admin
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors duration-200"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-200 z-10" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/60 text-slate-200 text-xs py-2 pl-10 pr-3 rounded-xl focus:outline-none focus:bg-slate-700/70 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-3 pb-4">
          {filteredItems.length > 0 && (
            <div className="mb-2 px-2 text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
              Menu
            </div>
          )}

          <nav className="space-y-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-200 ease-out relative overflow-hidden
                      ${active
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                  >
                    <div className="flex items-center gap-3 relative z-10 min-w-0">
                      <span className={`text-lg flex-shrink-0 transition-all duration-200 ${active ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'}`}>
                        {item.icon}
                      </span>

                      <div className="min-w-0">
                        <div className={`text-xs font-semibold transition-colors duration-200 truncate ${active ? 'text-white' : 'group-hover:text-slate-100'}`}>
                          {item.name}
                        </div>
                        <div className={`text-[10px] mt-0.5 transition-colors duration-200 truncate ${active ? 'text-emerald-100/80' : 'text-slate-500 group-hover:text-slate-400'}`}>
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold relative z-10 flex-shrink-0
                        ${active ? 'bg-white/20 text-white' : 'bg-rose-500/90 text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })
            ) : (
              <div className="px-3 py-8 text-center">
                <p className="text-slate-500 text-sm">Không tìm thấy menu</p>
              </div>
            )}
          </nav>
        </div>

        <div className="px-3 py-3 border-t border-emerald-500/10 bg-gradient-to-t from-slate-950 to-transparent shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50 flex-shrink-0"></div>
            <span className="font-semibold uppercase tracking-wide truncate">
              Hệ thống ổn định
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
