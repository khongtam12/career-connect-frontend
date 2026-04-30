import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { Briefcase, FileText, Settings, User, LogOut } from "lucide-react";

export default function CandidateMenu({ user }) {
    const [open, setOpen] = useState(false);
    const logout = useUserStore((s) => s.logout);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Avatar */}
            <div className="flex items-center gap-2 cursor-pointer">
                <img
                    src={user?.avatar || ""}
                    className="w-8 h-8 rounded-full"
                    alt="avatar"
                />
                <span className="text-sm font-medium">{user?.username}</span>
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full pt-2 z-50">
                    <div className="w-80 bg-gray-100 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

                        {/* Header */}
                        <div className="p-4 flex items-center gap-3 border-b bg-white">
                            <img
                                src={user?.avatar || ""}
                                className="w-10 h-10 rounded-full"
                                alt=""
                            />
                            <div>
                                <p className="font-semibold text-sm">{user?.fullName}</p>
                                <p className="text-xs text-gray-500">
                                    Tài khoản đã xác thực
                                </p>
                                <p className="text-xs text-gray-500">
                                    ID {user?.userId} | {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="p-3 text-sm space-y-2">

                            {/* SECTION 1 */}
                            <div>
                                <div className="flex items-center gap-2 px-2 py-2 text-gray-700 font-medium">
                                    <Briefcase size={16} />
                                    Quản lý tìm việc
                                </div>

                                <Link to="/saved-jobs" className="block px-6 py-2 rounded-md hover:bg-white">
                                    Việc làm đã lưu
                                </Link>
                                <Link to="/applied-jobs" className="block px-6 py-2 rounded-md hover:bg-white">
                                    Việc đã ứng tuyển
                                </Link>
                            </div>

                            {/* SECTION 2 */}
                            <div>
                                <div className="flex items-center gap-2 px-2 py-2 text-gray-700 font-medium">
                                    <FileText size={16} />
                                    Quản lý CV & Cover letter
                                </div>

                                <Link to="/cv-dashboard" className="block px-6 py-2 rounded-md hover:bg-white">
                                    CV của tôi
                                </Link>
                            </div>

                            {/* SECTION 3 */}
                            <div>
                                <div className="flex items-center gap-2 px-2 py-2 text-gray-700 font-medium">
                                    <Settings size={16} />
                                    Cài đặt
                                </div>

                                <Link className="block px-6 py-2 rounded-md hover:bg-white">
                                    Cài đặt & bảo mật
                                </Link>
                            </div>

                            {/* SECTION 4 */}
                            <div>
                                <div className="flex items-center gap-2 px-2 py-2 text-gray-700 font-medium">
                                    <User size={16} />
                                    Cá nhân
                                </div>

                                <Link className="block px-6 py-2 rounded-md hover:bg-white">
                                    Hồ sơ cá nhân
                                </Link>
                            </div>

                            {/* Logout */}
                            <div className="pt-2">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-full"
                                >
                                    <LogOut size={16} />
                                    Đăng xuất
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}