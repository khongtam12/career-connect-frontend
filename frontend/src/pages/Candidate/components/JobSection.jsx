import React, { useMemo } from 'react';
import {
  Briefcase,
  Filter,
  ChevronLeft,
  ChevronRight,
  SearchX,
  Loader2,
} from 'lucide-react';

import JobCard from './JobCard';
import JobDetailPanel from './JobDetailPanel';
import JobListItem from './JobListItem';

export default function JobSection({
  jobs = [],
  totalElements = 0,
  filters,
  filterOptions,
  onChange,
  onApply,
  page = 0,
  totalPages = 0,
  onPageChange,
  loading = false,
  selectedJob,
  onSelectJob,
  showDetailPanel = false,
}) {
  const hasJobs = useMemo(() => jobs.length > 0, [jobs]);

  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12 sm:py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <Briefcase className="h-4 w-4" />
              Career Opportunities
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Khám phá việc làm phù hợp
            </h1>

            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-500">
              Tìm kiếm hàng nghìn cơ hội việc làm chất lượng với mức lương hấp dẫn
              từ các doanh nghiệp hàng đầu.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm text-slate-500">Tổng số việc làm</p>
            <h3 className="mt-1 text-3xl font-black text-emerald-600">
              {totalElements}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">

          {/* Sidebar */}
          <aside className="lg:w-[300px] shrink-0">
            <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* Sidebar Header */}
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Filter className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Bộ lọc nâng cao
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tối ưu kết quả tìm kiếm
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Body */}
              <div className="space-y-6 p-6">

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
                  onClick={onApply}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200"
                >
                  <Filter className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1">

            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Danh sách tuyển dụng
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Hiển thị {jobs.length} / {totalElements} việc làm
                </p>
              </div>

              <div className="flex items-center gap-3">
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
              <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
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
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
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
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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