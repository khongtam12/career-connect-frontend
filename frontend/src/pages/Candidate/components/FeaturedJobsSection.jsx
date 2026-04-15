import React from 'react';
import { jobsData } from '../../../data/jobsData';
import JobCard from './JobCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function FeaturedJobsSection() {
  const featuredJobs = jobsData.filter((job) => job.featured).slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-72 h-72 bg-emerald-100 rounded-full opacity-20 blur-3xl -ml-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl -mr-48"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={24} className="text-emerald-600" />
            <span className="text-sm sm:text-base font-bold text-emerald-600">CÔNG VIỆC NỐI BẬT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Việc làm hot nhất hôm nay</h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Những cơ hội tuyệt vời đang chờ đón bạn
          </p>
        </div>

        {/* Featured Jobs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredJobs.map((job, index) => (
            <div 
              key={job.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <JobCard job={job} isFeatured={true} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg">
            Xem tất cả {jobsData.length} việc làm
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
