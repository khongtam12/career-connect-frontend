import React from 'react';

export default function JobSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Tất cả việc làm</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* This component can be extended later with pagination */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center text-gray-500">
            Xem thêm công việc...
          </div>
        </div>
      </div>
    </section>
  );
}
