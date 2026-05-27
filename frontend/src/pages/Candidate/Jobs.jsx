import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import JobSection from './components/JobSection';
import QuickJobsSection from './components/QuickJobsSection';
import { getJobFilters, searchJobs } from '../../service/jobService';
import { categoriesData } from '../../data/categoriesData';
import useProvinces from '../../hooks/useProvinces';
import { Layers3 } from 'lucide-react';

const FALLBACK_RANKS = [
  'Thực tập sinh',
  'Nhân viên',
  'Trưởng nhóm',
  'Phó phòng',
  'Trưởng phòng',
  'Phó giám đốc',
  'Giám đốc',
];

const FALLBACK_EDUCATIONS = [
  'Trung học phổ thông',
  'Trung cấp',
  'Cao Đẳng trở lên',
  'Đại học',
  'Đại học (đang học)',
  'Thạc sĩ',
  'Tiến sĩ',
  'Không yêu cầu',
];

const normalizeIndustryLabel = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 /-]+/g, '')
    .trim();

const resolveIndustryQuery = (filters, industries) => {
  if (filters.industryId || !filters.keyword) {
    return filters;
  }

  const normalizedKeyword = normalizeIndustryLabel(filters.keyword);
  const matchedIndustry = industries.find(
    (item) => normalizeIndustryLabel(item.name) === normalizedKeyword
  );
  const matchedCategory = categoriesData.find(
    (item) => normalizeIndustryLabel(item.title) === normalizedKeyword || normalizeIndustryLabel(item.industryId) === normalizedKeyword
  );

  const resolvedIndustryId = matchedIndustry?.industryId || matchedCategory?.backendIndustryId;

  if (!resolvedIndustryId) {
    return filters;
  }

  return {
    ...filters,
    industryId: resolvedIndustryId,
    keyword: '',
  };
};

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
  rank: '',
  education: '',
  salaryNegotiable: '',
  sortBy: 'createdAt',
  sortDir: 'desc',
};

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { provinces } = useProvinces(true);
  const [filters, setFilters] = useState(initialFilters);
  const [jobs, setJobs] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    jobTypes: [],
    statuses: [],
    locations: [],
    industries: [],
    ranks: [],
    educations: [],
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [industryPriorityJobs, setIndustryPriorityJobs] = useState([]);
  const [industryPriorityTotal, setIndustryPriorityTotal] = useState(0);
  const [industryPriorityLoading, setIndustryPriorityLoading] = useState(false);
  const lastQueryRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const provinceLocations = useMemo(
    () => provinces.map((province) => province.name).filter(Boolean),
    [provinces]
  );
  const displayFilterOptions = useMemo(() => ({
    ...filterOptions,
    locations: provinceLocations.length > 0 ? provinceLocations : filterOptions.locations,
    ranks: filterOptions.ranks.length > 0 ? filterOptions.ranks : FALLBACK_RANKS,
    educations: filterOptions.educations.length > 0 ? filterOptions.educations : FALLBACK_EDUCATIONS,
  }), [filterOptions, provinceLocations]);
  const currentIndustryName = useMemo(
    () =>
      filterOptions.industries.find((item) => item.industryId === filters.industryId)?.name || '',
    [filterOptions.industries, filters.industryId]
  );
  const shouldShowIndustryPrioritySection = Boolean(
    filters.industryId && filters.marketingPackageType !== 'INDUSTRY_PRIORITY'
  );

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
        salaryNegotiable: overrideFilters.salaryNegotiable === '' ? undefined : overrideFilters.salaryNegotiable === 'true',
        page: nextPage + 1,
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
    if (data.rank) params.set('rank', data.rank);
    if (data.education) params.set('education', data.education);
    if (data.salaryNegotiable) params.set('salaryNegotiable', data.salaryNegotiable);
    if (data.sortBy) params.set('sortBy', data.sortBy);
    if (data.sortDir) params.set('sortDir', data.sortDir);
    return params;
  };

  const handleSearch = (overrideFilters = filters) => {
    const resolvedFilters = resolveIndustryQuery(overrideFilters, filterOptions.industries);
    const params = buildParams(resolvedFilters);
    navigate(`/jobs?${params.toString()}`);
    applyFilters(0, resolvedFilters);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages) return;
    applyFilters(nextPage, filters);
  };

  const handleResetFilters = () => {
    const nextFilters = { ...initialFilters };
    setFilters(nextFilters);
    navigate('/jobs');
    applyFilters(0, nextFilters);
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
          ranks: options.ranks || FALLBACK_RANKS,
          educations: options.educations || FALLBACK_EDUCATIONS,
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
    const nextFilters = resolveIndustryQuery({
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
      rank: searchParams.get('rank') || '',
      education: searchParams.get('education') || '',
      salaryNegotiable: searchParams.get('salaryNegotiable') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortDir: searchParams.get('sortDir') || 'desc',
    }, filterOptions.industries);
    setFilters(nextFilters);
    const selectedId = searchParams.get('jobId');
    applyFilters(0, nextFilters, selectedId || undefined);
  }, [paramsKey, applyFilters, searchParams, filterOptions.industries]);

  useEffect(() => {
    const loadIndustryPriorityJobs = async () => {
      if (!shouldShowIndustryPrioritySection) {
        setIndustryPriorityJobs([]);
        setIndustryPriorityTotal(0);
        setIndustryPriorityLoading(false);
        return;
      }

      setIndustryPriorityLoading(true);
      try {
        const response = await searchJobs({
          industryId: filters.industryId,
          location: filters.location || undefined,
          marketingPackageType: 'INDUSTRY_PRIORITY',
          sortBy: 'createdAt',
          sortDir: 'desc',
          page: 0,
          size: 6,
        });

        setIndustryPriorityJobs(response.content || []);
        setIndustryPriorityTotal(response.totalElements || 0);
      } catch (error) {
        console.error('Failed to load industry priority jobs', error);
        setIndustryPriorityJobs([]);
        setIndustryPriorityTotal(0);
      } finally {
        setIndustryPriorityLoading(false);
      }
    };

    loadIndustryPriorityJobs();
  }, [filters.industryId, filters.location, shouldShowIndustryPrioritySection]);

  return (
    <div className="min-h-screen bg-slate-50">
      {shouldShowIndustryPrioritySection && (
        <QuickJobsSection
          title={
            currentIndustryName
              ? `Việc làm ưu tiên trong ngành ${currentIndustryName}`
              : 'Việc làm ưu tiên trong ngành này'
          }
          subtitle="Những tin tuyển dụng được quảng bá nổi bật trong lĩnh vực bạn đang quan tâm"
          icon={<Layers3 size={18} className="text-blue-600" />}
          jobs={industryPriorityJobs}
          total={industryPriorityTotal}
          locations={displayFilterOptions.locations}
          locationFilter={filters.location}
          onLocationChange={(value) => {
            const nextFilters = { ...filters, location: value };
            setFilters(nextFilters);
            const params = buildParams(nextFilters);
            navigate(`/jobs?${params.toString()}`);
          }}
          onViewAll={() => {
            const nextFilters = {
              ...filters,
              marketingPackageType: 'INDUSTRY_PRIORITY',
            };
            navigate(`/jobs?${buildParams(nextFilters).toString()}`);
          }}
          backgroundClassName="bg-blue-50/70"
          accentClassName="text-blue-700"
          emptyText="Chưa có tin tuyển dụng ưu tiên trong ngành này"
          loading={industryPriorityLoading}
        />
      )}
      <JobSection
        jobs={jobs}
        totalElements={totalElements}
        filters={filters}
        filterOptions={displayFilterOptions}
        onChange={handleFilterChange}
        onApply={handleSearch}
          onReset={handleResetFilters}
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
