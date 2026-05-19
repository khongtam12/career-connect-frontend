import React, { useMemo } from 'react';
import { FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const buildDefaultMonthlyData = () => {
  const now = new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    const year = String(date.getFullYear()).slice(-2);
    return {
      name: `T${date.getMonth() + 1}/${year}`,
      applications: 0,
    };
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-emerald-400">{payload[0].value} ứng viên</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsOverview({ stats, applicationData, topJobsData, isLoading }) {
  const resolvedApplicationData = useMemo(() => {
    if (applicationData?.length) return applicationData;
    return buildDefaultMonthlyData();
  }, [applicationData]);

  const resolvedTopJobs = useMemo(() => {
    if (topJobsData?.length) return topJobsData;
    return [];
  }, [topJobsData]);

  const summaryItems = [
    { label: 'Đang tuyển', value: stats?.active ?? 0, tone: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tạm dừng', value: stats?.paused ?? 0, tone: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Đã đóng', value: stats?.closed ?? 0, tone: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Tổng ứng viên', value: stats?.totalApplicants ?? 0, tone: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Thống kê tuyển dụng</h2>
      <p className="text-sm text-gray-500 mb-4">Tổng quan hiệu quả tuyển dụng của bạn</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`inline-flex items-center px-2 py-1 rounded-full ${item.bg} ${item.tone} text-xs font-semibold mb-2`}>
              {item.label}
            </div>
            <div className={`text-2xl font-bold ${item.tone}`}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Applications Over Time */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <FiTrendingUp size={16} />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Lượt ứng tuyển</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-gray-400">12 tháng qua</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resolvedApplicationData}>
                <defs>
                  <linearGradient id="colorAppHome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#colorAppHome)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3, stroke: '#fff' }}
                  activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Jobs */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <FiBarChart2 size={16} />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Tin tuyển dụng hiệu quả</h3>
            </div>
          </div>
          {resolvedTopJobs.length > 0 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resolvedTopJobs} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="applicants"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    background={{ fill: '#f8fafc', radius: [6, 6, 0, 0] }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-sm text-gray-400">
              {isLoading ? 'Đang tải dữ liệu...' : 'Chưa có dữ liệu ứng tuyển'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
