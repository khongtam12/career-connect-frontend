import React from "react";
import { Building2, CheckCircle2, FileBadge2 } from "lucide-react";

export default function Stepper({ currentStep, setCurrentStep }) {
  const steps = [
    { step: 1, label: "Thông tin công ty", hint: "Hồ sơ cơ bản", icon: Building2 },
    { step: 2, label: "Xác thực pháp lý", hint: "Giấy tờ doanh nghiệp", icon: FileBadge2 },
  ];

  return (
    <div className="space-y-4">
      {steps.map((item) => {
        const Icon = item.icon;
        const active = currentStep === item.step;
        const completed = currentStep > item.step;

        return (
          <button
            key={item.step}
            type="button"
            onClick={() => setCurrentStep(item.step)}
            className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition ${
              active
                ? "border-[#00b14f] bg-[#f4fff8] shadow-[0_12px_28px_rgba(0,177,79,0.12)]"
                : completed
                  ? "border-[#cfe9d9] bg-white"
                  : "border-slate-200 bg-white hover:border-[#b9dfc9] hover:bg-[#fbfffc]"
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                active
                  ? "bg-[#00b14f] text-white"
                  : completed
                    ? "bg-[#e9fff2] text-[#00b14f]"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {completed ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className={`text-sm font-bold ${active ? "text-slate-900" : "text-slate-700"}`}>
                {item.label}
              </div>
              <div className="mt-1 text-xs text-slate-500">{item.hint}</div>
            </div>

            <div className={`text-xs font-bold ${active ? "text-[#00b14f]" : "text-slate-400"}`}>
              0{item.step}
            </div>
          </button>
        );
      })}
    </div>
  );
}
