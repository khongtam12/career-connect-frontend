import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import JobSection from './components/JobSection';
import { getJobFilters, searchJobs } from '../../service/jobService';

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

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [jobs, setJobs] = useState([]);
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
  const [selectedJob, setSelectedJob] = useState(null);
  const lastQueryRef = useRef(null);
  const hasFetchedRef = useRef(false);

  const paramsKey = useMemo(() => searchParams.toString(), [searchParams]);

  const applyFilters = useCallback(async (nextPage = 0, overrideFilters = filters, selectedId) => {
    setLoading(true);
    try {
      const response = await searchJobs({
        ...overrideFilters,
        experienceMin: overrideFilters.experienceMin ? Number(overrideFilters.experienceMin) : undefined,
        experienceMax: overrideFilters.experienceMax ? Number(overrideFilters.experienceMax) : undefined,
        salaryMin: overrideFilters.salaryMin ? Number(overrideFilters.salaryMin) * 1000000 : undefined,
        salaryMax: overrideFilters.salaryMax ? Number(overrideFilters.salaryMax) * 1000000 : undefined,
        page: nextPage,
        size: 10,
      });
      setJobs(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      const responsePage = typeof response.page === 'number' ? response.page : 1;
      setPage(Math.max(responsePage - 1, 0));
      const nextSelected = response.content?.[0] || null;
      setSelectedJob((prev) => {
        if (!nextSelected) return null;
        if (selectedId) {
          const found = response.content?.find((item) => (item.jobId || item.id) === selectedId);
          if (found) return found;
        }
        if (prev && response.content?.some((item) => (item.jobId || item.id) === (prev.jobId || prev.id))) {
          return prev;
        }
        return nextSelected;
      });
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFilterChange = (next) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const buildParams = (data) => {
    const params = new URLSearchParams();
    if (data.keyword) params.set('keyword', data.keyword);
    if (data.location) params.set('location', data.location);
    if (data.industryId) params.set('industryId', data.industryId);
    if (data.fieldId) params.set('fieldId', data.fieldId);
    if (data.jobType) params.set('jobType', data.jobType);
    if (data.marketingPackageCategory) params.set('marketingPackageCategory', data.marketingPackageCategory);
    if (data.marketingPackageType) params.set('marketingPackageType', data.marketingPackageType);
    if (data.experienceMin) params.set('experienceMin', data.experienceMin);
    if (data.experienceMax) params.set('experienceMax', data.experienceMax);
    if (data.salaryMin) params.set('salaryMin', data.salaryMin);
    if (data.salaryMax) params.set('salaryMax', data.salaryMax);
    if (data.sortBy) params.set('sortBy', data.sortBy);
    if (data.sortDir) params.set('sortDir', data.sortDir);
    return params;
  };

  const handleSearch = (overrideFilters = filters) => {
    const params = buildParams(overrideFilters);
    navigate(`/jobs?${params.toString()}`);
    applyFilters(0, overrideFilters);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages) return;
    applyFilters(nextPage, filters);
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const options = await getJobFilters();
        setFilterOptions({
          jobTypes: options.jobTypes || [],
          statuses: options.statuses || [],
          locations: options.locations || [],
          industries: options.industries || [],
        });
      } catch (error) {
        console.error('Failed to load job filters', error);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current && lastQueryRef.current === paramsKey) {
      return;
    }
    lastQueryRef.current = paramsKey;
    hasFetchedRef.current = true;
    const nextFilters = {
      ...initialFilters,
      keyword: searchParams.get('keyword') || '',
      location: searchParams.get('location') || '',
      industryId: searchParams.get('industryId') || '',
      fieldId: searchParams.get('fieldId') || '',
      jobType: searchParams.get('jobType') || '',
      marketingPackageCategory: searchParams.get('marketingPackageCategory') || '',
      marketingPackageType: searchParams.get('marketingPackageType') || '',
      experienceMin: searchParams.get('experienceMin') || '',
      experienceMax: searchParams.get('experienceMax') || '',
      salaryMin: searchParams.get('salaryMin') || '',
      salaryMax: searchParams.get('salaryMax') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortDir: searchParams.get('sortDir') || 'desc',
    };
    setFilters(nextFilters);
    const selectedId = searchParams.get('jobId');
    applyFilters(0, nextFilters, selectedId || undefined);
  }, [paramsKey, applyFilters, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50">
      <JobSection
        jobs={jobs}
        totalElements={totalElements}
        filters={filters}
        filterOptions={filterOptions}
        onChange={handleFilterChange}
        onApply={handleSearch}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
        selectedJob={selectedJob}
        onSelectJob={setSelectedJob}
        showDetailPanel={false}
      />
    </div>
  );
}
