import React from 'react';

import HeroWelcome from '../../component/employer/home/HeroWelcome';
import PlatformIntro from '../../component/employer/home/PlatformIntro';
import KeyFeatures from '../../component/employer/home/KeyFeatures';
import HowItWorks from '../../component/employer/home/HowItWorks';
import HiringTips from '../../component/employer/home/HiringTips';
import RecommendedActions from '../../component/employer/home/RecommendedActions';
import AnalyticsOverview from '../../component/employer/home/AnalyticsOverview';

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
