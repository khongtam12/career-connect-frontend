import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, BriefcaseBusiness, Search, Sparkles } from 'lucide-react';
import { searchJobs } from '../../service/jobService';
import { getCompanyDetail, getFeaturedCompanyIds } from '../../service/companyService';
import { isServiceUnavailableError } from '../../service/apiClient';
import useProvinces from '../../hooks/useProvinces';
import { formatProvinceLabel } from '../../lib/utils';
import {
  getCompanyKey,
  mapFeaturedCompanyFromDetail,
  mapFeaturedCompaniesFromJobs,
  isBrandingJob,
} from './utils/featuredCompanies';

const FALLBACK_COMPANY_LOGO =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10';

export default function FeaturedCompanies() {
  const { provinces } = useProvinces(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);
  const [companies, setCompanies] = useState([]);

  const locationOptions = useMemo(
    () => provinces.map((province) => province.name).filter(Boolean),
    [provinces]
  );

  const loadCompanies = useCallback(async ({ keyword: nextKeyword = '', location: nextLocation = '' } = {}) => {

    setLoading(true);
    try {
      const [response, featuredIds] = await Promise.all([
        searchJobs(
          {
            keyword: nextKeyword || undefined,
            location: nextLocation || undefined,
            sortBy: 'createdAt',
            sortDir: 'desc',
            page: 0,
            size: 120,
          },
          { quietOn503: true }
        ),
        getFeaturedCompanyIds().catch(() => []),
      ]);

      setServiceUnavailable(false);
      const baseJobs = response.content || [];
      const baseCompanies = mapFeaturedCompaniesFromJobs(baseJobs);
      const companyMap = new Map(
        baseCompanies.map((company) => [company.key || company.companyId, company])
      );
      const brandedCompanyKeysFromJobs = new Set(
        baseJobs
          .filter(isBrandingJob)
          .map(getCompanyKey)
          .filter(Boolean)
      );

      const featuredSet = new Set(featuredIds || []);
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

      const featuredCompanies = Array.from(companyMap.values()).filter((company) => {
        const companyKey = company.key || company.companyId;
        return featuredSet.has(companyKey) || brandedCompanyKeysFromJobs.has(companyKey);
      });

      setCompanies(featuredCompanies);
    } catch (error) {
      if (isServiceUnavailableError(error)) {
        setServiceUnavailable(true);
      }
      setCompanies([]);
      console.error('Failed to load featured companies', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies({ keyword: '', location: '' });
  }, [loadCompanies]);

  const handleSearch = (event) => {
    event.preventDefault();
    loadCompanies({ keyword, location });
  };

  const emptyText = serviceUnavailable
    ? 'Job service dang tam gian doan. Vui long thu lai sau.'
    : 'Chua tim thay cong ty noi bat phu hop bo loc';

  const hasActiveFilters = Boolean(keyword.trim() || location);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-6">
          <div className="rounded-[28px] border border-emerald-100/70 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl px-5 sm:px-7 lg:px-8 py-6 sm:py-8">
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-emerald-700 mb-2">
              <Sparkles size={18} className="text-emerald-600" />
              <h1>Công ty nổi bật</h1>
            </div>
            <p className="text-sm text-gray-600 mt-1 max-w-3xl">
              Doanh nghiệp đang sở hữu gói quảng bá thương hiệu BRANDING.
            </p>

            <form onSubmit={handleSearch} className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px_auto]">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Tìm theo tên công ty hoặc việc làm"
                  className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="relative">
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Địa điểm</option>
                  {locationOptions.map((item) => (
                    <option key={item} value={item}>
                      {formatProvinceLabel(item)}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Lọc
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-sm text-gray-600">
              Tìm thấy <span className="font-semibold text-slate-800">{companies.length}</span> công ty nổi bật
            </p>
            {hasActiveFilters && (
              <p className="text-xs text-gray-500">
                Bộ lọc hiện tại: {keyword ? `“${keyword}”` : 'Tất cả từ khóa'}{location ? ` · ${formatProvinceLabel(location)}` : ''}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 shadow-sm animate-pulse"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 rounded-xl bg-slate-200" />
                    <div className="flex-1 space-y-3 pt-1">
                      <div className="h-4 w-2/3 rounded-full bg-slate-200" />
                      <div className="h-3 w-1/2 rounded-full bg-slate-200" />
                      <div className="h-3 w-1/3 rounded-full bg-slate-200" />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="h-8 w-24 rounded-full bg-slate-200" />
                    <div className="h-4 w-20 rounded-full bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : companies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
              <div className="mx-auto flex max-w-md flex-col items-center text-center">
                <p>{emptyText}</p>
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('');
                    setLocation('');
                    loadCompanies({ keyword: '', location: '' });
                  }}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Xem lại toàn bộ
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {companies.map((company) => (
                <article
                  key={company.key || company.companyId || company.name}
                  className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <img
                        src={company.logo || FALLBACK_COMPANY_LOGO}
                        alt={company.name}
                        className="h-16 w-16 rounded-xl object-contain border border-gray-100 bg-white p-1"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_COMPANY_LOGO;
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-slate-800 line-clamp-2">
                        {company.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500 inline-flex items-center gap-1">
                        <BriefcaseBusiness size={13} />
                        {company.jobCount} tin tuyển dụng đang hoạt động
                      </p>
                      {company.location && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-1">{formatProvinceLabel(company.location)}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <Building2 size={12} />
                      BRANDING
                    </span>

                    {company.companyId ? (
                      <Link
                        to={`/company/${company.companyId}`}
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        Xem công ty
                      </Link>
                    ) : (
                      <Link
                        to={`/jobs?keyword=${encodeURIComponent(company.name)}&marketingPackageCategory=BRANDING`}
                        className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        Xem việc làm
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
