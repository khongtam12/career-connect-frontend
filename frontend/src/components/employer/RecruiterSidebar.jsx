import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiGrid, FiFileText, FiUsers, FiBox, FiUser, FiHelpCircle
} from 'react-icons/fi';

import { useNotificationStore } from '../../stores/useNotificationStore';

const RecruiterSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { unreadCount } = useNotificationStore();

  const menuItems = [
    { name: 'Tin đăng', icon: <FiFileText size={22} />, path: '/employer/jobs' },
    { name: 'Ứng viên', icon: <FiUsers size={22} />, path: '/employer/candidates', badge: unreadCount > 0 ? unreadCount : null },
    { name: 'Dịch vụ', icon: <FiBox size={22} />, path: '/employer/services' },
  ];

  const isActive = (path) => {
    if (path === '/employer') return location.pathname === '/employer';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      <aside className={`fixed lg:relative top-0 left-0 h-full bg-white border-r border-gray-100 shadow-sm z-50 transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'w-[72px] translate-x-0' : 'w-0 -translate-x-full lg:-translate-x-full lg:w-0 lg:opacity-0 lg:invisible overflow-hidden'}`}>
        {/* Toggle Button for mobile branding */}
        <div className="h-16 flex items-center justify-center border-b border-gray-50 shrink-0">
          <div className="bg-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200">
            C
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto pt-4 flex flex-col items-center space-y-2">
          {menuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <NavLink
                key={index}
                to={item.path}
                className={`relative group w-full flex flex-col items-center py-4 transition-all duration-300 ${active
                  ? 'text-emerald-600'
                  : 'text-gray-400 hover:text-emerald-500'
                  }`}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-emerald-600 rounded-r-full shadow-lg shadow-emerald-200" />
                )}

                <div className={`mb-1 transition-transform group-hover:scale-110 ${active ? 'bg-emerald-50 p-2.5 rounded-2xl' : ''}`}>
                  {item.icon}
                </div>

                <span className={`text-[10px] font-black uppercase tracking-tighter text-center px-1 transition-colors ${active ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {item.name}
                </span>

                {item.badge && (
                  <span className="absolute top-2 right-4 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[8px] font-black shadow-sm ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Support at Bottom */}
        <div className="p-4 border-t border-gray-50 flex flex-col items-center shrink-0 mb-4">
          {/* Empty or Support Icon */}
        </div>
      </aside>
    </>
  );
};

export default RecruiterSidebar;
