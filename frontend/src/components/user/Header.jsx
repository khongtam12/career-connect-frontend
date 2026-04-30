import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import CandidateMenu from "./CandidateMenu";
import { useUserStore } from "../../stores/useUserStore";
const Header = ({ rightSlot }) => {
  const hydrated = useUserStore.persist.hasHydrated();
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  if (!hydrated) return null;
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* FLEX CHA */}
        <div className="flex items-center justify-between h-16">

          {/* LEFT: Logo + Menu */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="bg-emerald-500 w-2 h-2 rounded-full"></div>
              <div>
                <div className="font-bold text-emerald-600 text-lg">
                  CAREER
                </div>
                <div className="text-xs text-gray-500 -mt-1">
                  Tiếp lợi thế - Nối thành công
                </div>
              </div>
            </Link>

            {/* Menu */}
            <nav className="hidden lg:flex space-x-1 text-sm font-medium text-gray-700">
              <div className="flex items-center space-x-1 px-3 py-2 rounded-md hover:text-emerald-600 hover:bg-gray-50 cursor-pointer transition-colors">
                <span>Việc làm</span>
                <ChevronDown size={16} />
              </div>
              <Link to="/cv-dashboard" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:text-emerald-600 hover:bg-gray-50 cursor-pointer transition-colors">
                <span>Hồ sơ & CV</span>
                <ChevronDown size={16} />
              </Link>
              <div className="flex items-center space-x-1 px-3 py-2 rounded-md hover:text-emerald-600 hover:bg-gray-50 cursor-pointer transition-colors">
                <span>Công cụ</span>
                <ChevronDown size={16} />
              </div>
              <div className="flex items-center space-x-1 px-3 py-2 rounded-md hover:text-emerald-600 hover:bg-gray-50 cursor-pointer transition-colors">
                <span>Cẩm nang nghề nghiệp</span>
                <ChevronDown size={16} />
              </div>
              <div className="flex items-center space-x-1 px-3 py-2 rounded-md hover:text-emerald-600 hover:bg-gray-50 cursor-pointer transition-colors">
                <span>TopCV</span>
                <span className="bg-amber-400 text-[10px] px-1.5 py-0.5 rounded text-white font-bold ml-1">
                  Pro
                </span>
              </div>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <CandidateMenu user={user} />
            ) : (
              <>
                <Link to="/register">
                  <button className="hidden sm:block border border-emerald-500 text-emerald-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-50">
                    Đăng ký
                  </button>
                </Link>

                <Link to="/login">
                  <button className="hidden sm:block bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700">
                    Đăng nhập
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;