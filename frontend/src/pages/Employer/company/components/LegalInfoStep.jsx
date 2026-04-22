import React, { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";

export default function LegalInfoStep({ formData, handleInputChange, setLicenseFile }) {
  const [uploading, setUploading] = useState(false);
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <FileText className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-semibold text-slate-800">
          Xác thực hồ sơ pháp lý
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Mã số thuế xác thực <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="submittedTaxCode"
            value={formData.submittedTaxCode || ""}
            onChange={handleInputChange}
            placeholder="Nhập MST để xác thực"
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Ghi chú
          </label>
          <input
            type="text"
            name="note"
            value={formData.note || ""}
            onChange={handleInputChange}
            placeholder="VD: Công ty mới thành lập..."
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <div className="md:col-span-2 mt-4">
          <label className="text-sm font-semibold text-slate-700 mb-3 block border-t pt-6 border-slate-100">
            Giấy phép kinh doanh <span className="text-rose-500">*</span>
          </label>

          <div className="group border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-2xl p-10 text-center cursor-pointer transition-all duration-300">

            {formData.businessLicense ? (
              <div className="mb-4">
                <p className="text-sm text-indigo-600 font-medium">
                  📄 Đã chọn: {formData.businessLicense}
                </p>
                <a
                  href={formData.businessLicense}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 underline text-sm"
                >
                  Xem file
                </a>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <UploadCloud className="w-8 h-8 text-indigo-500" />
                </div>

                <p className="text-indigo-900 font-semibold mb-1 text-lg">
                  {uploading ? "Đang upload..." : "Tải ảnh hoặc PDF"}
                </p>

                <p className="text-sm text-indigo-400 mb-6">
                  PNG, JPG, PDF (tối đa 5MB)
                </p>
              </>
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              id="licenseUpload"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                setLicenseFile(file);
                handleInputChange({
                  target: {
                    name: "businessLicense",
                    value: file.name,
                  },
                });
              }}
            />

            <label
              htmlFor="licenseUpload"
              className="px-6 py-2.5 bg-white border border-indigo-100 text-indigo-600 font-medium rounded-lg shadow-sm hover:bg-indigo-50 cursor-pointer"
            >
              Chọn file
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}