import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import HeroWelcome from '../../components/employer/home/HeroWelcome';
import PlatformIntro from '../../components/employer/home/PlatformIntro';
import KeyFeatures from '../../components/employer/home/KeyFeatures';
import HowItWorks from '../../components/employer/home/HowItWorks';
import HiringTips from '../../components/employer/home/HiringTips';
import RecommendedActions from '../../components/employer/home/RecommendedActions';
import AnalyticsOverview from '../../components/employer/home/AnalyticsOverview';
import AnalyticsModels from '../../components/employer/home/AnalyticsModels';
import { useCartStore } from '../../stores/useCartStore';
import { useUserStore } from '../../stores/useUserStore';
import { getMyStats } from '../../service/jobService';
import { getCandidatesForEmployer } from '../../service/applicationService';
import { getCompanyProfile } from '../../service/profileService';

const buildLast12MonthsLabels = (baseDate = new Date()) => {
   return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - (11 - index), 1);
      const year = String(date.getFullYear()).slice(-2);
      return {
         key: `${date.getFullYear()}-${date.getMonth() + 1}`,
         label: `T${date.getMonth() + 1}/${year}`,
      };
   });
};

const buildMonthlyApplications = (candidates = []) => {
   const labels = buildLast12MonthsLabels();
   const monthly = labels.map((item) => ({ name: item.label, applications: 0, key: item.key }));
   const bucketMap = new Map(monthly.map((item) => [item.key, item]));

   candidates.forEach((item) => {
      const dateValue = item?.appliedAt || item?.updatedAt;
      if (!dateValue) return;
      const appliedAt = new Date(dateValue);
      if (Number.isNaN(appliedAt.getTime())) return;
      const key = `${appliedAt.getFullYear()}-${appliedAt.getMonth() + 1}`;
      const bucket = bucketMap.get(key);
      if (bucket) {
         bucket.applications += 1;
      }
   });

   return monthly.map(({ name, applications }) => ({ name, applications }));
};

const buildTopJobs = (candidates = [], limit = 5) => {
   const jobCounts = new Map();
   candidates.forEach((item) => {
      const name = item?.jobName || 'Khac';
      jobCounts.set(name, (jobCounts.get(name) || 0) + 1);
   });

   return [...jobCounts.entries()]
      .map(([name, applicants]) => ({ name, applicants }))
      .sort((a, b) => b.applicants - a.applicants)
      .slice(0, limit);
};

const countRecentApplicants = (candidates = [], days = 7) => {
   const now = Date.now();
   const threshold = days * 24 * 60 * 60 * 1000;
   return candidates.reduce((count, item) => {
      const dateValue = item?.appliedAt || item?.updatedAt;
      if (!dateValue) return count;
      const appliedAt = new Date(dateValue);
      if (Number.isNaN(appliedAt.getTime())) return count;
      return now - appliedAt.getTime() <= threshold ? count + 1 : count;
   }, 0);
};

const resolveCandidatePayload = (response) => {
   if (!response) return [];
   if (Array.isArray(response)) return response;
   if (Array.isArray(response.data)) return response.data;
   if (Array.isArray(response.data?.data)) return response.data.data;
   return [];
};

const getProfileCompletion = (profile) => {
   if (!profile) return 0;
   const fields = [
      profile.name,
      profile.logo,
      profile.website,
      profile.email,
      profile.phone,
      profile.address,
      profile.description,
      profile.companySize,
      profile.foundedYear,
   ];

   const completed = fields.filter((value) => {
      if (typeof value === 'number') return value > 0;
      return Boolean(value);
   }).length;

   return Math.round((completed / fields.length) * 100);
};

const normalizeStatus = (status) => {
   if (!status) return 'APPLIED';
   return String(status).toUpperCase();
};

const buildStatusSummary = (candidates = []) => {
   return candidates.reduce(
      (acc, item) => {
         const key = normalizeStatus(item?.status);
         acc[key] = (acc[key] || 0) + 1;
         return acc;
      },
      {
         APPLIED: 0,
         REVIEWING: 0,
         INTERVIEW: 0,
         ACCEPTED: 0,
         REJECTED: 0,
         CANCELLED: 0,
      }
   );
};

const buildFunnelMetrics = (statusSummary, total) => {
   const reviewed = (statusSummary.REVIEWING || 0)
      + (statusSummary.INTERVIEW || 0)
      + (statusSummary.ACCEPTED || 0)
      + (statusSummary.REJECTED || 0)
      + (statusSummary.CANCELLED || 0);

   const responseRate = total > 0 ? reviewed / total : 0;
   const interviewRate = total > 0 ? (statusSummary.INTERVIEW || 0) / total : 0;
   const offerRate = total > 0 ? (statusSummary.ACCEPTED || 0) / total : 0;

   return {
      total,
      reviewed,
      interview: statusSummary.INTERVIEW || 0,
      accepted: statusSummary.ACCEPTED || 0,
      responseRate,
      interviewRate,
      offerRate,
   };
};

const buildAverageReviewTimeDays = (candidates = []) => {
   const diffs = candidates
      .map((item) => {
         const start = item?.appliedAt ? new Date(item.appliedAt) : null;
         const end = item?.updatedAt ? new Date(item.updatedAt) : null;
         if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
         const diffMs = end.getTime() - start.getTime();
         if (diffMs <= 0) return null;
         return diffMs / (24 * 60 * 60 * 1000);
      })
      .filter((value) => typeof value === 'number');

   if (!diffs.length) return null;
   const total = diffs.reduce((sum, value) => sum + value, 0);
   return total / diffs.length;
};

const buildAverageMatchScore = (candidates = []) => {
   const scores = candidates
      .map((item) => item?.matchInsight?.matchScore)
      .filter((value) => typeof value === 'number');

   if (!scores.length) return null;
   const total = scores.reduce((sum, value) => sum + value, 0);
   return total / scores.length;
};

const buildRecentActivity = (candidates = [], limit = 4) => {
   return [...candidates]
      .filter((item) => item?.appliedAt)
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
      .slice(0, limit)
      .map((item) => {
         const appliedAt = new Date(item.appliedAt);
         const timeLabel = Number.isNaN(appliedAt.getTime())
            ? 'Moi'
            : appliedAt.toLocaleDateString('vi-VN');
         return {
            id: item.applicationId || item.id || `${item.jobId}-${item.candidateId}`,
            name: item.fullName,
            jobName: item.jobName,
            timeLabel,
         };
      });
};

export default function Home() {
   const location = useLocation();
   const navigate = useNavigate();
   const clearCart = useCartStore((state) => state.clearCart);
   const user = useUserStore((state) => state.user);
   const companyId = user?.companyId;

   const [stats, setStats] = useState({ active: 0, paused: 0, closed: 0, totalApplicants: 0 });
   const [applicationData, setApplicationData] = useState(() => buildMonthlyApplications([]));
   const [topJobsData, setTopJobsData] = useState([]);
   const [newApplicants, setNewApplicants] = useState(0);
   const [profileCompletion, setProfileCompletion] = useState(0);
   const [totalCandidates, setTotalCandidates] = useState(0);
   const [loadingDashboard, setLoadingDashboard] = useState(true);
   const [statusSummary, setStatusSummary] = useState({
      APPLIED: 0,
      REVIEWING: 0,
      INTERVIEW: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      CANCELLED: 0,
   });
   const [funnelMetrics, setFunnelMetrics] = useState({
      total: 0,
      reviewed: 0,
      interview: 0,
      accepted: 0,
      responseRate: 0,
      interviewRate: 0,
      offerRate: 0,
   });
   const [avgReviewTimeDays, setAvgReviewTimeDays] = useState(null);
   const [avgMatchScore, setAvgMatchScore] = useState(null);
   const [recentActivity, setRecentActivity] = useState([]);

   useEffect(() => {
      const params = new URLSearchParams(location.search);
      const paymentStatus = params.get('paymentStatus');

      if (!paymentStatus) return;

      if (paymentStatus === 'success') {
         clearCart();
         toast.success('Thanh toan thanh cong');
      } else {
         toast.error('Thanh toan that bai');
      }

      navigate(location.pathname, { replace: true });
   }, [clearCart, location.pathname, location.search, navigate]);

   useEffect(() => {
      let isMounted = true;

      const fetchDashboardData = async () => {
         setLoadingDashboard(true);

         try {
            const [statsResponse, candidatesResponse, profileResponse] = await Promise.all([
               getMyStats().catch(() => null),
               getCandidatesForEmployer().catch(() => null),
               companyId ? getCompanyProfile(companyId).catch(() => null) : Promise.resolve(null),
            ]);

            if (!isMounted) return;

            if (statsResponse) {
               setStats({
                  active: statsResponse.active || 0,
                  paused: statsResponse.paused || 0,
                  closed: statsResponse.closed || 0,
                  totalApplicants: statsResponse.totalApplicants || 0,
               });
            }

            const candidatePayload = resolveCandidatePayload(candidatesResponse);
            setTotalCandidates(candidatePayload.length);
            setApplicationData(buildMonthlyApplications(candidatePayload));
            setTopJobsData(buildTopJobs(candidatePayload));
            setNewApplicants(countRecentApplicants(candidatePayload));
               const summary = buildStatusSummary(candidatePayload);
               setStatusSummary(summary);
               setFunnelMetrics(buildFunnelMetrics(summary, candidatePayload.length));
               setAvgReviewTimeDays(buildAverageReviewTimeDays(candidatePayload));
               setAvgMatchScore(buildAverageMatchScore(candidatePayload));
               setRecentActivity(buildRecentActivity(candidatePayload));

            if (profileResponse) {
               setProfileCompletion(getProfileCompletion(profileResponse));
            }
         } catch (error) {
            console.error('Dashboard fetch error:', error);
         } finally {
            if (isMounted) {
               setLoadingDashboard(false);
            }
         }
      };

      fetchDashboardData();

      return () => {
         isMounted = false;
      };
   }, [companyId]);

   return (
      <div className="max-w-[1440px] mx-auto space-y-6 pb-8">
         <HeroWelcome newApplicants={newApplicants} />
         <PlatformIntro />
         <KeyFeatures />
         <HowItWorks />
         <HiringTips />
         <RecommendedActions
            stats={stats}
            profileCompletion={profileCompletion}
            totalCandidates={totalCandidates}
            isLoading={loadingDashboard}
         />
         <AnalyticsOverview
            stats={stats}
            applicationData={applicationData}
            topJobsData={topJobsData}
            isLoading={loadingDashboard}
         />
         <AnalyticsModels
            statusSummary={statusSummary}
            funnelMetrics={funnelMetrics}
            avgReviewTimeDays={avgReviewTimeDays}
            avgMatchScore={avgMatchScore}
            recentActivity={recentActivity}
            isLoading={loadingDashboard}
         />
      </div>
   );
}
