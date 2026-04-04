import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Stepper from './components/Stepper';
import CompanyInfoStep from './components/CompanyInfoStep';
import LegalInfoStep from './components/LegalInfoStep';
import JobPostingStep from './components/JobPostingStep';

export default function RecruitmentAccountForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyTaxId: '',
    province: '',
    phoneNumber: '',
    companyName: '',
    companyAddress: '',
    documentType: '',
    documentNumber: '',
    jobTitle: '',
    jobDescription: '',
    salary: '',
    quantity: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    alert('Hoàn thành đăng ký!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4 text-purple-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 mb-3 tracking-tight">
            Hoàn thiện tài khoản tuyển dụng
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Chỉ còn vài bước đơn giản để bắt đầu tìm kiếm những ứng viên tuyệt vời nhất cho công ty của bạn.
          </p>
        </div>

        {/* Dynamic Stepper Component */}
        <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

        {/* Form Container with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white p-8 md:p-10 mb-8 transition-all duration-500">
          
          {/* STEP 1: Company Info */}
          {currentStep === 1 && (
            <CompanyInfoStep formData={formData} handleInputChange={handleInputChange} />
          )}

          {/* STEP 2: Legal Documents */}
          {currentStep === 2 && (
            <LegalInfoStep formData={formData} handleInputChange={handleInputChange} />
          )}

          {/* STEP 3: Job Posting */}
          {currentStep === 3 && (
            <JobPostingStep formData={formData} handleInputChange={handleInputChange} />
          )}
        </div>

        {/* Floating Action Bar */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-100 sticky bottom-6">
          <button
            type="button"
            onClick={handlePrev}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Quay lại
          </button>

          <button
            type="button"
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            className={`px-8 py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 group
              ${currentStep === 3 
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
          >
            {currentStep === 3 ? 'Đăng tin & Hoàn tất' : 'Lưu và Tiếp tục'}
            <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${currentStep === 3 ? 'hidden' : 'block'}`} />
            {currentStep === 3 && <CheckCircle2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
