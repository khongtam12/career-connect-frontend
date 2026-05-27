import React, { useMemo } from 'react';
import { BarChart3, CircleGauge, Flame, TrendingUp, TriangleAlert } from 'lucide-react';
import { cn } from '../../../lib/utils';

const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(Number(value ?? 0));

export default function StatisticsSection({ stats, unavailable = false }) {
  const totalJobs = Number(stats?.totalJobs ?? 0);
  const openJobs = Number(stats?.openJobs ?? 0);
  const newJobs24h = Number(stats?.newJobs24h ?? 0);
  const pendingJobs = Number(stats?.pendingJobs ?? 0);
  const rejectedJobs = Number(stats?.rejectedJobs ?? 0);

  const safeTotal = Math.max(totalJobs, openJobs + pendingJobs + rejectedJobs, 1);
  const percentage = (value) => Math.min(100, Math.round((value / safeTotal) * 100));

  const summaryCards = [
    {
      label: 'Tổng việc làm',
      value: totalJobs,
      accent: 'from-cyan-400 to-emerald-400',
      hint: 'Tổng số tin đang có trong hệ thống',
    },
    {
      label: 'Đang hoạt động',
      value: openJobs,
      accent: 'from-emerald-400 to-teal-400',
      hint: 'Tin đang mở cho ứng viên xem và ứng tuyển',
    },
    {
      label: 'Mới 24h',
      value: newJobs24h,
      accent: 'from-sky-400 to-blue-400',
      hint: 'Việc làm mới được đăng trong 24 giờ qua',
    },
    {
      label: 'Chờ duyệt',
      value: pendingJobs,
      accent: 'from-amber-400 to-orange-400',
      hint: 'Tin đang cần kiểm duyệt trước khi lên sàn',
    },
    {
      label: 'Bị từ chối',
      value: rejectedJobs,
      accent: 'from-fuchsia-400 to-pink-400',
      hint: 'Tin không đạt điều kiện xuất bản',
    },
  ];

  const statusBreakdown = useMemo(
    () => [
      { label: 'Đang hoạt động', value: openJobs, color: '#10b981' },
      { label: 'Chờ duyệt', value: pendingJobs, color: '#f59e0b' },
      { label: 'Bị từ chối', value: rejectedJobs, color: '#ec4899' },
    ].filter((item) => item.value > 0),
    [openJobs, pendingJobs, rejectedJobs]
  );

  const statusTotal = statusBreakdown.reduce((sum, item) => sum + item.value, 0);
  const donutStops = statusBreakdown.length
    ? statusBreakdown
        .map((item, index) => {
          const previousTotal = statusBreakdown
            .slice(0, index)
            .reduce((sum, previousItem) => sum + previousItem.value, 0);
          const start = (previousTotal / statusTotal) * 360;
          const end = ((previousTotal + item.value) / statusTotal) * 360;
          return `${item.color} ${start}deg ${end}deg`;
        })
        .join(', ')
    : '#1f2937 0deg 360deg';

  const operationalBars = [
    {
      label: 'Tin đang hoạt động',
      value: openJobs,
      percent: percentage(openJobs),
      tone: 'from-emerald-400 to-teal-400',
    },
    {
      label: 'Tin mới 24h',
      value: newJobs24h,
      percent: percentage(newJobs24h),
      tone: 'from-sky-400 to-blue-400',
    },
    {
      label: 'Chờ duyệt',
      value: pendingJobs,
      percent: percentage(pendingJobs),
      tone: 'from-amber-400 to-orange-400',
    },
    {
      label: 'Bị từ chối',
      value: rejectedJobs,
      percent: percentage(rejectedJobs),
      tone: 'from-fuchsia-400 to-pink-400',
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.14),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#ecfdf5_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-slate-200/80" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-28 right-0 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute left-1/2 top-14 h-64 w-64 -translate-x-1/2 rounded-full border border-slate-200/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-emerald-700 shadow-sm backdrop-blur">
            <CircleGauge size={16} className="text-emerald-500" />
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">Thống kê việc làm</span>
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Thị trường việc làm hôm nay
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            {unavailable
              ? 'Thống kê tạm thời không khả dụng vì job service đang gián đoạn.'
              : 'Dữ liệu cập nhật từ hệ thống CareerConnect, số hóa theo từng trạng thái để dễ quan sát.'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((item) => (
            <div
              key={item.label}
              className={cn(
                'group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_50px_rgba(15,23,42,0.12)]',
                unavailable && 'opacity-70'
              )}
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${item.accent}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_44%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  {unavailable ? '--' : formatNumber(item.value)}
                </p>
                <div className="mt-4 h-px w-12 bg-slate-200" />
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.hint}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_48px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <TrendingUp size={20} className="text-emerald-500" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Cấu hình trạng thái tin đăng</h3>
                <p className="text-sm text-slate-600">Sơ đồ tròn theo dữ liệu duyệt, đang mở và bị từ chối</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div
                  className="relative flex h-52 w-52 items-center justify-center rounded-full border border-slate-200 shadow-inner"
                  style={{ background: `conic-gradient(${donutStops})` }}
                >
                  <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border border-white bg-white text-center shadow-[inset_0_0_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Tổng duyệt</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{formatNumber(statusTotal)}</p>
                    <p className="mt-1 text-xs text-slate-500">Tin đang có trạng thái</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-700">
                  {statusBreakdown.length > 0 ? (
                    statusBreakdown.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.label}</span>
                        </div>
                        <span className="font-semibold text-white">{formatNumber(item.value)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">Chưa có dữ liệu trạng thái</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <BarChart3 size={20} className="text-sky-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Chỉ số hoạt động</h3>
                    <p className="text-sm text-slate-600">Tỷ lệ từng nhóm theo tổng số tin</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {operationalBars.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                        <div>
                          <p className="font-medium text-slate-800">{item.label}</p>
                          <p className="text-xs text-slate-500">{formatNumber(item.value)} tin</p>
                        </div>
                        <span className="font-semibold text-slate-900">{item.percent}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-200 p-1 ring-1 ring-slate-200">
                        <div
                          className={cn('h-full rounded-full bg-linear-to-r transition-all duration-700', item.tone)}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Nhanh</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {unavailable ? '--' : formatNumber(newJobs24h)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">Tin mới trong 24 giờ qua</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cảnh báo</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {unavailable ? '--' : formatNumber(rejectedJobs)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">Tin chưa được chấp nhận</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_48px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <Flame size={20} className="text-orange-500" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Sự phân bố theo trạng thái</h3>
                <p className="text-sm text-slate-600">Tập trung vào những nhóm có tác động lớn nhất</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Tin đang hoạt động</p>
                    <p className="text-xs text-slate-500">Số lượng đã được mở cho ứng viên</p>
                  </div>
                  <span className="text-lg font-semibold text-emerald-600">{percentage(openJobs)}%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-slate-200 p-0.5 ring-1 ring-slate-200">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-400"
                    style={{ width: `${percentage(openJobs)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Tin mới 24h</p>
                    <p className="text-xs text-slate-500">Nhịp cập nhật mới nhất từ hệ thống</p>
                  </div>
                  <span className="text-lg font-semibold text-sky-600">{percentage(newJobs24h)}%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-slate-200 p-0.5 ring-1 ring-slate-200">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-sky-400 to-blue-400"
                    style={{ width: `${percentage(newJobs24h)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Tin chờ duyệt</p>
                    <p className="text-xs text-slate-500">Cần xử lý trước khi hiển thị công khai</p>
                  </div>
                  <span className="text-lg font-semibold text-amber-600">{percentage(pendingJobs)}%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-slate-200 p-0.5 ring-1 ring-slate-200">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-amber-400 to-orange-400"
                    style={{ width: `${percentage(pendingJobs)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Tin bị từ chối</p>
                    <p className="text-xs text-slate-500">Các tin cần xem lại nội dung</p>
                  </div>
                  <span className="text-lg font-semibold text-fuchsia-600">{percentage(rejectedJobs)}%</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-slate-200 p-0.5 ring-1 ring-slate-200">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-fuchsia-400 to-pink-400"
                    style={{ width: `${percentage(rejectedJobs)}%` }}
                  />
                </div>
              </div>

              {unavailable && (
                <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <TriangleAlert size={18} className="mt-0.5 shrink-0 text-amber-500" />
                  <div>
                    <p className="font-semibold">Hệ thống tạm thời chưa cập nhật dữ liệu</p>
                    <p className="mt-1 text-sm text-amber-800/90">
                      Giao diện vẫn giữ bố cục, và sẽ tự động cập nhật số liệu khi dịch vụ sẵn sàng.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
