import React from 'react';
import { FiZap } from 'react-icons/fi';

export default function PlatformIntro() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 relative overflow-hidden">
      {/* Subtle accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r"></div>
      
      <div className="pl-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <FiZap size={16} />
          </div>
          <h2 className="text-base font-bold text-gray-900">Giới thiệu nền tảng</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
          <strong className="text-gray-800">CareerConnect</strong> là nền tảng tuyển dụng thông minh giúp doanh nghiệp 
          đăng tin, tìm kiếm ứng viên phù hợp, quản lý hồ sơ và sắp xếp lịch phỏng vấn — tất cả trong một giao diện 
          đơn giản và trực quan. Tiết kiệm thời gian, tối ưu hiệu quả tuyển dụng cho đội ngũ HR.
        </p>
      </div>
    </div>
  );
}
