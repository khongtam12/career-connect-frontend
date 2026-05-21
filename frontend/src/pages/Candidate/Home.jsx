import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import BestJobsSection from './components/BestJobsSection';
import QuickJobsSection from './components/QuickJobsSection';
import StatisticsSection from './components/StatisticsSection';
import CTASection from './components/CTASection';
import HowItWorks from './components/HowItWorks';
import { getJobFilters, getJobStats, searchJobs } from '../../service/jobService';
import { isServiceUnavailableError } from '../../service/apiClient';
import { categoriesData } from '../../data/categoriesData';
import { getAppliedJobs, getSavedJobs } from './utils/jobTracker';
import { Flame, Zap } from 'lucide-react';

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
  const [urgentLocation, setUrgentLocation] = useState('');
  const [immediateLocation, setImmediateLocation] = useState('');
  const [jobServiceUnavailable, setJobServiceUnavailable] = useState(false);

  const mappedCategories = useMemo(() => {
    if (filterOptions.industries.length === 0) {
      return categoriesData;
    }
    return filterOptions.industries.map((item, index) => ({
      id: item.industryId,
      title: item.name,
      jobCount: '',
      icon: categoriesData[index % categoriesData.length]?.icon || '💼',
    }));
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
    if (!category?.id) return;
    const params = new URLSearchParams();
    params.set('industryId', category.id);
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
    const loadQuickJobs = async (marketingPackageType, setJobsState, setTotalState, setLoadingState) => {
      setLoadingState(true);
      try {
        const response = await searchJobs(
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
        setJobsState(response.content || []);
        setTotalState(response.totalElements || 0);
      } catch (error) {
        if (isServiceUnavailableError(error)) {
          setJobServiceUnavailable(true);
          setJobsState([]);
          setTotalState(0);
          return;
        }

        console.error('Failed to load quick job section', error);
      } finally {
        setLoadingState(false);
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
    loadQuickJobs('TRENDING_POST', setUrgentJobs, setUrgentTotal, setUrgentLoading);
    loadQuickJobs('URGENT_JOB_POST', setImmediateJobs, setImmediateTotal, setImmediateLoading);
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

  const jobUnavailableText = 'Job service dang tam gian doan. Vui long thu lai sau.';

  return (
    <div className="bg-white">
      <HeroSection
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        onQuickTag={handleQuickTag}
        categories={mappedCategories}
        locations={filterOptions.locations}
      />

      <BestJobsSection
        jobs={jobs}
        total={totalElements}
        filters={filters}
        filterOptions={filterOptions}
        onQuickFilter={handleQuickFilter}
        onViewAll={() => navigate('/jobs')}
        savedJobs={savedJobs}
        appliedJobs={appliedJobs}
        emptyText={jobServiceUnavailable ? jobUnavailableText : 'Chua tim thay viec lam phu hop'}
      />

      <QuickJobsSection
        title="Viec lam tuyen gap"
        subtitle="Co hoi noi bat can tuyen ngay"
        icon={<Flame size={18} className="text-orange-500" />}
        jobs={urgentJobsDisplay}
        total={urgentTotal}
        locations={filterOptions.locations}
        locationFilter={urgentLocation}
        onLocationChange={setUrgentLocation}
        onViewAll={() =>
          navigate(
            urgentLocation
              ? `/jobs?marketingPackageType=TRENDING_POST&location=${encodeURIComponent(urgentLocation)}`
              : '/jobs?marketingPackageType=TRENDING_POST'
          )
        }
        backgroundClassName="bg-slate-50"
        accentClassName="text-rose-600"
        emptyText={jobServiceUnavailable ? jobUnavailableText : 'Chua tim thay viec lam tuyen gap'}
        loading={urgentLoading}
      />

      <QuickJobsSection
        title="Viec di lam ngay"
        subtitle="Nhanh tay ung tuyen trong hom nay"
        icon={<Zap size={18} className="text-orange-500" />}
        jobs={immediateJobsDisplay}
        total={immediateTotal}
        locations={filterOptions.locations}
        locationFilter={immediateLocation}
        onLocationChange={setImmediateLocation}
        onViewAll={() =>
          navigate(
            immediateLocation
              ? `/jobs?marketingPackageType=URGENT_JOB_POST&location=${encodeURIComponent(immediateLocation)}`
              : '/jobs?marketingPackageType=URGENT_JOB_POST'
          )
        }
        backgroundClassName="bg-orange-50/70"
        accentClassName="text-orange-600"
        emptyText={jobServiceUnavailable ? jobUnavailableText : 'Chua tim thay viec di lam ngay'}
        loading={immediateLoading}
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
  return items.filter((job) => normalizeText(job?.location).includes(target));
};
