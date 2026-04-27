import React, { useState } from 'react';
import { 
  FiSearch, FiFilter, FiMapPin, FiClock, 
  FiDownload, FiCheckCircle, FiCalendar, FiXCircle 
} from 'react-icons/fi';
import { 
  Typography, Button, Select, MenuItem, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Card
} from '@mui/material';

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
        <div className="flex flex-col h-full min-h-[calc(100vh-80px)] bg-gray-50/50">
            {/* Top Search & Filter Bar */}
            <div className="bg-white p-4 border-b border-gray-100 flex gap-4 items-center flex-wrap">
                <div className="flex-1 min-w-[250px] relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo vị trí ứng tuyển..."
                        className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                </div>
                
                <Select
                    size="small"
                    defaultValue="all_status"
                    sx={{ borderRadius: '10px', minWidth: '160px', backgroundColor: '#f9fafb' }}
                >
                    <MenuItem value="all_status">Tất cả trạng thái</MenuItem>
                    <MenuItem value="pending">Chờ xử lý</MenuItem>
                    <MenuItem value="interviewing">Đang phỏng vấn</MenuItem>
                    <MenuItem value="rejected">Đã từ chối</MenuItem>
                </Select>

                <Select
                    size="small"
                    defaultValue="all_time"
                    sx={{ borderRadius: '10px', minWidth: '160px', backgroundColor: '#f9fafb' }}
                >
                    <MenuItem value="all_time">Mọi lúc</MenuItem>
                    <MenuItem value="today">Hôm nay</MenuItem>
                    <MenuItem value="this_week">Tuần này</MenuItem>
                    <MenuItem value="this_month">Tháng này</MenuItem>
                </Select>

                <Button 
                    variant="contained" 
                    startIcon={<FiFilter />}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 capitalize font-bold shadow-md shadow-blue-200"
                >
                    Lọc
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Candidate List */}
                <div className="w-[350px] border-r border-gray-100 bg-white overflow-y-auto flex flex-col">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
                        <Typography className="text-gray-600 font-bold text-sm">
                            Danh sách ứng tuyển ({candidatesData.length})
                        </Typography>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {candidatesData.map((c) => (
                            <div 
                                key={c.id}
                                onClick={() => setSelectedCandidate(c)}
                                className={`p-4 cursor-pointer border-b border-gray-50 transition-all ${selectedCandidate.id === c.id ? 'bg-blue-50/40 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex gap-3">
                                    <Avatar 
                                        src={c.avatar} 
                                        sx={{ width: 44, height: 44, borderRadius: '10px', fontWeight: 'bold' }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <Typography className="font-bold text-gray-800 text-sm truncate" title={c.name}>
                                                {c.name}
                                            </Typography>
                                            <Typography className="text-gray-400 text-[10px] whitespace-nowrap ml-2">
                                                {c.appliedDate}
                                            </Typography>
                                        </div>
                                        <Typography className="text-gray-600 text-xs mb-1 line-clamp-1">{c.role}</Typography>
                                        
                                        <div className="flex justify-between items-end mt-2">
                                            <Typography className="text-gray-500 text-[11px] flex items-center gap-1">
                                                <FiClock className="text-gray-400"/> {c.experience}
                                            </Typography>
                                            <Chip 
                                                label={c.status} 
                                                size="small" 
                                                className={`${getStatusColor(c.status)} font-bold text-[10px] h-5`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Candidate Detail & CV Preview */}
                <div className="flex-1 bg-gray-50 overflow-y-auto p-6 flex flex-col gap-6">
                     
                     {/* Candidate Header Card */}
                     <Card className="p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-white">
                        <div className="flex gap-5 items-center">
                            <Avatar 
                                src={selectedCandidate.avatar} 
                                sx={{ width: 80, height: 80, borderRadius: '20px' }}
                            />
                            <div>
                                <Typography variant="h5" className="font-bold text-gray-900 mb-1">
                                    {selectedCandidate.name} <span className="text-gray-500 text-lg font-medium">({selectedCandidate.age} tuổi)</span>
                                </Typography>
                                <Typography className="text-blue-700 font-medium text-sm mb-2">
                                    Ứng tuyển: {selectedCandidate.role}
                                </Typography>
                                <div className="flex items-center gap-4 text-gray-500 text-sm">
                                    <span className="flex items-center gap-1"><FiMapPin /> {selectedCandidate.location}</span>
                                    <span className="flex items-center gap-1"><FiClock /> {selectedCandidate.experience}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[220px] w-full xl:w-auto">
                            <Button 
                                variant="outlined" 
                                startIcon={<FiDownload />} 
                                className="w-full border-gray-200 text-gray-700 font-bold rounded-xl capitalize hover:bg-gray-50 py-2"
                            >
                                Tải CV xuống
                            </Button>
                            <div className="flex gap-2">
                                <Button 
                                    variant="contained" 
                                    startIcon={<FiCalendar />}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl capitalize shadow-sm py-2"
                                    onClick={() => setOpenInterviewModal(true)}
                                >
                                    Lên lịch PV
                                </Button>
                                <Button 
                                    variant="contained" 
                                    startIcon={<FiXCircle />}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl capitalize shadow-none elevation-0 border border-red-100 py-2"
                                    onClick={() => setOpenRejectModal(true)}
                                >
                                    Từ chối
                                </Button>
                            </div>
                        </div>
                     </Card>

                     {/* CV PDF Viewer Area */}
                     <Card className="flex-1 rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden flex flex-col min-h-[600px]">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <Typography className="font-bold text-gray-700 flex items-center gap-2">
                                Hồ sơ đính kèm (PDF)
                            </Typography>
                        </div>
                        <div className="flex-1 w-full bg-gray-200 relative">
                            {/* Embedded PDF Viewer */}
                            <object 
                                data={selectedCandidate.cvUrl} 
                                type="application/pdf" 
                                className="absolute inset-0 w-full h-full"
                            >
                                <div className="flex items-center justify-center h-full flex-col gap-3 text-gray-500 bg-white">
                                    <FiDownload size={48} className="text-gray-400"/>
                                    <Typography>Không thể hiển thị PDF trực tiếp. Vui lòng tải xuống.</Typography>
                                    <Button variant="outlined" startIcon={<FiDownload />}>Tải CV</Button>
                                </div>
                            </object>
                        </div>
                     </Card>
                </div>
            </div>

            {/* Modal: Schedule Interview */}
            <Dialog 
                open={openInterviewModal} 
                onClose={() => setOpenInterviewModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle className="font-bold text-xl border-b border-gray-100 pb-3">
                    Lên lịch phỏng vấn
                </DialogTitle>
                <DialogContent className="pt-5 flex flex-col gap-5">
                    <Typography className="text-gray-600 text-sm">
                        Thiết lập lịch phỏng vấn cho ứng viên <span className="font-bold">{selectedCandidate.name}</span>. Thông báo sẽ được gửi qua email.
                    </Typography>
                    
                    <div className="flex gap-4">
                        <TextField 
                            label="Ngày phỏng vấn" 
                            type="date" 
                            fullWidth 
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        />
                        <TextField 
                            label="Thời gian" 
                            type="time" 
                            fullWidth 
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        />
                    </div>
                    
                    <TextField 
                        label="Địa điểm / Link họp online" 
                        placeholder="VD: Tầng 3, Tòa nhà ABC hoặc Link Google Meet"
                        fullWidth 
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                    
                    <TextField 
                        label="Lời nhắn / Ghi chú cho ứng viên" 
                        multiline
                        rows={3}
                        placeholder="Trang phục, yêu cầu chuẩn bị..."
                        fullWidth 
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </DialogContent>
                <DialogActions className="p-4 border-t border-gray-100">
                    <Button onClick={() => setOpenInterviewModal(false)} className="text-gray-500 font-bold capitalize">
                        Hủy
                    </Button>
                    <Button variant="contained" className="bg-emerald-600 hover:bg-emerald-700 font-bold capitalize rounded-xl px-6">
                        Xác nhận Lên Lịch
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Reject Application */}
            <Dialog 
                open={openRejectModal} 
                onClose={() => setOpenRejectModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle className="font-bold text-xl border-b border-gray-100 pb-3 text-red-600 flex items-center gap-2">
                    <FiXCircle /> Từ chối hồ sơ
                </DialogTitle>
                <DialogContent className="pt-5 flex flex-col gap-4">
                    <Typography className="text-gray-600 text-sm mb-2">
                        Bạn đang từ chối hồ sơ của <span className="font-bold">{selectedCandidate.name}</span>. Vui lòng cung cấp lý do để ứng viên có thể cải thiện trong tương lai.
                    </Typography>
                    
                    <TextField 
                        label="Lý do từ chối (Bắt buộc)" 
                        multiline
                        rows={4}
                        placeholder="VD: Kinh nghiệm chưa phù hợp với yêu cầu vị trí hiện tại..."
                        fullWidth 
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </DialogContent>
                <DialogActions className="p-4 border-t border-gray-100">
                    <Button onClick={() => setOpenRejectModal(false)} className="text-gray-500 font-bold capitalize">
                        Hủy
                    </Button>
                    <Button variant="contained" color="error" className="font-bold capitalize rounded-xl px-6 bg-red-600 hover:bg-red-700 shadow-none">
                        Xác nhận Từ Chối
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default CVManagement;
