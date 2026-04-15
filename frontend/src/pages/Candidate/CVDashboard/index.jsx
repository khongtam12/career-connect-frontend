import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FilePlus2,
  FileText,
  Star,
  Plus,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import CVCard from './components/CVCard'

/* ── Stat card (small widget) ── */
function StatWidget({ icon: Icon, value, label, accent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="flex items-center gap-4 px-6 py-5 h-full rounded-2xl shadow-sm border border-zinc-200">
        <div className={cn(
          'size-10 rounded-xl flex items-center justify-center shrink-0',
          accent
            ? 'bg-zinc-900 text-white'
            : 'bg-zinc-100 text-zinc-500',
        )}>
          <Icon size={18} strokeWidth={2} />
        </div>
        <div>
          <p className={cn('text-2xl font-bold tracking-tight leading-none',
            accent ? 'text-zinc-900' : 'text-zinc-800')}>{value}</p>
          <p className="text-xs text-zinc-500 mt-1 font-medium">{label}</p>
        </div>
      </Card>
    </motion.div>
  )
}

/* ── "Tạo CV mới" card placeholder in grid ── */
function NewCVCard({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.42, ease: [0.23, 1, 0.32, 1] }}
    >
      <button
        onClick={onClick}
        className={cn(
          'w-full h-full min-h-[260px] flex flex-col items-center justify-center gap-4',
          'rounded-2xl border-2 border-dashed border-zinc-300',
          'bg-zinc-50/50 text-zinc-400',
          'hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-600',
          'hover:shadow-sm hover:-translate-y-1',
          'transition-all duration-300 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900',
          'group',
        )}
        aria-label="Tạo CV mới"
      >
        <div className={cn(
          'size-12 rounded-2xl flex items-center justify-center',
          'bg-zinc-200/50 text-zinc-500',
          'group-hover:bg-zinc-200 group-hover:text-zinc-800 group-hover:scale-110',
          'transition-all duration-300',
        )}>
          <Plus size={22} strokeWidth={2} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-zinc-700">Tạo CV mới</p>
          <p className="text-xs text-zinc-500 mt-1">Bắt đầu với mẫu đẹp</p>
        </div>
      </button>
    </motion.div>
  )
}

/* ── Empty state ── */
function EmptyState({ onCreateClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col items-center justify-center py-24"
    >
      <Card
        className={cn(
          'w-full max-w-md text-center',
          'border-2 border-dashed border-zinc-200',
          'shadow-sm rounded-2xl',
        )}
      >
        <CardContent className="flex flex-col items-center gap-5 py-14 px-10">
          {/* Icon */}
          <div className={cn(
            'size-16 rounded-2xl flex items-center justify-center',
            'bg-zinc-100 text-zinc-600',
            'shadow-sm',
          )}>
            <FilePlus2 size={28} strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-900 tracking-tight">
              Bạn chưa có CV nào
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
              Hãy tạo CV đầu tiên để bắt đầu hành trình tìm việc của bạn.
            </p>
          </div>

          <Button
            variant="default"
            onClick={onCreateClick}
            className="mt-2 gap-2 bg-zinc-900 text-white hover:bg-zinc-800 h-10 px-6 rounded-xl font-medium"
          >
            <Plus size={16} strokeWidth={2.5} />
            Tạo CV ngay
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   Dashboard Page
   ═══════════════════════════════════════════ */
export default function CVDashboard() {
  const navigate = useNavigate()
  const [cvList, setCvList] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const list = JSON.parse(localStorage.getItem('cv_list') || '[]')
      setCvList(list)
    } catch (e) {
      console.error('Failed to parse cv_list:', e)
    }
  }, [])

  const handleCreate = () => {
    try {
      const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const newId = `cv_${uuid}`

      const draft = {
        id: newId,
        name: 'CV chưa đặt tên',
        templateId: 1,
        data: {
          personal: {}, skills: [], experience: [],
          education: [], projects: [], certificates: [],
        },
        updatedAt: new Date().toISOString(),
        isDraft: true,
      }

      localStorage.setItem(`draft_cv_${newId}`, JSON.stringify(draft))
      navigate(`/cv-builder?id=${newId}`)
    } catch (err) {
      console.error('Không thể khởi tạo bản nháp:', err)
      alert('Đã xảy ra lỗi. Vui lòng thử lại.')
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa CV này? Hành động này không thể hoàn tác.')) return
    try {
      const next = cvList.filter(cv => cv.id !== id)
      localStorage.setItem('cv_list', JSON.stringify(next))
      setCvList(next)
    } catch (e) {
      console.error('Lỗi khi xóa CV:', e)
      alert('Đã xảy ra lỗi khi xóa CV. Vui lòng thử lại.')
    }
  }

  if (!mounted) {
    return null
  }

  const isEmpty = cvList.length === 0

  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans">
      <main className="max-w-screen-xl w-full mx-auto px-6 py-10 md:py-14">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2"
            >
              <LayoutDashboard size={24} className="text-zinc-800" />
              CV của tôi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="text-sm text-zinc-500 mt-2 ml-8"
            >
              Quản lý và tạo CV chuyên nghiệp để chinh phục nhà tuyển dụng
            </motion.p>
          </div>

          {!isEmpty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <Button onClick={handleCreate} className="gap-2 shadow-sm bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl h-10 px-5 font-medium">
                <Plus size={16} strokeWidth={2.5} />
                Tạo CV mới
              </Button>
            </motion.div>
          )}
        </div>

        {isEmpty ? (
          <EmptyState onCreateClick={handleCreate} />
        ) : (
          <>
            {/* ── Stats bar ── */}
            <div className="grid grid-cols-[1fr_2fr] gap-4 mb-10">
              <StatWidget icon={FileText} value={cvList.length} label="Tổng CV" accent />
              {/* Tip banner — wider column */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.12 }}
              >
                <Card className={cn(
                  'flex items-center gap-4 px-6 py-5 h-full rounded-2xl',
                  'bg-gradient-to-r from-blue-50 to-indigo-50',
                  'border-blue-100 shadow-sm border',
                )}>
                  <div className="size-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <TrendingUp size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Mẹo: CV tốt = Cơ hội tốt!</p>
                    <p className="text-xs text-blue-600/80 mt-0.5 leading-relaxed">
                      Luôn cập nhật CV để thu hút nhà tuyển dụng
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>

            <Separator className="mb-8" />

            {/* ── CV Grid ── */}
            <AnimatePresence>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {cvList.map((cv, i) => (
                  <CVCard
                    key={cv.id}
                    cv={cv}
                    index={i}
                    onDelete={handleDelete}
                  />
                ))}
                {/* New CV card always last */}
                <NewCVCard onClick={handleCreate} />
              </div>
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  )
}
