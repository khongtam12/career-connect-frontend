import React from 'react';
import { Heart } from 'lucide-react';

export default function JobCard({ job, isFeatured = false }) {
  const [isSaved, setIsSaved] = React.useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${
        isFeatured
          ? 'border-emerald-200 bg-linear-to-br from-emerald-50 to-white'
          : 'border-gray-200 bg-white'
      }`}
    >
      {/* Background Gradient Accent */}
      <div className={`absolute inset-0 bg-linear-to-br ${job.color || 'from-emerald-500 to-teal-600'} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex gap-4 mb-4">
          {/* Logo with Gradient Background */}
          <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${job.color || 'from-emerald-500 to-teal-600'} shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {job.company.charAt(0)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-emerald-600 cursor-pointer transition-colors">
              {job.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1.5 truncate font-medium">{job.company}</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-3.5 my-4">
          {/* Salary - Large and Bold */}
          <div>
            <p className="text-xl sm:text-2xl font-black text-emerald-600">{job.salary}</p>
          </div>

          {/* Location and Type */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-700 font-medium hover:bg-gray-200 transition-colors">
              📍 {job.location}
            </span>
            {job.type && (
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                job.type === 'Full-time' 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}>
                {job.type === 'Full-time' ? '💼' : '🎓'} {job.type}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-linear-to-r from-gray-200 via-gray-300 to-gray-200"></div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold transition-all duration-200 text-sm ${
              isSaved
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{isSaved ? 'Đã lưu' : 'Lưu'}</span>
          </button>
          <button className="flex-1 text-emerald-600 hover:bg-emerald-50 transition-all duration-200 text-sm font-semibold py-2.5 px-3 rounded-lg border-2 border-emerald-200 hover:border-emerald-400 group/btn">
            Chi tiết →
          </button>
        </div>
      </div>

      {/* Top Border Accent */}
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-400"></div>
      )}
    </div>
  );
}
