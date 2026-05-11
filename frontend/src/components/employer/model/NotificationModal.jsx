import { useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../../stores/useNotificationStore";
import { markNotificationAsRead } from "../../../service/notificationService";

const NotificationModal = ({ open, onClose, notifications = [] }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { markAsReadLocally, markAllAsRead } = useNotificationStore();

  const handleNotiClick = async (noti) => {
    if (!noti.read) {
      // Gọi API đánh dấu đã đọc
      try {
        await markNotificationAsRead(noti.id);
        markAsReadLocally(noti.id);
      } catch (error) {
         console.log(error);
      }
    }
    onClose();
    navigate('/employer/candidates'); // Chuyển sang trang ứng viên
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute right-0 mt-3 w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transition-all duration-200 origin-top-right
      ${
        open
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-400 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <FiBell className="text-purple-600" />
          <span className="font-semibold text-gray-800">
            Thông báo
          </span>
        </div>

        <button className="text-xs text-purple-600 hover:underline">
          Xem tất cả
        </button>
      </div>

      {/* LIST */}
      <div className="max-h-96 overflow-y-auto divide-y">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
             Không có thông báo nào
          </div>
        ) : (
          notifications.map((noti) => (
            <div
              key={noti.id}
              onClick={() => handleNotiClick(noti)}
              className={`flex gap-3 px-4 py-3 cursor-pointer transition group border-none
              ${
                  !noti.read
                  ? "bg-purple-50/70"
                  : "hover:bg-gray-50"
              }`}
            >
              {/* Avatar / Icon */}
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                {noti.title.charAt(0)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm text-gray-800 leading-snug">
                  <span className="font-semibold">
                    {noti.title}
                  </span>{" "}
                  <span className="text-gray-600">
                    {noti.message}
                  </span>
                </p>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-gray-400">
                    {noti.time}
                  </span>

                  {!noti.read && (
                    <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      {notifications.length > 0 && (
        <div className="p-2 border-t text-center">
          <button 
            onClick={() => {
              const unreadNotis = notifications.filter(n => !n.read);
              if (unreadNotis.length === 0) return;
              markAllAsRead();
              unreadNotis.forEach(n => {
                markNotificationAsRead(n.id).catch(() => {});
              });
            }}
            className="text-sm text-purple-600 hover:underline"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;