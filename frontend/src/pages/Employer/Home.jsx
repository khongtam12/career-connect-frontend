import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import HeroWelcome from '../../components/employer/home/HeroWelcome';
import PlatformIntro from '../../components/employer/home/PlatformIntro';
import KeyFeatures from '../../components/employer/home/KeyFeatures';
import HowItWorks from '../../components/employer/home/HowItWorks';
import HiringTips from '../../components/employer/home/HiringTips';
import RecommendedActions from '../../components/employer/home/RecommendedActions';
import AnalyticsOverview from '../../components/employer/home/AnalyticsOverview';

export default function Home() {
   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const paymentStatus = params.get('paymentStatus');

      if (!paymentStatus) return;

      if (paymentStatus === 'success') {
         toast.success('Thanh toán thành công');
      } else {
         toast.error('Thanh toán thất bại');
      }

      navigate(location.pathname, { replace: true });
   }, [location.pathname, location.search, navigate]);

   return (
      <div className="max-w-[1440px] mx-auto space-y-6 pb-8">
         <HeroWelcome />
         <PlatformIntro />
         <KeyFeatures />
         <HowItWorks />
         <HiringTips />
         <RecommendedActions />
         <AnalyticsOverview />
      </div>
   );
}
