import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Heart, Send } from 'lucide-react';

const TAB_LABELS = {
  saved: 'Việc làm đã lưu',
  applied: 'Việc làm đã ứng tuyển',
};

export default function JobManagementPanel({
  activeTab = 'saved',
  savedJobs = [],
  appliedJobs = [],
  onTabChange,
  onClose,
}) {
  const items = activeTab === 'saved' ? savedJobs : appliedJobs;
  const heading = TAB_LABELS[activeTab] || TAB_LABELS.saved;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-600">
            <ClipboardList size={18} />
            <span className="text-sm font-semibold">Quản lý tìm việc</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">{heading}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-gray-500 hover:text-emerald-600"
        >
          Ẩn danh sách
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <TabButton
          active={activeTab === 'saved'}
          onClick={() => onTabChange?.('saved')}
          icon={Heart}
        >
          Việc làm đã lưu ({savedJobs.length})
        </TabButton>
        <TabButton
          active={activeTab === 'applied'}
          onClick={() => onTabChange?.('applied')}
          icon={Send}
        >
          Việc làm đã ứng tuyển ({appliedJobs.length})
        </TabButton>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
          {activeTab === 'saved'
            ? 'Bạn chưa lưu việc làm nào.'
            : 'Bạn chưa ứng tuyển công việc nào.'}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <JobManagementItem key={item.id} item={item} mode={activeTab} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
        active
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-200 hover:text-emerald-600'
      }`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function JobManagementItem({ item, mode }) {
  const salaryLabel =
    item.salaryLabel || formatSalary(item.salaryMin, item.salaryMax) || 'Thỏa thuận';
  const dateText =
    mode === 'saved'
      ? formatDate(item.savedAt)
      : formatDate(item.appliedAt);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 hover:border-emerald-200 hover:shadow-md transition-all">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {item.companyLogoUrl ? (
          <img
            src={item.companyLogoUrl}
            alt={item.companyName || 'Logo'}
            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            {(item.companyName || 'C')[0]}
          </div>
        )}

        <div className="min-w-0">
          <Link
            to={`/job/${item.id}`}
            className="text-sm sm:text-base font-semibold text-gray-900 hover:text-emerald-600 line-clamp-2"
          >
            {item.title}
          </Link>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {item.companyName || 'Doanh nghiệp'}
          </p>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
            <span className="px-2 py-1 rounded-full bg-gray-100">
              Địa điểm: {item.location || 'Toàn quốc'}
            </span>
            {item.jobType && (
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                {formatJobType(item.jobType)}
              </span>
            )}
            {mode === 'applied' && (
              <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                {formatStatus(item.status)}
              </span>
            )}
          </div>
          {dateText && (
            <p className="text-xs text-gray-400 mt-2">
              {mode === 'saved' ? 'Đã lưu:' : 'Ứng tuyển:'} {dateText}
            </p>
          )}
        </div>
      </div>

      <div className="sm:text-right sm:w-44">
        <p className="text-emerald-600 font-bold text-sm sm:text-base">
          {salaryLabel}
        </p>
        <Link
          to={`/job/${item.id}`}
          className="inline-flex items-center justify-center mt-3 px-4 py-2 rounded-full border border-emerald-200 text-emerald-600 text-xs sm:text-sm font-semibold hover:border-emerald-400 hover:bg-emerald-50"
        >
          Chi tiết →
        </Link>
      </div>
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

const formatStatus = (status) => {
  const map = {
    APPLIED: 'Đã nộp',
    REVIEWING: 'Đang xem',
    ACCEPTED: 'Đã duyệt',
    REJECTED: 'Từ chối',
  };
  return map[status] || status || 'Đã nộp';
};

const formatSalary = (min, max) => {
  if (!min && !max) return '';
  if (min && max) return `${formatSalaryValue(min)} - ${formatSalaryValue(max)}`;
  if (min) return `Từ ${formatSalaryValue(min)}`;
  return `Đến ${formatSalaryValue(max)}`;
};

const formatSalaryValue = (value) => {
  if (typeof value !== 'number') return '';
  if (value >= 1000000) {
    const millions = Math.round((value / 1000000) * 10) / 10;
    return `${millions} triệu`;
  }
  return `${value}`;
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
