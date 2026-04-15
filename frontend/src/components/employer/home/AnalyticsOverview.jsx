import React from 'react';
import { FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const applicationData = [
  { name: 'T1', applications: 32 },
  { name: 'T2', applications: 45 },
  { name: 'T3', applications: 28 },
  { name: 'T4', applications: 64 },
  { name: 'T5', applications: 53 },
  { name: 'T6', applications: 72 },
  { name: 'T7', applications: 48 },
  { name: 'T8', applications: 91 },
  { name: 'T9', applications: 67 },
  { name: 'T10', applications: 85 },
  { name: 'T11', applications: 102 },
  { name: 'T12', applications: 78 },
];

const topJobsData = [
  { name: 'React Dev', applicants: 145 },
  { name: 'UI/UX', applicants: 112 },
  { name: 'Backend', applicants: 98 },
  { name: 'DevOps', applicants: 76 },
  { name: 'QA', applicants: 54 },
];

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

export default function AnalyticsOverview() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Thống kê tuyển dụng</h2>
      <p className="text-sm text-gray-500 mb-4">Tổng quan hiệu quả tuyển dụng của bạn</p>

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
              <AreaChart data={applicationData}>
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
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topJobsData} barSize={36}>
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
        </div>
      </div>
    </div>
  );
}
