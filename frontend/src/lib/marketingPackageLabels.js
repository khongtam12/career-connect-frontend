const normalizeType = (value) => (value || '').trim().toUpperCase();

export const MARKETING_PACKAGE_BADGES = {
  TRENDING_POST: {
    label: 'GẤP',
    chipSx: {
      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      color: '#fff',
      fontWeight: 700,
      fontSize: '0.65rem',
      height: 20,
      flexShrink: 0,
      '& .MuiChip-label': { px: 0.75 },
    },
    tailwindClass: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-md',
    borderColor: '#f59e0b',
  },
  URGENT_JOB_POST: {
    label: 'NHANH',
    chipSx: {
      background: 'linear-gradient(135deg, #ea580c, #fb923c)',
      color: '#fff',
      fontWeight: 700,
      fontSize: '0.65rem',
      height: 20,
      flexShrink: 0,
      '& .MuiChip-label': { px: 0.75 },
    },
    tailwindClass: 'bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow-md',
    borderColor: '#ea580c',
  },
  INDUSTRY_PRIORITY: {
    label: 'ƯU TIÊN NGÀNH',
    chipSx: {
      background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
      color: '#fff',
      fontWeight: 700,
      fontSize: '0.65rem',
      height: 20,
      flexShrink: 0,
      '& .MuiChip-label': { px: 0.75 },
    },
    tailwindClass: 'bg-gradient-to-r from-blue-600 to-sky-400 text-white shadow-md',
    borderColor: '#2563eb',
  },
};

export const getMarketingPackageBadge = (type) => MARKETING_PACKAGE_BADGES[normalizeType(type)] || null;

export const getMarketingPackageBadgeLabel = (type) => getMarketingPackageBadge(type)?.label || '';
