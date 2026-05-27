import React, { useMemo } from 'react';
import JobCard from './JobCard';
import { formatProvinceLabel } from '../../../lib/utils';

export default function QuickJobsSection({
  title,
  subtitle,
  icon,
  jobs = [],
  total = 0,
  locations = [],
  locationFilter = '',
  onLocationChange,
  onViewAll,
  backgroundClassName = 'bg-slate-50',
  accentClassName = 'text-emerald-600',
  emptyText = 'Chưa có việc làm phù hợp',
  loading = false,
}) {
  const locationOptions = useMemo(() => locations.filter(Boolean), [locations]);

  return (
    <section className={`py-12 sm:py-14 ${backgroundClassName}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className={`flex items-center gap-2 text-xl sm:text-2xl font-bold ${accentClassName}`}>
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm">
                {icon}
              </span>
              {title}
            </div>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-2"
          >
            Xem thêm {total ? `(${total})` : ''}
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative">
            <select
              value={locationFilter}
              onChange={(event) => onLocationChange?.(event.target.value)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
            >
              <option value="">Lọc theo: Địa điểm</option>
              {locationOptions.map((item) => (
                <option key={item} value={item}>
                  {formatProvinceLabel(item)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
            Đang tải việc làm...
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
            {emptyText}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.jobId || job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
