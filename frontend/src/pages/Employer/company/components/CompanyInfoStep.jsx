import React from 'react';
import { Building, CreditCard, Phone, MapPin, Globe, Mail, Users, Calendar } from 'lucide-react';



export default function CompanyInfoStep({ formData, handleInputChange, setLogoFile }) {


  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <Building className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-semibold text-slate-800">Thông tin công ty</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* LOGO */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-3 block">
            Logo công ty
          </label>

          <div className="flex items-center gap-6">
            {/* PREVIEW */}
            <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm">
              {formData.logo ? (
                <img
                  src={formData.logo}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building className="w-8 h-8 text-slate-300" />
              )}
            </div>

            {/* UPLOAD */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setLogoFile(file);

                  const previewUrl = URL.createObjectURL(file);

                  handleInputChange({
                    target: {
                      name: "logo",
                      value: previewUrl,
                    },
                  });
                }}
                className="hidden"
                id="logoUpload"
              />

              <label
                htmlFor="logoUpload"
                className="inline-block px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 transition-all shadow-sm font-medium"
              >
                Chọn logo
              </label>

              <p className="text-xs text-slate-400 mt-2">
                PNG, JPG (tối đa 2MB)
              </p>
            </div>
          </div>
        </div>
        {/* NAME */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Tên công ty <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên theo giấy phép kinh doanh"
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 font-medium text-slate-700 shadow-sm"
          />
        </div>

        {/* TAX CODE */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 flex justify-between">
            <span>Mã số thuế <span className="text-rose-500">*</span></span>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="taxCode"
              value={formData.taxCode}
              onChange={handleInputChange}
              placeholder="Nhập MST công ty"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Số điện thoại <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Số điện thoại"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="company@email.com"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
        </div>

        {/* WEBSITE */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Website
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://company.com"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
        </div>

        {/* COMPANY SIZE */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Quy mô công ty
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              name="companySize"
              value={formData.companySize}
              onChange={handleInputChange}
              placeholder="VD: 50"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
        </div>

        {/* FOUNDED YEAR */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Năm thành lập
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              name="foundedYear"
              value={formData.foundedYear}
              onChange={handleInputChange}
              placeholder="VD: 2020"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Địa chỉ
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Địa chỉ công ty"
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Mô tả công ty
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Giới thiệu về công ty..."
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 shadow-sm resize-none"
          />
        </div>

      </div>
    </div>
  );
}