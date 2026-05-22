const FALLBACK_COMPANY_LOGO =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10';

const normalizeText = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .trim();

export const getCompanyKey = (job = {}) => {
  const companyId =
    job.companyId ||
    job.company?.companyId ||
    job.company?.id ||
    job.company?.company_id ||
    '';

  if (companyId) {
    return companyId;
  }

  const companyName = job.companyName || job.company?.name || job.company || '';
  return normalizeText(companyName);
};

export const getCompanyIdentity = (job = {}) => {
  const companyId = getCompanyKey(job);

  const name =
    job.companyName ||
    job.company?.name ||
    job.company ||
    'Doanh nghiệp';

  const logo =
    job.companyLogoUrl ||
    job.logo ||
    job.logoUrl ||
    job.company?.logo ||
    job.company?.logoUrl ||
    FALLBACK_COMPANY_LOGO;

  const location = job.location || job.company?.address || '';
  const website = job.company?.website || '';

  return { companyId, name, logo, location, website };
};

export const mapFeaturedCompaniesFromJobs = (jobs = []) => {
  const grouped = new Map();

  jobs.forEach((job) => {
    const company = getCompanyIdentity(job);
    const groupKey = company.companyId || normalizeText(company.name);
    if (!groupKey) return;

    const createdAt = job.createdAt || job.updatedAt || null;
    const current = grouped.get(groupKey);

    if (!current) {
      grouped.set(groupKey, {
        key: groupKey,
        companyId: company.companyId,
        name: company.name,
        logo: company.logo,
        location: company.location,
        website: company.website,
        jobCount: 1,
        latestPostedAt: createdAt,
      });
      return;
    }

    current.jobCount += 1;

    if (!current.logo && company.logo) current.logo = company.logo;
    if (!current.location && company.location) current.location = company.location;
    if (!current.website && company.website) current.website = company.website;

    if (
      createdAt &&
      (!current.latestPostedAt || new Date(createdAt).getTime() > new Date(current.latestPostedAt).getTime())
    ) {
      current.latestPostedAt = createdAt;
    }
  });

  return Array.from(grouped.values()).sort((a, b) => {
    if (b.jobCount !== a.jobCount) return b.jobCount - a.jobCount;
    return new Date(b.latestPostedAt || 0).getTime() - new Date(a.latestPostedAt || 0).getTime();
  });
};

export const isBrandingJob = (job = {}) => {
  const category = String(job?.marketingPackageCategory || '').toUpperCase();
  const type = String(job?.marketingPackageType || '').toUpperCase();

  return category === 'BRANDING' || type === 'BRANDING_LOGO';
};

export const isBrandingEntitlementActive = (entitlement) => {
  if (!entitlement) return false;

  const status = String(entitlement.status || '').toUpperCase();
  if (status !== 'ACTIVE') return false;

  if (!entitlement.endDate) return true;
  const endTime = new Date(entitlement.endDate).getTime();
  if (Number.isNaN(endTime)) return true;
  return endTime >= Date.now();
};

export const filterFeaturedCompaniesByBranding = (
  companies = [],
  brandingMap = new Map(),
  brandedKeys = new Set()
) =>
  companies.filter((company) => {
    const companyKey = company.key || company.companyId;
    if (!companyKey) return false;
    return brandingMap.get(companyKey) === true || brandedKeys.has(companyKey);
  });
