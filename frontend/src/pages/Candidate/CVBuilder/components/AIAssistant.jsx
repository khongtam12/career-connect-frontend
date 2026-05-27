'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, X, Target, Copy, Zap, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import { calcCVScore } from '@/lib/utils' 
import { Button } from '@/components/ui/button'
import * as cvService from '@/service/cvService'
import { toast } from 'react-toastify'

const PROFILE_SUGGESTIONS = [
  'Kỹ sư phần mềm với hơn 3 năm kinh nghiệm phát triển ứng dụng web full-stack. Có khả năng làm việc trong môi trường Agile, hiểu biết sâu về React, Node.js và các công nghệ đám mây. Luôn chủ động học hỏi và đóng góp cho sản phẩm kỹ thuật số chất lượng cao.',
  'Lập trình viên Frontend đam mê xây dựng giao diện người dùng trực quan và hiệu suất cao. Thành thạo React, TypeScript và các công nghệ CSS hiện đại. Kinh nghiệm làm việc với team quốc tế và triển khai hệ thống phục vụ hàng triệu người dùng.',
]

export default function AIAssistant({ data, onSave }) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  
  // Get editId from URL if possible
  const editId = new URLSearchParams(window.location.search).get('id')

  // Inline score calculation for the main panel
  const calcScore = (d) => {
    let score = 0
    const p = d.personal || {}
    const suggestions = []
    if (p.fullName) score += 10
    if (p.email) score += 8
    if (p.jobTitle) score += 7
    if (p.summary && p.summary.length > 50) score += 10
    else suggestions.push('Bổ sung mục tiêu nghề nghiệp chi tiết hơn')
    const skills = d.skills || []
    if (skills.length >= 5) score += 15
    const exp = d.experience || []
    if (exp.length > 0) score += 15
    return { score: Math.min(score, 100), suggestions }
  }

  const { score: initialScore, suggestions: initialSuggestions } = calcScore(data)
  
  const handleAIReview = async () => {
    let currentEditId = editId;

    if (!currentEditId || currentEditId.startsWith('cv_')) {
      if (onSave) {
        toast.info('Đang tự động lưu CV trước khi nhận Review từ AI...', { toastId: 'ai-save' })
        try {
          const result = await onSave()
          if (result && result.id) {
            currentEditId = result.id
            toast.success('Đã lưu CV thành công!')
          } else {
            return // Lưu thất bại (do người dùng chưa nhập đủ info hoặc lỗi)
          }
        } catch (err) {
          toast.error('Không thể lưu CV. Vui lòng thử lại.')
          return
        }
      } else {
        alert('Vui lòng lưu CV trước khi nhận Review từ AI!')
        return
      }
    }
    
    setLoading(true)
    setShowModal(true)
    try {
      const result = await cvService.reviewCV(currentEditId)
      console.log(">>> AI REVIEW RESULT FROM SERVER:", result)
      setAiResult(result)
    } catch (err) {
      console.error(err)
      alert('Không thể kết nối với AI Assistant. Vui lòng thử lại sau!')
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  const displayScore = aiResult ? aiResult.score : initialScore
  const displayStrengths = aiResult ? aiResult.strengths : PROFILE_SUGGESTIONS
  const displayImprovements = aiResult ? aiResult.improvements : initialSuggestions

  const statusConfig = {
    high:   { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', icon: '🌟', msg: 'Rất tốt! Tiếp tục phát huy' },
    medium: { color: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',   icon: '💡', msg: 'Khá tốt! Thêm vài mục nữa nhé' },
    low:    { color: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50',     icon: '⚡', msg: 'Hãy bổ sung thêm thông tin' }
  }

  const statusKey = displayScore >= 80 ? 'high' : displayScore >= 50 ? 'medium' : 'low'
  const st = statusConfig[statusKey]

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    alert('Đã copy vào clipboard!')
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-soft-sm overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 px-5 py-4 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-inner">
            <Cpu size={22} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight leading-none">Hệ Thống Tối Ưu</h3>
            <p className="text-white/80 text-xs mt-1 font-medium">Phân tích chuyên sâu & đề xuất</p>
          </div>
        </div>

        {/* Score */}
        <div className="p-5 border-b border-zinc-200/60">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-foreground tracking-tight uppercase">Độ hoàn thiện CV</span>
            <span className={cn('text-xl font-black leading-none drop-shadow-sm', st.text.replace('text-', 'text-').replace('-700', '-600'))}>{displayScore}%</span>
          </div>
          <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${displayScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn('h-full rounded-full relative', st.color)}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
          <div className={cn('text-xs font-semibold flex items-center gap-1.5', st.text)}>
            <span>{st.icon}</span> {st.msg}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 flex flex-col gap-3">
          <Button
            variant="default"
            className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-soft-md shadow-indigo-500/20"
            onClick={handleAIReview}
          >
            <Zap size={16} />
            Kích hoạt phân tích tối ưu
          </Button>
        </div>
      </div>

      {/* Review Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-soft-xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base leading-none tracking-tight">Bản Phân Tích Chuyên Sâu</h2>
                    <p className="text-white/80 text-xs mt-1">Đánh giá toàn diện và cấu trúc tối ưu</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="size-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-indigo-600 font-bold animate-pulse">Hệ thống đang phân tích CV của bạn...</p>
                  </div>
                ) : (
                  <>
                    {/* Score Banner */}
                    <div className={cn('p-4 rounded-xl border flex items-center gap-4', st.bg, st.text.replace('text-', 'border-').replace('-700', '-200'))}>
                      <div className={cn('size-12 rounded-full flex items-center justify-center text-2xl bg-white shadow-soft-sm shrink-0')}>
                        {st.icon}
                      </div>
                      <div>
                        <h3 className={cn('font-bold tracking-tight', st.text)}>Điểm đánh giá: {displayScore}/100</h3>
                        <p className={cn('text-sm mt-0.5 leading-snug', st.text.replace('-700', '-600'))}>
                          {aiResult ? 'Dựa trên phân tích nội dung thực tế của CV.' : 'Đánh giá dựa trên độ hoàn thiện các mục thông tin.'}
                        </p>
                      </div>
                    </div>

                    {/* AI Results */}
                    {aiResult && (
                      <div className="space-y-6">
                        {/* strengths */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <Target size={16} className="text-indigo-500" /> Ưu điểm hồ sơ
                          </h4>
                          <div className="space-y-3">
                            {displayStrengths.map((s, i) => (
                              <div key={i} className="group relative p-4 rounded-xl border border-zinc-200 bg-emerald-50/30">
                                <p className="text-sm text-foreground/80 leading-relaxed">{s}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Improvements */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <Zap size={16} className="text-amber-500" /> Điểm cần cải thiện
                          </h4>
                          <div className="space-y-2">
                            {displayImprovements.map((s, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/50">
                                <div className="mt-0.5 size-1.5 rounded-full bg-red-400 shrink-0" />
                                <p className="text-sm text-red-900/80 leading-tight">{s}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
