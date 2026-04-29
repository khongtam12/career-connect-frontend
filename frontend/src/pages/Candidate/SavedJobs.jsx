import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobManagementPanel from './components/JobManagementPanel';
import { getAppliedJobs, getSavedJobs } from './utils/jobTracker';

export default function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const syncManagedJobs = () => {
      setSavedJobs(getSavedJobs());
      setAppliedJobs(getAppliedJobs());
    };

    syncManagedJobs();
    window.addEventListener('jobTrackerUpdated', syncManagedJobs);
    return () => window.removeEventListener('jobTrackerUpdated', syncManagedJobs);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <JobManagementPanel
              activeTab="saved"
              savedJobs={savedJobs}
              appliedJobs={appliedJobs}
              onTabChange={(tab) => navigate(tab === 'saved' ? '/saved-jobs' : '/applied-jobs')}
              onClose={() => navigate('/')}
            />
          </div>
          <aside className="lg:w-80">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-2">Gợi ý</h3>
              <p className="text-sm text-gray-600">
                Lưu việc làm để theo dõi nhanh, sau đó quay lại ứng tuyển khi bạn đã sẵn sàng.
              </p>
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="mt-4 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Tìm việc mới
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
