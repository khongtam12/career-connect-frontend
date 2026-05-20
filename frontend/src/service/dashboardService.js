import apiClient from './apiClient';

// ===== Dashboard Stats =====
export const getDashboardStats = async () => {
  try {
    const res = await apiClient.get('/api/v1/admin/dashboard/stats');
    return res.data?.data || res.data || null;
  } catch {
    return null;
  }
};

// ===== Weekly Revenue =====
export const getWeeklyRevenue = async () => {
  try {
    const res = await apiClient.get('/api/v1/admin/dashboard/weekly-revenue');
    return res.data?.data || res.data || null;
  } catch {
    return null;
  }
};

// ===== Recent Activities =====
export const getRecentActivities = async () => {
  try {
    const res = await apiClient.get('/api/v1/admin/dashboard/recent-activities');
    return res.data?.data || res.data || null;
  } catch {
    return null;
  }
};

// ===== Top Employers =====
export const getTopEmployers = async () => {
  try {
    const res = await apiClient.get('/api/v1/admin/dashboard/top-employers');
    return res.data?.data || res.data || null;
  } catch {
    return null;
  }
};

// ===== Weekly Interactions =====
export const getWeeklyInteractions = async () => {
  try {
    const res = await apiClient.get('/api/v1/admin/dashboard/weekly-interactions');
    return res.data?.data || res.data || null;
  } catch {
    return null;
  }
};

// ===== Aggregated fetch =====
export const fetchAllDashboardData = async () => {
  const [stats, revenue, activities, employers, interactions] = await Promise.all([
    getDashboardStats(),
    getWeeklyRevenue(),
    getRecentActivities(),
    getTopEmployers(),
    getWeeklyInteractions(),
  ]);
  return { stats, revenue, activities, employers, interactions };
};
