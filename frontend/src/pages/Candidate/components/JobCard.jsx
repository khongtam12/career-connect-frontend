import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';



export default function JobCard({ job, isFeatured = false, onDetail }) {
  const [isSaved, setIsSaved] = React.useState(false);

  const companyName =
    job.companyName || job.company || job.companyId || 'Doanh nghiep';

  const jobTypeLabel = job.type || formatJobType(job.jobType);
  const salaryLabel = job.salary || formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${isFeatured
          ? 'border-emerald-200 bg-linear-to-br from-emerald-50 to-white'
          : 'border-gray-200 bg-white'
        }`}
    >
      {/* Background */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${
          job.color || 'from-emerald-500 to-teal-600'
        } opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-xl bg-linear-to-br ${
              job.color || 'from-emerald-500 to-teal-600'
            } shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            {companyName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1.5 truncate font-medium">
              {companyName}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3.5 my-4">
          <p className="text-xl sm:text-2xl font-black text-emerald-600">
            {salaryLabel}
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-700 font-medium">
              📍 {job.location}
            </span>

            {jobTypeLabel && (
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${jobTypeLabel === 'Full-time'
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}>
                {jobTypeLabel === 'Full-time' ? '💼' : '🎓'} {jobTypeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold transition-all duration-200 text-sm ${isSaved
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">
              {isSaved ? 'Đã lưu' : 'Lưu'}
            </span>
          </button>

          {/* Detail */}
          <Link
            to={`/job/${job.jobId || job.id}`}
            className="flex-1 text-center text-emerald-600 hover:bg-emerald-50 text-sm font-semibold py-2.5 px-3 rounded-lg border-2 border-emerald-200 hover:border-emerald-400"
          >
            Chi tiết →
          </Link>
        </div>
      </div>

      {/* Top highlight */}
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400"></div>
      )}
    </div>
  );
}

// ===== Helpers =====
const formatJobType = (jobType) => {
  if (!jobType) return '';
  const map = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    INTERNSHIP: 'Internship',
    REMOTE: 'Remote',
    FREELANCE: 'Freelance',
  };
  return map[jobType] || jobType;
};

const formatSalary = (min, max) => {
  if (!min && !max) return 'Thoa thuan';
  if (min && max) return `${formatSalaryValue(min)} - ${formatSalaryValue(max)}`;
  if (min) return `Tu ${formatSalaryValue(min)}`;
  return `Den ${formatSalaryValue(max)}`;
};

const formatSalaryValue = (value) => {
  if (value >= 1000000) {
    const millions = Math.round((value / 1000000) * 10) / 10;
    return `${millions} trieu`;
  }
  return `${value}`;
};