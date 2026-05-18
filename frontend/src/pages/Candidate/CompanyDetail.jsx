import React, { useState,useEffect } from 'react';
import { Building2, MapPin, Map,Globe, Mail, Phone, FileText, Users, Calendar,CheckCircle2,Share2,ExternalLink,ChevronRight} from 'lucide-react';
import { motion } from 'framer-motion';
import {getCompanyDetail} from "../../service/companyService"; 
import {searchJobs} from "../../service/jobService";
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../Employer/Candidates/components/LoadingSpinner';
import CompanyJobItem from './components/CompanyJobItem';


// Common banner image for all companies
const bannerImage = "https://nld.mediacdn.vn/2019/8/31/vingroup-15672420231792147140688.jpg";

const CompanyDetail = () => {
  const [company,setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const { id } = useParams();

    useEffect(() => {
      const fetchCompanyDetailAndJobs = async () => {
        try {
          const data = await getCompanyDetail(id);
          setCompany(data);
          console.log("datacompany",data);
          
          if (data && data.name) {
            setLoadingJobs(true);
            const jobsData = await searchJobs({ keyword: data.name, size: 10 });
            if (jobsData && jobsData.content) {
              setCompanyJobs(jobsData.content);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingJobs(false);
        }
      };
  
      fetchCompanyDetailAndJobs();
    }, [id]);
  if (company==null) return <LoadingSpinner message="Đang tải thông tin công ty" />;
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-32 h-32 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                  <img 
                    src={company.logo} 
                    alt={`${company.name} Logo`} 
                    className="max-w-full max-h-full object-contain"
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
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      <a href={company.website} target="_blank" rel="noreferrer" className="hover:text-green-600 transition-colors">
                        {company.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{company.companySize}+ Employees</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Founded Yeard {company.foundedYear}</span>
                    </div>
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
                            : "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20"
                        }`}
                    >
                    <span>
                        {company.statusCompany === "VERIFIED"
                        ? "Đã xác thực"
                        : "Đang chờ duyệt"}
                    </span>
                    </button>
                </div>
              </div>
            </motion.div>

            {/* About Company */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-green-600" />
                Giới thiệu công ty
              </h2>
              <div className="prose prose-green max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {company.description}
              </div>
            </motion.div>

            {/* Hiring Jobs Placeholder */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
            >
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
            </motion.div>
          </div>

          {/* Sidebar Info Column */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6"
            >
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
                    <p className="text-sm text-gray-600 mt-1">{company.address}</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Điện thoại</p>
                    <p className="text-sm text-gray-600 mt-1">{company.phone}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <a href={`mailto:${company.email}`} className="hover:text-green-600">{company.email}</a>
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mã số thuế</p>
                    <p className="text-sm text-gray-600 mt-1">{company.taxCode}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Website</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-green-600">
                        Truy cập website <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Map Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-[450px]"
            >
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
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
