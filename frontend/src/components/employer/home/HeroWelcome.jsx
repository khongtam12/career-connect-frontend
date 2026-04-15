import React from 'react';
import { FiPlus, FiSearch, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function HeroWelcome() {
  const onboardingProgress = 80;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 sm:p-8 text-white">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl"></div>
      <div className="absolute top-8 right-12 w-20 h-20 bg-white/10 rounded-2xl rotate-12 hidden lg:block"></div>
      <div className="absolute bottom-6 right-48 w-14 h-14 bg-white/8 rounded-xl -rotate-6 hidden lg:block"></div>
      
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left content */}
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">👋</span>
            <span className="bg-white/15 text-white/90 text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
              Chào buổi sáng!
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
            Chào mừng trở lại, <span className="text-emerald-100">Jane HR</span>
          </h1>
          
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
            Nền tảng tuyển dụng giúp bạn kết nối với ứng viên chất lượng, 
            quản lý quy trình tuyển dụng hiệu quả và xây dựng đội ngũ mơ ước.
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:scale-[1.02]">
              <FiPlus size={18} />
              Đăng tin tuyển dụng
            </button>
            <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border border-white/20">
              <FiSearch size={16} />
              Tìm ứng viên
            </button>
          </div>
        </div>

        {/* Right side: Onboarding progress */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15 w-full lg:w-72 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <FiCheckCircle size={16} className="text-emerald-200" />
            <span className="text-sm font-semibold text-white">Tiến độ thiết lập</span>
          </div>
          
          <div className="w-full h-2 bg-white/15 rounded-full mb-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full transition-all duration-1000"
              style={{ width: `${onboardingProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-emerald-100 mb-3">{onboardingProgress}% hoàn thành</p>

          <div className="space-y-2">
            {[
              { label: 'Tạo tài khoản', done: true },
              { label: 'Cập nhật hồ sơ công ty', done: true },
              { label: 'Đăng tin tuyển dụng đầu tiên', done: true },
              { label: 'Mời thành viên team', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  item.done 
                    ? 'bg-emerald-300 text-emerald-800' 
                    : 'border border-white/30 text-transparent'
                }`}>
                  {item.done && <FiCheckCircle size={10} />}
                </div>
                <span className={item.done ? 'text-emerald-100 line-through opacity-70' : 'text-white'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full mt-3 flex items-center justify-center gap-1 text-xs font-medium text-emerald-200 hover:text-white transition-colors">
            Hoàn tất ngay <FiArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
