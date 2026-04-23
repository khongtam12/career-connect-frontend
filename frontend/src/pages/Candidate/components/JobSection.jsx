import React from 'react';
import JobCard from './JobCard';
import JobDetailPanel from './JobDetailPanel';
import JobListItem from './JobListItem';

export default function JobSection({
  jobs,
  totalElements,
  filters,
  filterOptions,
  onChange,
  onApply,
  page,
  totalPages,
  onPageChange,
  loading,
  selectedJob,
  onSelectJob,
  showDetailPanel = false,
}) {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Lọc nâng cao</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Loại hình</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => onChange({ jobType: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="">Tất cả</option>
                    {filterOptions.jobTypes.map((item) => (
                      <option key={item} value={item}>
                        {formatJobType(item)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Kinh nghiệm</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      value={filters.experienceMin}
                      onChange={(e) => onChange({ experienceMin: e.target.value })}
                      placeholder="Từ năm"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      min="0"
                      value={filters.experienceMax}
                      onChange={(e) => onChange({ experienceMax: e.target.value })}
                      placeholder="Đến năm"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Mức lương (triệu)</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      value={filters.salaryMin}
                      onChange={(e) => onChange({ salaryMin: e.target.value })}
                      placeholder="Từ"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      min="0"
                      value={filters.salaryMax}
                      onChange={(e) => onChange({ salaryMax: e.target.value })}
                      placeholder="Đến"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Ngành nghề</label>
                  <select
                    value={filters.industryId}
                    onChange={(e) => onChange({ industryId: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="">Tất cả</option>
                    {filterOptions.industries.map((item) => (
                      <option key={item.industryId} value={item.industryId}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={onApply}
                  className="w-full rounded-lg bg-emerald-600 py-2.5 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
                >
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </aside>

          <div className={showDetailPanel ? "lg:w-2/3" : "lg:w-3/4"}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tuyển dụng</h2>
                <p className="text-sm text-gray-500 mt-1">Tìm thấy {totalElements} việc làm phù hợp</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Sắp xếp</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => onChange({ sortBy: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="createdAt">Mới nhất</option>
                  <option value="salaryMax">Lương cao nhất</option>
                  <option value="salaryMin">Lương thấp nhất</option>
                  <option value="deadline">Sắp hết hạn</option>
                </select>
              </div>
            </div>

            {jobs.length === 0 && loading ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
                Đang tải việc làm...
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
                Không tìm thấy việc làm phù hợp
              </div>
            ) : (
              showDetailPanel ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobListItem
                      key={job.jobId || job.id}
                      job={job}
                      isActive={(selectedJob?.jobId || selectedJob?.id) === (job.jobId || job.id)}
                      onSelect={onSelectJob}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.jobId || job.id} job={job} />
                  ))}
                </div>
              )
            )}

            {loading && jobs.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">Đang cập nhật kết quả...</div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 0}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40"
                >
                  Trước
                </button>
                <span className="text-sm text-gray-600">Trang {page + 1} / {totalPages}</span>
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            )}
          </div>

          {showDetailPanel && (
            <div className="lg:w-1/3">
              <JobDetailPanel job={selectedJob} />
            </div>
          )}
        </div>
      </div>
    </section>
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
