import React from 'react';
import { Briefcase, Banknote, Users } from 'lucide-react';

export default function JobPostingStep({ formData, handleInputChange }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <Briefcase className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-semibold text-slate-800">Tạo tin tuyển dụng đầu tiên</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Tiêu đề vị trí <span className="text-rose-500">*</span></label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            placeholder="VD: Chuyên viên Marketing, Lập trình viên ReactJS..."
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 font-medium text-slate-800 shadow-sm text-lg"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Mức lương <span className="text-rose-500">*</span></label>
          <div className="relative">
            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="VD: 10 - 15 Triệu"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 font-medium shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Số lượng cần tuyển <span className="text-rose-500">*</span></label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="VD: 3"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 font-medium shadow-sm"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Mô tả công việc <span className="text-rose-500">*</span></label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleInputChange}
            placeholder="Mô tả chi tiết các trách nhiệm, yêu cầu công việc..."
            rows="5"
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 font-medium shadow-sm resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
