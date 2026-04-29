import React from 'react';

const LoadingSpinner = ({ message = "Đang tải dữ liệu..." }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-gray-50/50">
            <div className="relative flex items-center justify-center w-16 h-16 mb-4">
                {/* Outer ring */}
                <div className="absolute w-full h-full border-4 border-gray-200 rounded-full"></div>
                {/* Spinning inner ring */}
                <div className="absolute w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                {/* Center dot */}
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-500 font-medium animate-pulse">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
