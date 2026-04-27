import React, { useState } from 'react';
import { 
  FiSearch, FiFilter, FiMapPin, FiClock, 
  FiDownload, FiCheckCircle, FiCalendar, FiXCircle 
} from 'react-icons/fi';
import { 
  Typography, Button, Select, MenuItem, Chip, Avatar, Card
} from '@mui/material';
import ScheduleInterviewModal from './components/ScheduleInterviewModal';
import RejectApplicationModal from './components/RejectApplicationModal';

const candidatesData = [
  {
    id: 1,
    name: "Trần Thị Ngọc Quỳnh",
    age: 22,
    role: "Nhân Viên Văn Phòng",
    experience: "Chưa có kinh nghiệm",
    appliedDate: "27/04/2026",
    avatar: "https://ui-avatars.com/api/?name=TR&background=f43f5e&color=fff",
    status: "Chờ xử lý",
    location: "TP. Hồ Chí Minh",
    cvUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 2,
    name: "Đỗ Thuỳ Linh",
    age: 22,
    role: "Nhân Viên Sale",
    experience: "1 năm kinh nghiệm",
    appliedDate: "25/04/2026",
    avatar: "https://ui-avatars.com/api/?name=DTL&background=0ea5e9&color=fff",
    status: "Đang phỏng vấn",
    location: "Hà Nội",
    cvUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 3,
    name: "Nguyễn Ngô Thành Đạt",
    age: 22,
    role: "Nhân Viên Hiện Trường",
    experience: "1 năm kinh nghiệm",
    appliedDate: "20/04/2026",
    avatar: "https://ui-avatars.com/api/?name=TD&background=f59e0b&color=fff",
    status: "Đã từ chối",
    location: "Đà Nẵng",
    cvUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 4,
    name: "Đỗ Anh Dũng",
    age: 58,
    role: "Kế Toán Tổng Hợp",
    experience: "Hơn 5 năm kinh nghiệm",
    appliedDate: "15/04/2026",
    avatar: "https://ui-avatars.com/api/?name=DAD&background=64748b&color=fff",
    status: "Chờ xử lý",
    location: "Hải Phòng",
    cvUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

const getStatusColor = (status) => {
    switch(status) {
        case "Chờ xử lý": return "bg-orange-50 text-orange-600";
        case "Đang phỏng vấn": return "bg-blue-50 text-blue-600";
        case "Đã từ chối": return "bg-red-50 text-red-600";
        case "Đã chấp nhận": return "bg-emerald-50 text-emerald-600";
        default: return "bg-gray-50 text-gray-600";
    }
}

const CVManagement = () => {
    const [selectedCandidate, setSelectedCandidate] = useState(candidatesData[0]);
    
    // Modals state
    const [openInterviewModal, setOpenInterviewModal] = useState(false);
    const [openRejectModal, setOpenRejectModal] = useState(false);

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* Top Search & Filter Bar */}
            <div className="bg-white p-3 border-b border-gray-100 flex gap-3 items-center flex-wrap shrink-0">
                <div className="flex-1 min-w-[200px] relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo vị trí ứng tuyển..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>
                
                <Select
                    size="small"
                    defaultValue="all_status"
                    sx={{ borderRadius: '8px', minWidth: '150px', backgroundColor: '#f9fafb', fontSize: '0.875rem' }}
                >
                    <MenuItem value="all_status" sx={{ fontSize: '0.875rem' }}>Tất cả trạng thái</MenuItem>
                    <MenuItem value="pending" sx={{ fontSize: '0.875rem' }}>Chờ xử lý</MenuItem>
                    <MenuItem value="interviewing" sx={{ fontSize: '0.875rem' }}>Đang phỏng vấn</MenuItem>
                    <MenuItem value="rejected" sx={{ fontSize: '0.875rem' }}>Đã từ chối</MenuItem>
                </Select>

                <Select
                    size="small"
                    defaultValue="all_time"
                    sx={{ borderRadius: '8px', minWidth: '120px', backgroundColor: '#f9fafb', fontSize: '0.875rem' }}
                >
                    <MenuItem value="all_time" sx={{ fontSize: '0.875rem' }}>Mọi lúc</MenuItem>
                    <MenuItem value="today" sx={{ fontSize: '0.875rem' }}>Hôm nay</MenuItem>
                    <MenuItem value="this_week" sx={{ fontSize: '0.875rem' }}>Tuần này</MenuItem>
                    <MenuItem value="this_month" sx={{ fontSize: '0.875rem' }}>Tháng này</MenuItem>
                </Select>

                <Button 
                    variant="contained" 
                    startIcon={<FiFilter />}
                    size="small"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 capitalize font-bold shadow-md shadow-blue-200"
                >
                    Lọc
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Left Sidebar: Candidate List */}
                <div className="w-[300px] border-r border-gray-100 bg-white overflow-y-auto flex flex-col shrink-0">
                    <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10 shrink-0">
                        <Typography className="text-gray-600 font-bold text-xs uppercase tracking-wide">
                            Danh sách ứng tuyển ({candidatesData.length})
                        </Typography>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {candidatesData.map((c) => (
                            <div 
                                key={c.id}
                                onClick={() => setSelectedCandidate(c)}
                                className={`p-3 cursor-pointer border-b border-gray-50 transition-all ${selectedCandidate.id === c.id ? 'bg-blue-50/40 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                            >
                                <div className="flex gap-2.5">
                                    <Avatar 
                                        src={c.avatar} 
                                        sx={{ width: 36, height: 36, borderRadius: '8px', fontWeight: 'bold', fontSize: '13px' }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <Typography className="font-bold text-gray-800 text-[12px] truncate" title={c.name}>
                                                {c.name}
                                            </Typography>
                                            <Typography className="text-gray-400 text-[8px] whitespace-nowrap ml-1 mt-0.5">
                                                {c.appliedDate}
                                            </Typography>
                                        </div>
                                        <Typography className="text-gray-600 text-[10px] mb-1 line-clamp-1">{c.role}</Typography>
                                        
                                        <div className="flex flex-col gap-1 mt-1.5">
                                            <Typography className="text-gray-500 text-[10px] flex items-center gap-1 whitespace-nowrap">
                                                <FiClock className="text-gray-400 text-[9px]"/> {c.experience}
                                            </Typography>
                                            <div className="flex justify-end">
                                                <Chip 
                                                    label={c.status} 
                                                    size="small" 
                                                    className={`${getStatusColor(c.status)} font-bold text-[9px] h-[15px] px-1`}
                                                />
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
                     <Card className="p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white shrink-0">
                        <div className="flex gap-4 items-center">
                            <Avatar 
                                src={selectedCandidate.avatar} 
                                sx={{ width: 64, height: 64, borderRadius: '16px' }}
                            />
                            <div>
                                <Typography variant="h6" className="font-bold text-gray-900 mb-0.5 text-base">
                                    {selectedCandidate.name} <span className="text-gray-500 text-sm font-medium">({selectedCandidate.age} tuổi)</span>
                                </Typography>
                                <Typography className="text-blue-700 font-medium text-xs mb-1.5">
                                    Ứng tuyển: {selectedCandidate.role}
                                </Typography>
                                <div className="flex items-center gap-4 text-gray-500 text-xs">
                                    <span className="flex items-center gap-1"><FiMapPin className="text-[14px]" /> {selectedCandidate.location}</span>
                                    <span className="flex items-center gap-1"><FiClock className="text-[14px]" /> {selectedCandidate.experience}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[200px] w-full lg:w-auto mt-2 lg:mt-0">
                            <Button 
                                variant="outlined" 
                                startIcon={<FiDownload />} 
                                size="small"
                                className="w-full border-gray-200 text-gray-700 font-bold rounded-lg capitalize hover:bg-gray-50 py-1 text-xs"
                            >
                                Tải CV xuống
                            </Button>
                            <div className="flex gap-2">
                                <Button 
                                    variant="contained" 
                                    startIcon={<FiCalendar />}
                                    size="small"
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg capitalize shadow-sm py-1 text-sm"
                                    onClick={() => setOpenInterviewModal(true)}
                                >
                                    Lên lịch PV
                                </Button>
                                <Button 
                                    variant="contained" 
                                    startIcon={<FiXCircle />}
                                    size="small"
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg capitalize shadow-none elevation-0 border border-red-100 py-1 text-xs"
                                    onClick={() => setOpenRejectModal(true)}
                                >
                                    Từ chối
                                </Button>
                            </div>
                        </div>
                     </Card>

                     {/* CV PDF Viewer Area */}
                     <Card className="flex-1 rounded-xl shadow-sm border border-gray-100 bg-white overflow-hidden flex flex-col min-h-[400px]">
                        <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                            <Typography className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                Hồ sơ đính kèm (PDF)
                            </Typography>
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
                                    <Typography className="text-sm">Không thể hiển thị PDF trực tiếp. Vui lòng tải xuống.</Typography>
                                    <Button variant="outlined" size="small" startIcon={<FiDownload />}>Tải CV</Button>
                                </div>
                            </object>
                        </div>
                     </Card>
                </div>
            </div>

            {/* Modals */}
            <ScheduleInterviewModal 
                open={openInterviewModal} 
                onClose={() => setOpenInterviewModal(false)} 
                candidateName={selectedCandidate.name} 
            />

            <RejectApplicationModal 
                open={openRejectModal} 
                onClose={() => setOpenRejectModal(false)} 
                candidateName={selectedCandidate.name} 
            />

        </div>
    );
};

export default CVManagement;
