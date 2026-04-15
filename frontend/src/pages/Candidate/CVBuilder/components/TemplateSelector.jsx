'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const TEMPLATES = [
  { id: 1, name: 'Mẫu CV 1', desc: 'Truyền thống, chuyên nghiệp', gradient: 'from-indigo-500 to-cyan-400' },
  { id: 2, name: 'Mẫu CV 2', desc: 'Sáng tạo, tone tím', gradient: 'from-violet-500 to-purple-400' },
  { id: 3, name: 'Mẫu CV 3', desc: 'Cổ điển, sang trọng xám', gradient: 'from-slate-600 to-slate-400' },
  { id: 4, name: 'Mẫu CV 4', desc: 'Ấn tượng tím đậm', gradient: 'from-purple-700 to-violet-500' },
  { id: 5, name: 'Mẫu CV 5', desc: 'Tối giản, thanh lịch', gradient: 'from-slate-900 to-slate-700' },
  { id: 6, name: 'Mẫu CV 6', desc: 'Nổi bật, tone hồng', gradient: 'from-rose-600 to-pink-400' },
  { id: 7, name: 'Mẫu CV 7', desc: 'Tươi mát, xanh lá', gradient: 'from-emerald-700 to-teal-400' },
  { id: 8, name: 'Mẫu CV 8', desc: 'Tinh tế, xám nhạt', gradient: 'from-slate-400 to-slate-300' },
]

export default function TemplateSelector({ selectedId, onSelect }) {
  const [tooltip, setTooltip] = useState(null)

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-[13px] font-semibold text-foreground/80 tracking-tight">
          Danh sách mẫu CV
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-8">
        {TEMPLATES.map((tpl, i) => {
          const isActive = selectedId === tpl.id
          return (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="relative"
              onMouseEnter={() => setTooltip(tpl.id)}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Tooltip */}
              <AnimatePresence>
                {tooltip === tpl.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2',
                      'bg-slate-800 text-white text-[10px] py-1.5 px-2.5 rounded-lg whitespace-nowrap',
                      'z-50 shadow-soft-sm font-medium tracking-wide'
                    )}
                  >
                    {tpl.desc}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card */}
              <button
                onClick={() => onSelect(tpl.id)}
                className={cn(
                  'w-full aspect-[3/4] rounded-xl flex flex-col items-center justify-end p-2',
                  'bg-gradient-to-br relative overflow-hidden',
                  'transition-all duration-300 ease-out outline-none',
                  tpl.gradient,
                  isActive
                    ? 'ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-soft-md'
                    : 'hover:scale-[1.02] hover:shadow-soft-md ring-1 ring-black/5 opacity-90 hover:opacity-100',
                )}
              >
                {/* Decorative UI elements for template preview */}
                <div className="absolute top-3 inset-x-3 bottom-8 bg-white/20 rounded-md backdrop-blur-sm p-2 flex flex-col gap-1.5">
                  <div className="w-1/2 h-2 bg-white/60 rounded-full" />
                  <div className="w-3/4 h-1.5 bg-white/40 rounded-full" />
                  <div className="w-full h-1 bg-white/30 rounded-full mt-2" />
                  <div className="w-full h-1 bg-white/30 rounded-full" />
                  <div className="w-2/3 h-1 bg-white/30 rounded-full" />
                </div>

                {isActive && (
                  <div className="absolute top-2 right-2 bg-white text-primary rounded-full p-0.5 shadow-sm">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                <span className="text-[11px] text-white font-bold tracking-wide drop-shadow-md z-10 w-full text-center truncate">
                  {tpl.name}
                </span>
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export { TEMPLATES }
