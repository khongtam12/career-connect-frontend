import React, { useMemo, useState } from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { categoriesData } from '../../../data/categoriesData';

export default function HeroSection({
  filters,
  onChange,
  onSearch,
  onCategorySelect,
  categories = categoriesData,
  locations = [],
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const visibleCategories = useMemo(
    () => categories.slice(categoryIndex, categoryIndex + 5),
    [categories, categoryIndex]
  );

  const handleCategoryPrev = () => {
    setCategoryIndex(Math.max(0, categoryIndex - 1));
  };

  const handleCategoryNext = () => {
    setCategoryIndex(Math.min(Math.max(categories.length - 5, 0), categoryIndex + 1));
  };

  return (
    <div className="relative bg-linear-to-br from-teal-700 via-teal-600 to-emerald-700 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Hero Section */}
      <div className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Title with Animation */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-full mb-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-colors">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-semibold text-amber-200">Tìm công việc dream của bạn hôm nay</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-transparent bg-clip-text bg-linear-to-r from-white via-emerald-100 to-white">
              CareerConnect - Tạo CV, Tìm việc làm, Tuyển dụng hiệu quả
            </h1>
            <p className="text-teal-100 text-base sm:text-lg max-w-3xl mx-auto">
              Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt Nam
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 shadow-2xl backdrop-blur-xl border border-white border-opacity-10 hover:shadow-3xl transition-all duration-300">
                <div className="space-y-1">
                  {visibleCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onCategorySelect?.(cat)}
                      className="group w-full flex items-center justify-between p-3 hover:bg-emerald-50 rounded-xl cursor-pointer transition-all duration-200 hover:translate-x-1"
                    >
                      <div>
                        <span className="text-gray-800 font-medium text-sm group-hover:text-emerald-700 transition-colors">
                          {cat.title}
                        </span>
                        {cat.jobCount && (
                          <p className="text-xs text-gray-500 mt-1">{cat.jobCount}</p>
                        )}
                      </div>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
                    </button>
                  ))}
                </div>

                {/* Category Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCategoryPrev}
                    disabled={categoryIndex === 0}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-500 font-semibold">
                    {categoryIndex + 1}/{Math.ceil(categories.length / 5 || 1)}
                  </span>
                  <button
                    onClick={handleCategoryNext}
                    disabled={categoryIndex >= categories.length - 5}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Center - Search Box */}
            <div className="lg:col-span-2">
              {/* Search Box with Glassmorphism */}
              <div className="bg-white backdrop-blur-xl rounded-full shadow-2xl p-4 mb-8 border border-white border-opacity-20 hover:shadow-3xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Vị trí tuyển dụng, tên công ty"
                      value={filters.keyword}
                      onChange={(e) => onChange({ keyword: e.target.value })}
                      className="w-full px-5 py-3 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none text-sm sm:text-base font-medium"
                    />
                  </div>
                  <div className="w-full sm:w-auto relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      value={filters.location}
                      onChange={(e) => onChange({ location: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 text-gray-900 bg-transparent focus:outline-none text-sm sm:text-base cursor-pointer font-medium"
                    >
                      <option value="">Địa điểm</option>
                      {locations.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={onSearch}
                    className="bg-linear-to-r from-emerald-500 to-teal-600 text-white font-bold px-6 sm:px-8 py-3 rounded-full hover:shadow-2xl transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 active:scale-95"
                  >
                    <Search size={18} />
                    <span className="hidden sm:inline">Tìm kiếm</span>
                  </button>
                </div>
              </div>

              {/* Description Text */}
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-emerald-100">Tiêp lợi thế, nơi thành công</h2>
                <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
                  Kết nối nhân tài với cơ hội tuyệt vời - Nền tảng tuyển dụng số 1 Việt Nam
                </p>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="lg:col-span-1 hidden lg:flex">
              <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600"
                  alt="Career Connect Hero"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
                <span className="absolute bottom-4 right-4 text-white text-sm font-semibold backdrop-blur-md bg-black/30 px-4 py-2 rounded-full border border-white/20">
                  Welcome onboard! 🚀
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar with Glass Effect */}
      <div className="border-t border-teal-500 border-opacity-30 bg-linear-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-lg py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px rgba(52, 211, 153, 0.5)' }}></div>
              <span className="text-teal-100 text-sm font-medium">Thị trường việc làm hôm nay 04/04/2026</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="group cursor-pointer">
                <p className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-300 transition-colors">64.584</p>
                <p className="text-teal-100 text-xs sm:text-sm font-medium">Việc làm đang tuyển</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center sm:justify-start gap-2 group-hover:text-emerald-300 transition-colors">
                  3.483 <span className="text-emerald-400 animate-bounce">✓</span>
                </p>
                <p className="text-teal-100 text-xs sm:text-sm font-medium">Việc làm mới hôm nay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
