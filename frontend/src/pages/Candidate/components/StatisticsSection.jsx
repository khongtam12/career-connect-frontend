import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

export default function StatisticsSection({ stats }) {
  const totalJobs = stats?.totalJobs ?? 64584;
  const newJobs24h = stats?.newJobs24h ?? 3483;
  const openJobs = stats?.openJobs ?? 20278;
  return (
    <section className="py-16 sm:py-20 bg-linear-to-br from-slate-900 via-slate-850 to-slate-900 text-white relative overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/50 mb-4">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">THỐNG KÊ THỰC TẾ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-linear-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            Thị trường việc làm hôm nay
          </h2>
          <p className="text-slate-300 text-base">Dữ liệu cập nhật realtime từ CareerConnect</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Jobs Available */}
          <div className="group relative p-6 sm:p-8 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative">
              <p className="text-slate-400 text-sm mb-2 font-medium">Việc làm đang tuyển</p>
              <p className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                {totalJobs.toLocaleString('vi-VN')}
              </p>
              <div className="h-1 w-12 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            </div>
          </div>

          {/* New Jobs Today */}
          <div className="group relative p-6 sm:p-8 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative">
              <p className="text-slate-400 text-sm mb-2 font-medium">Việc làm mới 24h</p>
              <p className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                {newJobs24h.toLocaleString('vi-VN')}
              </p>
              <div className="h-1 w-12 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            </div>
          </div>

          {/* Active Companies */}
          <div className="group relative p-6 sm:p-8 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative">
              <p className="text-slate-400 text-sm mb-2 font-medium">Công ty đang tuyển</p>
              <p className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                {openJobs.toLocaleString('vi-VN')}
              </p>
              <div className="h-1 w-12 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            </div>
          </div>

          {/* Salary Insights */}
          <div className="group relative p-6 sm:p-8 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
            <div className="relative">
              <p className="text-slate-400 text-sm mb-2 font-medium">Lương trung bình</p>
              <p className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                20M+
              </p>
              <div className="h-1 w-12 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Chart */}
          <div className="p-6 sm:p-8 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={20} className="text-emerald-400" />
              <h3 className="text-lg font-bold">Tăng trưởng số lượng việc làm</h3>
            </div>
            <div className="flex items-end gap-1 h-40">
              {[20, 35, 28, 45, 38, 50, 42, 55, 60, 75].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-linear-to-t from-emerald-500 to-emerald-400 rounded-t opacity-70 hover:opacity-100 transition-all duration-300 group cursor-pointer"
                  style={{ 
                    height: `${height}%`,
                    transition: 'opacity 0.3s, transform 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1, 1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1, 1)'}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-400 font-medium">
              <span>Tháng 1</span>
              <span>Tháng 10</span>
            </div>
          </div>

          {/* Categories Distribution */}
          <div className="p-6 sm:p-8 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 size={20} className="text-emerald-400" />
              <h3 className="text-lg font-bold">Nhu cầu tuyển dụng theo ngành</h3>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Kinh doanh / Bán hàng', value: 70, color: 'from-emerald-500 to-emerald-400' },
                { label: 'Hành chính / Văn phòng', value: 50, color: 'from-blue-500 to-blue-400' },
                { label: 'Kế toán / Kiểm toán', value: 60, color: 'from-purple-500 to-purple-400' },
                { label: 'Marketing / Truyền thông', value: 40, color: 'from-pink-500 to-pink-400' },
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{item.label}</span>
                    <span className="text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">{item.value}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden border border-slate-500/50">
                    <div
                      style={{ width: `${item.value}%` }}
                      className={`h-full bg-linear-to-r ${item.color} rounded-full transition-all duration-500 group-hover:rounded-none`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
