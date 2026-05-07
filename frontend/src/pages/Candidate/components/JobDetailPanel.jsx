import React from 'react';
import { isHotJob } from '../utils/jobBadges';

export default function JobDetailPanel({ job }) {
  if (!job) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-500">
        Chọn một công việc để xem chi tiết
      </div>
    );
  }

  const salaryLabel = formatSalary(job.salaryMin, job.salaryMax);
  const jobTypeLabel = formatJobType(job.jobType);
  const requirements = splitToList(job.candidateRequirements || job.requirement || job.requirementTags);
  const benefits = splitToList(job.benefitsDetail || job.benefit || job.benefitTags);
  const description = splitToList(job.description);
  const showHotBadge = isHotJob(job);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {job.companyLogoUrl ? (
            <img
              src={job.companyLogoUrl}
              alt={job.companyName || 'Logo'}
              className="w-12 h-12 rounded-lg border border-gray-200 object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              {(job.companyName || job.companyId || 'C')[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              {showHotBadge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
                  🔥 HOT
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{job.companyName || job.companyId}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600" type="button">✕</button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{salaryLabel}</span>
        <span className="px-2 py-1 rounded-full bg-gray-100">{job.location || 'Toàn quốc'}</span>
        {typeof job.experienceRequired === 'number' && (
          <span className="px-2 py-1 rounded-full bg-gray-100">{job.experienceRequired} năm</span>
        )}
        {jobTypeLabel && (
          <span className="px-2 py-1 rounded-full bg-gray-100">{jobTypeLabel}</span>
        )}
        {job.jobLevel && (
          <span className="px-2 py-1 rounded-full bg-gray-100">{job.jobLevel}</span>
        )}
        {job.workType && (
          <span className="px-2 py-1 rounded-full bg-gray-100">{job.workType}</span>
        )}
        {job.employmentType && (
          <span className="px-2 py-1 rounded-full bg-gray-100">{job.employmentType}</span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-white font-semibold hover:bg-emerald-700">
          Ứng tuyển ngay
        </button>
        <button className="w-11 h-11 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50">❤</button>
      </div>

      <div className="mt-6 space-y-6">
        <Section title="Thông tin công ty" items={buildCompanyInfo(job)} />
        <Section title="Kỹ năng" items={splitComma(job.skills)} />
        <Section title="Tags" items={splitComma(job.tags)} />
        <Section title="Mô tả công việc" items={description} />
        <Section title="Yêu cầu ứng viên" items={requirements} />
        <Section title="Quyền lợi" items={benefits} />
        <Section title="Liên hệ" items={buildContactInfo(job)} />
      </div>
    </div>
  );
}

function Section({ title, items }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="text-base font-bold text-gray-900 mb-3">{title}</h4>
      <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
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

const splitToList = (text) => {
  if (!text) return [];
  if (Array.isArray(text)) {
    return text
      .map((item) => (typeof item === 'string' ? item.trim() : String(item)))
      .filter(Boolean);
  }
  if (typeof text !== 'string') return [];
  return text
    .split(/\n|\r|\r\n|\u2022|-|\*|\u2023/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const splitComma = (text) => {
  if (!text) return [];
  if (Array.isArray(text)) {
    return text
      .map((item) => (typeof item === 'string' ? item.trim() : String(item)))
      .filter(Boolean);
  }
  if (typeof text !== 'string') return [];
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildCompanyInfo = (job) => {
  const items = [];
  if (job.companySize) items.push(`Quy mô: ${job.companySize}`);
  if (job.companyAddress) items.push(`Địa chỉ: ${job.companyAddress}`);
  if (job.provinceCode || job.district) {
    items.push(`Khu vực: ${[job.district, job.provinceCode].filter(Boolean).join(', ')}`);
  }
  return items;
};

const buildContactInfo = (job) => {
  const items = [];
  if (job.contactEmail) items.push(`Email: ${job.contactEmail}`);
  if (job.contactPhone) items.push(`Điện thoại: ${job.contactPhone}`);
  return items;
};
