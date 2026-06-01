import React, { useEffect, useMemo, useState } from 'react';
import {
    FiSearch,
    FiFilter,
    FiMapPin,
    FiClock,
    FiDownload,
    FiCheckCircle,
    FiCalendar,
    FiXCircle,
    FiSlash,
    FiRefreshCw,
    FiMessageSquare,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ScheduleInterviewModal from './components/ScheduleInterviewModal';
import RejectApplicationModal from './components/RejectApplicationModal';
import { cancelInterview, getCandidatesForEmployer, updateApplicationStatus } from '@/service/applicationService';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyCandidateState from '@/components/employer/EmptyCandidateState';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { markNotificationAsRead } from '../../../service/notificationService';
import { getCandidateInfo } from '../../../service/userService';

const mapStatus = (status) => {
    switch (status) {
        case 'APPLIED':
            return 'Chờ xử lý';
        case 'REVIEWING':
            return 'Đang đánh giá';
        case 'INTERVIEW':
            return 'Đang phỏng vấn';
        case 'REJECTED':
            return 'Đã từ chối';
        case 'ACCEPTED':
            return 'Đã chấp nhận';
        case 'CANCELLED':
            return 'Đã hủy';
        default:
            return 'Không xác định';
    }
};

const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDelta = today.getMonth() - birthDate.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const formatScore = (score) => {
    if (score === null || score === undefined) return 'N/A';
    return `${Math.round(score)}%`;
};

const scoreTone = (score) => {
    if (score === null || score === undefined) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-emerald-100 text-emerald-700';
    if (score >= 65) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
};

const normalizeInsightItems = (items) => {
    if (!Array.isArray(items)) return [];

    return items
        .flatMap((item) => {
            if (typeof item !== 'string') return [];

            const cleaned = item
                .replace(/<[^>]+>/g, ' ')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/\[/g, ' ')
                .replace(/\]/g, ' ')
                .replace(/"/g, ' ')
                .replace(/â€¢/g, '\n')
                .replace(/\s*\/\s*li\s*>\s*/gi, '\n');

            return cleaned.split(/[,\n\r;]+/);
        })
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((item) => item !== 'ul' && item !== '/ul')
        .filter((item) => item.length <= 40)
        .filter((item) => item.split(/\s+/).length <= 4)
        .filter((item, index, array) => array.findIndex((value) => value.toLowerCase() === item.toLowerCase()) === index);
};

const statusTone = (status) => {
    switch (status) {
        case 'Chờ xử lý':
            return 'bg-amber-100 text-amber-700';
        case 'Đang phỏng vấn':
            return 'bg-blue-100 text-blue-700';
        case 'Đã từ chối':
            return 'bg-red-100 text-red-700';
        case 'Đã chấp nhận':
            return 'bg-green-100 text-green-700';
        case 'Đã hủy':
            return 'bg-orange-100 text-orange-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const CVManagement = () => {
    const [openInterviewModal, setOpenInterviewModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all_status');
    const [timeFilter, setTimeFilter] = useState('all_time');
    const [jobFilter, setJobFilter] = useState('all_jobs');

    const hasNewCandidate = useNotificationStore((state) => state.hasNewCandidate);
    const setHasNewCandidate = useNotificationStore((state) => state.setHasNewCandidate);
    const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
    const notifications = useNotificationStore((state) => state.notifications);
    const navigate = useNavigate();

    const fetchCandidates = async ({ includeAi = false, forceAiRefresh = false } = {}) => {
        try {
            const res = await getCandidatesForEmployer({
                jobId: jobFilter === 'all_jobs' ? undefined : jobFilter,
                includeAi,
                forceAiRefresh,
            });
            const data = res.data;

            const mapped = (data || []).map((item) => ({
                id: item.applicationId,
                jobId: item.jobId,
                candidateId: item.candidateId,
                name: item.fullName,
                role: item.jobName,
                experience: item.experienceYear,
                appliedAt: item.appliedAt,
                appliedDate: item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : 'N/A',
                avatar: null,
                rawStatus: item.status,
                status: mapStatus(item.status),
                location: 'N/A',
                cvUrl: item.url,
                age: calculateAge(item.dob || item.dateOfBirth),
                interviewDate: item.interviewDate,
                interviewTime: item.interviewTime,
                interviewLocation: item.interviewLocation,
                rejectionReason: item.rejectionReason,
                matchScore: item.matchInsight?.matchScore ?? null,
                matchInsight: item.matchInsight ?? null,
            }));

            const mappedWithAvatar = await Promise.all(
                mapped.map(async (candidate) => {
                    if (candidate.candidateId) {
                        try {
                            const info = await getCandidateInfo(candidate.candidateId);
                            return {
                                ...candidate,
                                avatar:
                                    info?.avatar
                                    || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || 'U')}&background=6366f1&color=fff`,
                            };
                        } catch {
                            return {
                                ...candidate,
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || 'U')}&background=6366f1&color=fff`,
                            };
                        }
                    }
                    return {
                        ...candidate,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || 'U')}&background=6366f1&color=fff`,
                    };
                })
            );

            setCandidates(mappedWithAvatar);
            if (mappedWithAvatar.length > 0) {
                if (selectedCandidate) {
                    const found = mappedWithAvatar.find((candidate) => candidate.id === selectedCandidate.id);
                    setSelectedCandidate(found || mappedWithAvatar[0]);
                } else {
                    setSelectedCandidate(mappedWithAvatar[0]);
                }
            } else {
                setSelectedCandidate(null);
            }
        } catch (err) {
            console.error('Fetch candidates error:', err);
        } finally {
            setLoading(false);
            setAiLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates({ includeAi: false });

        const unreadNotifications = notifications.filter((notification) => !notification.read);
        if (unreadNotifications.length > 0) {
            markAllAsRead();
            unreadNotifications.forEach((notification) => {
                markNotificationAsRead(notification.id).catch(() => {});
            });
        }
    }, [jobFilter]);

    useEffect(() => {
        if (hasNewCandidate) {
            fetchCandidates({ includeAi: false });
            setHasNewCandidate(false);
        }
    }, [hasNewCandidate]);

    const handleRunAiMatching = async () => {
        setAiLoading(true);
        await fetchCandidates({ includeAi: true });
    };

    const handleRefreshAiMatching = async () => {
        setAiLoading(true);
        await fetchCandidates({ includeAi: true, forceAiRefresh: true });
    };

    const filteredCandidates = useMemo(() => {
        let result = [...candidates];

        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter(
                (candidate) =>
                    (candidate.name && candidate.name.toLowerCase().includes(query))
                    || (candidate.role && candidate.role.toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'all_status') {
            const statusMap = {
                pending: 'APPLIED',
                reviewing: 'REVIEWING',
                interviewing: 'INTERVIEW',
                rejected: 'REJECTED',
                accepted: 'ACCEPTED',
                cancelled: 'CANCELLED',
            };
            const rawStatus = statusMap[statusFilter];
            if (rawStatus) {
                result = result.filter((candidate) => candidate.rawStatus === rawStatus);
            }
        }

        if (timeFilter !== 'all_time') {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            result = result.filter((candidate) => {
                if (!candidate.appliedAt) return false;
                const applied = new Date(candidate.appliedAt);

                switch (timeFilter) {
                    case 'today':
                        return applied >= startOfDay;
                    case 'this_week': {
                        const day = now.getDay() || 7;
                        const startOfWeek = new Date(startOfDay);
                        startOfWeek.setDate(startOfWeek.getDate() - day + 1);
                        return applied >= startOfWeek;
                    }
                    case 'this_month': {
                        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                        return applied >= startOfMonth;
                    }
                    default:
                        return true;
                }
            });
        }

        return result;
    }, [candidates, searchQuery, statusFilter, timeFilter]);

    const matchedSkills = useMemo(
        () => normalizeInsightItems(selectedCandidate?.matchInsight?.matchedSkills),
        [selectedCandidate]
    );

    const missingSkills = useMemo(
        () => normalizeInsightItems(selectedCandidate?.matchInsight?.missingSkills),
        [selectedCandidate]
    );

    const insightStrengths = useMemo(
        () => normalizeInsightItems(selectedCandidate?.matchInsight?.strengths),
        [selectedCandidate]
    );

    const insightConcerns = useMemo(
        () => normalizeInsightItems(selectedCandidate?.matchInsight?.concerns),
        [selectedCandidate]
    );

    const interviewFocus = useMemo(
        () => normalizeInsightItems(selectedCandidate?.matchInsight?.interviewFocus),
        [selectedCandidate]
    );

    const jobOptions = useMemo(() => {
        const uniqueJobs = new Map();
        candidates.forEach((candidate) => {
            if (candidate.jobId && candidate.role && !uniqueJobs.has(candidate.jobId)) {
                uniqueJobs.set(candidate.jobId, candidate.role);
            }
        });
        return Array.from(uniqueJobs.entries()).map(([id, title]) => ({ id, title }));
    }, [candidates]);

    const handleDownloadCV = (candidate) => {
        if (!candidate.cvUrl) {
            alert('Không có CV để tải xuống');
            return;
        }

        const link = document.createElement('a');
        link.href = candidate.cvUrl;
        link.target = '_blank';
        link.download = `CV_${candidate.name?.replace(/\s+/g, '_') || 'unknown'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCancelInterview = async () => {
        if (!selectedCandidate) return;

        const confirmed = window.confirm(`Bạn có chắc muốn hủy phỏng vấn của ${selectedCandidate.name}?`);
        if (!confirmed) return;

        setActionLoading(true);
        try {
            await cancelInterview(selectedCandidate.id);
            toast.success(`Đã hủy phỏng vấn của ${selectedCandidate.name} và gửi thông báo qua email!`);
            await fetchCandidates({ includeAi: false });
        } catch (err) {
            console.error('Cancel interview error:', err);
            toast.error(err?.response?.data?.message || 'Lỗi khi hủy phỏng vấn');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAcceptCandidate = async () => {
        if (!selectedCandidate) return;

        const confirmed = window.confirm(`Bạn có chắc muốn chấp nhận ứng viên ${selectedCandidate.name}?`);
        if (!confirmed) return;

        setActionLoading(true);
        try {
            await updateApplicationStatus(selectedCandidate.id, { status: 'ACCEPTED' });
            toast.success(`Đã chấp nhận ứng viên ${selectedCandidate.name} và gửi email thông báo!`);
            await fetchCandidates({ includeAi: false });
        } catch (err) {
            console.error('Accept candidate error:', err);
            toast.error(err?.response?.data?.message || 'Lỗi khi chấp nhận ứng viên');
        } finally {
            setActionLoading(false);
        }
    };

    const handleActionSuccess = () => {
        fetchCandidates({ includeAi: false });
    };

    if (loading) return <LoadingSpinner message="Đang tải danh sách ứng viên..." />;

    if (!candidates.length) {
        return (
            <div className="m-4 flex-1 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <EmptyCandidateState />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-gray-50/50">
            <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-gray-100 bg-white p-3">
                <div className="relative min-w-[200px] flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc vị trí ứng tuyển..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    className="block min-w-[190px] rounded-lg border border-gray-200 bg-[#f9fafb] p-2 text-[0.875rem] text-gray-700 outline-none focus:border-blue-500 focus:ring-blue-500"
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                >
                    <option value="all_jobs">Tất cả tin tuyển dụng</option>
                    {jobOptions.map((job) => (
                        <option key={job.id} value={job.id}>
                            {job.title}
                        </option>
                    ))}
                </select>

                <select
                    className="block min-w-[150px] rounded-lg border border-gray-200 bg-[#f9fafb] p-2 text-[0.875rem] text-gray-700 outline-none focus:border-blue-500 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all_status">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="reviewing">Đang đánh giá</option>
                    <option value="interviewing">Đang phỏng vấn</option>
                    <option value="accepted">Đã chấp nhận</option>
                    <option value="rejected">Đã từ chối</option>
                    <option value="cancelled">Đã hủy</option>
                </select>

                <select
                    className="block min-w-[120px] rounded-lg border border-gray-200 bg-[#f9fafb] p-2 text-[0.875rem] text-gray-700 outline-none focus:border-blue-500 focus:ring-blue-500"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                >
                    <option value="all_time">Mọi lúc</option>
                    <option value="today">Hôm nay</option>
                    <option value="this_week">Tuần này</option>
                    <option value="this_month">Tháng này</option>
                </select>

                {(searchQuery || statusFilter !== 'all_status' || timeFilter !== 'all_time') && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all_status');
                            setTimeFilter('all_time');
                        }}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        <FiXCircle className="text-xs" /> Xóa lọc
                    </button>
                )}

                <button
                    onClick={() => {
                        setLoading(true);
                        fetchCandidates({ includeAi: false });
                    }}
                    className="ml-auto flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-100"
                >
                    <FiRefreshCw className="text-xs" /> Làm mới
                </button>

                <button
                    onClick={handleRunAiMatching}
                    disabled={aiLoading}
                    className="flex items-center gap-2 rounded-lg bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 transition-colors hover:bg-violet-100 disabled:opacity-60"
                >
                    <FiFilter className="text-xs" /> {aiLoading ? 'Đang phân tích AI...' : 'Phân tích AI'}
                </button>

                <button
                    onClick={handleRefreshAiMatching}
                    disabled={aiLoading}
                    className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-60"
                >
                    <FiRefreshCw className="text-xs" /> {aiLoading ? 'Đang phân tích lại...' : 'Phân tích lại'}
                </button>
            </div>

            <div className="flex min-h-0 flex-1 overflow-hidden">
                <div className="flex w-[320px] shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-white">
                    <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-gray-50 bg-gray-50/50 p-3">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-600">
                            Danh sách ứng tuyển ({filteredCandidates.length}/{candidates.length})
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredCandidates.length === 0 ? (
                            <div className="p-6 text-center text-sm text-gray-400">
                                <FiSearch className="mx-auto mb-2 text-2xl" />
                                Không tìm thấy ứng viên phù hợp
                            </div>
                        ) : (
                            filteredCandidates.map((candidate) => (
                                <div
                                    key={candidate.id}
                                    onClick={() => setSelectedCandidate(candidate)}
                                    className={`cursor-pointer border-b border-gray-50 p-3 transition-all ${
                                        selectedCandidate?.id === candidate.id
                                            ? 'border-l-4 border-l-blue-600 bg-blue-50/40'
                                            : 'border-l-4 border-transparent hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex gap-2.5">
                                        <img
                                            src={candidate.avatar}
                                            alt={candidate.name}
                                            className="h-9 w-9 shrink-0 rounded-lg bg-gray-200 object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-0.5 flex items-start justify-between gap-2">
                                                <h4 className="truncate text-[15px] font-bold text-gray-800" title={candidate.name}>
                                                    {candidate.name}
                                                </h4>
                                                <span className="mt-0.5 whitespace-nowrap text-[12px] text-gray-400">
                                                    {candidate.appliedDate}
                                                </span>
                                            </div>

                                            <p className="mb-1 line-clamp-1 text-[14px] text-gray-600">{candidate.role}</p>

                                            <div className="mt-1.5 flex flex-col gap-1">
                                                <div className="flex w-full items-center justify-between text-[13px] text-gray-500">
                                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                                        <FiClock className="text-[9px] text-gray-400" />
                                                        {candidate.experience} năm kinh nghiệm
                                                    </div>

                                                    <button onClick={() => navigate(`/employer/chat?candidateId=${candidate.candidateId}`)}>
                                                        <FiMessageSquare size={15} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between gap-2">
                                                    <span
                                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${scoreTone(candidate.matchScore)}`}
                                                    >
                                                        Match {formatScore(candidate.matchScore)}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold ${statusTone(candidate.status)}`}
                                                    >
                                                        {candidate.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto bg-gray-50 p-4">
                    <div className="flex shrink-0 flex-col items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
                        <div className="flex items-center gap-4">
                            <img
                                src={selectedCandidate.avatar}
                                alt={selectedCandidate.name}
                                className="h-16 w-16 shrink-0 rounded-2xl bg-gray-200 object-cover"
                            />
                            <div>
                                <h2 className="mb-0.5 text-base font-bold text-gray-900">
                                    {selectedCandidate.name}{' '}
                                    <span className="text-sm font-medium text-gray-500">({selectedCandidate.age} tuổi)</span>
                                </h2>
                                <p className="mb-1.5 font-medium text-blue-700">Ứng tuyển: {selectedCandidate.role}</p>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <FiMapPin className="text-[14px]" /> {selectedCandidate.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiClock className="text-[14px]" /> {selectedCandidate.experience} năm kinh nghiệm
                                    </span>
                                    <span className={`rounded-full px-2 py-1 font-bold ${scoreTone(selectedCandidate.matchScore)}`}>
                                        AI Match: {formatScore(selectedCandidate.matchScore)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 flex w-full min-w-[200px] flex-col gap-2 lg:mt-0 lg:w-auto">
                            <button
                                onClick={() => handleDownloadCV(selectedCandidate)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-1.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                <FiDownload /> Tải CV xuống
                            </button>
                            <div className="flex gap-4">
                                {selectedCandidate.rawStatus === 'INTERVIEW' ? (
                                    <>
                                        <button
                                            onClick={handleCancelInterview}
                                            disabled={actionLoading}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-orange-600 disabled:opacity-50"
                                        >
                                            <FiSlash /> {actionLoading ? '...' : 'Hủy PV'}
                                        </button>
                                        <button
                                            onClick={handleAcceptCandidate}
                                            disabled={actionLoading}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            <FiCheckCircle /> {actionLoading ? '...' : 'Chấp nhận'}
                                        </button>
                                    </>
                                ) : selectedCandidate.rawStatus === 'REJECTED'
                                    || selectedCandidate.rawStatus === 'ACCEPTED'
                                    || selectedCandidate.rawStatus === 'CANCELLED' ? (
                                        <div className="flex-1 rounded-lg bg-gray-100 py-1.5 text-center text-xs font-bold text-gray-400">
                                            {selectedCandidate.status}
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setOpenInterviewModal(true)}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                                            >
                                                <FiCalendar /> Lên lịch PV
                                            </button>
                                            <button
                                                onClick={() => setOpenRejectModal(true)}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
                                            >
                                                <FiXCircle /> Từ chối
                                            </button>
                                        </>
                                    )}
                            </div>
                        </div>
                    </div>

                    {selectedCandidate.rawStatus === 'INTERVIEW' && selectedCandidate.interviewDate && (
                        <div className="shrink-0 rounded-xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm">
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-800">
                                <FiCalendar className="text-blue-600" /> Thông tin phỏng vấn
                            </h3>
                            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                                <div>
                                    <span className="text-xs font-medium text-blue-600">Ngày:</span>
                                    <p className="font-bold text-gray-800">{selectedCandidate.interviewDate}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-blue-600">Giờ:</span>
                                    <p className="font-bold text-gray-800">{selectedCandidate.interviewTime}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-blue-600">Địa điểm:</span>
                                    <p className="font-bold text-gray-800">{selectedCandidate.interviewLocation || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedCandidate.rawStatus === 'REJECTED' && selectedCandidate.rejectionReason && (
                        <div className="shrink-0 rounded-xl border border-red-100 bg-red-50/60 p-4 shadow-sm">
                            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
                                <FiXCircle className="text-red-600" /> Lý do từ chối
                            </h3>
                            <p className="text-sm text-gray-700">{selectedCandidate.rejectionReason}</p>
                        </div>
                    )}

                    {selectedCandidate.matchInsight && (
                        <div className="shrink-0 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-sm">
                            <div className="mb-3 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-800">AI CV-Job Matching</h3>
                                    <p className="mt-1 text-xs text-emerald-700">
                                        Hệ thống tự động đánh giá mức độ phù hợp của CV với JD hiện tại.
                                    </p>
                                </div>
                                <div className={`rounded-full px-3 py-1 text-sm font-bold ${scoreTone(selectedCandidate.matchScore)}`}>
                                    {formatScore(selectedCandidate.matchScore)}
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
                                <div className="rounded-lg border border-emerald-100 bg-white p-3">
                                    <p className="mb-1 text-xs text-gray-500">Kỹ năng</p>
                                    <p className="font-bold text-gray-900">{formatScore(selectedCandidate.matchInsight.skillScore)}</p>
                                </div>
                                <div className="rounded-lg border border-emerald-100 bg-white p-3">
                                    <p className="mb-1 text-xs text-gray-500">Kinh nghiệm</p>
                                    <p className="font-bold text-gray-900">{formatScore(selectedCandidate.matchInsight.experienceScore)}</p>
                                </div>
                                <div className="rounded-lg border border-emerald-100 bg-white p-3">
                                    <p className="mb-1 text-xs text-gray-500">Học vấn</p>
                                    <p className="font-bold text-gray-900">{formatScore(selectedCandidate.matchInsight.educationScore)}</p>
                                </div>
                                <div className="rounded-lg border border-emerald-100 bg-white p-3">
                                    <p className="mb-1 text-xs text-gray-500">Keyword</p>
                                    <p className="font-bold text-gray-900">{formatScore(selectedCandidate.matchInsight.keywordScore)}</p>
                                </div>
                            </div>

                            <p className="mb-4 text-sm text-gray-700">
                                {selectedCandidate.matchInsight.recommendation || 'Chưa có gợi ý tự động.'}
                            </p>

                            {selectedCandidate.matchInsight.summary && (
                                <div className="mb-4 rounded-lg border border-emerald-100 bg-white/80 p-3">
                                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-800">Tóm tắt phân tích</p>
                                    <p className="text-sm text-gray-700">{selectedCandidate.matchInsight.summary}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div>
                                    <p className="mb-2 text-xs font-bold text-emerald-800">Kỹ năng khớp</p>
                                    <div className="flex flex-wrap gap-2">
                                        {matchedSkills.length > 0 ? (
                                            matchedSkills.map((skill) => (
                                                <span key={skill} className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-500">Chưa phát hiện kỹ năng khớp rõ ràng.</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-bold text-red-700">Kỹ năng còn thiếu</p>
                                    <div className="flex flex-wrap gap-2">
                                        {missingSkills.length > 0 ? (
                                            missingSkills.map((skill) => (
                                                <span key={skill} className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-500">Không có thiếu hụt kỹ năng lớn theo JD.</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {(insightStrengths.length > 0 || insightConcerns.length > 0 || interviewFocus.length > 0) && (
                                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                                    <div className="rounded-lg border border-emerald-100 bg-white p-3">
                                        <p className="mb-2 text-xs font-bold text-emerald-800">Điểm mạnh nổi bật</p>
                                        <div className="space-y-2">
                                            {insightStrengths.length > 0 ? (
                                                insightStrengths.map((item) => (
                                                    <p key={item} className="text-xs text-gray-700">- {item}</p>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-500">Chưa có đánh giá bổ sung.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-amber-100 bg-white p-3">
                                        <p className="mb-2 text-xs font-bold text-amber-800">Điểm cần xác minh</p>
                                        <div className="space-y-2">
                                            {insightConcerns.length > 0 ? (
                                                insightConcerns.map((item) => (
                                                    <p key={item} className="text-xs text-gray-700">- {item}</p>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-500">Không có cảnh báo lớn.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-sky-100 bg-white p-3">
                                        <p className="mb-2 text-xs font-bold text-sky-800">Gợi ý phỏng vấn</p>
                                        <div className="space-y-2">
                                            {interviewFocus.length > 0 ? (
                                                interviewFocus.map((item) => (
                                                    <p key={item} className="text-xs text-gray-700">- {item}</p>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-500">Chưa có gợi ý cụ thể.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!selectedCandidate.matchInsight && (
                        <div className="shrink-0 rounded-xl border border-violet-100 bg-violet-50/40 p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-violet-800">AI CV-Job Matching</h3>
                                    <p className="mt-1 text-xs text-violet-700">
                                        AI không tự động chạy khi mở trang để tránh tốn token và làm chậm hệ thống.
                                    </p>
                                </div>
                                <button
                                    onClick={handleRunAiMatching}
                                    disabled={aiLoading}
                                    className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-violet-700 disabled:opacity-60"
                                >
                                    <FiFilter /> {aiLoading ? 'Đang chạy...' : 'Chạy AI'}
                                </button>
                                <button
                                    onClick={handleRefreshAiMatching}
                                    disabled={aiLoading}
                                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
                                >
                                    <FiRefreshCw /> {aiLoading ? 'Đang làm mới...' : 'Phân tích lại'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex min-h-[1000px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/50 p-3">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700">Hồ sơ đính kèm (PDF)</h3>
                            <button
                                onClick={() => handleDownloadCV(selectedCandidate)}
                                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                <FiDownload /> Tải xuống
                            </button>
                        </div>
                        <div className="relative min-h-0 flex-1 w-full bg-gray-200">
                            <object
                                data={selectedCandidate.cvUrl}
                                type="application/pdf"
                                className="absolute inset-0 h-full w-full"
                            >
                                <div className="flex h-full flex-col items-center justify-center gap-2 bg-white text-gray-500">
                                    <FiDownload size={32} className="text-gray-400" />
                                    <p className="text-sm">Không thể hiển thị PDF trực tiếp. Vui lòng tải xuống.</p>
                                    <button
                                        onClick={() => handleDownloadCV(selectedCandidate)}
                                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        <FiDownload /> Tải CV
                                    </button>
                                </div>
                            </object>
                        </div>
                    </div>
                </div>
            </div>

            <ScheduleInterviewModal
                open={openInterviewModal}
                onClose={() => setOpenInterviewModal(false)}
                candidateName={selectedCandidate.name}
                applicationId={selectedCandidate.id}
                onSuccess={handleActionSuccess}
            />

            <RejectApplicationModal
                open={openRejectModal}
                onClose={() => setOpenRejectModal(false)}
                candidateName={selectedCandidate.name}
                applicationId={selectedCandidate.id}
                onSuccess={handleActionSuccess}
            />
        </div>
    );
};

export default CVManagement;
