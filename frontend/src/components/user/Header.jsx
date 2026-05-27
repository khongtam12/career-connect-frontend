import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MessageSquare, Plus, FileText, UploadCloud, User, Sparkles, FolderOpen } from "lucide-react";

import CandidateMenu from "./CandidateMenu";
import { useUserStore } from "../../stores/useUserStore";
import { useNotificationStore } from "../../stores/useNotificationStore";
import { categoriesData } from "../../data/categoriesData";

const buildJobsUrl = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `/jobs?${query}` : "/jobs";
};

const jobQuickLinks = [
  { label: "Tìm việc làm", to: "/jobs", description: "Khám phá toàn bộ tin tuyển dụng" },
  { label: "Việc làm đã lưu", to: "/saved-jobs", description: "Xem lại các tin bạn đã lưu" },
  { label: "Việc làm đã ứng tuyển", to: "/applied-jobs", description: "Theo dõi tiến độ ứng tuyển" },
  { label: "Việc làm phù hợp", to: "/jobs", description: "Gợi ý theo hồ sơ và lịch sử tìm kiếm" },
];

const jobPositionLinks = [
  { label: 'Việc làm Nhân viên kinh doanh', keyword: 'Nhân viên kinh doanh' },
  { label: 'Việc làm Kế toán', keyword: 'Kế toán' },
  { label: 'Việc làm Marketing', keyword: 'Marketing' },
  { label: 'Việc làm Hành chính nhân sự', keyword: 'Hành chính nhân sự' },
  { label: 'Việc làm Chăm sóc khách hàng', keyword: 'Chăm sóc khách hàng' },
  { label: 'Việc làm Ngân hàng', keyword: 'Ngân hàng' },
  { label: 'Việc làm IT', keyword: 'IT' },
  { label: 'Việc làm Lao động phổ thông', keyword: 'Lao động phổ thông' },
  { label: 'Việc làm Senior', keyword: 'Senior' },
  { label: 'Việc làm Kỹ sư xây dựng', keyword: 'Kỹ sư xây dựng' },
  { label: 'Việc làm Thiết kế đồ họa', keyword: 'Thiết kế đồ họa' },
  { label: 'Việc làm Bất động sản', keyword: 'Bất động sản' },
  { label: 'Việc làm Giáo dục', keyword: 'Giáo dục' },
  { label: 'Việc làm Telesales', keyword: 'Telesales' },
];

const jobFieldLinks = categoriesData
  .filter((item) => item.backendIndustryId && item.title !== "Khác")
  .slice(0, 10)
  .map((item) => ({
    label: item.title,
    to: buildJobsUrl({ industryId: item.backendIndustryId }),
  }));

const MenuLink = ({ to, children, className = "" }) => (
  <Link
    to={to}
    className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 ${className}`}
  >
    {children}
  </Link>
);

const SectionTitle = ({ children }) => (
  <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
    {children}
  </div>
);

const Header = ({ rightSlot }) => {
  const [cvMenuOpen, setCvMenuOpen] = useState(false);
  const hydrated = useUserStore.persist.hasHydrated();
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const unreadChatCount = useNotificationStore((s) => s.unreadChatCount);

  if (!hydrated) return null;
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* FLEX CHA */}
        <div className="flex items-center justify-between h-16">

          {/* LEFT: Logo + Menu */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 shrink-0">
              <div className="bg-emerald-500 w-2 h-2 rounded-full"></div>
              <div>
                <div className="font-bold text-emerald-600 text-lg">
                  CAREER CONNECT
                </div>
                <div className="text-xs text-gray-500 -mt-1">
                  Tiếp lợi thế - Nối thành công
                </div>
              </div>
            </Link>

            {/* Menu */}
            <nav className="hidden lg:flex space-x-1 text-sm font-medium text-gray-700">
              <div className="relative group/job-menu">
                <Link
                  to="/jobs"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:text-emerald-600 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <span>Việc làm</span>
                  <ChevronDown size={16} className="transition-transform duration-200 group-hover/job-menu:rotate-180" />
                </Link>

                <div className="invisible absolute left-0 top-full z-80 mt-3 w-[min(1120px,calc(100vw-2rem))] opacity-0 translate-y-2 transition-all duration-200 group-hover/job-menu:visible group-hover/job-menu:opacity-100 group-hover/job-menu:translate-y-0">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] ring-1 ring-black/5">
                    <div className="grid gap-0 lg:grid-cols-[240px_minmax(0,1.2fr)_minmax(0,1fr)]">
                      <div className="border-b border-slate-100 bg-linear-to-b from-emerald-50 to-white p-5 lg:border-b-0 lg:border-r">
                        <SectionTitle>Tìm việc nhanh</SectionTitle>
                        <div className="space-y-1.5">
                          {jobQuickLinks.map((item) => (
                            <MenuLink key={item.label} to={item.to}>
                              <div>
                                <div className="font-semibold text-slate-800">{item.label}</div>
                                <div className="mt-0.5 text-xs font-normal text-slate-500">{item.description}</div>
                              </div>
                            </MenuLink>
                          ))}
                        </div>
                      </div>

                      <div className="border-b border-slate-100 p-5 lg:border-b-0 lg:border-r">
                        <SectionTitle>Việc làm theo vị trí</SectionTitle>
                        <div className="max-w-3xl">
                          <div className="grid grid-cols-2 gap-y-2 gap-x-6">
                            {jobPositionLinks.map((item) => (
                              <Link
                                key={item.label}
                                to={buildJobsUrl({ keyword: item.keyword })}
                                className="block py-2 text-sm text-slate-700 hover:text-emerald-600 transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <SectionTitle>Việc làm theo lĩnh vực</SectionTitle>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {jobFieldLinks.map((item) => (
                            <MenuLink key={item.label} to={item.to}>
                              <span>{item.label}</span>
                            </MenuLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/cv-templates" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:text-emerald-600 hover:bg-gray-50 cursor-pointer transition-colors">
                <span>Tạo CV</span>
              </Link>

              <Link to="/featured-companies" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:text-emerald-600 hover:bg-gray-50 cursor-pointer transition-colors">
                <span>Công ty nổi bật</span>
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
              <div className="flex items-center space-x-4">
                <Link
                  to="/chat"
                  className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all relative group"
                  title="Tin nhắn"
                >
                  <MessageSquare size={22} />
                  {unreadChatCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full shadow-sm group-hover:scale-110 transition-transform"></span>
                  )}
                </Link>
                <CandidateMenu user={user} />
              </div>
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