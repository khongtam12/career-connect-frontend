import React from 'react';

import HeroWelcome from '../../components/employer/home/HeroWelcome';
import PlatformIntro from '../../components/employer/home/PlatformIntro';
import KeyFeatures from '../../components/employer/home/KeyFeatures';
import HowItWorks from '../../components/employer/home/HowItWorks';
import HiringTips from '../../components/employer/home/HiringTips';
import RecommendedActions from '../../components/employer/home/RecommendedActions';
import AnalyticsOverview from '../../components/employer/home/AnalyticsOverview';

export default function Home() {
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
