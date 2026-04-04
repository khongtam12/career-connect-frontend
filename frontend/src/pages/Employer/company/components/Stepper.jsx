import React from 'react';
import { Building2, FileText, Briefcase, CheckCircle2 } from 'lucide-react';

export default function Stepper({ currentStep, setCurrentStep }) {
  const steps = [
    { step: 1, label: 'Thông tin công ty', icon: Building2 },
    { step: 2, label: 'Xác thực pháp lý', icon: FileText },
    { step: 3, label: 'Tạo tin ngay', icon: Briefcase }
  ];

  return (
    <div className="relative mb-16 max-w-2xl mx-auto">
      {/* Progress Bar Background */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full overflow-hidden">
        {/* Active Progress */}
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700 ease-in-out"
          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
        />
      </div>

      <div className="relative flex justify-between z-10">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.step} 
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => setCurrentStep(item.step)}
            >
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                  ${currentStep === item.step 
                    ? 'bg-purple-600 text-white shadow-purple-200 shadow-lg scale-110' 
                    : currentStep > item.step 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                      : 'bg-white text-slate-400 border-2 border-slate-100 group-hover:border-purple-200 group-hover:text-purple-400'
                  }`}
              >
                {currentStep > item.step ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              <span className={`mt-4 text-sm font-medium transition-colors duration-300 ${currentStep === item.step ? 'text-purple-700' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
