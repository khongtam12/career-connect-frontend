import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FiActivity, FiClock, FiTarget } from 'react-icons/fi';

const STATUS_COLORS = {
  APPLIED: '#94a3b8',
  REVIEWING: '#38bdf8',
  INTERVIEW: '#6366f1',
  ACCEPTED: '#22c55e',
  REJECTED: '#ef4444',
  CANCELLED: '#f97316',
};

const formatPercent = (value) => `${Math.round(value * 100)}%`;

const formatDays = (value) => {
  if (!Number.isFinite(value)) return '—';
  return `${value.toFixed(1)} ngày`;
};

const StatusTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl">
        <div className="font-semibold">{payload[0].name}</div>
        <div className="text-slate-300">{payload[0].value} hồ sơ</div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsModels({
  statusSummary,
  funnelMetrics,
  avgReviewTimeDays,
  avgMatchScore,
  recentActivity,
  isLoading,
}) {
  const statusData = useMemo(() => {
    if (!statusSummary) return [];
    return Object.entries(statusSummary)
      .map(([key, value]) => ({ name: key, value }))
      .filter((item) => item.value > 0);
  }, [statusSummary]);

  const funnelData = useMemo(() => {
    if (!funnelMetrics) return [];
    return [
      { name: 'Đã ứng tuyển', value: funnelMetrics.total },
      { name: 'Đã phản hồi', value: funnelMetrics.reviewed },
      { name: 'Phỏng vấn', value: funnelMetrics.interview },
      { name: 'Chấp nhận', value: funnelMetrics.accepted },
    ];
  }, [funnelMetrics]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Mô hình phân tích dữ liệu</h2>
          <p className="text-sm text-gray-500">Tổng hợp hiệu suất và chất lượng nguồn ứng viên</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <FiActivity size={14} />
          Cập nhật theo thời gian thực
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-100 p-4 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <FiTarget size={16} className="text-indigo-500" />
              Hiệu suất tuyển dụng
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-white border border-gray-100 p-3">
                <div className="text-xs text-gray-500">Tỷ lệ phản hồi</div>
                <div className="text-lg font-semibold text-indigo-600">
                  {formatPercent(funnelMetrics?.responseRate || 0)}
                </div>
              </div>
              <div className="rounded-lg bg-white border border-gray-100 p-3">
                <div className="text-xs text-gray-500">Tỷ lệ phỏng vấn</div>
                <div className="text-lg font-semibold text-emerald-600">
                  {formatPercent(funnelMetrics?.interviewRate || 0)}
                </div>
              </div>
              <div className="rounded-lg bg-white border border-gray-100 p-3">
                <div className="text-xs text-gray-500">Tỷ lệ chấp nhận</div>
                <div className="text-lg font-semibold text-amber-600">
                  {formatPercent(funnelMetrics?.offerRate || 0)}
                </div>
              </div>
              <div className="rounded-lg bg-white border border-gray-100 p-3">
                <div className="text-xs text-gray-500">Điểm phù hợp TB</div>
                <div className="text-lg font-semibold text-slate-700">
                  {avgMatchScore ? `${avgMatchScore.toFixed(0)}%` : '—'}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <FiClock size={14} className="text-slate-400" />
              Thời gian phản hồi trung bình: {formatDays(avgReviewTimeDays)}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Phân bổ trạng thái hồ sơ</div>
            <div className="h-52">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#cbd5f5'} />
                      ))}
                    </Pie>
                    <Tooltip content={<StatusTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                  {isLoading ? 'Đang tải dữ liệu...' : 'Chưa có dữ liệu trạng thái'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 p-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">Phễu chuyển đổi</div>
          <div className="h-52">
            {funnelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip content={<StatusTooltip />} />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 6, 6]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                {isLoading ? 'Đang tải dữ liệu...' : 'Chưa có dữ liệu phễu'}
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500 mb-2">Hoạt động gần đây</div>
            <div className="space-y-2">
              {(recentActivity || []).map((item) => (
                <div key={item.id} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <div>
                    <div className="font-semibold text-gray-700">{item.name || 'Ứng viên'}</div>
                    <div>{item.jobName || 'Tin tuyển dụng'} • {item.timeLabel}</div>
                  </div>
                </div>
              ))}
              {(!recentActivity || recentActivity.length === 0) && (
                <div className="text-xs text-gray-400">Chưa có hoạt động mới.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
