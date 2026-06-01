import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function HeroWelcome({ newApplicants = 0 }) {
  const resolvedCount = Number.isFinite(newApplicants) ? newApplicants : 0;
  const badgeText = resolvedCount > 0 ? `+${resolvedCount} hồ sơ` : '0 hồ sơ';

  return (
    <div className="relative overflow-hidden bg-white px-6 sm:px-12 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
      {/* Background soft accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] -mr-64 -mt-32 -z-10 opacity-60"></div>
      
      {/* Left content */}
      <div className="flex-1 max-w-2xl z-10">
        <div className="w-12 h-1.5 bg-emerald-600 mb-8 rounded-full shadow-lg shadow-emerald-200"></div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-gray-800 mb-6 leading-tight tracking-tight">
          Nơi gặp gỡ giữa doanh nghiệp <br /> 
          và <span className="text-emerald-600 italic">10 triệu</span> ứng viên <br />
          chất lượng
        </h1>
        
        <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg font-medium">
          Tuyển người dễ dàng với <span className="text-blue-600 font-bold">CareerConnect</span> - 
          Chúng tôi luôn có ứng viên phù hợp cho bạn
        </p>

        <div className="flex flex-wrap gap-4">
          <Link 
            to="/employer/jobs"
            className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl text-base font-black transition-all duration-300 shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 group no-underline"
          >
            Đăng tin ngay!
            <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Right side: Mockup/Image area */}
      <div className="flex-1 w-full max-w-xl relative flex justify-center">
         <div className="absolute inset-0 bg-blue-50/50 rounded-[40px] rotate-3 scale-105 -z-10"></div>
         <div className="relative w-full aspect-[4/3] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-white">
            <img 
               src="https://img.freepik.com/free-photo/successful-female-entrepreneur-sitting-office-using-laptop-working-online-smiling_1258-124976.jpg" 
               alt="Employer" 
               className="w-full h-full object-cover"
            />
            {/* Floating UI Elements */}
            <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 animate-bounce-slow">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                     <FiArrowRight />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Ứng tuyển mới</div>
                    <div className="text-sm font-black text-gray-800">{badgeText}</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
