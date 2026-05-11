import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getJobById } from "../../service/jobService";
import { TransformJob } from './utils/TransformJob';
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Heart,
  ChevronRight,
  Building2,
  Users,
  GraduationCap,
  CalendarDays,
  Layers,
  Globe,
  Star,
  Send,
  BookOpen,
  Award,
  CheckCircle2,
} from 'lucide-react';

import ApplyJobModal from './components/ApplyJobModal';
import { isJobSaved, toggleSavedJob } from './utils/jobTracker';

/* ── Reusable info‑row for sidebar ── */
function InfoRow({ icon: Icon, label, value, iconColor = 'text-emerald-600' }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className={`w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/* ── Tag badge ── */
function Tag({ children, color = 'bg-emerald-100 text-emerald-700' }) {
  return (
    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${color} transition-transform hover:scale-105`}>
      {children}
    </span>
  );
}

function isHtmlString(value) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function normalizeHtml(value) {
  return value ? value.replace(/&nbsp;/g, ' ') : value;
}

function formatJobType(jobType) {
  const map = {
    FULL_TIME: 'Toàn thời gian',
    PART_TIME: 'Bán thời gian',
    INTERNSHIP: 'Thực tập',
    REMOTE: 'Từ xa',
    FREELANCE: 'Tự do',
  };
  return map[jobType] || jobType;
}

/* ─────────────────────────────────────────────
   Job Detail Page
   ───────────────────────────────────────────── */
export default function JobDetail() {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const [job, setJob] = useState(null);

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        console.log('Fetched job data:', data);
        setJob(TransformJob(data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!job) return;
    setIsSaved(isJobSaved(job.id || job.jobId));
  }, [job]);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy công việc</h2>
          <p className="text-gray-500 mb-6">Công việc bạn tìm kiếm không tồn tại hoặc đã bị xoá.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const gradientColor = job.color || 'from-emerald-500 to-teal-600';
  const descriptionHtml = normalizeHtml(job.description?.[0]);
  const candidateHtml = normalizeHtml(job.candidateRequirements?.[0]);
  const salaryHtml = normalizeHtml(job.salaryDetail?.[0]);
  const benefitsHtml = normalizeHtml(job.benefitsDetail?.[0]);
  const workScheduleHtml = normalizeHtml(job.workSchedule?.[0]);
  const workFormLabel = formatJobType(job.workForm);
  const descriptionIsHtml = descriptionHtml && isHtmlString(descriptionHtml);
  const candidateIsHtml = candidateHtml && isHtmlString(candidateHtml);
  const salaryIsHtml = salaryHtml && isHtmlString(salaryHtml);
  const benefitsIsHtml = benefitsHtml && isHtmlString(benefitsHtml);
  const workScheduleIsHtml = workScheduleHtml && isHtmlString(workScheduleHtml);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* ── Breadcrumb ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <Link to="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
              <ChevronRight size={14} />
              <span className="hover:text-emerald-600 transition-colors cursor-pointer">Tìm việc làm</span>
              <ChevronRight size={14} />
              <span className="text-gray-800 font-medium truncate max-w-xs">{job.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ═══════ LEFT COLUMN ═══════ */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* ── Job Header Card ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Top gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${gradientColor}`} />

                <div className="p-6 sm:p-8">
                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-snug">
                    {job.title}
                    <span className="inline-block ml-2 align-middle">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    </span>
                  </h1>

                  {/* Quick info tags */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Thu nhập</p>
                        <p className="font-bold text-emerald-600">{job.salary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Địa điểm</p>
                        <p className="font-semibold text-gray-800">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Kinh nghiệm</p>
                        <p className="font-semibold text-gray-800">{job.experience}</p>
                      </div>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                    <CalendarDays size={16} className="text-amber-500" />
                    <span>Hạn nộp hồ sơ: <b className="text-gray-800">{job.deadline}</b></span>
                    {job.daysLeft && (
                      <span className="text-amber-600 font-semibold ml-1">(Còn {job.daysLeft} ngày)</span>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setApplyOpen(true)}
                      className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-base hover:shadow-lg hover:shadow-emerald-200 transition-all duration-200 active:scale-[0.98]"
                    >
                      <Send size={18} />
                      Ứng tuyển ngay
                    </button>
                    <button
                      onClick={() => setIsSaved(toggleSavedJob(job))}
                      className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold border-2 transition-all duration-200 ${isSaved
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                    >
                      <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                      {isSaved ? 'Đã lưu' : 'Lưu tin'}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Job Details Section ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-emerald-600" />
                  Chi tiết tin tuyển dụng
                </h2>

                {/* Requirements summary tags */}
                {job.requirements && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Yêu cầu:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, i) => (
                        <Tag key={i} color="bg-blue-50 text-blue-700">{req}</Tag>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits summary */}
                {job.benefits && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Quyền lợi:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((b, i) => (
                        <Tag key={i} color="bg-purple-50 text-purple-700">{b}</Tag>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialties */}
                {job.specialties && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Chuyên môn:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.specialties.map((s, i) => (
                        <Tag key={i} color="bg-gray-100 text-gray-700">{s}</Tag>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-px bg-gray-200 my-6" />

                {/* ── Mô tả công việc ── */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Mô tả công việc</h3>
                  {descriptionIsHtml ? (
                    <div
                      className="job-html text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                    />
                  ) : (
                    <ul className="space-y-2">
                      {job.description?.map((line, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ── Yêu cầu ứng viên ── */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Yêu cầu ứng viên</h3>
                  {candidateIsHtml ? (
                    <div
                      className="job-html text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: candidateHtml }}
                    />
                  ) : (
                    <ul className="space-y-2">
                      {job.candidateRequirements?.map((line, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="mt-1 text-emerald-500">-</span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ── Thu nhập ── */}
                {job.salaryDetail && (
                  <div className="mb-8">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Thu nhập</h3>
                    {salaryIsHtml ? (
                      <div
                        className="job-html text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: salaryHtml }}
                      />
                    ) : (
                      <ul className="space-y-2">
                        {job.salaryDetail.map((line, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* ── Quyền lợi chi tiết ── */}
                {job.benefitsDetail && (
                  <div className="mb-8">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Quyền lợi</h3>
                    {benefitsIsHtml ? (
                      <div
                        className="job-html text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: benefitsHtml }}
                      />
                    ) : (
                      <ul className="space-y-2">
                        {job.benefitsDetail.map((line, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* ── Địa điểm làm việc ── */}
                {job.workAddress && (
                  <div className="mb-8">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Địa điểm làm việc</h3>
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                      <MapPin size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                      {job.workAddress}
                    </p>
                  </div>
                )}

                {/* ── Thời gian làm việc ── */}
                {job.workSchedule && (
                  <div className="mb-8">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Thời gian làm việc</h3>
                    {workScheduleIsHtml ? (
                      <div
                        className="job-html text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: workScheduleHtml }}
                      />
                    ) : (
                      <ul className="space-y-2">
                        {job.workSchedule.map((line, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* ── Cách thức ứng tuyển ── */}
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Cách thức ứng tuyển</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Ứng viên nộp hồ sơ trực tuyến bằng cách bấm{' '}
                    <b className="text-emerald-600">Ứng tuyển ngay</b> dưới đây.
                  </p>
                  <p className="text-sm text-gray-500 mb-5">
                    Hạn nộp hồ sơ: <b className="text-gray-800">{job.deadline}</b>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setApplyOpen(true)}
                      className="flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-200 transition-all duration-200 active:scale-[0.98]"
                    >
                      <Send size={16} />
                      Ứng tuyển ngay
                    </button>
                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className={`flex items-center gap-2 py-3 px-6 rounded-xl font-semibold border-2 transition-all duration-200 ${isSaved
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
                        }`}
                    >
                      <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                      {isSaved ? 'Đã lưu' : 'Lưu tin'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ═══════ RIGHT SIDEBAR ═══════ */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* ── Company Card ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                    {job.company?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{job.company}</h3>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 py-2 text-gray-600">
                    <Users size={15} className="text-gray-400 shrink-0" />
                    <span>Quy mô: <b className="text-gray-800">{job.companySize}</b></span>
                  </div>
                  <div className="flex items-center gap-2 py-2 text-gray-600">
                    <Globe size={15} className="text-gray-400 shrink-0" />
                    <span>Lĩnh vực: <b className="text-gray-800">{job.companyField}</b></span>
                  </div>
                  <div className="flex items-start gap-2 py-2 text-gray-600">
                    <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>Địa điểm: <b className="text-gray-800">{job.companyAddress}</b></span>
                  </div>
                </div>

                <a href="#" className="block mt-4 text-sm text-emerald-600 font-semibold hover:underline text-center">
                  Xem trang công ty →
                </a>
              </div>

              {/* ── General Info Card ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Thông tin chung</h3>
                <div className="space-y-1">
                  <InfoRow icon={Star} label="Cấp bậc" value={job.rank} />
                  <InfoRow icon={GraduationCap} label="Học vấn" value={job.education} />
                  <InfoRow icon={Users} label="Số lượng tuyển" value={`${job.quantity} người`} />
                  <InfoRow icon={Clock} label="Hình thức làm việc" value={workFormLabel} />
                </div>
              </div>

              {/* ── Related Categories ── */}
              {job.relatedCategories && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Danh mục Nghề liên quan</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.relatedCategories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Skills ── */}
              {job.skills && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Kỹ năng cần có</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-sm text-emerald-700 font-semibold hover:bg-emerald-100 cursor-pointer transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Apply Modal ── */}
      <ApplyJobModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        job={job}
      />
    </>
  );
}
