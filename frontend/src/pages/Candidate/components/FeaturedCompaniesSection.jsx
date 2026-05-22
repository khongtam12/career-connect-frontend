import { Building2, BriefcaseBusiness, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatProvinceLabel } from '../../../lib/utils';

const FALLBACK_COMPANY_LOGO =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10';

export default function FeaturedCompaniesSection({
  companies = [],
  total = 0,
  onViewAll,
  loading = false,
  emptyText = 'Chua co cong ty noi bat',
}) {
  return (
    <section className="py-12 sm:py-14 bg-emerald-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-emerald-700">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm">
                <Sparkles size={18} className="text-emerald-600" />
              </span>
              Công ty nổi bật
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Doanh nghiệp đang sở hữu gói quảng bá thương hiệu BRANDING
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-2"
          >
            Xem tất cả {total ? `(${total})` : ''}
            <span aria-hidden="true">→</span>
          </button>
        </div>

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
                className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
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
  );
}
