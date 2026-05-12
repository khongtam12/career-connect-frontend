import React, { useState, useEffect, useMemo } from 'react';
import {
    FiSearch, FiFilter, FiMapPin, FiClock,
    FiDownload, FiCheckCircle, FiCalendar, FiXCircle, FiSlash, FiRefreshCw,

} from 'react-icons/fi';
import { toast } from 'react-toastify';
import ScheduleInterviewModal from './components/ScheduleInterviewModal';
import RejectApplicationModal from './components/RejectApplicationModal';
import { cancelInterview, getCandidatesForEmployer, updateApplicationStatus } from '@/service/applicationService';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyCandidateState from '@/components/employer/EmptyCandidateState';
import { useNotificationStore } from '@/stores/useNotificationStore';
import {markNotificationAsRead} from "../../../service/notificationService"
const mapStatus = (status) => {
    switch (status) {
        case 'APPLIED': return 'Cho xu ly';
        case 'REVIEWING': return 'Dang danh gia';
        case 'INTERVIEW': return 'Dang phong van';
        case 'REJECTED': return 'Da tu choi';
        case 'ACCEPTED': return 'Da chap nhan';
        case 'CANCELLED': return 'Da huy';
        default: return 'Khong xac dinh';
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

const statusTone = (status) => {
    switch (status) {
        case 'Cho xu ly': return 'bg-amber-100 text-amber-700';
        case 'Dang phong van': return 'bg-blue-100 text-blue-700';
        case 'Da tu choi': return 'bg-red-100 text-red-700';
        case 'Da chap nhan': return 'bg-green-100 text-green-700';
        case 'Da huy': return 'bg-orange-100 text-orange-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const CVManagement = () => {

    // Modals state
    const [openInterviewModal, setOpenInterviewModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all_status');
    const [timeFilter, setTimeFilter] = useState('all_time');
    const [jobFilter, setJobFilter] = useState('all_jobs');

    const hasNewCandidate = useNotificationStore((state) => state.hasNewCandidate);
    const setHasNewCandidate = useNotificationStore((state) => state.setHasNewCandidate);
    const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
    const notifications = useNotificationStore((state) => state.notifications);

    const fetchCandidates = async () => {
        try {
            const res = await getCandidatesForEmployer({
                jobId: jobFilter === 'all_jobs' ? undefined : jobFilter,
            });
            const data = res.data;

            const mapped = (data || []).map((item) => ({
                id: item.applicationId,
                jobId: item.jobId,
                name: item.fullName,
                role: item.jobName,
                experience: item.experienceYear,
                appliedAt: item.appliedAt,
                appliedDate: item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : 'N/A',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.fullName || 'Candidate')}`,
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

            setCandidates(mapped);
            if (mapped.length > 0) {
                if (selectedCandidate) {
                    const found = mapped.find((candidate) => candidate.id === selectedCandidate.id);
                    setSelectedCandidate(found || mapped[0]);
                } else {
                    setSelectedCandidate(mapped[0]);
                }
            } else {
                setSelectedCandidate(null);
            }
        } catch (err) {
            console.error('Fetch candidates error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();

        const unreadNotifications = notifications.filter((notification) => !notification.read);
        if (unreadNotifications.length > 0) {
            markAllAsRead();
            // Đồng bộ trạng thái đã đọc lên backend
            unreadNotifications.forEach(n => {
                markNotificationAsRead(n.id).catch(() => { });
            });
        }
    }, [jobFilter]);

    useEffect(() => {
        if (hasNewCandidate) {
            fetchCandidates();
            setHasNewCandidate(false);
        }
    }, [hasNewCandidate]);

    const filteredCandidates = useMemo(() => {
        let result = [...candidates];

        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter((candidate) =>
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
            alert('Khong co CV de tai xuong');
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
            toast.success(`Da huy phong van cua ${selectedCandidate.name} va gui thong bao qua email!`);
            await fetchCandidates();
        } catch (err) {
            console.error('Cancel interview error:', err);
            toast.error(err?.response?.data?.message || 'Loi khi huy phong van');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAcceptCandidate = async () => {
        if (!selectedCandidate) return;

        const confirmed = window.confirm(`Ban co chac muon chap nhan ung vien ${selectedCandidate.name}?`);
        if (!confirmed) return;

        setActionLoading(true);
        try {
            await updateApplicationStatus(selectedCandidate.id, { status: 'ACCEPTED' });
            toast.success(`Da chap nhan ung vien ${selectedCandidate.name} va gui email thong bao!`);
            await fetchCandidates();
        } catch (err) {
            console.error('Accept candidate error:', err);
            toast.error(err?.response?.data?.message || 'Loi khi chap nhan ung vien');
        } finally {
            setActionLoading(false);
        }
    };

    const handleActionSuccess = () => {
        fetchCandidates();
    };

    if (loading) return <LoadingSpinner message="Đang tải danh sách ứng viên..." />;
    if (!candidates.length) return (
        <div className="flex-1 bg-white p-6 rounded-3xl m-4 shadow-sm border border-gray-100">
            <EmptyCandidateState />
        </div>
    );
    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <div className="bg-white p-3 border-b border-gray-100 flex gap-3 items-center flex-wrap shrink-0">
                <div className="flex-1 min-w-[200px] relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc vị trí ứng tuyển..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>

                <select
                    className="bg-[#f9fafb] border border-gray-200 text-gray-700 text-[0.875rem] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none min-w-[190px]"
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                >
                    <option value="all_jobs">Tat ca tin tuyen dung</option>
                    {jobOptions.map((job) => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                </select>

                <select
                    className="bg-[#f9fafb] border border-gray-200 text-gray-700 text-[0.875rem] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none min-w-[150px]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all_status">Tat ca trang thai</option>
                    <option value="pending">Cho xu ly</option>
                    <option value="reviewing">Dang danh gia</option>
                    <option value="interviewing">Dang phong van</option>
                    <option value="accepted">Da chap nhan</option>
                    <option value="rejected">Da tu choi</option>
                    <option value="cancelled">Da huy</option>
                </select>

                <select
                    className="bg-[#f9fafb] border border-gray-200 text-gray-700 text-[0.875rem] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none min-w-[120px]"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                >
                    <option value="all_time">Moi luc</option>
                    <option value="today">Hom nay</option>
                    <option value="this_week">Tuan nay</option>
                    <option value="this_month">Thang nay</option>
                </select>

                {(searchQuery || statusFilter !== 'all_status' || timeFilter !== 'all_time') && (
                    <button
                        onClick={() => { setSearchQuery(''); setStatusFilter('all_status'); setTimeFilter('all_time'); }}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg px-4 py-2 text-sm font-bold transition-colors"
                    >
                        <FiXCircle className="text-xs" /> Xoa loc
                    </button>
                )}
                <button
                    onClick={() => {
                        setLoading(true);
                        fetchCandidates();
                    }}
                    className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg px-4 py-2 text-sm font-bold transition-colors ml-auto"
                >
                    <FiRefreshCw className="text-xs" /> Lam moi
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0">
                <div className="w-[320px] border-r border-gray-100 bg-white overflow-y-auto flex flex-col shrink-0">
                    <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 shrink-0">
                        <h3 className="text-gray-600 font-bold text-xs uppercase tracking-wide">
                            Danh sach ung tuyen ({filteredCandidates.length}/{candidates.length})
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredCandidates.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm">
                                <FiSearch className="mx-auto mb-2 text-2xl" />
                                Khong tim thay ung vien phu hop
                            </div>
                        ) : filteredCandidates.map((candidate) => (
                            <div
                                key={candidate.id}
                                onClick={() => setSelectedCandidate(candidate)}
                                className={`p-3 cursor-pointer border-b border-gray-50 transition-all ${selectedCandidate.id === candidate.id ? 'bg-blue-50/40 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                            >
                                <div className="flex gap-2.5">
                                    <img
                                        src={candidate.avatar}
                                        alt={candidate.name}
                                        className="w-9 h-9 rounded-lg object-cover bg-gray-200 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5 gap-2">
                                            <h4 className="font-bold text-gray-800 text-[15px] truncate" title={candidate.name}>
                                                {candidate.name}
                                            </h4>
                                            <span className="text-gray-400 text-[12px] whitespace-nowrap mt-0.5">
                                                {candidate.appliedDate}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-[14px] mb-1 line-clamp-1">{candidate.role}</p>

                                        <div className="flex flex-col gap-1 mt-1.5">
                                            <div className="text-gray-500 text-[13px] flex items-center gap-1 whitespace-nowrap">
                                                <FiClock className="text-gray-400 text-[9px]" /> {candidate.experience} nam kinh nghiem
                                            </div>
                                            <div className="flex justify-between items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full inline-flex items-center justify-center font-bold text-[10px] whitespace-nowrap ${scoreTone(candidate.matchScore)}`}>
                                                    Match {formatScore(candidate.matchScore)}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full inline-flex items-center justify-center font-bold text-[9px] whitespace-nowrap ${statusTone(candidate.status)}`}>
                                                    {candidate.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 bg-gray-50 overflow-y-auto p-4 flex flex-col gap-4 min-w-0">

                    {/* Candidate Header Card */}
                    <div className="p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white shrink-0">
                        <div className="flex gap-4 items-center">
                            <img
                                src={selectedCandidate.avatar}
                                alt={selectedCandidate.name}
                                className="w-16 h-16 rounded-2xl object-cover bg-gray-200 shrink-0"
                            />
                            <div>
                                <h2 className="font-bold text-gray-900 mb-0.5 text-base">
                                    {selectedCandidate.name} <span className="text-gray-500 text-sm font-medium">({selectedCandidate.age} tuoi)</span>
                                </h2>
                                <p className="text-blue-700 font-medium text-ls mb-1.5">
                                    Ung tuyen: {selectedCandidate.role}
                                </p>
                                <div className="flex items-center gap-4 text-gray-500 text-xs flex-wrap">
                                    <span className="flex items-center gap-1"><FiMapPin className="text-[14px]" /> {selectedCandidate.location}</span>
                                    <span className="flex items-center gap-1"><FiClock className="text-[14px]" /> {selectedCandidate.experience} nam kinh nghiem</span>
                                    <span className={`px-2 py-1 rounded-full font-bold ${scoreTone(selectedCandidate.matchScore)}`}>
                                        AI Match: {formatScore(selectedCandidate.matchScore)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[200px] w-full lg:w-auto mt-2 lg:mt-0">
                            <button
                                onClick={() => handleDownloadCV(selectedCandidate)}
                                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 py-1.5 text-xs transition-colors"
                            >
                                <FiDownload /> Tai CV xuong
                            </button>
                            <div className="flex gap-4">
                                {selectedCandidate.rawStatus === 'INTERVIEW' ? (
                                    <>
                                        <button
                                            onClick={handleCancelInterview}
                                            disabled={actionLoading}
                                            className="flex items-center justify-center gap-2 flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-sm py-1.5 text-xs transition-colors disabled:opacity-50"
                                        >
                                            <FiSlash /> {actionLoading ? '...' : 'Huy PV'}
                                        </button>
                                        <button
                                            onClick={handleAcceptCandidate}
                                            disabled={actionLoading}
                                            className="flex items-center justify-center gap-2 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm py-1.5 text-xs transition-colors disabled:opacity-50"
                                        >
                                            <FiCheckCircle /> {actionLoading ? '...' : 'Chap nhan'}
                                        </button>
                                    </>
                                ) : selectedCandidate.rawStatus === 'REJECTED' || selectedCandidate.rawStatus === 'ACCEPTED' || selectedCandidate.rawStatus === 'CANCELLED' ? (
                                    <div className="flex-1 text-center py-1.5 text-xs font-bold text-gray-400 bg-gray-100 rounded-lg">
                                        {selectedCandidate.status}
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setOpenInterviewModal(true)}
                                            className="flex items-center justify-center gap-2 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm py-1.5 text-xs transition-colors"
                                        >
                                            <FiCalendar /> Len lich PV
                                        </button>
                                        <button
                                            onClick={() => setOpenRejectModal(true)}
                                            className="flex items-center justify-center gap-2 flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg border border-red-100 py-1.5 text-xs transition-colors"
                                        >
                                            <FiXCircle /> Tu choi
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Interview Info Card (nếu đang phỏng vấn) */}
                    {selectedCandidate.rawStatus === 'INTERVIEW' && selectedCandidate.interviewDate && (
                        <div className="p-4 rounded-xl shadow-sm border border-blue-100 bg-blue-50/60 shrink-0">
                            <h3 className="font-bold text-blue-800 text-sm flex items-center gap-2 mb-3">
                                <FiCalendar className="text-blue-600" /> Thong tin phong van
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                <div>
                                    <span className="text-blue-600 font-medium text-xs">Ngay:</span>
                                    <p className="text-gray-800 font-bold">{selectedCandidate.interviewDate}</p>
                                </div>
                                <div>
                                    <span className="text-blue-600 font-medium text-xs">Gio:</span>
                                    <p className="text-gray-800 font-bold">{selectedCandidate.interviewTime}</p>
                                </div>
                                <div>
                                    <span className="text-blue-600 font-medium text-xs">Dia diem:</span>
                                    <p className="text-gray-800 font-bold">{selectedCandidate.interviewLocation || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rejection Reason Card (nếu đã từ chối) */}
                    {selectedCandidate.rawStatus === 'REJECTED' && selectedCandidate.rejectionReason && (
                        <div className="p-4 rounded-xl shadow-sm border border-red-100 bg-red-50/60 shrink-0">
                            <h3 className="font-bold text-red-800 text-sm flex items-center gap-2 mb-2">
                                <FiXCircle className="text-red-600" /> Ly do tu choi
                            </h3>
                            <p className="text-gray-700 text-sm">{selectedCandidate.rejectionReason}</p>
                        </div>
                    )}

                    {/* CV PDF Viewer Area */}
                    {selectedCandidate.matchInsight && (
                        <div className="p-4 rounded-xl shadow-sm border border-emerald-100 bg-emerald-50/40 shrink-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <h3 className="font-bold text-emerald-800 text-sm">AI CV-Job Matching</h3>
                                    <p className="text-xs text-emerald-700 mt-1">
                                        He thong tu dong danh gia muc do phu hop cua CV voi JD hien tai.
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full font-bold text-sm ${scoreTone(selectedCandidate.matchScore)}`}>
                                    {formatScore(selectedCandidate.matchScore)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 text-sm">
                                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                    <p className="text-gray-500 text-xs mb-1">Ky nang</p>
                                    <p className="font-bold text-gray-900">{formatScore(selectedCandidate.matchInsight.skillScore)}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                    <p className="text-gray-500 text-xs mb-1">Kinh nghiem</p>
                                    <p className="font-bold text-gray-900">{formatScore(selectedCandidate.matchInsight.experienceScore)}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                    <p className="text-gray-500 text-xs mb-1">Hoc van</p>
                                    <p className="font-bold text-gray-900">{formatScore(selectedCandidate.matchInsight.educationScore)}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                    <p className="text-gray-500 text-xs mb-1">Keyword</p>
                                    <p className="font-bold text-gray-900">{formatScore(selectedCandidate.matchInsight.keywordScore)}</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-700 mb-4">
                                {selectedCandidate.matchInsight.recommendation || 'Chua co goi y tu dong.'}
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-emerald-800 mb-2">Ky nang khop</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedCandidate.matchInsight.matchedSkills || []).length > 0 ? (
                                            selectedCandidate.matchInsight.matchedSkills.map((skill) => (
                                                <span key={skill} className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-500">Chua phat hien ky nang khop ro rang.</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-red-700 mb-2">Ky nang con thieu</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedCandidate.matchInsight.missingSkills || []).length > 0 ? (
                                            selectedCandidate.matchInsight.missingSkills.map((skill) => (
                                                <span key={skill} className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-500">Khong co thieu hut ky nang lon theo JD.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 rounded-xl shadow-sm border border-gray-100 bg-white overflow-hidden flex flex-col min-h-[1000px]">
                        <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                Ho so dinh kem (PDF)
                            </h3>
                            <button
                                onClick={() => handleDownloadCV(selectedCandidate)}
                                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold transition-colors"
                            >
                                <FiDownload /> Tai xuong
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-gray-200 relative min-h-0">
                            {/* Embedded PDF Viewer */}
                            <object
                                data={selectedCandidate.cvUrl}
                                type="application/pdf"
                                className="absolute inset-0 w-full h-full"
                            >
                                <div className="flex items-center justify-center h-full flex-col gap-2 text-gray-500 bg-white">
                                    <FiDownload size={32} className="text-gray-400" />
                                    <p className="text-sm">Khong the hien thi PDF truc tiep. Vui long tai xuong.</p>
                                    <button
                                        onClick={() => handleDownloadCV(selectedCandidate)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                                    >
                                        <FiDownload /> Tai CV
                                    </button>
                                </div>
                            </object>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
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
