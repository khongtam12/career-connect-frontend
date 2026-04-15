import React from 'react';
import { FiFileText, FiUsers, FiFolder, FiCalendar } from 'react-icons/fi';

const features = [
  {
    icon: FiFileText,
    title: 'Đăng tin dễ dàng',
    description: 'Tạo tin tuyển dụng chỉ trong vài phút với form thông minh, tự động gợi ý nội dung phù hợp.',
    color: 'emerald',
    gradient: 'from-emerald-400 to-emerald-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: FiUsers,
    title: 'Tìm ứng viên phù hợp',
    description: 'Hệ thống AI gợi ý ứng viên phù hợp nhất dựa trên kỹ năng, kinh nghiệm và mong muốn của bạn.',
    color: 'blue',
    gradient: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: FiFolder,
    title: 'Quản lý hồ sơ',
    description: 'Theo dõi toàn bộ hồ sơ ứng tuyển, phân loại ứng viên và quản lý pipeline tuyển dụng.',
    color: 'violet',
    gradient: 'from-violet-400 to-violet-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: FiCalendar,
    title: 'Lên lịch phỏng vấn',
    description: 'Đặt lịch phỏng vấn nhanh chóng, gửi thông báo tự động và đồng bộ với Google Calendar.',
    color: 'amber',
    gradient: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

export default function KeyFeatures() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-gray-900">Tính năng nổi bật</h2>
        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Miễn phí
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-xl hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 cursor-default relative overflow-hidden"
          >
            {/* Hover gradient accent */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}></div>
            
            <div className="relative">
              <div className={`w-11 h-11 rounded-xl ${feature.bg} ${feature.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={22} />
              </div>

              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{feature.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
