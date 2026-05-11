import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiPlus, FiChevronDown, FiMenu, FiSearch } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useUserStore } from "../../stores/useUserStore";
import NotificationModal from "./model/NotificationModal";
import { fetchNotificationsByCompanyId, connectNotificationWebSocket } from "../../service/notificationService";
import apiClient from "../../service/apiClient";
import { Stomp } from '@stomp/stompjs'
import SockJS from 'sockjs-client';
import axios from 'axios';
import { useNotificationStore } from "../../stores/useNotificationStore";

const RecruiterHeader = ({ setSidebarOpen }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCandidatePage = location.pathname === "/employer/candidates";

  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const ref = useRef(null);

  const { notifications, unreadCount, setNotifications, addNotification, setHasNewCandidate, markAllAsRead } = useNotificationStore();


  useEffect(() => {
    if (!user?.companyId) return;

    // 1. Fetch thông báo cũ từ Backend 
    fetchNotificationsByCompanyId(user.companyId)
      .then(res => {
        setNotifications(res);
      })
      .catch(err => console.log(err));

    // 2. Mở kết nối STOMP Websocket qua API Gateway
    const stompClient = connectNotificationWebSocket(user.companyId, (newNoti) => {
      addNotification(newNoti);
      // Báo hiệu cho CVManagement biết có ứng viên mới cần refetch
      setHasNewCandidate(true);
    });

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, [user]);



  // click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // avatar fallback
  const initials =
    user?.username
      ?.split(" ")
      .map((w) => w[0])
      .slice(-2)
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm h-16 flex items-center justify-between px-6">

      {/* LEFT */}
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="text-gray-400 p-2 rounded-lg hover:bg-gray-50 hover:text-gray-700"
        >
          <FiMenu size={20} />
        </button>

        {/* Logo */}
        <Link to="/employer" className="flex items-center gap-2 group">
          <div className="bg-purple-600 text-white p-1.5 rounded-lg group-hover:bg-purple-700 transition">
            <FiPlus size={18} />
          </div>
          <span className="font-black text-lg text-gray-900">
            career<span className="text-purple-600">connect</span>
          </span>
        </Link>

        {/* SEARCH / NAV */}
        {isCandidatePage ? (
          <div className="hidden md:flex relative max-w-sm w-full ml-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Tìm kiếm ứng viên..."
            />
          </div>
        ) : (
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-500">
            <NavLink to="/employer/pricing" className={({ isActive }) =>
              isActive ? "text-purple-600" : "hover:text-purple-600"
            }>
              Bảng giá
            </NavLink>
            <NavLink to="/employer/candidates" className="hover:text-purple-600">
              Tìm ứng viên
            </NavLink>
          </nav>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* Notification */}
       <div className="relative">
        <button
          onClick={() => {
            setShowNotifications((prev) => !prev);
          }}
          className="relative p-2 text-gray-400 hover:text-purple-600 hover:bg-gray-50 rounded-lg"
        >
          {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
            <FiBell size={20} />
          </button>

          <NotificationModal
            open={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
          />
        </div>

        {/* Wallet */}
        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
          <span className="text-sm font-semibold text-emerald-700">
            5.000.000đ
          </span>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2 py-0.5 rounded">
            Nạp
          </button>
        </div>

        {/* PROFILE */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition ${showProfile ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
          >
            {user?.avatar ? (
              <img
                className="h-9 w-9 rounded-full border object-cover"
                src={user.avatar}
                alt=""
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
            )}

            <div className="hidden xl:flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-800">
                {user?.username}
              </span>
              <span className="text-[11px] text-gray-400">
                {user?.companyName}
              </span>
            </div>

            <FiChevronDown
              className={`text-gray-400 transition ${showProfile ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* DROPDOWN */}
          <div
            className={`absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden transition-all duration-200 origin-top-right
            ${showProfile
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
              }`}
          >
            {/* User card */}
            <div className="p-4 flex items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
              <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                {initials}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.companyName}
                </p>
              </div>
            </div>

            {/* Menu */}
            <div className="p-2 text-sm">
              <button
                onClick={() => {
                  navigate("/employer/profile");
                  setShowProfile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Hồ sơ cá nhân
              </button>

              <button
                onClick={() => {
                  navigate("/employer/recruitment-account");
                  setShowProfile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Thông tin công ty
              </button>

              <button
                onClick={() => {
                  navigate("/employer/jobs");
                  setShowProfile(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Quản lý tin tuyển dụng
              </button>

              <div className="border-t my-2"></div>

              <button
                onClick={async () => {
                  await logout();
                  navigate("/employer/login");
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default RecruiterHeader;