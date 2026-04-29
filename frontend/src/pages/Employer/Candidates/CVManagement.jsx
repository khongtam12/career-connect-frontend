import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiSearch, FiFilter, FiMapPin, FiClock, 
  FiDownload, FiCheckCircle, FiCalendar, FiXCircle, FiSlash 
} from 'react-icons/fi';
import ScheduleInterviewModal from './components/ScheduleInterviewModal';
import RejectApplicationModal from './components/RejectApplicationModal';
import { getCandidatesForEmployer, cancelInterview, updateApplicationStatus } from '@/service/applicationService';
import { toast } from 'react-toastify';
import LoadingSpinner from './components/LoadingSpinner';

const mapStatus = (status) => {
    switch (status) {
        case "APPLIED": return "Chờ xử lý";
        case "REVIEWING": return "đang đánh giá";
        case "INTERVIEW": return "Đang phỏng vấn";
        case "REJECTED": return "Đã từ chối";
        case "ACCEPTED": return "Đã chấp nhận";
        case "CANCELLED": return "Đã hủy";
        default: return "Không xác định";
    }
};

const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const CVManagement = () => {
    
    // Modals state
    const [openInterviewModal, setOpenInterviewModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all_status');
    const [timeFilter, setTimeFilter] = useState('all_time');

    const fetchCandidates = async () => {
        try {
            const res = await getCandidatesForEmployer();
            const data = res.data;

            const mapped = (data || []).map((item) => ({
                id: item.applicationId,
                name: item.fullName,
                role: item.jobName,
                experience: item.experienceYear,
                appliedAt: item.appliedAt,
                appliedDate: new Date(item.appliedAt).toLocaleDateString(),
                avatar: `https://ui-avatars.com/api/?name=${item.fullName}`,
                rawStatus: item.status,
                status: mapStatus(item.status),
                location: "N/A",
                cvUrl: item.url,
                age: calculateAge(item.dob || item.dateOfBirth),
                interviewDate: item.interviewDate,
                interviewTime: item.interviewTime,
                interviewLocation: item.interviewLocation,
                rejectionReason: item.rejectionReason
            }));

            setCandidates(mapped);
            if (mapped.length > 0) {
                // giữ lại candidate đang chọn nếu có
                if (selectedCandidate) {
                    const found = mapped.find(c => c.id === selectedCandidate.id);
                    setSelectedCandidate(found || mapped[0]);
                } else {
                    setSelectedCandidate(mapped[0]);
                }
            }
        } catch (err) {
            console.error("Fetch candidates error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    // Filtered candidates (client-side)
    const filteredCandidates = useMemo(() => {
        let result = [...candidates];

        // 1. Tìm kiếm theo tên ứng viên hoặc vị trí
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            result = result.filter(c =>
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.role && c.role.toLowerCase().includes(q))
            );
        }

        // 2. Lọc theo trạng thái
        if (statusFilter !== 'all_status') {
            const statusMap = {
                pending: 'APPLIED',
                reviewing: 'REVIEWING',
                interviewing: 'INTERVIEW',
                rejected: 'REJECTED',
                accepted: 'ACCEPTED',
                cancelled: 'CANCELLED',
            };
            const raw = statusMap[statusFilter];
            if (raw) {
                result = result.filter(c => c.rawStatus === raw);
            }
        }

        // 3. Lọc theo thời gian ứng tuyển
        if (timeFilter !== 'all_time') {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            result = result.filter(c => {
                if (!c.appliedAt) return false;
                const applied = new Date(c.appliedAt);

                switch (timeFilter) {
                    case 'today':
                        return applied >= startOfDay;
                    case 'this_week': {
                        const day = now.getDay() || 7; // Chủ nhật = 7
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

    // Tải CV xuống
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

    // Hủy phỏng vấn
    const handleCancelInterview = async () => {
        if (!selectedCandidate) return;
        
        const confirmed = window.confirm(`Bạn có chắc muốn hủy phỏng vấn của ${selectedCandidate.name}?`);
        if (!confirmed) return;

        setActionLoading(true);
        try {
            await cancelInterview(selectedCandidate.id);
            toast.success(`Đã hủy phỏng vấn của ${selectedCandidate.name} và gửi thông báo qua email!`);
            await fetchCandidates();
        } catch (err) {
            console.error('Cancel interview error:', err);
            toast.error(err?.response?.data?.message || 'Lỗi khi hủy phỏng vấn');
        } finally {
            setActionLoading(false);
        }
    };

    // Chấp nhận ứng viên
    const handleAcceptCandidate = async () => {
        if (!selectedCandidate) return;

        const confirmed = window.confirm(`Bạn có chắc muốn chấp nhận ứng viên ${selectedCandidate.name}?`);
        if (!confirmed) return;

        setActionLoading(true);
        try {
            await updateApplicationStatus(selectedCandidate.id, { status: 'ACCEPTED' });
            toast.success(`Đã chấp nhận ứng viên ${selectedCandidate.name} và gửi email thông báo!`);
            await fetchCandidates();
        } catch (err) {
            console.error('Accept candidate error:', err);
            toast.error(err?.response?.data?.message || 'Lỗi khi chấp nhận ứng viên');
        } finally {
            setActionLoading(false);
        }
    };

    // Callback sau khi lên lịch / từ chối thành công
    const handleActionSuccess = () => {
        fetchCandidates();
    };

    if (loading) return <LoadingSpinner message="Đang tải danh sách ứng viên..." />;
    if (!candidates.length) return <div className="p-4">Không có ứng viên</div>;
    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* Top Search & Filter Bar */}
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
                    className="bg-[#f9fafb] border border-gray-200 text-gray-700 text-[0.875rem] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none min-w-[150px]"
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
                    className="bg-[#f9fafb] border border-gray-200 text-gray-700 text-[0.875rem] rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none min-w-[120px]"
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
                        onClick={() => { setSearchQuery(''); setStatusFilter('all_status'); setTimeFilter('all_time'); }}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg px-4 py-2 text-sm font-bold transition-colors"
                    >
                        <FiXCircle className="text-xs" /> Xóa lọc
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Left Sidebar: Candidate List */}
                <div className="w-[300px] border-r border-gray-100 bg-white overflow-y-auto flex flex-col shrink-0">
                    <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 shrink-0">
                        <h3 className="text-gray-600 font-bold text-xs uppercase tracking-wide">
                            Danh sách ứng tuyển ({filteredCandidates.length}/{candidates.length})
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredCandidates.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm">
                                <FiSearch className="mx-auto mb-2 text-2xl" />
                                Không tìm thấy ứng viên phù hợp
                            </div>
                        ) : filteredCandidates.map((c) => (
                            <div 
                                key={c.id}
                                onClick={() => setSelectedCandidate(c)}
                                className={`p-3 cursor-pointer border-b border-gray-50 transition-all ${selectedCandidate.id === c.id ? 'bg-blue-50/40 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                            >
                                <div className="flex gap-2.5">
                                    <img 
                                        src={c.avatar} 
                                        alt={c.name}
                                        className="w-9 h-9 rounded-lg object-cover bg-gray-200 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h4 className="font-bold text-gray-800 text-[15px] truncate" title={c.name}>
                                                {c.name}
                                            </h4>
                                            <span className="text-gray-400 text-[14px] whitespace-nowrap ml-1 mt-0.5">
                                                {c.appliedDate}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-[14px] mb-1 line-clamp-1">{c.role}</p>
                                        
                                        <div className="flex flex-col gap-1 mt-1.5">
                                            <div className="text-gray-500 text-[13px] flex items-center gap-1 whitespace-nowrap">
                                                <FiClock className="text-gray-400 text-[9px]"/> {c.experience} năm kinh nghiệm
                                            </div>
                                            <div className="flex justify-end">
                                                <span 
                                                    className={`px-2 py-0.5 rounded-full inline-flex items-center justify-center font-bold text-[9px] whitespace-nowrap 
                                                    ${c.status === 'Chờ xử lý' ? 'bg-amber-100 text-amber-700' : 
                                                      c.status === 'Đang phỏng vấn' ? 'bg-blue-100 text-blue-700' : 
                                                      c.status === 'Đã từ chối' ? 'bg-red-100 text-red-700' : 
                                                      c.status === 'Đã chấp nhận' ? 'bg-green-100 text-green-700' : 
                                                      c.status === 'Đã hủy' ? 'bg-orange-100 text-orange-700' :
                                                      'bg-gray-100 text-gray-700'}`}
                                                >
                                                    {c.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Candidate Detail & CV Preview */}
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
                                    {selectedCandidate.name} <span className="text-gray-500 text-sm font-medium">({selectedCandidate.age} tuổi)</span>
                                </h2>
                                <p className="text-blue-700 font-medium text-ls mb-1.5">
                                    Ứng tuyển: {selectedCandidate.role}
                                </p>
                                <div className="flex items-center gap-4 text-gray-500 text-xs">
                                    <span className="flex items-center gap-1"><FiMapPin className="text-[14px]" /> {selectedCandidate.location}</span>
                                    <span className="flex items-center gap-1"><FiClock className="text-[14px]" /> {selectedCandidate.experience} năm kinh nghiệm</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[200px] w-full lg:w-auto mt-2 lg:mt-0">
                            <button 
                                onClick={() => handleDownloadCV(selectedCandidate)}
                                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 py-1.5 text-xs transition-colors"
                            >
                                <FiDownload /> Tải CV xuống
                            </button>
                            <div className="flex gap-4">
                                {/* Nút lên lịch PV hoặc hủy PV tùy trạng thái */}
                                {selectedCandidate.rawStatus === 'INTERVIEW' ? (
                                    <>
                                        <button 
                                            onClick={handleCancelInterview}
                                            disabled={actionLoading}
                                            className="flex items-center justify-center gap-2 flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-sm py-1.5 text-xs transition-colors disabled:opacity-50"
                                        >
                                            <FiSlash /> {actionLoading ? '...' : 'Hủy PV'}
                                        </button>
                                        <button 
                                            onClick={handleAcceptCandidate}
                                            disabled={actionLoading}
                                            className="flex items-center justify-center gap-2 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm py-1.5 text-xs transition-colors disabled:opacity-50"
                                        >
                                            <FiCheckCircle /> {actionLoading ? '...' : 'Chấp nhận'}
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
                                            <FiCalendar /> Lên lịch PV
                                        </button>
                                        <button 
                                            onClick={() => setOpenRejectModal(true)}
                                            className="flex items-center justify-center gap-2 flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg border border-red-100 py-1.5 text-xs transition-colors"
                                        >
                                            <FiXCircle /> Từ chối
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
                                <FiCalendar className="text-blue-600" /> Thông tin phỏng vấn
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                <div>
                                    <span className="text-blue-600 font-medium text-xs">Ngày:</span>
                                    <p className="text-gray-800 font-bold">{selectedCandidate.interviewDate}</p>
                                </div>
                                <div>
                                    <span className="text-blue-600 font-medium text-xs">Giờ:</span>
                                    <p className="text-gray-800 font-bold">{selectedCandidate.interviewTime}</p>
                                </div>
                                <div>
                                    <span className="text-blue-600 font-medium text-xs">Địa điểm:</span>
                                    <p className="text-gray-800 font-bold">{selectedCandidate.interviewLocation || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                     )}

                     {/* Rejection Reason Card (nếu đã từ chối) */}
                     {selectedCandidate.rawStatus === 'REJECTED' && selectedCandidate.rejectionReason && (
                        <div className="p-4 rounded-xl shadow-sm border border-red-100 bg-red-50/60 shrink-0">
                            <h3 className="font-bold text-red-800 text-sm flex items-center gap-2 mb-2">
                                <FiXCircle className="text-red-600" /> Lý do từ chối
                            </h3>
                            <p className="text-gray-700 text-sm">{selectedCandidate.rejectionReason}</p>
                        </div>
                     )}

                     {/* CV PDF Viewer Area */}
                     <div className="mt-4 rounded-xl shadow-sm border border-gray-100 bg-white overflow-hidden flex flex-col min-h-[1000px]">
                        <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                Hồ sơ đính kèm (PDF)
                            </h3>
                            <button 
                                onClick={() => handleDownloadCV(selectedCandidate)}
                                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold transition-colors"
                            >
                                <FiDownload /> Tải xuống
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
                                    <FiDownload size={32} className="text-gray-400"/>
                                    <p className="text-sm">Không thể hiển thị PDF trực tiếp. Vui lòng tải xuống.</p>
                                    <button 
                                        onClick={() => handleDownloadCV(selectedCandidate)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                                    >
                                        <FiDownload /> Tải CV
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
