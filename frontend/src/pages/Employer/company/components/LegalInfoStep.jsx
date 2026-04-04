import React from 'react';
import { FileText, UploadCloud } from 'lucide-react';

export default function LegalInfoStep({ formData, handleInputChange }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <FileText className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-semibold text-slate-800">Xác thực hồ sơ pháp lý</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Loại giấy tờ <span className="text-rose-500">*</span></label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleInputChange}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-slate-700 appearance-none shadow-sm cursor-pointer"
          >
            <option value="" disabled>Chọn loại giấy tờ</option>
            <option value="cccd">Căn cước công dân (CCCD)</option>
            <option value="gpkd">Giấy phép kinh doanh</option>
            <option value="hc">Hộ chiếu</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Số giấy tờ <span className="text-rose-500">*</span></label>
          <input
            type="text"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={handleInputChange}
            placeholder="Nhập số giấy tờ"
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-400 font-medium shadow-sm"
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <label className="text-sm font-semibold text-slate-700 mb-3 block border-t pt-6 border-slate-100">Cung cấp hình ảnh <span className="text-rose-500">*</span></label>
          <div className="group border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 group-hover:shadow-indigo-100 transition-all duration-300">
              <UploadCloud className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-indigo-900 font-semibold mb-1 text-lg">Tải ảnh hoặc tài liệu PDF</p>
            <p className="text-sm text-indigo-400 mb-6">Kéo thả file vào đây hoặc nhấn để chọn (Tối đa 5MB)</p>
            <button type="button" className="px-6 py-2.5 bg-white border border-indigo-100 text-indigo-600 font-medium rounded-lg shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition-all">
              Chọn file từ máy tính
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
