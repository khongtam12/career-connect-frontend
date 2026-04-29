import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import BestJobsSection from './components/BestJobsSection';
import StatisticsSection from './components/StatisticsSection';
import CTASection from './components/CTASection';
import HowItWorks from './components/HowItWorks';
import { getJobFilters, getJobStats, searchJobs } from '../../service/jobService';
import { categoriesData } from '../../data/categoriesData';
import { getAppliedJobs, getSavedJobs } from './utils/jobTracker';

export default function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    industryId: '',
    fieldId: '',
    jobType: '',
    experienceMin: '',
    experienceMax: '',
    salaryMin: '',
    salaryMax: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
  });
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    jobTypes: [],
    statuses: [],
    locations: [],
    industries: [],
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

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

  const applyFilters = async (nextPage = 0, overrideFilters = filters) => {
    setLoading(true);
    try {
      const response = await searchJobs({
        ...overrideFilters,
        experienceMin: overrideFilters.experienceMin ? Number(overrideFilters.experienceMin) : undefined,
        experienceMax: overrideFilters.experienceMax ? Number(overrideFilters.experienceMax) : undefined,
        salaryMin: overrideFilters.salaryMin ? Number(overrideFilters.salaryMin) * 1000000 : undefined,
        salaryMax: overrideFilters.salaryMax ? Number(overrideFilters.salaryMax) * 1000000 : undefined,
        page: nextPage,
        size: 8,
      });
      setJobs(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      const responsePage = typeof response.page === 'number' ? response.page : 1;
      setPage(Math.max(responsePage - 1, 0));
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (next) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const handleQuickFilter = (next) => {
    const nextFilters = { ...filters, ...next };
    setFilters(nextFilters);
    applyFilters(0, nextFilters);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set('keyword', filters.keyword);
    if (filters.location) params.set('location', filters.location);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleCategorySelect = (category) => {
    if (!category?.id) return;
    const params = new URLSearchParams();
    params.set('industryId', category.id);
    navigate(`/jobs?${params.toString()}`);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages) return;
    applyFilters(nextPage, filters);
  };

  useEffect(() => {
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
    applyFilters(0, filters);
  }, []);

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

      {/* How It Works */}
      <HowItWorks />

      {/* Statistics & Insights */}
      <StatisticsSection stats={stats} />

      {/* Call to Action */}
      <CTASection />
    </div>
  );
}
