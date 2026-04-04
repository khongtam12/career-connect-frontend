// ─── Mock Data for Employer Dashboard ──────────────────────────────────────────

export const applicationData = [
  { name: 'T1', applications: 32 },
  { name: 'T2', applications: 45 },
  { name: 'T3', applications: 28 },
  { name: 'T4', applications: 64 },
  { name: 'T5', applications: 53 },
  { name: 'T6', applications: 72 },
  { name: 'T7', applications: 48 },
  { name: 'T8', applications: 91 },
  { name: 'T9', applications: 67 },
  { name: 'T10', applications: 85 },
  { name: 'T11', applications: 102 },
  { name: 'T12', applications: 78 },
];

export const topJobsData = [
  { name: 'React Dev', applicants: 145 },
  { name: 'UI/UX', applicants: 112 },
  { name: 'Backend', applicants: 98 },
  { name: 'DevOps', applicants: 76 },
  { name: 'QA', applicants: 54 },
];

export const recentJobs = [
  { id: 1, title: 'Senior React Developer', status: 'active', applicants: 45, posted: '28/03/2026', salary: '25-40 triệu' },
  { id: 2, title: 'UI/UX Designer', status: 'active', applicants: 32, posted: '25/03/2026', salary: '18-28 triệu' },
  { id: 3, title: 'Backend Engineer (Node.js)', status: 'paused', applicants: 28, posted: '20/03/2026', salary: '30-45 triệu' },
  { id: 4, title: 'DevOps Engineer', status: 'active', applicants: 19, posted: '15/03/2026', salary: '35-50 triệu' },
  { id: 5, title: 'QA Automation Engineer', status: 'closed', applicants: 54, posted: '10/03/2026', salary: '20-30 triệu' },
];

export const recentApplicants = [
  { id: 1, name: 'Nguyễn Văn Minh', position: 'Senior React Developer', status: 'new', avatar: 'NVM', time: '2 giờ trước' },
  { id: 2, name: 'Trần Thị Hương', position: 'UI/UX Designer', status: 'reviewed', avatar: 'TTH', time: '4 giờ trước' },
  { id: 3, name: 'Lê Hoàng Nam', position: 'Backend Engineer (Node.js)', status: 'interview', avatar: 'LHN', time: '6 giờ trước' },
  { id: 4, name: 'Phạm Quốc Đạt', position: 'DevOps Engineer', status: 'new', avatar: 'PQD', time: '8 giờ trước' },
  { id: 5, name: 'Đỗ Minh Anh', position: 'Senior React Developer', status: 'reviewed', avatar: 'DMA', time: '1 ngày trước' },
];

export const activityFeedData = [
  { id: 1, type: 'application', message: 'Nguyễn Văn Minh đã ứng tuyển vị trí Senior React Developer', time: '2 giờ trước' },
  { id: 2, type: 'interview', message: 'Phỏng vấn với Lê Hoàng Nam lúc 14:00 hôm nay', time: '3 giờ trước' },
  { id: 3, type: 'message', message: 'Trần Thị Hương đã gửi tin nhắn mới', time: '5 giờ trước' },
  { id: 4, type: 'system', message: 'Tin đăng "UI/UX Designer" đã đạt 30 lượt ứng tuyển', time: '6 giờ trước' },
  { id: 5, type: 'application', message: 'Phạm Quốc Đạt đã ứng tuyển vị trí DevOps Engineer', time: '8 giờ trước' },
  { id: 6, type: 'reminder', message: 'Nhắc nhở: Review hồ sơ ứng viên cho vị trí Backend Engineer', time: '1 ngày trước' },
];

export const recommendedCandidates = [
  { id: 1, name: 'Hoàng Minh Tuấn', skills: ['React', 'TypeScript', 'Node.js'], experience: '5 năm', match: 95, avatar: 'HMT', title: 'Senior Frontend Developer' },
  { id: 2, name: 'Vũ Thị Lan', skills: ['Figma', 'UI/UX', 'Prototyping'], experience: '4 năm', match: 88, avatar: 'VTL', title: 'UI/UX Lead Designer' },
  { id: 3, name: 'Trịnh Đức Anh', skills: ['Python', 'Django', 'PostgreSQL'], experience: '6 năm', match: 82, avatar: 'TDA', title: 'Backend Architect' },
  { id: 4, name: 'Bùi Thanh Hà', skills: ['AWS', 'Docker', 'K8s'], experience: '7 năm', match: 79, avatar: 'BTH', title: 'Cloud DevOps Engineer' },
];
