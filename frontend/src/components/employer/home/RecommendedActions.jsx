import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiUser, FiDatabase, FiArrowRight } from 'react-icons/fi';

export default function RecommendedActions({ stats, profileCompletion, totalCandidates, isLoading }) {
  const navigate = useNavigate();

  const actions = useMemo(() => {
    const active = stats?.active || 0;
    const paused = stats?.paused || 0;
    const closed = stats?.closed || 0;
    const totalJobs = active + paused + closed;
    const completion = Number.isFinite(profileCompletion) ? profileCompletion : 0;
    const candidateCount = totalCandidates || 0;

    return [
      {
        icon: FiPlus,
        title: totalJobs > 0 ? 'Tạo thêm tin tuyển dụng' : 'Tạo tin tuyển dụng đầu tiên',
        description:
          totalJobs > 0
            ? `Bạn đang có ${totalJobs} tin tuyển dụng. Tạo thêm để mở rộng phạm vi tiếp cận.`
            : 'Bắt đầu thu hút ứng viên chất lượng cho vị trí bạn đang tuyển.',
        cta: totalJobs > 0 ? 'Tạo tin mới' : 'Tạo ngay',
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'bg-emerald-400/20',
        onClick: () => navigate('/employer/jobs'),
      },
      {
        icon: FiUser,
        title: completion < 70 ? 'Hoàn thiện hồ sơ công ty' : 'Cập nhật hồ sơ công ty',
        description:
          completion < 70
            ? `Hồ sơ công ty đã hoàn thiện ${completion}%. Hoàn thiện để tăng độ tin cậy.`
            : 'Cập nhật thông tin công ty để giữ hồ sơ luôn mới và đáng tin cậy.',
        cta: 'Cập nhật',
        gradient: 'from-blue-500 to-indigo-600',
        iconBg: 'bg-blue-400/20',
        onClick: () => navigate('/employer/profile'),
      },
      {
        icon: FiDatabase,
        title: 'Khám phá kho ứng viên',
        description:
          candidateCount > 0
            ? `Bạn có ${candidateCount} hồ sơ ứng tuyển đang chờ đánh giá.`
            : 'Tìm kiếm ứng viên phù hợp và quản lý quy trình phỏng vấn.',
        cta: 'Xem ngay',
        gradient: 'from-violet-500 to-purple-600',
        iconBg: 'bg-violet-400/20',
        onClick: () => navigate('/employer/candidates'),
      },
    ];
  }, [navigate, profileCompletion, stats, totalCandidates]);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Hành động đề xuất</h2>
      <p className="text-sm text-gray-500 mb-4">Hoàn thành các bước này để tối ưu trải nghiệm tuyển dụng</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.gradient} p-5 text-white cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
          >
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>

            <div className="relative">
              <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon size={20} />
              </div>

              <h3 className="text-sm font-bold mb-1">{action.title}</h3>
              <p className="text-xs text-white/80 leading-relaxed mb-4">{action.description}</p>

              <button
                type="button"
                onClick={action.onClick}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm px-3.5 py-1.5 rounded-lg transition-all duration-200 border border-white/10"
              >
                {action.cta}
                <FiArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
