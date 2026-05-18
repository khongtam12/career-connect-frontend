import React from 'react';
import { Heart, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyJobItem = ({ job, company }) => {
  const isFeatured = job?.isFeatured || job?.top || false;
  
  const companyName = job?.companyName || company?.name || "TÊN CÔNG TY";
  const companyLogo = job?.companyLogoUrl || job?.logo || company?.logo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10";

  // Calculate days left
  const calculateDaysLeft = (deadline) => {
    if (!deadline) return 30;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft(job?.deadline);

  const formatSalary = (min, max, negotiable) => {
    if (negotiable) return "Thoả thuận";
    if (!min && !max) return "Thoả thuận";
    if (min && max) return `${min} - ${max} Triệu`;
    if (min) return `Từ ${min} Triệu`;
    return `Đến ${max} Triệu`;
  };

  const salaryLabel = job?.salary || formatSalary(job?.salaryMin, job?.salaryMax, job?.salaryNegotiable);

  return (
    <div className="flex flex-col sm:flex-row items-center p-4 bg-white border border-gray-100 hover:border-green-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group gap-4 relative">
      {/* Left: Logo */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 border border-gray-100 rounded-xl overflow-hidden p-2 flex items-center justify-center bg-white">
        <img 
          src={companyLogo} 
          alt={companyName} 
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeplpRN1hSAQoBqsMoIHnQwfn4zC8yFJldEjYoL8Mi8g&s=10";
          }}
        />
      </div>

      {/* Right: Info */}
      <div className="flex-1 min-w-0 w-full flex flex-col justify-between py-1 space-y-3 sm:space-y-2">
        {/* Top badges & Salary */}
        <div className="flex justify-between items-start">
          <div className="pr-4">
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-orange-500 text-white shadow-sm mb-1">
                <Sparkles size={12} /> Nổi bật
              </span>
            )}
            <Link to={`/job/${job?.jobId || job?.id}`} className="block">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors flex items-center gap-1.5 truncate">
                {job?.title || "Vị trí tuyển dụng"}
                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-1 text-green-600 font-bold whitespace-nowrap">
            <span className="text-xs sm:text-sm bg-green-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-black leading-none">$</span>
            <span className="hidden sm:inline">{salaryLabel}</span>
            <span className="sm:hidden text-sm">{salaryLabel}</span>
          </div>
        </div>

        {/* Company Name */}
        <div className="text-gray-600 font-medium text-sm uppercase truncate">
          {companyName}
        </div>

        {/* Bottom tags & Actions */}
        <div className="flex flex-wrap items-end justify-between gap-3 mt-2">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-md font-medium">
              {job?.location || "Địa điểm"}
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-md font-medium">
              Còn {daysLeft} ngày để ứng tuyển
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link to={`/job/${job?.jobId || job?.id}`} className="flex-1 sm:flex-none text-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-green-600/20 transition-colors">
              Ứng tuyển
            </Link>
            <button className="p-2 border border-green-200 hover:bg-green-50 hover:border-green-600 text-green-600 rounded-lg transition-colors flex items-center justify-center">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyJobItem;
