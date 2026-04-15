import React from 'react';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import FeaturedJobsSection from './components/FeaturedJobsSection';
import StatisticsSection from './components/StatisticsSection';
import CTASection from './components/CTASection';
import HowItWorks from './components/HowItWorks';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Top Job Categories */}
      <CategoriesSection />

      {/* Featured Jobs */}
      <FeaturedJobsSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Statistics & Insights */}
      <StatisticsSection />

      {/* Call to Action */}
      <CTASection />
    </div>
  );
}
