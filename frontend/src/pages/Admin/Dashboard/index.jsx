import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Paper, Avatar, Skeleton, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Tooltip, Pagination
} from '@mui/material';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import { fetchAllDashboardData } from '../../../service/dashboardService';
import { getPackage } from '../../../service/paymentService';
import { useUserStore } from '../../../stores/useUserStore';

dayjs.locale('vi');

const formatCurrency = (v) => {
  if (!v && v !== 0) return '0';
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${Math.round(v / 1e6)}M`;
  if (v >= 1e3) return `${Math.round(v / 1e3)}K`;
  return String(v);
};

const formatFullCurrency = (v) => {
  if (!v && v !== 0) return '0đ';
  return new Intl.NumberFormat('vi-VN').format(v) + 'đ';
};

const dayLabels = { MONDAY: 'T2', TUESDAY: 'T3', WEDNESDAY: 'T4', THURSDAY: 'T5', FRIDAY: 'T6', SATURDAY: 'T7', SUNDAY: 'CN' };
const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const gradients = [
  { bg: 'linear-gradient(135deg, #2f6bff 0%, #1f4fd7 100%)', icon: <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: '#fff' }} /> },
  { bg: 'linear-gradient(135deg, #29c57b 0%, #1a9d64 100%)', icon: <BusinessOutlinedIcon sx={{ fontSize: 28, color: '#fff' }} /> },
  { bg: 'linear-gradient(135deg, #7a3ff0 0%, #5b27c9 100%)', icon: <WorkOutlineOutlinedIcon sx={{ fontSize: 28, color: '#fff' }} /> },
  { bg: 'linear-gradient(135deg, #f59a23 0%, #ef6d1f 100%)', icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 28, color: '#fff' }} /> },
];

const activityMeta = {
  NEW_JOB: { bg: '#dbeafe', color: '#2563eb', icon: <WorkOutlineOutlinedIcon sx={{ fontSize: 16 }} /> },
  NEW_USER: { bg: '#dcfce7', color: '#16a34a', icon: <PersonAddAltOutlinedIcon sx={{ fontSize: 16 }} /> },
  NEW_EMPLOYER: { bg: '#e0f2fe', color: '#0284c7', icon: <BusinessOutlinedIcon sx={{ fontSize: 16 }} /> },
  NEW_APPLICATION: { bg: '#fee2e2', color: '#dc2626', icon: <SendOutlinedIcon sx={{ fontSize: 16 }} /> },
  JOB_APPROVED: { bg: '#dcfce7', color: '#16a34a', icon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} /> },
  JOB_REJECTED: { bg: '#fee2e2', color: '#dc2626', icon: <HighlightOffOutlinedIcon sx={{ fontSize: 16 }} /> },
  COMPANY_APPROVED: { bg: '#dcfce7', color: '#16a34a', icon: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} /> },
  COMPANY_REJECTED: { bg: '#fee2e2', color: '#dc2626', icon: <HighlightOffOutlinedIcon sx={{ fontSize: 16 }} /> },
  PAYMENT_SUCCEEDED: { bg: '#e0f2fe', color: '#0284c7', icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 16 }} /> },
};

const activityLabels = {
  NEW_JOB: 'Tin tuyển dụng mới',
  NEW_USER: 'Người dùng mới đăng ký',
  NEW_EMPLOYER: 'Nhà tuyển dụng mới',
  NEW_APPLICATION: 'Hồ sơ ứng tuyển mới',
  JOB_APPROVED: 'Tin tuyển dụng được duyệt',
  JOB_REJECTED: 'Tin tuyển dụng bị từ chối',
  COMPANY_APPROVED: 'Công ty được duyệt',
  COMPANY_REJECTED: 'Công ty bị từ chối',
  PAYMENT_SUCCEEDED: 'Thanh toán thành công',
};

const getTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = dayjs().diff(dayjs(dateStr), 'minute');
  if (diff < 1) return 'Vừa xong';
  if (diff < 60) return `${diff} phút trước`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

const formatActivityDetail = (act) => {
  const company = act.companyName || 'Không rõ';
  const title = act.entityName || 'Không rõ';
  switch (act.type) {
    case 'NEW_JOB':
      return [company, title].filter(Boolean).join(' • ');
    case 'JOB_APPROVED':
    case 'JOB_REJECTED':
      return [company, title].filter(Boolean).join(' • ');
    case 'PAYMENT_SUCCEEDED': {
      const amount = (act.amount || act.amount === 0) ? formatFullCurrency(act.amount) : null;
      return [title, amount].filter(Boolean).join(' • ');
    }
    case 'NEW_APPLICATION': {
      const count = (act.applicationCount || act.applicationCount === 0) ? `${act.applicationCount} ứng tuyển` : null;
      return [title, count].filter(Boolean).join(' • ');
    }
    default:
      return title;
  }
};

const CustomTooltipChart = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: '#1e293b', color: '#fff', px: 2, py: 1.5, borderRadius: 2, fontSize: '0.8rem', boxShadow: 3 }}>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Ngày: {label}</Typography>
      <Typography sx={{ fontSize: '0.8rem' }}>Doanh thu: {formatFullCurrency(payload[0]?.value)}</Typography>
    </Box>
  );
};

export default function Dashboard() {
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [activities, setActivities] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [packageStats, setPackageStats] = useState([]);
  const [interactionData, setInteractionData] = useState([]);
  const [topEmployerPage, setTopEmployerPage] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllDashboardData();
      const pkgs = await getPackage();

      const categoryOptions = [
        { value: 'JOB_POSTING', label: 'Tin đăng tuyển dụng' },
        { value: 'HIGHLIGHT', label: 'Gia tăng hiển thị' },
        { value: 'EFFECT', label: 'Hiệu ứng nổi bật' },
        { value: 'POINTS', label: 'Điểm dịch vụ' },
        { value: 'BRANDING', label: 'Quảng bá thương hiệu' }
      ];
      
      const byCategory = (Array.isArray(pkgs) ? pkgs : []).reduce((acc, item) => {
        const key = item.category || 'Khác';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      
      const pieData = Object.entries(byCategory).map(([key, value]) => {
        const label = categoryOptions.find((opt) => opt.value === key)?.label || key;
        return { name: label, value };
      });
      pieData.sort((a, b) => b.value - a.value);
      setPackageStats(pieData);

      setStats(data.stats || {});
      const revData = data.revenue || [];
      const mapped = revData.map((r) => ({
        ...r,
        label: dayLabels[r.day] || r.day
      }));
      setRevenue(mapped);
      setActivities(Array.isArray(data.activities) ? data.activities : []);
      setEmployers(Array.isArray(data.employers) ? data.employers : []);
      
      const intData = Array.isArray(data.interactions) ? data.interactions : [];
      setInteractionData(intData);
    } catch (e) {
      console.error('Dashboard load error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { setTopEmployerPage(1); }, [employers.length]);

  const totalRevenue = revenue.reduce((s, r) => s + (r.revenue || 0), 0);

  // Dữ liệu cho biểu đồ Trạng thái tin tuyển dụng
  const jobStatusData = [
    { name: 'Đang hoạt động', value: stats?.activeJobs ?? 0, color: '#16a34a' },
    { name: 'Chờ duyệt', value: stats?.pendingApprovals ?? 0, color: '#2563eb' },
    { name: 'Khác (Hết hạn, Từ chối)', value: Math.max(0, (stats?.totalJobs ?? 0) - (stats?.activeJobs ?? 0) - (stats?.pendingApprovals ?? 0)), color: '#ea580c' },
  ].filter(item => item.value > 0);

  const topEmployerPageSize = 5;
  const totalEmployerPages = Math.max(1, Math.ceil(employers.length / topEmployerPageSize));
  const pagedEmployers = employers.slice(
    (topEmployerPage - 1) * topEmployerPageSize,
    topEmployerPage * topEmployerPageSize
  );

  const statCards = [
    { label: 'Tổng người dùng', value: stats?.totalUsers ?? 0, change: stats?.userGrowth ?? 0 },
    { label: 'Nhà tuyển dụng', value: stats?.totalEmployers ?? 0, badge: `${stats?.activeJobs ?? 0} tin` },
    { label: 'Tin tuyển dụng', value: stats?.totalJobs ?? 0, change: stats?.jobGrowth ?? 0 },
    { label: 'Doanh thu tháng', value: formatFullCurrency(stats?.monthlyRevenue ?? 0), change: stats?.revenueGrowth ?? 0 },
  ];

  const miniCards = [
    { label: 'Chờ duyệt', value: stats?.pendingApprovals ?? 0, icon: <AccessTimeOutlinedIcon sx={{ fontSize: 22, color: '#f97316' }} />, color: '#fff7ed' },
    { label: 'Mới hôm nay', value: stats?.newToday ?? 0, icon: <GroupAddOutlinedIcon sx={{ fontSize: 22, color: '#6366f1' }} />, color: '#eef2ff' },
    { label: 'Đang hoạt động', value: stats?.activeJobs ?? 0, icon: <BoltOutlinedIcon sx={{ fontSize: 22, color: '#3b82f6' }} />, color: '#eff6ff' },
    { label: 'Ứng tuyển tháng', value: stats?.monthlyApplications ?? 0, icon: <SendOutlinedIcon sx={{ fontSize: 22, color: '#10b981' }} />, color: '#ecfdf5' },
  ];

  const renderSkeleton = () => (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {[0,1,2,3].map(i => <Skeleton key={i} variant="rounded" height={120} sx={{ flex: 1, borderRadius: 3 }} />)}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {[0,1,2,3].map(i => <Skeleton key={i} variant="rounded" height={70} sx={{ flex: 1, borderRadius: 3 }} />)}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 2 }}>
        <Skeleton variant="rounded" height={350} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rounded" height={350} sx={{ borderRadius: 3 }} />
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box><Skeleton width={280} height={36} /><Skeleton width={320} height={22} /></Box>
          <Box sx={{ display: 'flex', gap: 1 }}><Skeleton width={100} height={40} variant="rounded" /><Skeleton width={180} height={40} variant="rounded" /></Box>
        </Box>
        {renderSkeleton()}
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.6rem', color: '#1f2937' }}>
            Xin chào, {user?.fullName || 'Admin'}!
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mt: 0.3 }}>
            Đây là tổng quan hoạt động của hệ thống hôm nay.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            sx={{ borderColor: '#d1d5db', color: '#374151', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' } }}
          >
            Làm mới
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 2, px: 2, py: 1 }}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: '#6b7280' }} />
            <Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>
              {dayjs().format('dddd, DD/MM/YYYY')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 4 Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
        {statCards.map((card, idx) => (
          <Paper key={card.label} elevation={0} sx={{ p: 2.5, borderRadius: 3, background: gradients[idx].bg, color: '#fff', position: 'relative', overflow: 'hidden', minHeight: 110 }}>
            <Box sx={{ position: 'absolute', top: 14, left: 14, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {gradients[idx].icon}
            </Box>
            {card.change !== undefined ? (
              <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 0.3, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 5, px: 1, py: 0.3 }}>
                {card.change >= 0 ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{Math.abs(card.change)}%</Typography>
              </Box>
            ) : card.badge ? (
              <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.25)', borderRadius: 5, px: 1.2, py: 0.4 }}>
                <WorkOutlineOutlinedIcon sx={{ fontSize: 13 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{card.badge}</Typography>
              </Box>
            ) : null}
            <Box sx={{ mt: 6 }}>
              <Typography sx={{ fontSize: '0.78rem', opacity: 0.9, mb: 0.3 }}>{card.label}</Typography>
              <Typography sx={{ fontSize: '1.7rem', fontWeight: 700, lineHeight: 1.1 }}>{card.value}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* 4 Mini Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {miniCards.map((card) => (
          <Paper key={card.label} variant="outlined" sx={{ p: 2, borderRadius: 3, borderColor: '#e5e7eb', display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#fff', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 2 } }}>
            <Box sx={{ bgcolor: card.color, borderRadius: 2, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {card.icon}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 600, color: '#1f2937', lineHeight: 1.2 }}>{card.value}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{card.label}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Chart + Package Distribution */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 360px' }, gap: 2, mb: 3 }}>
        {/* Revenue Chart */}
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb', p: 2.5, bgcolor: '#fff', height: { xs: 350, md: 365 }, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937' }}>Doanh thu 7 ngày qua</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#6b7280' }}>Tổng: {formatFullCurrency(totalRevenue)}</Typography>
            </Box>
            <IconButton size="small"><MoreHorizIcon sx={{ color: '#9ca3af' }} /></IconButton>
          </Box>
          <Box sx={{ width: '100%', flex: 1, minHeight: 0, mt: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
                <RTooltip content={<CustomTooltipChart />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {revenue.map((entry, index) => (
                    <Cell key={index} fill={entry.revenue > 0 ? '#6366f1' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Package Distribution Pie Chart */}
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb', p: 2.5, bgcolor: '#fff', display: 'flex', flexDirection: 'column', height: { xs: 350, md: 365 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937', mb: 0.5 }}>
            Phân bố theo gói dịch vụ
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', mb: 2 }}>
            Tổng quan các gói đăng ký
          </Typography>
          <Box sx={{ width: '100%', flex: 1, minHeight: 0 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={packageStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {packageStats.map((entry, index) => {
                    const colors = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#bbf7d0'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <RTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}
                  wrapperStyle={{ zIndex: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
            {packageStats.map((entry, index) => {
              const colors = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#bbf7d0'];
              return (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors[index % colors.length], flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#4b5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.name}: {entry.value}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>

      {/* Interaction + Job Status */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 360px' }, gap: 2, mb: 3 }}>
        {/* Interaction Line Chart */}
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb', p: 2.5, bgcolor: '#fff', height: { xs: 350, md: 365 }, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937' }}>Tương tác hệ thống</Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#6b7280' }}>Lượt ứng tuyển & Việc làm mới trong tuần</Typography>
            </Box>
            <IconButton size="small"><MoreHorizIcon sx={{ color: '#9ca3af' }} /></IconButton>
          </Box>
          <Box sx={{ width: '100%', flex: 1, minHeight: 0, mt: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interactionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <RTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }}
                  itemStyle={{ fontWeight: 600, fontSize: '0.85rem' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                <Line type="monotone" name="Lượt ứng tuyển" dataKey="applications" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Việc làm mới" dataKey="newJobs" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Job Status Donut Chart */}
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb', p: 2.5, bgcolor: '#fff', display: 'flex', flexDirection: 'column', height: { xs: 350, md: 365 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937', mb: 0.5 }}>
            Trạng thái Tin tuyển dụng
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', mb: 2 }}>
            Tỉ lệ phê duyệt tin đăng
          </Typography>
          <Box sx={{ width: '100%', flex: 1, minHeight: 0, position: 'relative', zIndex: 1 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}
                  wrapperStyle={{ zIndex: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937' }}>{stats?.totalJobs ?? 0}</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>Tổng tin</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5, mt: 2 }}>
            {jobStatusData.map((entry, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#4b5563' }}>{entry.name}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f2937' }}>{entry.value}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Top Employers + Recent Activities */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 360px' }, gap: 2, mb: 3 }}>
        {/* Top Employers */}
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb', bgcolor: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ bgcolor: '#ecfdf3', borderRadius: 2, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BusinessOutlinedIcon sx={{ fontSize: 20, color: '#16a34a' }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1f2937' }}>Top nhà tuyển dụng</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>Hoạt động tích cực nhất tháng này</Typography>
              </Box>
            </Box>
          </Box>
  
          <TableContainer sx={{ flex: 1 }}>
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#6b7280', borderBottom: '1px solid #f3f4f6', py: 1, bgcolor: '#fafafa', letterSpacing: '0.03em' }}>Công ty</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#6b7280', borderBottom: '1px solid #f3f4f6', py: 1, bgcolor: '#fafafa', letterSpacing: '0.03em' }}>Email liên hệ</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#6b7280', borderBottom: '1px solid #f3f4f6', py: 1, bgcolor: '#fafafa', letterSpacing: '0.03em' }}>Tin đăng</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.7rem', color: '#6b7280', borderBottom: '1px solid #f3f4f6', py: 1, bgcolor: '#fafafa', letterSpacing: '0.03em' }}>Lượt xem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: '#9ca3af' }}>
                      Chưa có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedEmployers.map((emp, idx) => {
                    const rank = (topEmployerPage - 1) * topEmployerPageSize + idx + 1;
                    const isTop = rank === 1;
                    return (
                      <TableRow key={idx} hover sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                        <TableCell sx={{ py: 1.1, borderBottom: '1px solid #f3f4f6' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <Avatar src={emp.companyLogo || ''} sx={{ width: 30, height: 30, bgcolor: isTop ? '#16a34a' : '#e5e7eb', fontSize: '0.75rem', fontWeight: 700, color: isTop ? '#fff' : '#374151' }}>
                              {emp.companyName?.[0]?.toUpperCase() || '?'}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1f2937' }}>{emp.companyName}</Typography>
                              <Typography sx={{ fontSize: '0.68rem', color: '#9ca3af' }}>#{rank} trong tháng</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.1, borderBottom: '1px solid #f3f4f6' }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#4b5563' }}>
                            {emp.email || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.1, borderBottom: '1px solid #f3f4f6', fontWeight: 600, fontSize: '0.78rem', color: '#1f2937' }}>
                          {emp.jobCount ?? 0}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.1, borderBottom: '1px solid #f3f4f6', fontSize: '0.78rem', color: '#6b7280' }}>
                          {emp.viewCount ?? 0}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {employers.length > topEmployerPageSize && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, borderTop: '1px solid #f3f4f6' }}>
              <Pagination
                count={totalEmployerPages}
                page={topEmployerPage}
                onChange={(_, page) => setTopEmployerPage(page)}
                size="small"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': { fontSize: '0.7rem', minWidth: 28, height: 28, color: '#16a34a' },
                  '& .MuiPaginationItem-root:hover': { bgcolor: '#dcfce7' },
                  '& .MuiPaginationItem-root.Mui-selected': { bgcolor: '#16a34a', color: '#fff' },
                  '& .MuiPaginationItem-root.Mui-selected:hover': { bgcolor: '#15803d' }
                }}
              />
            </Box>
          )}
        </Paper>

        {/* Recent Activities */}
        <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: '#e5e7eb', bgcolor: '#fff', display: 'flex', flexDirection: 'column', height: { xs: 350, md: 365 }, maxHeight: 365 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.2, pb: 1.2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: 2.5, bgcolor: '#ecfdf3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NotificationsNoneOutlinedIcon sx={{ fontSize: 18, color: '#16a34a' }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1f2937' }}>Hoạt động</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>Cập nhật gần đây</Typography>
              </Box>
            </Box>
            <IconButton size="small"><KeyboardArrowUpIcon sx={{ color: '#9ca3af' }} /></IconButton>
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto', px: 2.2, pb: 1.8, display: 'flex', flexDirection: 'column', gap: 1.4, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#e5e7eb', borderRadius: '4px' } }}>
            {activities.length === 0 ? (
              <Typography sx={{ textAlign: 'center', color: '#9ca3af', py: 4, fontSize: '0.8rem' }}>Chưa có hoạt động nào</Typography>
            ) : (
              activities.slice(0, 10).map((act, idx) => {
                const meta = activityMeta[act.type] || { bg: '#e5e7eb', color: '#6b7280', icon: <NotificationsNoneOutlinedIcon sx={{ fontSize: 16 }} /> };
                return (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, py: 0.6 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {meta.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1f2937' }}>
                        {activityLabels[act.type] || act.type}
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formatActivityDetail(act)}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.68rem', color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {getTimeAgo(act.createdAt)}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Box>
        </Paper>
      </Box>

    </Box>
  );
}
