import React from 'react';
import { isHotJob } from '../utils/jobBadges';

export default function JobListItem({ job, isActive, onSelect }) {
  const salaryLabel = formatSalary(job.salaryMin, job.salaryMax);
  const jobTypeLabel = formatJobType(job.jobType);
  const showHotBadge = isHotJob(job);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(job)}
      className={`w-full text-left rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
        isActive
          ? 'border-emerald-500 bg-emerald-50/60 shadow-md'
          : 'border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-md'
      }`}
    >
      <div className="flex gap-4">
        {job.companyLogoUrl ? (
          <img
            src={job.companyLogoUrl}
            alt={job.companyName || 'Logo'}
            className="w-14 h-14 rounded-xl object-cover border border-gray-200"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
            {(job.companyName || job.companyId || 'C')[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{job.title}</p>
            {showHotBadge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
                🔥 HOT
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1 truncate">{job.companyName || job.companyId}</p>
          <p className="text-emerald-600 font-bold mt-3 text-sm sm:text-base">{salaryLabel}</p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-600">
            <span className="px-2 py-1 rounded-full bg-gray-100">{job.location || 'Toàn quốc'}</span>
            {jobTypeLabel && (
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{jobTypeLabel}</span>
            )}
            {typeof job.experienceRequired === 'number' && (
              <span className="px-2 py-1 rounded-full bg-gray-100">{job.experienceRequired} năm</span>
            )}
            {job.jobLevel && (
              <span className="px-2 py-1 rounded-full bg-gray-100">{job.jobLevel}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

const formatJobType = (jobType) => {
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
  if (!min && !max) return 'Thỏa thuận';
  if (min && max) return `${formatSalaryValue(min)} - ${formatSalaryValue(max)}`;
  if (min) return `Từ ${formatSalaryValue(min)}`;
  return `Đến ${formatSalaryValue(max)}`;
};

const formatSalaryValue = (value) => {
  if (value >= 1000000) {
    const millions = Math.round((value / 1000000) * 10) / 10;
    return `${millions} triệu`;
  }
  return `${value}`;
};
