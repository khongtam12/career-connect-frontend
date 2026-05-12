import React from 'react';
import { Building, CreditCard, Phone, MapPin, Globe, Mail, Users, Calendar } from 'lucide-react';

const fieldClass = (hasError) =>
  `w-full px-5 py-3.5 bg-slate-50 border rounded-xl transition-all shadow-sm ${
    hasError ? 'border-rose-400 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-purple-500'
  }`;

const inputWithIconClass = (hasError) =>
  `w-full pl-12 pr-5 py-3.5 bg-slate-50 border rounded-xl transition-all shadow-sm ${
    hasError ? 'border-rose-400 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-purple-500'
  }`;

export default function CompanyInfoStep({ formData, handleInputChange, setLogoFile, errors = {} }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <Building className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-semibold text-slate-800">Thong tin cong ty</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-3 block">
            Logo cong ty
          </label>

          <div className="flex items-center gap-6">
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
                      name: 'logo',
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
                Chon logo
              </label>

              <p className="text-xs text-slate-400 mt-2">
                PNG, JPG (toi da 2MB)
              </p>
              {errors.logo && <p className="text-sm text-rose-500 mt-2">{errors.logo}</p>}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Ten cong ty <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhap ten theo giay phep kinh doanh"
            className={`${fieldClass(!!errors.name)} placeholder-slate-400 font-medium text-slate-700`}
          />
          {errors.name && <p className="text-sm text-rose-500 mt-2">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 flex justify-between">
            <span>Ma so thue <span className="text-rose-500">*</span></span>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="taxCode"
              value={formData.taxCode}
              onChange={handleInputChange}
              placeholder="Nhap MST cong ty"
              className={inputWithIconClass(!!errors.taxCode)}
            />
          </div>
          {errors.taxCode && <p className="text-sm text-rose-500 mt-2">{errors.taxCode}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            So dien thoai <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="So dien thoai"
              className={inputWithIconClass(!!errors.phone)}
            />
          </div>
          {errors.phone && <p className="text-sm text-rose-500 mt-2">{errors.phone}</p>}
        </div>

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
              className={inputWithIconClass(!!errors.email)}
            />
          </div>
          {errors.email && <p className="text-sm text-rose-500 mt-2">{errors.email}</p>}
        </div>

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
              className={inputWithIconClass(!!errors.website)}
            />
          </div>
          {errors.website && <p className="text-sm text-rose-500 mt-2">{errors.website}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Quy mo cong ty
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              name="companySize"
              value={formData.companySize}
              onChange={handleInputChange}
              placeholder="VD: 50"
              className={inputWithIconClass(!!errors.companySize)}
            />
          </div>
          {errors.companySize && <p className="text-sm text-rose-500 mt-2">{errors.companySize}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Nam thanh lap
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              name="foundedYear"
              value={formData.foundedYear}
              onChange={handleInputChange}
              placeholder="VD: 2020"
              className={inputWithIconClass(!!errors.foundedYear)}
            />
          </div>
          {errors.foundedYear && <p className="text-sm text-rose-500 mt-2">{errors.foundedYear}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Dia chi
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Dia chi cong ty"
              className={inputWithIconClass(!!errors.address)}
            />
          </div>
          {errors.address && <p className="text-sm text-rose-500 mt-2">{errors.address}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Mo ta cong ty
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Gioi thieu ve cong ty..."
            className={`${fieldClass(!!errors.description)} resize-none`}
          />
          {errors.description && <p className="text-sm text-rose-500 mt-2">{errors.description}</p>}
        </div>
      </div>
    </div>
  );
}
