import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, BriefcaseBusiness, Search, Sparkles } from 'lucide-react';
import { searchJobs } from '../../service/jobService';
import { getCompanyMarketingEntitlements } from '../../service/companyService';
import { isServiceUnavailableError } from '../../service/apiClient';
import useProvinces from '../../hooks/useProvinces';
import { formatProvinceLabel } from '../../lib/utils';
import {
  filterFeaturedCompaniesByBranding,
  getCompanyKey,
  isBrandingEntitlementActive,
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
      const response = await searchJobs(
        {
          keyword: nextKeyword || undefined,
          location: nextLocation || undefined,
          sortBy: 'createdAt',
          sortDir: 'desc',
          page: 0,
          size: 120,
        },
        { quietOn503: true }
      );

      setServiceUnavailable(false);
      const baseJobs = response.content || [];
      const baseCompanies = mapFeaturedCompaniesFromJobs(baseJobs);
      const brandedCompanyKeysFromJobs = new Set(
        baseJobs
          .filter(isBrandingJob)
          .map(getCompanyKey)
          .filter(Boolean)
      );

      const brandingMap = new Map();
      let unauthorizedBrandingApi = false;

      await Promise.allSettled(
        baseCompanies.map(async (company) => {
          const companyKey = company.key || company.companyId;
          if (!companyKey) {
            return;
          }

          if (brandedCompanyKeysFromJobs.has(companyKey)) {
            brandingMap.set(companyKey, true);
            return;
          }

          try {
            if (!company.companyId) {
              brandingMap.set(companyKey, false);
              return;
            }

            const entitlements = await getCompanyMarketingEntitlements(company.companyId, 'BRANDING');
            brandingMap.set(
              companyKey,
              Array.isArray(entitlements) && entitlements.some(isBrandingEntitlementActive)
            );
          } catch (error) {
            if (error?.response?.status === 401) {
              unauthorizedBrandingApi = true;
            }
            brandingMap.set(companyKey, false);
          }
        })
      );

      setCompanies(
        unauthorizedBrandingApi
          ? baseCompanies.filter((company) => brandedCompanyKeysFromJobs.has(company.key || company.companyId))
          : filterFeaturedCompaniesByBranding(baseCompanies, brandingMap, brandedCompanyKeysFromJobs)
      );
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

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 text-emerald-700 mb-2">
            <Sparkles size={22} />
            <h1 className="text-2xl sm:text-3xl font-bold">Công ty nổi bật</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-3xl">
            Danh sách doanh nghiệp đang sử dụng gói quảng bá thương hiệu BRANDING.
          </p>

          <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm theo tên công ty hoặc việc làm"
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-2.5 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">Địa điểm</option>
                {locationOptions.map((item) => (
                  <option key={item} value={item}>
                    {formatProvinceLabel(item)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 hover:bg-emerald-700"
              >
                Lọc
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600 mb-4">
            Tìm thấy <span className="font-semibold text-slate-800">{companies.length}</span> công ty nổi bật
          </p>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
              Dang tai cong ty noi bat...
            </div>
          ) : companies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
              {emptyText}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {companies.map((company) => (
                <article
                  key={company.key || company.companyId || company.name}
                  className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={company.logo || FALLBACK_COMPANY_LOGO}
                      alt={company.name}
                      className="w-16 h-16 rounded-xl object-contain border border-gray-100 bg-white p-1"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_COMPANY_LOGO;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-slate-800 line-clamp-2">{company.name}</h3>
                      <p className="mt-1 text-xs text-gray-500 inline-flex items-center gap-1">
                        <BriefcaseBusiness size={13} />
                        {company.jobCount} tin tuyen dung dang hoat dong
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
