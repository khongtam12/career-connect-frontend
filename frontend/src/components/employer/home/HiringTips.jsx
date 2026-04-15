import React from 'react';
import { FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const tips = [
  {
    title: 'Mô tả công việc rõ ràng',
    description: 'Liệt kê cụ thể yêu cầu kỹ năng, trách nhiệm và quyền lợi để thu hút đúng ứng viên.',
  },
  {
    title: 'Phản hồi nhanh ứng viên',
    description: 'Ứng viên chất lượng thường apply nhiều nơi. Phản hồi trong 24-48h để không bỏ lỡ.',
  },
  {
    title: 'Sử dụng bộ lọc thông minh',
    description: 'Lọc theo kỹ năng, kinh nghiệm, địa điểm để tiết kiệm thời gian xem hồ sơ.',
  },
  {
    title: 'Xây dựng thương hiệu nhà tuyển dụng',
    description: 'Cập nhật logo, mô tả công ty và văn hóa để tạo ấn tượng tốt với ứng viên.',
  },
];

export default function HiringTips() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50 rounded-xl border border-amber-100/60 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
          <FiBookOpen size={16} />
        </div>
        <h2 className="text-base font-bold text-gray-900">Mẹo tuyển dụng hiệu quả</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex gap-3 bg-white/70 backdrop-blur-sm rounded-lg p-3.5 border border-amber-100/40 hover:bg-white hover:shadow-sm transition-all duration-200">
            <div className="shrink-0 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FiCheckCircle size={12} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-0.5">{tip.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
