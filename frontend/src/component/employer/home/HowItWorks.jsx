import React from 'react';
import { FiEdit3, FiInbox, FiFilter, FiVideo } from 'react-icons/fi';

const steps = [
  {
    icon: FiEdit3,
    step: '01',
    title: 'Tạo tin tuyển dụng',
    description: 'Mô tả vị trí, yêu cầu kỹ năng và mức lương để thu hút ứng viên phù hợp.',
    color: 'emerald',
  },
  {
    icon: FiInbox,
    step: '02',
    title: 'Nhận hồ sơ ứng tuyển',
    description: 'Ứng viên gửi hồ sơ trực tiếp. Bạn nhận thông báo ngay khi có CV mới.',
    color: 'blue',
  },
  {
    icon: FiFilter,
    step: '03',
    title: 'Xem & lọc ứng viên',
    description: 'Dùng bộ lọc thông minh để tìm ứng viên phù hợp nhất, đánh giá và so sánh.',
    color: 'violet',
  },
  {
    icon: FiVideo,
    step: '04',
    title: 'Lên lịch phỏng vấn',
    description: 'Chọn thời gian, gửi lời mời tự động và bắt đầu quy trình phỏng vấn.',
    color: 'amber',
  },
];

const colorMap = {
  emerald: {
    bg: 'bg-emerald-500',
    light: 'bg-emerald-50',
    text: 'text-emerald-600',
    line: 'from-emerald-400 to-blue-400',
    ring: 'ring-emerald-100',
    number: 'text-emerald-500',
  },
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    line: 'from-blue-400 to-violet-400',
    ring: 'ring-blue-100',
    number: 'text-blue-500',
  },
  violet: {
    bg: 'bg-violet-500',
    light: 'bg-violet-50',
    text: 'text-violet-600',
    line: 'from-violet-400 to-amber-400',
    ring: 'ring-violet-100',
    number: 'text-violet-500',
  },
  amber: {
    bg: 'bg-amber-500',
    light: 'bg-amber-50',
    text: 'text-amber-600',
    line: '',
    ring: 'ring-amber-100',
    number: 'text-amber-500',
  },
};

export default function HowItWorks() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Quy trình hoạt động</h2>
      <p className="text-sm text-gray-500 mb-5">Chỉ 4 bước đơn giản để bắt đầu tuyển dụng</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative">
        {steps.map((step, i) => {
          const c = colorMap[step.color];
          return (
            <div key={i} className="relative">
              {/* Connector line (hidden on last item and mobile) */}
              {i < steps.length - 1 && (
                <div className={`hidden xl:block absolute top-8 left-[calc(50%+28px)] w-[calc(100%-56px)] h-0.5 bg-gradient-to-r ${c.line} opacity-30`}></div>
              )}

              <div className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
                {/* Step number */}
                <div className={`text-xs font-bold ${c.number} mb-3 tracking-widest`}>
                  BƯỚC {step.step}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${c.light} ${c.text} flex items-center justify-center mx-auto mb-4 ring-4 ${c.ring} group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon size={24} />
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
