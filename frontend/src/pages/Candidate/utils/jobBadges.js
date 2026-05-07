const URGENT_LABEL_TOKENS = ['tuyen gap', 'trending', 'noi bat'];
const IMMEDIATE_LABEL_TOKENS = ['tuyen nhanh', 'urgent', 'di lam ngay'];
const HOT_LABEL_TOKENS = ['hot', 'tuyen gap', 'trending', 'noi bat'];

const normalizeText = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase();

const labelContains = (label, tokens) => {
  const normalized = normalizeText(label);
  if (!normalized) return false;
  return tokens.some((token) => normalized.includes(token));
};

export const isUrgentJob = (job) => labelContains(job?.packageLabel, URGENT_LABEL_TOKENS);

export const isImmediateJob = (job) => labelContains(job?.packageLabel, IMMEDIATE_LABEL_TOKENS);

export const isHotJob = (job) => Boolean(job?.isTop) || labelContains(job?.packageLabel, HOT_LABEL_TOKENS);
