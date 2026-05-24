const URGENT_LABEL_TOKENS = ['urgent job', 'tuyen gap', 'trending', 'noi bat', 'premium'];
const IMMEDIATE_LABEL_TOKENS = ['urgent job', 'tuyen nhanh', 'urgent', 'di lam ngay', 'standard'];
const HOT_LABEL_TOKENS = ['hot', 'tuyen gap', 'trending', 'noi bat', 'premium', 'urgent job'];

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase();

const normalizeMarketing = (value) => normalizeText(value).toUpperCase();

const getMarketingType = (job) => normalizeMarketing(job?.marketingPackageType || job?.marketingPackageLabel || '');
const getMarketingCategory = (job) => normalizeMarketing(job?.marketingPackageCategory || job?.marketingPackageLabel || '');

export const isHighlightJob = (job) => {
  const category = getMarketingCategory(job);
  return category === 'HIGHLIGHT' || Boolean(job?.top);
};

export const isFrameJob = (job) => {
  const type = getMarketingType(job);
  return type === 'EFFECT_FRAME' || (job?.marketingPackageLabel || '').toString().toLowerCase().includes('frame');
};

export const isBoldJob = (job) => {
  const type = getMarketingType(job);
  return type === 'EFFECT_BOLD' || (job?.marketingPackageLabel || '').toString().toLowerCase().includes('đậm') || (job?.marketingPackageLabel || '').toString().toLowerCase().includes('bold');
};

const labelContains = (label, tokens) => {
  const normalized = normalizeText(label);
  if (!normalized) return false;
  return tokens.some((token) => normalized.includes(token));
};

export const isUrgentJob = (job) => {
  const type = getMarketingType(job);
  return type === 'TRENDING_POST';
};

export const isImmediateJob = (job) => {
  // Immediate jobs: recently created or has high views
  const isRecent = job?.createdAt && 
    (new Date() - new Date(job.createdAt)) < (7 * 24 * 60 * 60 * 1000); // within 7 days
  const hasHighViews = job?.views > 50;
  return (isRecent || hasHighViews) && !isHighlightJob(job);
};

export const isHotJob = (job) => {
  const type = getMarketingType(job);
  const label = (job?.marketingPackageLabel || '').toString().toLowerCase();
  return type === 'EFFECT_HOT' || label.includes('hot') || label.includes('🔥');
};
