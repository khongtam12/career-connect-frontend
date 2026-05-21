import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from './JobCard';
import { Briefcase, ChevronDown } from 'lucide-react';

const filterOptionsList = [
  { value: 'location', label: 'Địa điểm' },
  { value: 'salary', label: 'Mức lương' },
  { value: 'experience', label: 'Kinh nghiệm' },
  { value: 'industry', label: 'Ngành nghề' },
];

const salaryRanges = [
  { label: 'Dưới 10 triệu', min: 0, max: 10000000 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { label: '20 - 30 triệu', min: 20000000, max: 30000000 },
  { label: 'Trên 30 triệu', min: 30000000, max: null },
];

const experienceRanges = [
  { label: 'Mới ra trường', min: 0, max: 0 },
  { label: '1 - 2 năm', min: 1, max: 2 },
  { label: '3 - 5 năm', min: 3, max: 5 },
  { label: 'Trên 5 năm', min: 6, max: null },
];

export default function BestJobsSection({
  jobs = [],
  total = 0,
  filters,
  filterOptions,
  onQuickFilter,
  onViewAll,
  savedJobs = [],
  appliedJobs = [],
  emptyText = 'Chua tim thay viec lam phu hop',
}) {
  const [activeFilterType, setActiveFilterType] = useState('location');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const dropdownRef = useRef(null);
  const managementRef = useRef(null);
  const managementCount = savedJobs.length + appliedJobs.length;
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (managementRef.current && !managementRef.current.contains(event.target)) {
        setIsManagementOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chips = useMemo(() => {
    if (activeFilterType === 'location') {
      return (filterOptions.locations || []).map((item) => ({ label: item, value: item }));
    }
    if (activeFilterType === 'industry') {
      return (filterOptions.industries || []).map((item) => ({
        label: item.name,
        value: item.industryId,
      }));
    }
    if (activeFilterType === 'salary') {
      return salaryRanges.map((item) => ({ label: item.label, value: item }));
    }
    if (activeFilterType === 'experience') {
      return experienceRanges.map((item) => ({ label: item.label, value: item }));
    }
    return [];
  }, [activeFilterType, filterOptions.industries, filterOptions.locations]);

  const handleChipClick = (chip) => {
    if (activeFilterType === 'location') {
      onQuickFilter({ location: chip.value });
      return;
    }
    if (activeFilterType === 'industry') {
      onQuickFilter({ industryId: chip.value });
      return;
    }
    if (activeFilterType === 'salary') {
      onQuickFilter({
        salaryMin: chip.value.min !== null ? chip.value.min / 1000000 : '',
        salaryMax: chip.value.max !== null ? chip.value.max / 1000000 : '',
      });
      return;
    }
    if (activeFilterType === 'experience') {
      onQuickFilter({
        experienceMin: chip.value.min,
        experienceMax: chip.value.max,
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-linear-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700">Việc làm tốt nhất</h2>
            <p className="text-sm text-gray-500 mt-1">Chọn nhanh bộ lọc để tìm công việc phù hợp</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onViewAll}
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Xem tất cả việc làm {total ? `(${total})` : ''}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:border-emerald-300"
              >
                <span className="text-gray-500">Lọc theo:</span>
                <span className="font-semibold text-gray-800">
                  {filterOptionsList.find((item) => item.value === activeFilterType)?.label}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 top-12 z-20 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                  {filterOptionsList.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setActiveFilterType(item.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${activeFilterType === item.value
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {item.label}
                      {activeFilterType === item.value && <span className="text-emerald-600">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div ref={managementRef} className="relative">
              <button
                type="button"
                onClick={() => setIsManagementOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-100"
              >
                <Briefcase size={16} />
                Quản lý tìm việc
                {managementCount > 0 && (
                  <span className="rounded-full bg-emerald-600 text-white text-xs px-2 py-0.5">
                    {managementCount}
                  </span>
                )}
                <ChevronDown size={16} className={`transition-transform ${isManagementOpen ? 'rotate-180' : ''}`} />
              </button>

              {isManagementOpen && (
                <div className="absolute left-0 top-12 z-20 w-64 rounded-2xl border border-emerald-100 bg-white p-2 shadow-xl">
                  {[
                    { key: 'saved', label: 'Việc làm đã lưu', count: savedJobs.length },
                    { key: 'applied', label: 'Việc làm đã ứng tuyển', count: appliedJobs.length },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        navigate(item.key === 'saved' ? '/saved-jobs' : '/applied-jobs');
                        setIsManagementOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-gray-400">{item.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {chips.length === 0 ? (
              <span className="text-xs text-gray-500">Chưa có dữ liệu bộ lọc</span>
            ) : (
              chips.map((chip) => {
                const isActive =
                  (activeFilterType === 'location' && filters.location === chip.value) ||
                  (activeFilterType === 'industry' && filters.industryId === chip.value);
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${isActive
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-200 hover:text-emerald-600'
                      }`}
                  >
                    {chip.label}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <JobCard key={job.jobId || job.id} job={job} />
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">Chưa tìm thấy việc làm phù hợp</div>
        )}
      </div>
    </section>
  );
}
