import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiChevronDown, FiLogOut, FiMenu, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import NotificationModal from "./model/NotificationModal";
import {
  connectNotificationWebSocket,
  fetchNotificationsByCompanyId,
} from "../../service/notificationService";
import { useNotificationStore } from "../../stores/useNotificationStore";
import UserAvatar from "../common/UserAvatar";

const RecruiterHeader = ({ setSidebarOpen }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef(null);

  const isCandidatePage = location.pathname === "/employer/candidates";

  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const logout = useUserStore((s) => s.logout);
  const unreadChatCount = useNotificationStore((s) => s.unreadChatCount);
  const {
    notifications,
    unreadCount,
    setNotifications,
    addNotification,
    setHasNewCandidate,
  } = useNotificationStore();

  useEffect(() => {
    if (!user?.companyId) return;

    fetchNotificationsByCompanyId(user.companyId)
      .then((res) => setNotifications(res))
      .catch((err) => console.log(err));

    const stompClient = connectNotificationWebSocket(user.companyId, (newNoti) => {
      addNotification(newNoti);
      setHasNewCandidate(true);
    });

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, [addNotification, setHasNewCandidate, setNotifications, user?.companyId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchToCandidate = async () => {
    if (isAuthenticated) {
      await logout();
    }
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-6 shadow-sm">
      <div className="flex flex-1 items-center gap-6">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
        >
          <FiMenu size={20} />
        </button>

        <Link to="/employer" className="group flex items-center gap-2">
          <div className="rounded-lg bg-emerald-600 p-1.5 text-white transition group-hover:bg-emerald-700">
            <FiPlus size={18} />
          </div>
          <span className="text-lg font-black text-gray-900">
            career<span className="text-emerald-600">connect</span>
          </span>
        </Link>

        {isCandidatePage ? (
          <div className="ml-4 hidden max-w-sm w-full relative md:flex">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Tìm kiếm ứng viên..."
            />
          </div>
        ) : (
          <nav className="hidden items-center gap-5 text-sm font-medium text-gray-500 lg:flex">
            <NavLink
              to="/employer/pricing"
              className={({ isActive }) => (isActive ? "text-emerald-600" : "hover:text-emerald-600")}
            >
              Bảng giá
            </NavLink>
            <NavLink to={isAuthenticated ? "/employer/candidates" : "/employer/login"} className="hover:text-emerald-600">
              Tìm ứng viên
            </NavLink>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSwitchToCandidate}
          className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100 lg:block"
        >
          Dành cho Ứng Viên
        </button>

        {isAuthenticated ? (
          <>
            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-emerald-600"
              >
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
                <FiBell size={20} />
              </button>

              <NotificationModal
                open={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
              />
            </div>

            <Link
              to="/employer/chat"
              className="group relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-emerald-600"
              title="Tin nhắn"
            >
              <FiMessageSquare size={20} />
              {unreadChatCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white shadow-sm transition-transform group-hover:scale-110"></span>
              )}
            </Link>

            <div className="hidden items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
              <span className="text-sm font-semibold text-emerald-700">5.000.000đ</span>
              <button className="rounded bg-emerald-600 px-2 py-0.5 text-xs text-white hover:bg-emerald-700">
                Nạp
              </button>
            </div>

            <div ref={ref} className="relative">
              <button
                onClick={() => setShowProfile((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition ${
                  showProfile ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <UserAvatar src={user?.avatar} name={user?.username} className="h-9 w-9" />

                <div className="hidden flex-col items-start xl:flex">
                  <span className="text-sm font-semibold text-gray-800">{user?.username}</span>
                  <span className="text-[11px] text-gray-400">{user?.companyName}</span>
                </div>

                <FiChevronDown className={`text-gray-400 transition ${showProfile ? "rotate-180" : ""}`} />
              </button>

              <div
                className={`absolute right-0 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-200 ${
                  showProfile ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-95 opacity-0"
                }`}
              >
                <div className="flex items-center gap-3 border-b bg-white p-4">
                  <UserAvatar src={user?.avatar} name={user?.fullName || user?.username} className="h-12 w-12" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-gray-500">Tài khoản nhà tuyển dụng</p>
                    <p className="text-xs text-gray-500">
                      ID {user?.userId || user?.employerId} | {user?.email}
                    </p>
                  </div>
                </div>

                <div className="p-2 text-sm">
                  <button
                    onClick={() => {
                      navigate("/employer/profile");
                      setShowProfile(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100"
                  >
                    Hồ sơ cá nhân
                  </button>

                  <button
                    onClick={() => {
                      navigate("/employer/recruitment-account");
                      setShowProfile(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100"
                  >
                    Thông tin công ty
                  </button>

                  <button
                    onClick={() => {
                      navigate("/employer/jobs");
                      setShowProfile(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100"
                  >
                    Quản lý tin tuyển dụng
                  </button>

                  <div className="my-2 border-t"></div>

                  <button
                    onClick={async () => {
                      await logout();
                      navigate("/employer/login");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-red-500 hover:bg-red-50"
                  >
                    <FiLogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/employer/register"
              className="hidden rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 sm:inline-flex"
            >
              Đăng ký
            </Link>
            <Link
              to="/employer/login"
              className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Đăng nhập
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default RecruiterHeader;
