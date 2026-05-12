import React from 'react';
import { FiUsers, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const EmptyCandidateState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-3xl p-8 shadow-sm border border-white/50 backdrop-blur-sm">
      {/* Icon Container */}
      <div className="relative mb-8 group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-purple-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
        
        {/* Main Icon Circle */}
        <div className="relative h-32 w-32 bg-white rounded-full flex items-center justify-center shadow-xl shadow-purple-100 border border-purple-50 group-hover:scale-105 transition-transform duration-500 ease-out">
          <FiUsers className="text-5xl text-purple-600" />
          
          {/* Floating badge */}
          <div className="absolute -top-2 -right-2 h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-bounce" style={{ animationDuration: '3s' }}>
            <FiFileText className="text-white text-xl" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-2xl font-black text-gray-800 mb-3 text-center tracking-tight">
        Chưa có ứng viên nào
      </h2>
      <p className="text-gray-500 text-center max-w-md leading-relaxed mb-8">
        Hiện tại chưa có hồ sơ nào được gửi đến. Hãy tạo thêm các tin tuyển dụng hấp dẫn để thu hút nhân tài gia nhập công ty của bạn nhé!
      </p>

      {/* Action Button */}
      <button 
        onClick={() => navigate('/employer/jobs')}
        className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-purple-600 border border-transparent rounded-2xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 overflow-hidden shadow-lg shadow-purple-200"
      >
        <div className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></div>
        <span className="relative flex items-center gap-2">
          Đăng tin tuyển dụng ngay
        </span>
      </button>
    </div>
  );
};

export default EmptyCandidateState;
