import React from 'react';
import { ArrowRight } from 'lucide-react';
import { categoriesData } from '../../../data/categoriesData';

export default function CategoriesSection({ categories = [], onCategorySelect, onViewAll }) {
  const items = categories.length > 0 ? categories : categoriesData;
  return (
    <section className="py-16 sm:py-20 bg-linear-to-b from-white via-blue-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full opacity-20 blur-3xl -ml-48 -mb-48"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Top ngành nghề nổi bật</h2>
          <p className="text-gray-600 text-lg">
            Bạn muốn tìm việc mới?{' '}
            <button
              type="button"
              onClick={onViewAll}
              className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
            >
              Xem danh sách việc làm →
            </button>
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((category, index) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategorySelect?.(category)}
              className={`group relative p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer overflow-hidden ${
                category.featured
                  ? 'border-3 border-emerald-500 bg-linear-to-br from-emerald-50 via-white to-teal-50 shadow-lg'
                  : 'bg-white border border-gray-200 hover:border-emerald-300'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-linear-to-br from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300 origin-left">
                  {category.icon || '💼'}
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 mb-3 text-base sm:text-lg group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {category.title}
                </h3>

                {/* Job Count */}
                <p className="text-sm sm:text-base text-emerald-600 font-bold group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                  {category.jobCount || 'Xem việc làm'}
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>

              {/* Top Border for Featured */}
              {category.featured && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 via-teal-400 to-emerald-400"></div>
              )}

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12"></div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Khám phá tất cả ngành nghề
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
