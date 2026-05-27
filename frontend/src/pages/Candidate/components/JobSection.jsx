import React, { useMemo } from 'react';
import {
  Briefcase,
  Filter,
  ChevronLeft,
  ChevronRight,
  SearchX,
  Loader2,
  Search,
  RotateCcw,
} from 'lucide-react';

import JobCard from './JobCard';
import JobDetailPanel from './JobDetailPanel';
import JobListItem from './JobListItem';
import { formatProvinceLabel } from '../../../lib/utils';

export default function JobSection({
  jobs = [],
  totalElements = 0,
  filters,
  filterOptions,
  onChange,
  onApply,
  onReset,
  page = 0,
  totalPages = 0,
  onPageChange,
  loading = false,
  selectedJob,
  onSelectJob,
  showDetailPanel = false,
}) {
  const hasJobs = useMemo(() => jobs.length > 0, [jobs]);
  const locationChips = (filterOptions.locations || []).slice(0, 6);
  const activeFilterCount = useMemo(() => {
    return [
      filters.keyword,
      filters.location,
      filters.jobType,
      filters.industryId,
      filters.rank,
      filters.education,
      filters.experienceMin,
      filters.experienceMax,
      filters.salaryMin,
      filters.salaryMax,
      filters.salaryNegotiable,
      filters.marketingPackageType,
      filters.marketingPackageCategory,
    ].filter(Boolean).length;
  }, [filters]);

  const activeFilterLabels = useMemo(() => {
    const labels = [];

    if (filters.keyword) labels.push(`Từ khóa: ${filters.keyword}`);
    if (filters.location) labels.push(`Địa điểm: ${formatProvinceLabel(filters.location)}`);
    if (filters.jobType) labels.push(`Loại hình: ${formatJobType(filters.jobType)}`);
    if (filters.rank) labels.push(`Cấp bậc: ${filters.rank}`);
    if (filters.education) labels.push(`Học vấn: ${filters.education}`);
    if (filters.salaryNegotiable === 'true') labels.push('Lương: Có thương lượng');
    if (filters.salaryNegotiable === 'false') labels.push('Lương: Không thương lượng');
    if (filters.experienceMin || filters.experienceMax) {
      labels.push(`Kinh nghiệm: ${filters.experienceMin || '0'} - ${filters.experienceMax || '∞'} năm`);
    }
    if (filters.salaryMin || filters.salaryMax) {
      labels.push(`Lương: ${filters.salaryMin || '0'} - ${filters.salaryMax || '∞'} triệu`);
    }

    return labels;
  }, [filters]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.09),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.05),transparent_22%),linear-gradient(180deg,#f8fafc_0%,#ffffff_38%,#ecfdf5_100%)] py-10 sm:py-14">
      <div className="pointer-events-none absolute -left-32 top-32 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-80 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-stretch">
          <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
              <Briefcase className="h-4 w-4" />
              Career Opportunities
            </div>

            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Khám phá việc làm phù hợp
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Tìm kiếm hàng nghìn cơ hội việc làm chất lượng với mức lương hấp dẫn
              từ các doanh nghiệp hàng đầu.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <p className="text-sm font-medium text-slate-500">Tổng số việc làm</p>
              <h3 className="mt-2 text-4xl font-black text-emerald-600">
                {totalElements}
              </h3>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/80 px-5 py-4 shadow-[0_18px_60px_rgba(16,185,129,0.10)] backdrop-blur-xl">
              <p className="text-sm font-medium text-emerald-700">Kết quả trang hiện tại</p>
              <h3 className="mt-2 text-4xl font-black text-slate-900">
                {jobs.length}
              </h3>
            </div>
          </div>
        </div>
        <div className="mb-10 rounded-4xl border border-white/70 bg-white/85 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => onChange({ keyword: e.target.value })}
                placeholder="Tìm theo vị trí, công ty, kỹ năng..."
                className="w-full rounded-[1.25rem] border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <select
              value={filters.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">Tất cả địa điểm</option>
              {(filterOptions.locations || []).map((item) => (
                <option key={item} value={item}>
                  {formatProvinceLabel(item)}
                </option>
              ))}
            </select>

            <button
              onClick={() => onApply?.({ ...filters })}
              className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_16px_35px_rgba(16,185,129,0.28)] transition-all hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-[0_22px_45px_rgba(16,185,129,0.34)]"
            >
              <Search className="h-4 w-4" />
              Tìm kiếm
            </button>
          </div>

          {locationChips.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onApply?.({ ...filters, location: '' })}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${!filters.location
                    ? 'border-emerald-200 bg-emerald-100 text-emerald-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-600'
                  }`}
              >
                Tất cả
              </button>
              {locationChips.map((item) => {
                const isActive = filters.location === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onApply?.({ ...filters, location: item })}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${isActive
                        ? 'border-emerald-200 bg-emerald-100 text-emerald-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-600'
                      }`}
                  >
                    {formatProvinceLabel(item)}
                  </button>
                );
              })}
            </div>
          )}

          {activeFilterLabels.length > 0 && (
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Bộ lọc đang dùng {activeFilterCount ? `(${activeFilterCount})` : ''}
                  </p>
                  <p className="text-xs text-emerald-700/80">
                    URL sẽ giữ nguyên các tiêu chí đã chọn khi chia sẻ.
                  </p>
                </div>

                {onReset && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeFilterLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Sidebar */}
          <aside className="lg:w-75 shrink-0">
            <div className="sticky top-24 overflow-hidden rounded-4xl border border-white/70 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">

              {/* Sidebar Header */}
              <div className="border-b border-slate-100 bg-linear-to-br from-emerald-50 via-white to-slate-50 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
                    <Filter className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Bộ lọc nâng cao
                    </h3>
                    <p className="text-sm text-slate-500">
                      Tối ưu kết quả tìm kiếm
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Body */}
              <div className="space-y-5 p-6">

                {/* Job Type */}
                <FilterSelect
                  label="Loại hình"
                  value={filters.jobType}
                  onChange={(e) => onChange({ jobType: e.target.value })}
                >
                  <option value="">Tất cả</option>

                  {filterOptions.jobTypes.map((item) => (
                    <option key={item} value={item}>
                      {formatJobType(item)}
                    </option>
                  ))}
                </FilterSelect>

                <FilterSelect
                  label="Cấp bậc"
                  value={filters.rank}
                  onChange={(e) => onChange({ rank: e.target.value })}
                >
                  <option value="">Tất cả</option>

                  {(filterOptions.ranks || []).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </FilterSelect>

                <FilterSelect
                  label="Học vấn"
                  value={filters.education}
                  onChange={(e) => onChange({ education: e.target.value })}
                >
                  <option value="">Tất cả</option>

                  {(filterOptions.educations || []).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </FilterSelect>

                {/* Experience */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Kinh nghiệm
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      min="0"
                      value={filters.experienceMin}
                      onChange={(e) =>
                        onChange({ experienceMin: e.target.value })
                      }
                      placeholder="Từ năm"
                    />

                    <Input
                      type="number"
                      min="0"
                      value={filters.experienceMax}
                      onChange={(e) =>
                        onChange({ experienceMax: e.target.value })
                      }
                      placeholder="Đến năm"
                    />
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Mức lương (triệu)
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      min="0"
                      value={filters.salaryMin}
                      onChange={(e) =>
                        onChange({ salaryMin: e.target.value })
                      }
                      placeholder="Từ"
                    />

                    <Input
                      type="number"
                      min="0"
                      value={filters.salaryMax}
                      onChange={(e) =>
                        onChange({ salaryMax: e.target.value })
                      }
                      placeholder="Đến"
                    />
                  </div>
                </div>

                <FilterSelect
                  label="Lương thương lượng"
                  value={filters.salaryNegotiable}
                  onChange={(e) => onChange({ salaryNegotiable: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  <option value="true">Có thể thương lượng</option>
                  <option value="false">Không thương lượng</option>
                </FilterSelect>

                {/* Industry */}
                <FilterSelect
                  label="Ngành nghề"
                  value={filters.industryId}
                  onChange={(e) =>
                    onChange({ industryId: e.target.value })
                  }
                >
                  <option value="">Tất cả</option>

                  {filterOptions.industries.map((item) => (
                    <option
                      key={item.industryId}
                      value={item.industryId}
                    >
                      {item.name}
                    </option>
                  ))}
                </FilterSelect>

                {/* Button */}
                <button
                  onClick={() => onApply?.({ ...filters })}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_16px_35px_rgba(16,185,129,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-[0_22px_45px_rgba(16,185,129,0.34)]"
                >
                  <Filter className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  Áp dụng bộ lọc
                </button>

                {onReset && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-emerald-200 hover:text-emerald-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1">

            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 rounded-4xl border border-white/70 bg-white/85 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Danh sách tuyển dụng
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Hiển thị {jobs.length} / {totalElements} việc làm
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="text-sm font-medium text-slate-600">
                  Sắp xếp
                </span>

                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    onChange({ sortBy: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="createdAt">Mới nhất</option>
                  <option value="salaryMax">Lương cao nhất</option>
                  <option value="salaryMin">Lương thấp nhất</option>
                  <option value="deadline">Sắp hết hạn</option>
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading && !hasJobs && (
              <div className="flex flex-col items-center justify-center rounded-4xl border border-white/70 bg-white/85 px-6 py-20 text-center shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-emerald-600" />

                <h3 className="text-lg font-bold text-slate-800">
                  Đang tải việc làm...
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Hệ thống đang cập nhật dữ liệu mới nhất
                </p>
              </div>
            )}

            {/* Empty */}
            {!loading && !hasJobs && (
              <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-slate-300 bg-white/85 px-6 py-20 text-center shadow-[0_16px_50px_rgba(15,23,42,0.05)] backdrop-blur-xl">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-slate-100 to-slate-200">
                  <SearchX className="h-10 w-10 text-slate-400" />
                </div>

                <h3 className="text-xl font-bold text-slate-800">
                  Không tìm thấy việc làm
                </h3>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                  Hãy thử thay đổi từ khóa hoặc điều chỉnh bộ lọc để
                  tìm được công việc phù hợp hơn.
                </p>
              </div>
            )}

            {/* Job Content */}
            {hasJobs && (
              <>
                {showDetailPanel ? (
                  <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                    {/* Left */}
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <JobListItem
                          key={job.jobId || job.id}
                          job={job}
                          isActive={
                            (selectedJob?.jobId || selectedJob?.id) ===
                            (job.jobId || job.id)
                          }
                          onSelect={onSelectJob}
                        />
                      ))}
                    </div>

                    {/* Right */}
                    <div className="sticky top-24 h-fit">
                      <JobDetailPanel job={selectedJob} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-1 2xl:grid-cols-1">
                    {jobs.map((job) => (
                      <JobCard
                        key={job.jobId || job.id}
                        job={job}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Updating */}
            {loading && hasJobs && (
              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang cập nhật kết quả...
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">

                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 0}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-500 hover:text-emerald-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </button>

                <div className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200">
                  Trang {page + 1} / {totalPages}
                </div>

                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-500 hover:text-emerald-600 disabled:pointer-events-none disabled:opacity-40"
                >
                  Sau
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- */
/* Components */
/* -------------------------------- */

function Input(props) {
  return (
    <input
      {...props}
      className="
        w-full rounded-xl border border-slate-200
        bg-white px-4 py-2.5 text-sm text-slate-700
        outline-none transition-all
        placeholder:text-slate-400
        hover:border-slate-300
        focus:border-emerald-500
        focus:ring-4 focus:ring-emerald-100
      "
    />
  );
}

function FilterSelect({ label, children, ...props }) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        {...props}
        className="
          w-full rounded-xl border border-slate-200
          bg-white px-4 py-2.5 text-sm text-slate-700
          outline-none transition-all
          hover:border-slate-300
          focus:border-emerald-500
          focus:ring-4 focus:ring-emerald-100
        "
      >
        {children}
      </select>
    </div>
  );
}

function formatJobType(jobType) {
  const map = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    INTERNSHIP: 'Internship',
    REMOTE: 'Remote',
    FREELANCE: 'Freelance',
  };

  return map[jobType] || jobType;
}