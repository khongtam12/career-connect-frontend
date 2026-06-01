import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import BestJobsSection from './components/BestJobsSection';
import QuickJobsSection from './components/QuickJobsSection';
import StatisticsSection from './components/StatisticsSection';
import CTASection from './components/CTASection';
import HowItWorks from './components/HowItWorks';
import FeaturedCompaniesSection from './components/FeaturedCompaniesSection';
import { getJobFilters, getJobStats, searchJobs } from '../../service/jobService';
import { getCompanyDetail, getFeaturedCompanyIds } from '../../service/companyService';
import { isServiceUnavailableError } from '../../service/apiClient';
import { categoriesData } from '../../data/categoriesData';
import { getAppliedJobs, getSavedJobs } from './utils/jobTracker';
import {
  getCompanyKey,
  isBrandingJob,
  mapFeaturedCompanyFromDetail,
  mapFeaturedCompaniesFromJobs,
} from './utils/featuredCompanies';
import useProvinces from '../../hooks/useProvinces';
import { formatProvinceLabel } from '../../lib/utils';
import { Flame, Zap } from 'lucide-react';

const normalizeIndustryLabel = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 /-]+/g, '')
    .trim();

const initialFilters = {
  keyword: '',
  location: '',
  industryId: '',
  fieldId: '',
  jobType: '',
  marketingPackageCategory: '',
  marketingPackageType: '',
  experienceMin: '',
  experienceMax: '',
  salaryMin: '',
  salaryMax: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
};

const initialFilterOptions = {
  jobTypes: [],
  statuses: [],
  locations: [],
  industries: [],
};

export default function Home() {
  const navigate = useNavigate();
  const { provinces } = useProvinces(true);
  const [filters, setFilters] = useState(initialFilters);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);
  const [totalElements, setTotalElements] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [urgentJobs, setUrgentJobs] = useState([]);
  const [immediateJobs, setImmediateJobs] = useState([]);
  const [urgentTotal, setUrgentTotal] = useState(0);
  const [immediateTotal, setImmediateTotal] = useState(0);
  const [urgentLoading, setUrgentLoading] = useState(false);
  const [immediateLoading, setImmediateLoading] = useState(false);
  const [urgentHasPackageMatch, setUrgentHasPackageMatch] = useState(false);
  const [immediateHasPackageMatch, setImmediateHasPackageMatch] = useState(false);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [featuredCompaniesTotal, setFeaturedCompaniesTotal] = useState(0);
  const [featuredCompaniesLoading, setFeaturedCompaniesLoading] = useState(false);
  const [urgentLocation, setUrgentLocation] = useState('');
  const [immediateLocation, setImmediateLocation] = useState('');
  const [jobServiceUnavailable, setJobServiceUnavailable] = useState(false);

  const provinceLocations = useMemo(
    () => provinces.map((province) => province.name).filter(Boolean),
    [provinces]
  );

  const displayFilterOptions = useMemo(() => ({
    ...filterOptions,
    locations: provinceLocations.length > 0 ? provinceLocations : filterOptions.locations,
  }), [filterOptions, provinceLocations]);

  const mappedCategories = useMemo(() => {
    const industryByLabel = new Map(
      filterOptions.industries.map((item) => [normalizeIndustryLabel(item.name), item])
    );

    return categoriesData.map((category) => {
      const matchedIndustry =
        industryByLabel.get(normalizeIndustryLabel(category.title)) ||
        industryByLabel.get(normalizeIndustryLabel(category.industryId));
      const industryId = category.backendIndustryId || matchedIndustry?.industryId || null;

      return {
        ...category,
        id: industryId,
        industryId,
        searchKeyword: category.title,
      };
    });
  }, [filterOptions.industries]);

  const applyFilters = useCallback(async (nextPage = 0, overrideFilters) => {
    const targetFilters = overrideFilters || initialFilters;
    try {
      const response = await searchJobs(
        {
          ...targetFilters,
          experienceMin: targetFilters.experienceMin ? Number(targetFilters.experienceMin) : undefined,
          experienceMax: targetFilters.experienceMax ? Number(targetFilters.experienceMax) : undefined,
          salaryMin: targetFilters.salaryMin ? Number(targetFilters.salaryMin) * 1000000 : undefined,
          salaryMax: targetFilters.salaryMax ? Number(targetFilters.salaryMax) * 1000000 : undefined,
          page: nextPage,
          size: 8,
        },
        { quietOn503: true }
      );

      setJobServiceUnavailable(false);
      setJobs(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      if (isServiceUnavailableError(error)) {
        setJobServiceUnavailable(true);
        setJobs([]);
        setTotalElements(0);
        return;
      }

      console.error('Failed to fetch jobs', error);
    }
  }, []);

  const handleFilterChange = (next) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const handleQuickFilter = (next) => {
    const nextFilters = { ...filters, ...next };
    setFilters(nextFilters);
    applyFilters(0, nextFilters);
  };

  const handleSearch = () => {
    applyFilters(0, filters);
  };

  const handleCategorySelect = (category) => {
    const params = new URLSearchParams();
    const industryId = category?.backendIndustryId || category?.industryId || category?.id;

    if (industryId) {
      params.set('industryId', industryId);
    } else if (category?.searchKeyword || category?.title || category?.name) {
      params.set('keyword', category.searchKeyword || category.title || category.name);
    } else {
      return;
    }

    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickTag = (keyword) => {
    const params = new URLSearchParams();
    params.set('marketingPackageType', keyword);
    navigate(`/jobs?${params.toString()}`);
  };

  const urgentJobsDisplay = useMemo(
    () => filterByLocation(urgentJobs, urgentLocation).slice(0, 6),
    [urgentJobs, urgentLocation]
  );

  const immediateJobsDisplay = useMemo(
    () => filterByLocation(immediateJobs, immediateLocation).slice(0, 6),
    [immediateJobs, immediateLocation]
  );

  useEffect(() => {
    const loadQuickJobs = async (
      marketingPackageType,
      setJobsState,
      setTotalState,
      setLoadingState,
      setHasPackageMatchState
    ) => {
      setLoadingState(true);
      try {
        const packageResponse = await searchJobs(
          {
            page: 0,
            size: 6,
            sortBy: 'createdAt',
            sortDir: 'desc',
            marketingPackageType,
          },
          { quietOn503: true }
        );

        setJobServiceUnavailable(false);

        const packageJobs = packageResponse.content || [];
        const packageMatched = packageJobs.length > 0;

        if (packageMatched) {
          setJobsState(packageJobs);
          setTotalState(packageResponse.totalElements || 0);
          setHasPackageMatchState(true);
          return;
        }

        const fallbackResponse = await searchJobs(
          {
            page: 0,
            size: 6,
            sortBy: 'createdAt',
            sortDir: 'desc',
          },
          { quietOn503: true }
        );

        setJobsState(fallbackResponse.content || []);
        setTotalState(fallbackResponse.totalElements || 0);
        setHasPackageMatchState(false);
      } catch (error) {
        if (isServiceUnavailableError(error)) {
          setJobServiceUnavailable(true);
          setJobsState([]);
          setTotalState(0);
          setHasPackageMatchState(false);
          return;
        }

        console.error('Failed to load quick job section', error);
      } finally {
        setLoadingState(false);
      }
    };

    const loadFeaturedCompanies = async () => {
      setFeaturedCompaniesLoading(true);
      try {
        const [jobsResponse, featuredIds] = await Promise.all([
          searchJobs({ page: 0, size: 120, sortBy: 'createdAt', sortDir: 'desc' }, { quietOn503: true }),
          getFeaturedCompanyIds().catch(() => []),
        ]);

        setJobServiceUnavailable(false);
        const baseJobs = jobsResponse.content || [];
        const companies = mapFeaturedCompaniesFromJobs(baseJobs);
        const companyMap = new Map(
          companies.map((company) => [company.key || company.companyId, company])
        );

        const featuredSet = new Set(featuredIds || []);
        const brandedByJobKeys = new Set(
          baseJobs.filter(isBrandingJob).map(getCompanyKey).filter(Boolean)
        );

        const missingFeaturedIds = Array.from(featuredSet).filter((companyId) => !companyMap.has(companyId));

        if (missingFeaturedIds.length > 0) {
          const detailResults = await Promise.allSettled(
            missingFeaturedIds.map((companyId) => getCompanyDetail(companyId))
          );

          detailResults.forEach((result, index) => {
            if (result.status !== 'fulfilled' || !result.value) return;
            const company = mapFeaturedCompanyFromDetail(result.value);
            if (!company.key) return;
            companyMap.set(missingFeaturedIds[index], company);
          });
        }

        const featured = Array.from(companyMap.values()).filter((company) => {
          const key = company.key || company.companyId;
          return featuredSet.has(key) || brandedByJobKeys.has(key);
        });

        setFeaturedCompanies(featured.slice(0, 6));
        setFeaturedCompaniesTotal(featured.length);
      } catch (error) {
        if (isServiceUnavailableError(error)) {
          setJobServiceUnavailable(true);
          setFeaturedCompanies([]);
          setFeaturedCompaniesTotal(0);
          return;
        }
        console.error('Failed to load featured companies', error);
      } finally {
        setFeaturedCompaniesLoading(false);
      }
    };

    const loadInit = async () => {
      const [optionsResult, statsResult] = await Promise.allSettled([
        getJobFilters({ quietOn503: true }),
        getJobStats({ quietOn503: true }),
      ]);

      const optionsLoaded = optionsResult.status === 'fulfilled';
      const statsLoaded = statsResult.status === 'fulfilled';

      if (optionsLoaded) {
        const options = optionsResult.value;
        setFilterOptions({
          jobTypes: options.jobTypes || [],
          statuses: options.statuses || [],
          locations: options.locations || [],
          industries: options.industries || [],
        });
      } else {
        setFilterOptions(initialFilterOptions);
      }

      if (statsLoaded) {
        setStats(statsResult.value || null);
      } else {
        setStats(null);
      }

      const unavailable =
        (optionsResult.status === 'rejected' && isServiceUnavailableError(optionsResult.reason)) ||
        (statsResult.status === 'rejected' && isServiceUnavailableError(statsResult.reason));

      if (unavailable) {
        setJobServiceUnavailable(true);
        return;
      }

      if (optionsResult.status === 'rejected') {
        console.error('Failed to load job filters', optionsResult.reason);
      }

      if (statsResult.status === 'rejected') {
        console.error('Failed to load job stats', statsResult.reason);
      }
    };

    loadInit();
    applyFilters(0, initialFilters);
    loadQuickJobs(
      'TRENDING_POST',
      setUrgentJobs,
      setUrgentTotal,
      setUrgentLoading,
      setUrgentHasPackageMatch
    );
    loadQuickJobs(
      'URGENT_JOB_POST',
      setImmediateJobs,
      setImmediateTotal,
      setImmediateLoading,
      setImmediateHasPackageMatch
    );
    loadFeaturedCompanies();
  }, [applyFilters]);

  useEffect(() => {
    const syncManagedJobs = () => {
      setSavedJobs(getSavedJobs());
      setAppliedJobs(getAppliedJobs());
    };

    syncManagedJobs();
    window.addEventListener('jobTrackerUpdated', syncManagedJobs);
    return () => window.removeEventListener('jobTrackerUpdated', syncManagedJobs);
  }, []);

  const jobUnavailableText = 'Job service đang tạm gián đoạn. Vui lòng thử lại sau.';

  return (
    <div className="bg-white">
      <HeroSection
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        onQuickTag={handleQuickTag}
        categories={mappedCategories}
        locations={displayFilterOptions.locations}
      />

      <BestJobsSection
        jobs={jobs}
        total={totalElements}
        filters={filters}
        filterOptions={displayFilterOptions}
        onQuickFilter={handleQuickFilter}
        onViewAll={() => navigate('/jobs')}
        savedJobs={savedJobs}
        appliedJobs={appliedJobs}
        emptyText={jobServiceUnavailable ? jobUnavailableText : 'Chưa tìm thấy việc làm phù hợp'}
      />

      <QuickJobsSection
        title="Việc làm tuyển gấp"
        subtitle="Cơ hội nổi bật cần tuyển ngay"
        icon={<Flame size={18} className="text-orange-500" />}
        jobs={urgentJobsDisplay}
        total={urgentTotal}
        locations={displayFilterOptions.locations}
        locationFilter={urgentLocation}
        onLocationChange={setUrgentLocation}
        onViewAll={() =>
          navigate(
            urgentHasPackageMatch
              ? urgentLocation
              ? `/jobs?marketingPackageType=TRENDING_POST&location=${encodeURIComponent(urgentLocation)}`
              : '/jobs?marketingPackageType=TRENDING_POST'
              : urgentLocation
              ? `/jobs?location=${encodeURIComponent(urgentLocation)}`
              : '/jobs'
          )
        }
        backgroundClassName="bg-slate-50"
        accentClassName="text-rose-600"
        emptyText={jobServiceUnavailable ? jobUnavailableText : 'Chưa tìm thấy việc làm tuyển gấp'}
        loading={urgentLoading}
      />

      <QuickJobsSection
        title="Việc đi làm ngay"
        subtitle="Nhanh tay ứng tuyển trong hôm nay"
        icon={<Zap size={18} className="text-orange-500" />}
        jobs={immediateJobsDisplay}
        total={immediateTotal}
        locations={displayFilterOptions.locations}
        locationFilter={immediateLocation}
        onLocationChange={setImmediateLocation}
        onViewAll={() =>
          navigate(
            immediateHasPackageMatch
              ? immediateLocation
              ? `/jobs?marketingPackageType=URGENT_JOB_POST&location=${encodeURIComponent(immediateLocation)}`
              : '/jobs?marketingPackageType=URGENT_JOB_POST'
              : immediateLocation
              ? `/jobs?location=${encodeURIComponent(immediateLocation)}`
              : '/jobs'
          )
        }
        backgroundClassName="bg-orange-50/70"
        accentClassName="text-orange-600"
        emptyText={jobServiceUnavailable ? jobUnavailableText : 'Chưa tìm thấy việc đi làm ngay'}
        loading={immediateLoading}
      />

      <FeaturedCompaniesSection
        companies={featuredCompanies}
        total={featuredCompaniesTotal}
        loading={featuredCompaniesLoading}
        onViewAll={() => navigate('/featured-companies')}
        emptyText={jobServiceUnavailable ? jobUnavailableText : 'Chưa tìm thấy công ty nổi bật'}
      />

      <HowItWorks />

      <StatisticsSection stats={stats} unavailable={jobServiceUnavailable} />

      <CTASection />
    </div>
  );
}

const normalizeText = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase();

const filterByLocation = (items, location) => {
  if (!location) return items;
  const target = normalizeText(location);
  return items.filter((job) => normalizeText(formatProvinceLabel(job?.location)).includes(target));
};
