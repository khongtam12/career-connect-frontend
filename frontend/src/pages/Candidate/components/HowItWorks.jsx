import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Send, HandshakeIcon } from 'lucide-react';

import { useUserStore } from '../../../stores/useUserStore';

export default function HowItWorks() {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthDialog } = useUserStore();

  const steps = [
    {
      number: '1',
      title: 'Tạo tài khoản',
      description: 'Đăng ký tài khoản miễn phí và hoàn thành hồ sơ cơ bản',
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: '2',
      title: 'Tìm kiếm việc',
      description: 'Khám phá hàng nghìn cơ hội việc làm phù hợp',
      icon: Search,
      color: 'from-purple-500 to-purple-600',
    },
    {
      number: '3',
      title: 'Ứng tuyển',
      description: 'Gửi đơn ứng tuyển chỉ với một cú click',
      icon: Send,
      color: 'from-pink-500 to-pink-600',
    },
    {
      number: '4',
      title: 'Nhận việc làm',
      description: 'Kết nối với nhà tuyển dụng và nhận lời mời phỏng vấn',
      icon: HandshakeIcon,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const handleStepClick = (step) => {
    if (step.number === '1') {
      navigate(isAuthenticated ? '/cv-dashboard' : '/register');
      return;
    }

    if (step.number === '2') {
      navigate('/jobs');
      return;
    }

    if (step.number === '3') {
      if (!isAuthenticated) {
        openAuthDialog({
          closable: true,
          onSuccess: () => navigate('/jobs'),
        });
        return;
      }

      navigate('/jobs');
      return;
    }

    if (step.number === '4') {
      if (!isAuthenticated) {
        openAuthDialog({
          closable: true,
          onSuccess: () => navigate('/applied-jobs'),
        });
        return;
      }

      navigate('/applied-jobs');
    }
  };

  const handleCtaClick = () => {
    navigate(isAuthenticated ? '/jobs' : '/register');
  };

  return (
    <section className="py-16 sm:py-20 bg-linear-to-b from-white via-blue-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-72 h-72 bg-blue-200 opacity-20 rounded-full blur-3xl -mr-36"></div>
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-emerald-200 opacity-20 rounded-full blur-3xl -ml-36"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cách hoạt động đơn giản
          </h2>
          <p className="text-gray-600 text-lg">
            4 bước đơn giản để tìm công việc dream của bạn
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleStepClick(step)}
                className="relative group text-left w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-4 rounded-2xl"
              >
                {/* Card */}
                <div className="relative p-6 sm:p-8 bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl group-hover:shadow-2xl h-full">
                  {/* Background Gradient Overlay */}
                  <div className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>

                  {/* Icon Circle */}
                  <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent size={28} className="text-white" />
                  </div>

                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-3.5 w-7 h-1 bg-linear-to-r from-emerald-400 to-transparent z-20">
                    <div className="absolute right-0 top-1/2 transform translate-y-1/2 w-0 h-0 border-l-2 border-t-2 border-b-2 border-l-emerald-400 border-t-emerald-400 border-b-emerald-400"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Bắt đầu ngay hôm nay
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
