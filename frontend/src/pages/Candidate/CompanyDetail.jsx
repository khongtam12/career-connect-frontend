import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Map,Globe, Mail, Phone, FileText, Users, Calendar,CheckCircle2,Share2,ExternalLink,ChevronRight} from 'lucide-react';
import { getCompanyDetail } from '../../service/companyService';
import { searchJobs } from '../../service/jobService';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../Employer/Candidates/components/LoadingSpinner';
import CompanyJobItem from './components/CompanyJobItem';
import { getCompanyKey, mapFeaturedCompaniesFromJobs } from './utils/featuredCompanies';


// Common banner image for all companies
const bannerImage = "https://nld.mediacdn.vn/2019/8/31/vingroup-15672420231792147140688.jpg";
const FALLBACK_COMPANY_LOGO = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10';

const CompanyDetail = () => {
  const [company,setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [companyError, setCompanyError] = useState('');
  const { id } = useParams();

    useEffect(() => {
      const fetchCompanyDetailAndJobs = async () => {
        setLoadingCompany(true);
        setCompanyError('');
        try {
          const data = await getCompanyDetail(id);
          const nextCompany = normalizeCompanyDetail(data, id);
          setCompany(nextCompany);

          if (nextCompany?.name) {
            setLoadingJobs(true);
            const jobsData = await searchJobs({ keyword: nextCompany.name, size: 20, sortBy: 'createdAt', sortDir: 'desc' });
            setCompanyJobs(filterJobsForCompany(jobsData?.content || [], nextCompany));
          }
        } catch (err) {
          try {
            const jobsData = await searchJobs({ keyword: id, size: 50, sortBy: 'createdAt', sortDir: 'desc' });
            const jobs = jobsData?.content || [];

            if (jobs.length === 0) {
              throw err;
            }

            const fallbackCompany = buildFallbackCompany(jobs, id);
            setCompany(fallbackCompany);
            setCompanyJobs(filterJobsForCompany(jobs, fallbackCompany));
          } catch (fallbackErr) {
            console.error('Failed to load company detail', fallbackErr);
            setCompany(null);
            setCompanyJobs([]);
            setCompanyError('Không thể tải thông tin công ty lúc này. Vui lòng thử lại sau.');
          }
        } finally {
          setLoadingCompany(false);
          setLoadingJobs(false);
        }
      };
  
      fetchCompanyDetailAndJobs();
    }, [id]);

  if (loadingCompany) return <LoadingSpinner message="Đang tải thông tin công ty" />;

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy công ty</h1>
          <p className="text-gray-600 mb-6">{companyError || 'Trang công ty hiện không có dữ liệu để hiển thị.'}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/featured-companies" className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700">
              Xem công ty nổi bật
            </a>
            <a href="/jobs" className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
              Xem việc làm
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Banner Section */}
      <div className="relative h-64 md:h-100 w-full ">
        <img 
          src={bannerImage} 
          alt={`${company.name} Banner`} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-32 h-32 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                  <img 
                    src={company.logo || FALLBACK_COMPANY_LOGO} 
                    alt={`${company.name} Logo`} 
                    className="max-w-full max-h-full object-contain"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_COMPANY_LOGO;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                    {company.statusCompany === "ACTIVE" && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                    {company.website ? (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        <a href={company.website} target="_blank" rel="noreferrer" className="hover:text-green-600 transition-colors">
                          {company.website}
                        </a>
                      </div>
                    ) : null}
                    {company.companySize ? (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{company.companySize}+ Employees</span>
                      </div>
                    ) : null}
                    {company.foundedYear ? (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Founded Year {company.foundedYear}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-3 mt-4 sm:mt-0">
                  <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    className={`px-6 py-2.5 rounded-xl text-white font-medium transition-colors shadow-md
                        ${
                        company.statusCompany === "VERIFIED"
                            ? "bg-green-600 hover:bg-green-700 shadow-green-500/20"
                            : company.statusCompany === "ACTIVE"
                              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                              : "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20"
                        }`}
                    >
                    <span>
                        {company.statusCompany === "VERIFIED"
                        ? "Đã xác thực"
                        : company.statusCompany === "ACTIVE"
                          ? "Đang hoạt động"
                          : "Đang chờ duyệt"}
                    </span>
                    </button>
                </div>
              </div>
            </div>

            {/* About Company */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-green-600" />
                Giới thiệu công ty
              </h2>
              <div className="prose prose-green max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {company.description || `Trang công ty đang được dựng từ dữ liệu tuyển dụng hiện có của ${company.name}.`}
              </div>
            </div>

            {/* Hiring Jobs Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-green-600" />
                  Tuyển dụng hiện tại
                </h2>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                  Xem tất cả <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {loadingJobs ? (
                <div className="flex justify-center py-10">
                  <LoadingSpinner message="Đang tải việc làm..." />
                </div>
              ) : companyJobs.length > 0 ? (
                <div className="flex flex-col gap-4 mt-2">
                  {companyJobs.map(job => (
                    <CompanyJobItem key={job.jobId || job.id} job={job} company={company} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có công việc nào</h3>
                  <p className="text-gray-500">Công ty hiện chưa đăng tin tuyển dụng mới.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Thông tin liên hệ
              </h3>
              
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Địa chỉ</p>
                    <p className="text-sm text-gray-600 mt-1">{company.address || 'Đang cập nhật'}</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Điện thoại</p>
                    <p className="text-sm text-gray-600 mt-1">{company.phone || 'Đang cập nhật'}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {company.email ? <a href={`mailto:${company.email}`} className="hover:text-green-600">{company.email}</a> : 'Đang cập nhật'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mã số thuế</p>
                    <p className="text-sm text-gray-600 mt-1">{company.taxCode || 'Đang cập nhật'}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Website</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-green-600">
                          Truy cập website <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : 'Đang cập nhật'}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-[450px]">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-green-600" />
                Xem bản đồ
              </h3>
              <div className="w-full h-[250px] rounded-xl overflow-hidden border border-gray-100">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.85816909105!2d106.6842704745177!3d10.822164158349457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBUUC5IQ00!5e0!3m2!1svi!2s!4v1779005582519!5m2!1svi!2s"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Company Location Map"
                ></iframe>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const normalizeValue = (value) =>
  (value || '')
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .trim();

const buildFallbackCompany = (jobs, fallbackId) => {
  const [bestMatch] = mapFeaturedCompaniesFromJobs(jobs);
  const firstJob = jobs[0] || {};
  const companyName = bestMatch?.name || firstJob.companyName || fallbackId;
  const companyKey = bestMatch?.key || getCompanyKey(firstJob) || normalizeValue(fallbackId);

  return {
    companyId: bestMatch?.companyId || companyKey || fallbackId,
    name: companyName,
    logo: bestMatch?.logo || firstJob.logo || firstJob.companyLogoUrl || FALLBACK_COMPANY_LOGO,
    address: firstJob.companyAddress || firstJob.address || firstJob.location || '',
    phone: firstJob.companyPhone || '',
    email: firstJob.companyEmail || '',
    taxCode: firstJob.companyTaxCode || '',
    website: firstJob.website || firstJob.companyWebsite || '',
    description: firstJob.companyDescription || '',
    companySize: firstJob.companySize || '',
    foundedYear: firstJob.foundedYear || '',
    statusCompany: firstJob.statusCompany || 'ACTIVE',
    companyKey,
  };
};

const filterJobsForCompany = (jobs, company) => {
  if (!Array.isArray(jobs) || jobs.length === 0 || !company) return [];

  const targetKey = company.companyKey || getCompanyKey(company) || normalizeValue(company.name);
  return jobs.filter((job) => {
    const jobKey = getCompanyKey(job) || normalizeValue(job.companyName);
    return jobKey === targetKey;
  });
};

const normalizeCompanyDetail = (data, fallbackId) => {
  if (!data) return null;
  return {
    companyId: data.id || data.companyId || fallbackId,
    name: data.name || fallbackId,
    logo: data.logo || FALLBACK_COMPANY_LOGO,
    address: data.address || '',
    phone: data.phone || '',
    email: data.email || '',
    taxCode: data.taxCode || '',
    website: data.website || '',
    description: data.description || '',
    companySize: data.companySize || '',
    foundedYear: data.foundedYear || '',
    statusCompany: data.statusCompany || '',
    companyKey: data.id || data.companyId || fallbackId,
  };
};

export default CompanyDetail;
