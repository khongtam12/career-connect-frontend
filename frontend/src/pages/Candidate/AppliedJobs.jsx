import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobManagementPanel from './components/JobManagementPanel';
import { getAppliedJobs, getSavedJobs } from './utils/jobTracker';
import { getJobById } from '../../service/jobService';
import { getMyApplications } from '../../service/applicationService';

export default function AppliedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const syncSavedJobs = () => setSavedJobs(getSavedJobs());

    const loadApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getMyApplications();
        const payload = response?.data ?? response;
        const applications = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        const jobDetails = await Promise.all(
          applications.map(async (app) => {
            try {
              const job = await getJobById(app.jobId);
              return { app, job };
            } catch (err) {
              return { app, job: null };
            }
          })
        );

        const mapped = jobDetails.map(({ app, job }) => ({
          id: app.jobId,
          title: job?.title || 'Việc làm',
          companyName: job?.companyName || job?.company?.name || job?.companyId || 'Doanh nghiệp',
          companyLogoUrl: job?.companyLogoUrl || job?.company?.logoUrl || '',
          location: job?.location || '',
          jobType: job?.jobType || '',
          salaryMin: job?.salaryMin ?? null,
          salaryMax: job?.salaryMax ?? null,
          salaryLabel: job?.salary || '',
          status: app.status,
          appliedAt: app.appliedAt,
        }));

        setAppliedJobs(mapped);
      } catch (err) {
        setError('Không thể tải danh sách việc làm đã ứng tuyển.');
        setAppliedJobs(getAppliedJobs());
      } finally {
        setLoading(false);
      }
    };

    syncSavedJobs();
    loadApplications();
    window.addEventListener('jobTrackerUpdated', syncSavedJobs);
    return () => window.removeEventListener('jobTrackerUpdated', syncSavedJobs);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <JobManagementPanel
              activeTab="applied"
              savedJobs={savedJobs}
              appliedJobs={loading ? [] : appliedJobs}
              onTabChange={(tab) => navigate(tab === 'saved' ? '/saved-jobs' : '/applied-jobs')}
              onClose={() => navigate('/')}
            />
            {loading && (
              <div className="mt-4 text-sm text-gray-500">Đang tải hồ sơ ứng tuyển...</div>
            )}
            {error && !loading && (
              <div className="mt-4 text-sm text-red-500">{error}</div>
            )}
          </div>
          <aside className="lg:w-80">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-2">Theo dõi hồ sơ</h3>
              <p className="text-sm text-gray-600">
                Cập nhật trạng thái ứng tuyển thường xuyên để không bỏ lỡ phản hồi từ nhà tuyển dụng.
              </p>
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="mt-4 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Tìm việc khác
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
