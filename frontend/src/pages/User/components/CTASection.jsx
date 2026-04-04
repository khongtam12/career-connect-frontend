import React from 'react';
import { ArrowRight, Zap, FileText, CheckCircle } from 'lucide-react';

export default function CTASection() {
  const cards = [
    {
      icon: FileText,
      title: "CV Builder",
      description: "Tạo CV chuyên nghiệp chỉ trong vài phút với các mẫu đẹp và hiện đại.",
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-50 to-blue-100",
    },
    {
      icon: Zap,
      title: "Cảnh báo việc làm",
      description: "Nhận cảnh báo ngay lập tức khi có việc làm phù hợp với bạn.",
      color: "from-emerald-500 to-teal-600",
      hoverColor: "from-emerald-50 to-teal-100",
    },
    {
      icon: CheckCircle,
      title: "Xác thực hồ sơ",
      description: "Xác thực hồ sơ để tăng độ tin cậy và cơ hội được nhà tuyển dụng chọn.",
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-50 to-purple-100",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full opacity-30 blur-3xl -ml-48 -mb-48"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Công cụ vượt trội!
          </h2>
          <p className="text-gray-600 text-lg">
            Những công cụ giúp bạn tìm việc hiệu quả hơn
          </p>
        </div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border-2 border-transparent hover:border-opacity-100 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 overflow-hidden cursor-pointer bg-linear-to-br ${card.hoverColor}`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                {/* Icon Background */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-linear-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <IconComponent size={24} className="text-white" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                    {card.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    {card.description}
                  </p>

                  <button className="inline-flex items-center gap-2 text-sm sm:text-base font-bold group/btn">
                    <span className={`bg-linear-to-r ${card.color} text-transparent bg-clip-text`}>
                      Bắt đầu ngay
                    </span>
                    <ArrowRight size={16} className={`bg-linear-to-r ${card.color} text-transparent bg-clip-text group-hover/btn:translate-x-1 transition-transform`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="py-12 sm:py-16 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-600 rounded-3xl text-center text-white relative overflow-hidden shadow-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16 blur-2xl"></div>
          </div>

          <div className="relative z-10 px-6">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Bắt đầu hành trình sự nghiệp của bạn
            </h3>
            <p className="text-emerald-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Tham gia hàng triệu những người đang tìm kiếm công việc ideal của họ trên CareerConnect
            </p>
            <button className="inline-flex items-center gap-3 px-8 sm:px-10 py-3 sm:py-4 bg-white text-emerald-600 font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-base sm:text-lg">
              Đăng ký ngay miễn phí
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
