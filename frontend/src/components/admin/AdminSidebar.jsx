import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FiPieChart,
  FiUsers,
  FiBriefcase,
  FiLayers,
  FiPackage,
  FiFileText,
  FiSearch,
  FiLayout
} from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Tổng quan',
      subtitle: 'Thống kê hệ thống',
      icon: <FiPieChart />,
      path: '/admin'
    },
    {
      name: 'Nhà tuyển dụng',
      subtitle: 'Quản lý công ty',
      icon: <HiOutlineOfficeBuilding />,
      path: '/admin/recruiters',
      badge: '3'
    },
    {
      name: 'Người dùng',
      subtitle: 'Quản lý tài khoản',
      icon: <FiUsers />,
      path: '/admin/candidates'
    },
    {
      name: 'Tin tuyển dụng',
      subtitle: 'Quản lý tin đăng', // Adjusted slightly to match my jobs route
      icon: <FiBriefcase />,
      path: '/admin/jobs'
    },
    {
      name: 'Ngành nghề',
      subtitle: 'Quản lý danh mục',
      icon: <FiLayers />,
      path: '/admin/categories' // Router may not have this, but user wants it in menu
    },
    {
      name: 'Gói dịch vụ',
      subtitle: 'Quản lý gói & giá',
      icon: <FiPackage />,
      path: '/admin/services'
    },
    {
      name: 'Bài viết',
      subtitle: 'Quản lý nội dung',
      icon: <FiFileText />,
      path: '/admin/posts'
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-[#111827] border-r border-white/5 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-screen lg:z-30`}>

        {/* Logo Section */}
        <div className="p-8 flex items-center gap-3 shrink-0">
          <div className="bg-[#6366F1] w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <FiLayout size={26} />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-white text-xl tracking-tight leading-none">JobPortal</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5 whitespace-nowrap">Admin Dashboard</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 mb-8">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full bg-[#1F2937] border border-transparent text-slate-300 text-xs py-3 pl-11 pr-10 rounded-2xl focus:outline-none focus:bg-[#283244] focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none opacity-50">
              <span className="text-[10px] text-slate-400 font-bold border border-slate-600 px-1 rounded bg-[#374151]">⌘</span>
              <span className="text-[10px] text-slate-400 font-bold border border-slate-600 px-1 rounded bg-[#374151]">K</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-hide">
          <div className="mb-4 px-4 text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">
            MENU CHÍNH
          </div>
          <nav className="space-y-1.5">
            {menuItems.map((item, idx) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setIsOpen && setIsOpen(false)}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${active
                      ? 'bg-[#6366F1] text-white shadow-[0_15px_30px_rgba(99,102,241,0.3)]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 opacity-70'}`}>
                      {item.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold tracking-wide leading-tight">{item.name}</span>
                      <span className={`text-[10px] font-medium mt-0.5 ${active ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${active ? 'bg-white/20 text-white' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 p-3 text-slate-500 group cursor-pointer hover:text-slate-200 transition-all">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider">Hệ thống ổn định</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;