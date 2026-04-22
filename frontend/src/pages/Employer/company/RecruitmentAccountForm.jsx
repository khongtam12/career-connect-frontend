import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Stepper from './components/Stepper';
import CompanyInfoStep from './components/CompanyInfoStep';
import LegalInfoStep from './components/LegalInfoStep';
import { saveCompany, saveVerification, getUrl } from '../../../service/companyService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserStore } from '../../../stores/useUserStore';

export default function RecruitmentAccountForm() {
  const { user } = useUserStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [logoFile, setLogoFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // Company
    name: '',
    logo: '',
    taxCode: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    companySize: '',
    foundedYear: '',

    // Verify
    submittedTaxCode: '',
    businessLicense: '',
    note: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const uploadFileToS3 = async (file, folder) => {
    const key = `${folder}/${Date.now()}_${file.name}`;

    const { uploadUrl, fileUrl } = await getUrl({
      key,
      contentType: file.type,
    });

    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    return fileUrl;
  };

  const handleSubmit = async () => {
    try {
      let logoUrl = "";
      let licenseUrl = "";


      if (logoFile) {
        logoUrl = await uploadFileToS3(logoFile, "company/logo");
      }


      if (licenseFile) {
        licenseUrl = await uploadFileToS3(licenseFile, "company/license");
      }
      if (!user?.userId) {
        toast.error("Bạn chưa đăng nhập");
        console.log("USER:", user);
        return;
      }
      const companyRes = await saveCompany({
        name: formData.name,
        logo: logoUrl,
        taxCode: formData.taxCode,
        website: formData.website,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        companySize: formData.companySize,
        foundedYear: formData.foundedYear,
        employerId: user.userId
      });


      await saveVerification({
        companyId: companyRes.companyId,
        submittedTaxCode: formData.submittedTaxCode,
        businessLicense: licenseUrl,
        note: formData.note,
      });
      toast.success("Cập nhật thông tin thành công")
      navigate("/employer")

    } catch (err) {
      console.error(err);
      toast.error("Lỗi Cập nhật thông tin")
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4 text-purple-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 text-transparent bg-clip-text mb-3">
            Hoàn thiện tài khoản tuyển dụng
          </h1>
          <p className="text-slate-500">
            Chỉ vài bước để bắt đầu tuyển dụng 🚀
          </p>
        </div>

        <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow p-8 mb-8">

          {currentStep === 1 && (
            <CompanyInfoStep
              setLogoFile={setLogoFile}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {currentStep === 2 && (
            <LegalInfoStep
              setLicenseFile={setLicenseFile}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

        </div>

        {/* ACTION */}
        <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow sticky bottom-6">

          <button
            onClick={handlePrev}
            className={`${currentStep === 1 ? 'opacity-0' : ''}`}
          >
            Quay lại
          </button>

          <button
            onClick={currentStep === 2 ? handleSubmit : handleNext}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            {currentStep === 2 ? 'Hoàn tất' : 'Tiếp tục'}
            {currentStep === 2
              ? <CheckCircle2 className="w-4 h-4" />
              : <ChevronRight className="w-4 h-4" />
            }
          </button>

        </div>
      </div>
    </div>
  );
}