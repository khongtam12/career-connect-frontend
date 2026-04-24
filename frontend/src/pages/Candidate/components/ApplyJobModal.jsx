import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { applyForJob } from '../../../service/jobService';
import * as cvService from '../../../service/cvService';
import { useUserStore } from '../../../stores/useUserStore';

export default function ApplyJobModal({ open, onClose, job }) {
  const [cvList, setCvList] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState('');
  const [note, setNote] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { user } = useUserStore();

  // Load CVs from API
  useEffect(() => {
    if (open && user) {
      const fetchCVs = async () => {
        try {
          const list = await cvService.getMyCVs();
          setCvList(list);
          if (list.length > 0) setSelectedCvId(list[0].id);
        } catch {
          setCvList([]);
        }
      };
      fetchCVs();
      
      // Reset states
      setNote('');
      setAgreed(false);
      setSuccess(false);
      setError('');
    }
  }, [open, user]);

  const handleSubmit = async () => {
    if (!selectedCvId) {
      setError('Vui lòng chọn CV để ứng tuyển.');
      return;
    }
    if (!agreed) {
      setError('Vui lòng đồng ý với điều khoản sử dụng.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await applyForJob({
        jobId: String(job.id),
        cvId: selectedCvId,
        note: note.trim() || undefined,
      });
      setSuccess(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Đã xảy ra lỗi khi nộp hồ sơ. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <div
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ─── Success State ─── */}
              {success ? (
                <div className="px-8 py-14 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="text-emerald-600" size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Ứng tuyển thành công!
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Hồ sơ của bạn đã được gửi đến nhà tuyển dụng. Chúc bạn may
                    mắn!
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              ) : (
                <>
                  {/* ─── Header ─── */}
                  <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                      <X size={22} />
                    </button>
                    <h2 className="text-white font-bold text-lg pr-8">
                      Ứng tuyển{' '}
                      <span className="font-extrabold">{job?.title}</span>
                    </h2>
                  </div>

                  {/* ─── Body ─── */}
                  <div className="px-6 py-6 max-h-[65vh] overflow-y-auto space-y-6">
                    {/* CV Selection */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                        <FileText size={18} className="text-emerald-600" />
                        Chọn CV để ứng tuyển
                      </label>

                      {cvList.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                          <FileText
                            size={36}
                            className="text-gray-300 mx-auto mb-3"
                          />
                          <p className="text-sm text-gray-500 mb-1">
                            Bạn chưa có CV nào trong thư viện.
                          </p>
                          <a
                            href="/cv-builder"
                            className="text-sm text-emerald-600 font-semibold hover:underline"
                          >
                            Tạo CV ngay →
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {cvList.map((cv) => (
                            <label
                              key={cv.id}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                selectedCvId === cv.id
                                  ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name="cv-select"
                                value={cv.id}
                                checked={selectedCvId === cv.id}
                                onChange={() => setSelectedCvId(cv.id)}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  selectedCvId === cv.id
                                    ? 'border-emerald-500'
                                    : 'border-gray-300'
                                }`}
                              >
                                {selectedCvId === cv.id && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {cv.name || 'CV chưa đặt tên'}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Cập nhật:{' '}
                                  {cv.updatedAt
                                    ? new Date(cv.updatedAt).toLocaleDateString(
                                        'vi-VN'
                                      )
                                    : 'Không rõ'}
                                </p>
                              </div>
                              {selectedCvId === cv.id && (
                                <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded-lg">
                                  Đã chọn
                                </span>
                              )}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                        <span className="text-emerald-600">✍</span>
                        Thư giới thiệu:
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn gây
                        ấn tượng hơn với nhà tuyển dụng.
                      </p>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Viết giới thiệu ngắn gọn về bản thân và lý do bạn muốn ứng tuyển cho vị trí này."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none placeholder:text-gray-400"
                      />
                    </div>

                    {/* Warning Box */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-amber-700 flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} />
                        Lưu ý:
                      </p>
                      <p className="text-xs text-amber-600 leading-relaxed">
                        Hãy luôn cẩn trọng trong quá trình tìm việc và chủ động
                        nghiên cứu về thông tin công ty, vị trí việc làm trước
                        khi ứng tuyển.
                      </p>
                    </div>

                    {/* Agreement Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-gray-600 leading-relaxed">
                        Tôi đã đọc và đồng ý với{' '}
                        <span className="text-emerald-600 font-semibold">
                          "Thoả thuận sử dụng dữ liệu cá nhân"
                        </span>{' '}
                        của Nhà tuyển dụng.
                      </span>
                    </label>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2"
                      >
                        <AlertTriangle size={16} />
                        {error}
                      </motion.div>
                    )}
                  </div>

                  {/* ─── Footer ─── */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !selectedCvId}
                      className={`w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                        loading || !selectedCvId
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-200 active:scale-[0.98]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Đang gửi...
                        </>
                      ) : (
                        'Nộp hồ sơ ứng tuyển'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
