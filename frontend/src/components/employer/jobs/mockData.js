// Mock data cho trang quản lý tin tuyển dụng
export const MOCK_JOBS = [
  {
    id: 1,
    title: 'Kỹ Thuật Viên FPT Telecom',
    isTop: true,
    location: '48 Vạn Bảo, Phường Ngọc Hà',
    type: 'Toàn thời gian',
    salaryMin: 10,
    salaryMax: 25,
    applicants: 0,
    views: 0,
    deadline: '31/12/2025',
    status: 'active',
  },
  {
    id: 2,
    title: 'Chuyên Viên DevOps Engineer, 5 Năm Kinh Nghiệm, Thu Nhập 20-30 Triệu, Tại Hà Nội',
    isTop: false,
    location: 'Phường Thanh Xuân',
    type: 'Toàn thời gian',
    salaryMin: 5,
    salaryMax: 10,
    applicants: 0,
    views: 0,
    deadline: '02/02/2026',
    status: 'active',
  },
  {
    id: 3,
    title: 'Nhân Viên Kinh Doanh - Thu Nhập 15-20 Triệu/Tháng (Khách Hàng Có Sẵn)',
    isTop: false,
    location: 'Toà Nhà MISA, Đường Tô Ký, Tân Chánh Hiệp, Quận 12, Thành phố Hồ Chí Minh',
    type: 'Bán thời gian',
    salaryMin: 20,
    salaryMax: 25,
    applicants: 0,
    views: 0,
    deadline: '05/05/2027',
    status: 'active',
  },
  {
    id: 4,
    title: 'Từ 18 Tháng Kinh Nghiệm / Nhân Viên Kinh Doanh Phần Mềm Cogoyer CRM/ERP',
    isTop: false,
    location: 'Tầng 5, Tòa nhà Lottery, Số 77 Trần Nhân Tốn, Phường An Đông',
    type: 'Bán thời gian',
    salaryMin: 10,
    salaryMax: 15,
    applicants: 0,
    views: 0,
    deadline: '05/05/2026',
    status: 'active',
  },
  {
    id: 5,
    title: 'CVCC/CG Quản Trị Rủi Ro Công Nghệ Thông Tin (Digital Channel Risk Management Specialist)',
    isTop: false,
    location: 'Hội sở ABBANK, Phường Ô Chợ Dừa',
    type: 'Bán thời gian',
    salaryMin: 10,
    salaryMax: 15,
    applicants: 0,
    views: 0,
    deadline: '04/01/2026',
    status: 'active',
  },
  {
    id: 6,
    title: 'Thực Tập Sinh Network Security (Security Intern)',
    isTop: false,
    location: 'Tầng 25, tòa B1, Roman plaza, Tố Hữu, Phường Đại Mỗ',
    type: 'Bán thời gian',
    salaryMin: 10,
    salaryMax: 15,
    applicants: 0,
    views: 0,
    deadline: '30/12/2025',
    status: 'active',
  },
  {
    id: 7,
    title: 'Media Marketing Thiết Kế Đồ Họa - Ngành Rượu Vang & Đồ Uống Tại Hà Nội - Yêu Cầu 2,5 Năm Kinh Nghiệm',
    isTop: false,
    location: 'Số 308C Trường Chinh, Phường Kim Liên',
    type: 'Toàn thời gian',
    salaryMin: 5,
    salaryMax: 10,
    applicants: 0,
    views: 0,
    deadline: '31/12/2025',
    status: 'active',
  },
];

// Mapping status key → label & color
export const STATUS_MAP = {
  draft:    { label: 'Nháp',       color: 'draft'   },
  pending:  { label: 'Chờ duyệt', color: 'pending' },
  active:   { label: 'Đang tuyển', color: 'success' },
  paused:   { label: 'Tạm dừng',  color: 'paused'  },
  closed:   { label: 'Đã đóng',   color: 'default' },
  rejected: { label: 'Từ chối',   color: 'error'   },
  expired:  { label: 'Hết hạn',   color: 'expired' },
};

// Hỗ trợ enum BE viết hoa (DRAFT, PENDING, ...)
export const STATUS_MAP_UPPER = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [k.toUpperCase(), v])
);

// Danh sách ngành nghề
export const INDUSTRIES = [
  'Công nghệ thông tin',
  'Kinh doanh / Bán hàng',
  'Marketing / Truyền thông',
  'Kế toán / Tài chính',
  'Hành chính / Nhân sự',
  'Kỹ thuật / Cơ khí',
  'Xây dựng / Kiến trúc',
  'Giáo dục / Đào tạo',
  'Y tế / Dược phẩm',
  'Logistics / Vận tải',
  'Bất động sản',
  'Thiết kế / Đồ họa',
  'Điện / Điện tử / Viễn thông',
  'Dịch vụ khách hàng',
  'Khác',
];

// Loại hình công việc
export const JOB_TYPES = [
  'Toàn thời gian',
  'Bán thời gian',
  'Thực tập',
  'Freelance',
  'Remote',
];
