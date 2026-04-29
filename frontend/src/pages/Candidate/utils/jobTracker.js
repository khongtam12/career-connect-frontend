const STORAGE_KEYS = {
  saved: 'candidate_saved_jobs',
  applied: 'candidate_applied_jobs',
};

const readList = (key) => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to read job tracker', error);
    return [];
  }
};

const writeList = (key, list) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(list));
};

const notifyUpdate = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('jobTrackerUpdated'));
};

const normalizeJob = (job) => {
  if (!job) return null;
  const id = job.jobId || job.id;
  if (!id) return null;
  return {
    id: String(id),
    title: job.title || job.jobTitle || 'Vi tri tuyen dung',
    companyName:
      job.companyName ||
      job.company ||
      job.companyId ||
      job.company?.name ||
      'Doanh nghiep',
    companyLogoUrl:
      job.companyLogoUrl ||
      job.companyLogo ||
      job.logoUrl ||
      job.company?.logoUrl ||
      '',
    location: job.location || job.city || '',
    jobType: job.jobType || job.type || job.workForm || '',
    salaryMin: job.salaryMin ?? null,
    salaryMax: job.salaryMax ?? null,
    salaryLabel: job.salary || job.salaryLabel || '',
  };
};

export const getSavedJobs = () => readList(STORAGE_KEYS.saved);

export const getAppliedJobs = () => readList(STORAGE_KEYS.applied);

export const isJobSaved = (jobId) => {
  if (!jobId) return false;
  const list = readList(STORAGE_KEYS.saved);
  return list.some((item) => item.id === String(jobId));
};

export const toggleSavedJob = (job) => {
  const normalized = normalizeJob(job);
  if (!normalized) return false;
  const list = readList(STORAGE_KEYS.saved);
  const index = list.findIndex((item) => item.id === normalized.id);
  let nextSaved = false;

  if (index >= 0) {
    list.splice(index, 1);
    nextSaved = false;
  } else {
    list.unshift({
      ...normalized,
      savedAt: new Date().toISOString(),
    });
    nextSaved = true;
  }

  writeList(STORAGE_KEYS.saved, list);
  notifyUpdate();
  return nextSaved;
};

export const addAppliedJob = (job) => {
  const normalized = normalizeJob(job);
  if (!normalized) return null;
  const list = readList(STORAGE_KEYS.applied);
  const now = new Date().toISOString();
  const existingIndex = list.findIndex((item) => item.id === normalized.id);

  if (existingIndex >= 0) {
    list[existingIndex] = {
      ...list[existingIndex],
      ...normalized,
      appliedAt: now,
      status: list[existingIndex].status || 'APPLIED',
    };
  } else {
    list.unshift({
      ...normalized,
      appliedAt: now,
      status: 'APPLIED',
    });
  }

  writeList(STORAGE_KEYS.applied, list);
  notifyUpdate();
  return normalized.id;
};
