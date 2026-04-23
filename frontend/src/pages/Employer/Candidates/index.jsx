import React, { useState } from 'react';
import { 
  FiSearch, FiFilter, FiMapPin, FiClock, 
  FiMessageSquare, FiDownload, FiCheckCircle 
} from 'react-icons/fi';
import { 
  Typography, Grid, Card, Button, 
  Select, MenuItem, Box, Chip, Avatar,
  IconButton, Tooltip
} from '@mui/material';

const candidatesData = [
  {
    id: 1,
    name: "Trần Thị Ngọc Q...",
    age: 22,
    role: "Nhân Viên Văn Phòng / Nhân Viê...",
    experience: "Chưa có kinh nghiệm",
    lastActive: "3 phút trước",
    avatar: "https://ui-avatars.com/api/?name=TR&background=f43f5e&color=fff",
    status: "Tích cực tìm việc",
    location: "TP. Hồ Chí Minh"
  },
  {
    id: 2,
    name: "Đỗ Thuỳ Linh",
    age: 22,
    role: "Nhân Viên Sale",
    experience: "Chưa có kinh nghiệm",
    lastActive: "6 phút trước",
    avatar: "https://ui-avatars.com/api/?name=DTL&background=0ea5e9&color=fff",
    status: null,
    location: "Hà Nội"
  },
  {
    id: 3,
    name: "Nguyễn Ngô Thành Đạt",
    age: 22,
    role: "Nhân Viên Hiện Trường",
    experience: "1 năm kinh nghiệm",
    lastActive: "6 phút trước",
    avatar: "https://ui-avatars.com/api/?name=TD&background=f59e0b&color=fff",
    status: null,
    location: "Đà Nẵng"
  },
  {
    id: 4,
    name: "Đỗ Anh Dũng",
    age: 58,
    role: "Kế Toán Tổng Hợp",
    experience: "Hơn 5 năm kinh nghiệm",
    lastActive: "6 phút trước",
    avatar: "https://ui-avatars.com/api/?name=DAD&background=64748b&color=fff",
    status: "Tích cực tìm việc",
    location: "Hải Phòng"
  }
];

const CandidateSearch = () => {
    const [selectedCandidate, setSelectedCandidate] = useState(candidatesData[0]);

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* Top Search Bar */}
            <div className="bg-white p-4 border-b border-gray-100 flex gap-4 items-center">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Vị trí cần tuyển"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white outline-none transition-all font-medium"
                    />
                </div>
                <Select
                    size="small"
                    defaultValue="Toàn quốc"
                    sx={{ borderRadius: '12px', minWidth: '200px', backgroundColor: '#f9fafb' }}
                >
                    <MenuItem value="Toàn quốc">Toàn quốc</MenuItem>
                    <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                    <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
                </Select>
                <Button 
                    variant="outlined" 
                    startIcon={<FiFilter />}
                    className="border-gray-200 text-gray-600 rounded-xl px-6 capitalize font-bold hover:bg-gray-100"
                >
                    Bộ lọc
                </Button>
                <Button 
                    variant="contained" 
                    startIcon={<FiSearch />}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-10 capitalize font-bold shadow-lg shadow-purple-200"
                >
                    Tìm kiếm
                </Button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Results List */}
                <div className="w-[320px] border-r border-gray-100 bg-white overflow-y-auto">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <Typography className="text-gray-500 font-bold text-xs uppercase tracking-wider">
                            4,154,327 ứng viên
                        </Typography>
                        <Select size="small" defaultValue="match" sx={{ fontSize: '12px', minWidth: '120px' }} variant="standard">
                            <MenuItem value="match">Phù hợp nhất</MenuItem>
                            <MenuItem value="newest">Mới nhất</MenuItem>
                        </Select>
                    </div>

                    {candidatesData.map((c) => (
                        <div 
                            key={c.id}
                            onClick={() => setSelectedCandidate(c)}
                            className={`p-5 cursor-pointer border-b border-gray-50 transition-all ${selectedCandidate.id === c.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'}`}
                        >
                            <div className="flex gap-4">
                                <Avatar 
                                    src={c.avatar} 
                                    sx={{ width: 48, height: 48, borderRadius: '12px', fontWeight: 'bold' }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <Typography className="font-black text-gray-800 text-sm truncate">{c.name} ({c.age} tuổi)</Typography>
                                    </div>
                                    {c.status && (
                                        <Chip 
                                            label={c.status} 
                                            size="small" 
                                            className="bg-orange-50 text-orange-600 font-bold text-[10px] mt-1 mb-2 px-1 rounded-md"
                                        />
                                    )}
                                    <Typography className="text-blue-900 font-bold text-xs mb-1 line-clamp-1">{c.role}</Typography>
                                    <div className="flex justify-between items-center mt-2">
                                        <Typography className="text-gray-400 text-[10px] font-bold uppercase">{c.experience}</Typography>
                                        <Typography className="text-gray-400 text-[10px] italic">{c.lastActive}</Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Candidate Detail/Preview */}
                <div className="flex-1 bg-white overflow-y-auto p-12">
                     <div className="max-w-4xl mx-auto">
                        <div className="flex items-start justify-between mb-12">
                           <div className="flex gap-8 items-center">
                              <Avatar 
                                 src={selectedCandidate.avatar} 
                                 sx={{ width: 120, height: 120, borderRadius: '32px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                              />
                              <div>
                                 <Typography variant="h4" className="font-black text-gray-800 mb-2">{selectedCandidate.name}</Typography>
                                 <div className="flex items-center gap-4 text-gray-500 font-bold mb-4">
                                    <span className="flex items-center gap-1"><FiMapPin /> {selectedCandidate.location}</span>
                                    <span className="flex items-center gap-1"><FiClock /> {selectedCandidate.experience}</span>
                                 </div>
                                 <div className="flex gap-3">
                                    <Chip label="Đã xác thực hồ sơ" icon={<FiCheckCircle />} className="bg-emerald-50 text-emerald-600 font-black px-4 rounded-xl" />
                                    <Chip label="Sẵn sàng đi làm" className="bg-purple-50 text-purple-600 font-black px-4 rounded-xl" />
                                 </div>
                              </div>
                           </div>
                           <div className="flex flex-col gap-3">
                              <Button variant="contained" className="bg-purple-600 hover:bg-purple-700 font-black px-8 py-3 rounded-2xl shadow-xl shadow-purple-200 capitalize">
                                 Mở thông tin liên hệ
                              </Button>
                              <div className="flex gap-2">
                                 <Button variant="outlined" startIcon={<FiMessageSquare />} className="flex-1 border-gray-200 text-gray-600 font-black rounded-xl capitalize">
                                    Chat
                                 </Button>
                                 <Button variant="outlined" startIcon={<FiDownload />} className="flex-1 border-gray-200 text-gray-600 font-black rounded-xl capitalize">
                                    Tải CV
                                 </Button>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-12">
                            {/* Skeleton sections to match Screenshot 1's detailed view */}
                            {[1, 2, 3].map(i => (
                                <div key={i}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-6 w-1 bg-purple-600 rounded-full"></div>
                                        <div className="h-4 w-48 bg-gray-100 rounded-full"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-3 w-full bg-gray-50 rounded-full"></div>
                                        <div className="h-3 w-5/6 bg-gray-50 rounded-full"></div>
                                        <div className="h-3 w-4/6 bg-gray-50 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>

            {/* Info Message */}
            <div className="bg-orange-50 border-t border-orange-100 px-6 py-2 flex items-center justify-center gap-2">
                <Typography className="text-orange-700 text-xs font-bold">
                    Hồ sơ của bạn chưa hoàn thiện để sử dụng đầy đủ các dịch vụ của Việc Làm 24h.
                </Typography>
                <a href="#" className="text-blue-600 text-xs font-black underline decoration-2 underline-offset-4">Hoàn tất ngay</a>
            </div>
        </div>
    );
};

export default CandidateSearch;
