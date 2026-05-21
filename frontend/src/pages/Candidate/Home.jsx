import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import BestJobsSection from './components/BestJobsSection';
import QuickJobsSection from './components/QuickJobsSection';
import StatisticsSection from './components/StatisticsSection';
import CTASection from './components/CTASection';
import HowItWorks from './components/HowItWorks';
import { getJobFilters, getJobStats, searchJobs } from '../../service/jobService';
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

export default function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    jobTypes: [],
    statuses: [],
    locations: [],
    industries: [],
  });
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
      const response = await searchJobs({
        ...targetFilters,
        experienceMin: targetFilters.experienceMin ? Number(targetFilters.experienceMin) : undefined,
        experienceMax: targetFilters.experienceMax ? Number(targetFilters.experienceMax) : undefined,
        salaryMin: targetFilters.salaryMin ? Number(targetFilters.salaryMin) * 1000000 : undefined,
        salaryMax: targetFilters.salaryMax ? Number(targetFilters.salaryMax) * 1000000 : undefined,
        page: nextPage,
        size: 8,
      });
      setJobs(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
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
        const response = await searchJobs({
          page: 0,
          size: 6,
          sortBy: 'createdAt',
          sortDir: 'desc',
          marketingPackageType,
        });
        setJobsState(response.content || []);
        setTotalState(response.totalElements || 0);
      } catch (error) {
        console.error('Failed to load quick job section', error);
      } finally {
        setLoadingState(false);
      }
    };

    const loadInit = async () => {
      try {
        const [options, statsResponse] = await Promise.all([
          getJobFilters(),
          getJobStats(),
        ]);
        setFilterOptions({
          jobTypes: options.jobTypes || [],
          statuses: options.statuses || [],
          locations: options.locations || [],
          industries: options.industries || [],
        });
        setStats(statsResponse || null);
      } catch (error) {
        console.error('Failed to load job filters or stats', error);
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

  return (
    <div className="bg-white">
      {/* Hero Section with Search */}
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
      />

      <QuickJobsSection
        title="Việc làm tuyển gấp"
        subtitle="Cơ hội nổi bật cần tuyển ngay"
        icon={<Flame size={18} className="text-orange-500" />}
        jobs={urgentJobsDisplay}
        total={urgentTotal}
        locations={filterOptions.locations}
        locationFilter={urgentLocation}
        onLocationChange={setUrgentLocation}
        onViewAll={() => navigate(urgentLocation ? `/jobs?marketingPackageType=TRENDING_POST&location=${encodeURIComponent(urgentLocation)}` : '/jobs?marketingPackageType=TRENDING_POST')}
        backgroundClassName="bg-slate-50"
        accentClassName="text-rose-600"
        emptyText="Chưa tìm thấy việc làm tuyển gấp"
        loading={urgentLoading}
      />

      <QuickJobsSection
        title="Việc đi làm ngay"
        subtitle="Nhanh tay ứng tuyển trong hôm nay"
        icon={<Zap size={18} className="text-orange-500" />}
        jobs={immediateJobsDisplay}
        total={immediateTotal}
        locations={filterOptions.locations}
        locationFilter={immediateLocation}
        onLocationChange={setImmediateLocation}
        onViewAll={() => navigate(immediateLocation ? `/jobs?marketingPackageType=URGENT_JOB_POST&location=${encodeURIComponent(immediateLocation)}` : '/jobs?marketingPackageType=URGENT_JOB_POST')}
        backgroundClassName="bg-orange-50/70"
        accentClassName="text-orange-600"
        emptyText="Chưa tìm thấy việc đi làm ngay"
        loading={immediateLoading}
      />

      {/* How It Works */}
      <HowItWorks />

      {/* Statistics & Insights */}
      <StatisticsSection stats={stats} />

      {/* Call to Action */}
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
