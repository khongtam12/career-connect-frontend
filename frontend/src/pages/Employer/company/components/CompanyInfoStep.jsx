import React from 'react';
import { Building, CreditCard, Phone, MapPin } from 'lucide-react';

export default function CompanyInfoStep({ formData, handleInputChange }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <Building className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-semibold text-slate-800">Thông tin công ty</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Tên công ty <span className="text-rose-500">*</span></label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Nhập tên theo giấy phép kinh doanh"
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 font-medium text-slate-700 shadow-sm"
          />
          <p className="text-xs text-slate-500 mt-2">Đảm bảo tên công ty đúng theo giấy đăng ký kinh doanh</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
            <span>Mã số thuế <span className="text-rose-500">*</span></span>
            <a href="#" className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline">Hướng dẫn tìm MST</a>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              name="companyTaxId"
              value={formData.companyTaxId}
              onChange={handleInputChange}
              placeholder="Nhập MST công ty"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 font-medium shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Tỉnh / Thành phố <span className="text-rose-500">*</span></label>
          <select
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium text-slate-700 appearance-none shadow-sm cursor-pointer"
          >
            <option value="" disabled>Chọn tỉnh thành</option>
            <option value="hn">Hà Nội</option>
            <option value="hcm">Hồ Chí Minh</option>
            <option value="dn">Đà Nẵng</option>
            <option value="ct">Cần Thơ</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Số điện thoại <span className="text-rose-500">*</span></label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Số điện thoại liên hệ"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 font-medium shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Địa chỉ trụ sở</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleInputChange}
              placeholder="Số nhà, đường, quận/huyện..."
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 font-medium shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
