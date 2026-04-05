import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pencil,
  Eye,
  Download,
  Trash2,
  FileText,
  Star,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* Template gradient map — mirrors CVPreview */
const TEMPLATE_GRADIENTS = {
  1: 'from-indigo-500 to-cyan-400',
  2: 'from-violet-500 to-purple-400',
  3: 'from-slate-600 to-slate-400',
  4: 'from-purple-700 to-violet-500',
  5: 'from-slate-900 to-slate-700',
  6: 'from-rose-600 to-pink-400',
  7: 'from-emerald-700 to-teal-400',
  8: 'from-slate-400 to-slate-300',
}

const fmtDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/**
 * CVCard
 * Hover overlay reveals action buttons. Stagger animation via CSS delay.
 */
export default function CVCard({ cv, index = 0, onDelete }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  const gradient = TEMPLATE_GRADIENTS[cv.templateId] || TEMPLATE_GRADIENTS[1]
  const p = cv.data?.personal || {}

  const handleEdit = () => navigate(`/cv-builder?id=${cv.id}`)
  const handlePDF  = () => {
    navigate(`/cv-builder?id=${cv.id}&print=1`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden',
        'bg-white border border-zinc-200',
        'shadow-soft-sm transition-all duration-300 ease-out',
        'hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1.5',
        'cursor-pointer bg-white'
      )}
    >
      {/* ── Thumbnail / Preview Cover ── */}
      <div
        className={cn(
          'relative h-36 bg-gradient-to-br shrink-0 overflow-hidden',
          gradient,
        )}
        onClick={handleEdit}
      >
        {/* Decorative CV lines */}
        <div className="absolute inset-0 flex flex-col justify-center gap-2 px-5 py-4 opacity-25">
          <div className="h-2.5 w-3/5 rounded-full bg-white" />
          <div className="h-1.5 w-2/5 rounded-full bg-white" />
          <div className="mt-2 space-y-1.5">
            {[4, 5, 3, 4].map((w, i) => (
              <div key={i} className={`h-1 rounded-full bg-white`} style={{ width: `${w * 12}%` }} />
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px]">
            Mẫu {cv.templateId}
          </Badge>
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center gap-2"
            >
              <Button
                variant="default"
                size="sm"
                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                className="shadow-sm bg-white text-zinc-900 hover:bg-zinc-100 gap-1.5 h-8 text-xs font-semibold px-3"
              >
                <Pencil size={13} strokeWidth={2.5} />
                Chỉnh sửa
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                className="bg-white/20 text-white hover:bg-white/30 hover:text-white h-8 w-8 rounded-md"
                aria-label="Xem trước"
                title="Xem trước"
              >
                <Eye size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); handlePDF(); }}
                className="bg-white/20 text-white hover:bg-white/30 hover:text-white h-8 w-8 rounded-md"
                aria-label="Xuất PDF"
                title="Xuất PDF"
              >
                <Download size={15} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-3 p-4 bg-white flex-1" onClick={handleEdit}>
        {/* CV name */}
        <div>
          <p className="text-sm font-semibold text-zinc-900 leading-tight line-clamp-1">
            {cv.name || 'Chưa đặt tên'}
          </p>
          {p.fullName && (
            <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
              <FileText size={11} />
              {p.fullName}
            </p>
          )}
        </div>

        {p.jobTitle && (
          <p className="text-xs text-primary/80 font-medium line-clamp-1">
            {p.jobTitle}
          </p>
        )}

        <p className="text-xs text-zinc-400 mt-auto">
          Cập nhật: {fmtDate(cv.updatedAt)}
        </p>
      </div>

      {/* ── Footer actions (always visible) ── */}
      <div
        className="flex items-center justify-between gap-2 px-4 pb-4 pt-0 bg-white"
        onClick={e => e.stopPropagation()}
      >
        <Button variant="default" onClick={handleEdit} className="flex-1 gap-1.5 bg-zinc-900 text-white hover:bg-zinc-800 h-8 text-xs font-semibold px-3">
          <Pencil size={12} strokeWidth={2.5} />
          Chỉnh sửa
        </Button>
        <Button
          variant="ghost"
          onClick={handlePDF}
          aria-label="Xuất PDF"
          title="Xuất PDF"
          className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 h-8 w-8 p-0 rounded-md flex items-center justify-center"
        >
          <Download size={14} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onDelete?.(cv.id)}
          aria-label="Xóa CV"
          title="Xóa CV"
          className="text-zinc-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-md flex items-center justify-center"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </motion.div>
  )
}
