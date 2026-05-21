import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

export default function StatisticsSection({ stats, unavailable = false }) {
  const totalJobs = stats?.totalJobs ?? 0;
  const newJobs24h = stats?.newJobs24h ?? 0;
  const openJobs = stats?.openJobs ?? 0;

  return (
    <section className="py-16 sm:py-20 bg-linear-to-br from-slate-900 via-slate-850 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500 opacity-10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/50 mb-4">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">THONG KE THUC TE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-linear-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            Thi truong viec lam hom nay
          </h2>
          <p className="text-slate-300 text-base">
            {unavailable
              ? 'Thong ke tam thoi khong kha dung vi job service dang gian doan.'
              : 'Du lieu cap nhat realtime tu CareerConnect'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Viec lam dang tuyen', value: totalJobs.toLocaleString('vi-VN') },
            { label: 'Viec lam moi 24h', value: newJobs24h.toLocaleString('vi-VN') },
            { label: 'Cong ty dang tuyen', value: openJobs.toLocaleString('vi-VN') },
            { label: 'Luong trung binh', value: unavailable ? '--' : '20M+' },
          ].map((item) => (
            <div
              key={item.label}
              className="group relative p-6 sm:p-8 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative">
                <p className="text-slate-400 text-sm mb-2 font-medium">{item.label}</p>
                <p className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                  {item.value}
                </p>
                <div className="h-1 w-12 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={20} className="text-emerald-400" />
              <h3 className="text-lg font-bold">Tang truong so luong viec lam</h3>
            </div>
            <div className="flex items-end gap-1 h-40">
              {[20, 35, 28, 45, 38, 50, 42, 55, 60, 75].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-linear-to-t from-emerald-500 to-emerald-400 rounded-t opacity-70 hover:opacity-100 transition-all duration-300 group cursor-pointer"
                  style={{
                    height: `${unavailable ? 12 : height}%`,
                    transition: 'opacity 0.3s, transform 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1, 1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1, 1)';
                  }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-400 font-medium">
              <span>Thang 1</span>
              <span>Thang 10</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 size={20} className="text-emerald-400" />
              <h3 className="text-lg font-bold">Nhu cau tuyen dung theo nganh</h3>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Kinh doanh / Ban hang', value: unavailable ? 0 : 70, color: 'from-emerald-500 to-emerald-400' },
                { label: 'Hanh chinh / Van phong', value: unavailable ? 0 : 50, color: 'from-blue-500 to-blue-400' },
                { label: 'Ke toan / Kiem toan', value: unavailable ? 0 : 60, color: 'from-purple-500 to-purple-400' },
                { label: 'Marketing / Truyen thong', value: unavailable ? 0 : 40, color: 'from-pink-500 to-pink-400' },
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
