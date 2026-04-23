import { Link, NavLink, useLocation } from "react-router-dom";
import { FiBell, FiPlus, FiChevronDown, FiMenu, FiSearch } from "react-icons/fi";
import { useState } from "react";

const RecruiterHeader = ({ setSidebarOpen }) => {
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const isCandidatePage = location.pathname === '/employer/candidates';

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm h-16 flex items-center justify-between px-6">
      
      {/* Left: Logo & Nav & Search */}
      <div className="flex items-center gap-8 flex-1">
        <button 
          onClick={() => setSidebarOpen(prev => !prev)}
          className="text-gray-500 p-2 -ml-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FiMenu size={20} />
        </button>
        
        <Link to="/employer" className="flex items-center gap-2 cursor-pointer no-underline group shrink-0">
          <div className="bg-purple-600 text-white p-1 rounded-lg group-hover:bg-purple-700 transition-colors">
             <FiPlus size={24} />
          </div>
          <span className="font-black text-xl tracking-tighter text-blue-900 border-r border-gray-200 pr-4">
            career<span className="text-purple-600">connect</span>
          </span>
        </Link>

        {/* Conditional Search Bar: Only shows on Candidates page */}
        {isCandidatePage ? (
          <div className="hidden md:flex relative max-w-md w-full ml-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all"
              placeholder="Tìm kiếm CV, Tên ứng viên, Kỹ năng..."
            />
          </div>
        ) : (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-500">
            <NavLink to="/employer/pricing" className={({isActive}) => isActive ? "text-purple-600" : "hover:text-purple-600 transition-colors"}>Bảng giá</NavLink>
            <NavLink to="/employer/promotions" className="flex items-center gap-1 hover:text-purple-600 transition-colors">
              <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-md font-black uppercase">Mới</span>
              Khuyến mãi
            </NavLink>
            <NavLink to="/employer/candidates" className={({isActive}) => isActive ? "text-blue-900 border-b-2 border-blue-500 py-3 mt-1" : "hover:text-purple-600 transition-colors"}>Tìm ứng viên</NavLink>
            <a href="#" className="hover:text-purple-600 transition-colors">Trợ giúp</a>
          </nav>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-purple-600 transition-colors">
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
          <FiBell size={22} />
        </button>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <div className="flex items-center gap-3 bg-emerald-50/50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
          <div className="text-[10px] text-emerald-600 font-black uppercase">Tài khoản</div>
          <span className="text-sm font-black text-emerald-700">5.000.000đ</span>
          <button className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-md font-black uppercase hover:bg-emerald-700 shadow-md shadow-emerald-200">Nạp</button>
        </div>

        <button className="flex items-center gap-2 pl-2 focus:outline-none group">
          <div className="relative">
            <img className="h-9 w-9 rounded-full object-cover border-2 border-purple-100 group-hover:border-purple-300 transition-all" src="https://ui-avatars.com/api/?name=Jane+HR&background=9333ea&color=fff" alt="Avatar" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="hidden xl:flex flex-col items-start truncate max-w-[120px]">
            <span className="text-sm font-black text-gray-800 leading-none mb-1">Jane HR</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Tech Corp</span>
          </div>
          <FiChevronDown className="text-gray-400 group-hover:text-purple-600" size={16} />
        </button>
      </div>
    </header>
  );
};

export default RecruiterHeader;
