import React from 'react';
import { FiPlus, FiUser, FiDatabase, FiArrowRight } from 'react-icons/fi';

const actions = [
  {
    icon: FiPlus,
    title: 'Tạo tin tuyển dụng đầu tiên',
    description: 'Bắt đầu thu hút ứng viên chất lượng cho vị trí bạn đang tuyển.',
    cta: 'Tạo ngay',
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-400/20',
  },
  {
    icon: FiUser,
    title: 'Hoàn thiện hồ sơ công ty',
    description: 'Công ty có profile đầy đủ nhận được gấp 3 lần lượt ứng tuyển.',
    cta: 'Cập nhật',
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-400/20',
  },
  {
    icon: FiDatabase,
    title: 'Khám phá kho ứng viên',
    description: 'Hơn 50,000 hồ sơ ứng viên IT chất lượng đang chờ bạn khám phá.',
    cta: 'Xem ngay',
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-400/20',
  },
];

export default function RecommendedActions() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Hành động đề xuất</h2>
      <p className="text-sm text-gray-500 mb-4">Hoàn thành các bước này để tối ưu trải nghiệm tuyển dụng</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.gradient} p-5 text-white cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
          >
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>

            <div className="relative">
              <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon size={20} />
              </div>

              <h3 className="text-sm font-bold mb-1">{action.title}</h3>
              <p className="text-xs text-white/80 leading-relaxed mb-4">{action.description}</p>

              <button className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm px-3.5 py-1.5 rounded-lg transition-all duration-200 border border-white/10">
                {action.cta}
                <FiArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
