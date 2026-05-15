import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isJobSaved, toggleSavedJob } from '../utils/jobTracker';
import { useUserStore } from '../../../stores/useUserStore';

import { isHotJob } from '../utils/jobBadges';

export default function JobCard({ job, isFeatured = false, onDetail, isSaved, onToggleSave }) {
  const jobId = job?.jobId || job?.id;
  const [localSaved, setLocalSaved] = React.useState(() => isJobSaved(jobId));
  const resolvedSaved = typeof isSaved === 'boolean' ? isSaved : localSaved;
  const { isAuthenticated, openAuthDialog } = useUserStore();
  const showHotBadge = isHotJob(job);
  useEffect(() => {
    setLocalSaved(isJobSaved(jobId));
  }, [jobId]);

  useEffect(() => {
    const handleUpdate = () => setLocalSaved(isJobSaved(jobId));
    window.addEventListener('jobTrackerUpdated', handleUpdate);
    return () => window.removeEventListener('jobTrackerUpdated', handleUpdate);
    
  }, [jobId]);

  const companyName =
    job.companyName || job.company || job.companyId || 'Doanh nghiep';

  const jobTypeLabel = job.type || formatJobType(job.jobType);
  const salaryLabel = job.salary || formatSalary(job.salaryMin, job.salaryMax);
  const handleToggleSave = () => {
    if (!isAuthenticated) {
      openAuthDialog({ closable: true });
      return;
    }
    if (onToggleSave) {
      onToggleSave(job, !resolvedSaved);
      return;
    }
    const next = toggleSavedJob(job);
    setLocalSaved(next);
  };
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 ${isFeatured
        ? 'border-emerald-200 bg-linear-to-br from-emerald-50 to-white'
        : 'border-gray-200 bg-white'
        }`}
    >
      {showHotBadge && (
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
            🔥 HOT
          </span>
        </div>
      )}
      {/* Background */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${job.color || 'from-emerald-500 to-teal-600'
          } opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex gap-4 mb-4">
          <div
            className={`w-14 h-14 rounded-xl bg-linear-to-br ${job.color || 'from-emerald-500 to-teal-600'
              } shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden bg-white`}
          >
            {(job.logo || job.company?.logo) ? (
              <img
                src={job.logo || job.company?.logo}
                alt={companyName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10";
                }}
              />
            ) : (
              companyName.charAt(0)
            )}
          </div>

          <div className="flex-1 min-w-0">
            
            <p className="text-xl sm:text-xl text-gray-600 mt-1.5 truncate font-medium">
            Công Ty {companyName}
            </p>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {job.title}
            </h3>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3.5 my-4">
          <p className="text-xl sm:text-2xl font-black text-emerald-600">
            Lương: {salaryLabel} VNĐ
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
            onClick={handleToggleSave} // ← thay toàn bộ inline arrow function cũ
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-semibold transition-all duration-200 text-sm ${resolvedSaved
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <Heart size={18} fill={resolvedSaved ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">
              {resolvedSaved ? 'Đã lưu' : 'Lưu'}
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