import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/component/user/Header'
import CVCard from '@/component/user/cv-shared/CVCard'

export default function CVDashboard() {
  const navigate = useNavigate()
  const [cvList, setCvList] = useState([])
  const [mounted, setMounted] = useState(false)

  // Load CVs from localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const list = JSON.parse(localStorage.getItem('cv_list') || '[]')
      setCvList(list)
    } catch (e) {
      console.error('Failed to parse cv_list', e)
    }
  }, [])

  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá CV này không?')) return
    
    try {
      const newList = cvList.filter(cv => cv.id !== id)
      localStorage.setItem('cv_list', JSON.stringify(newList))
      setCvList(newList)
    } catch (e) {
      console.error('Failed to update cv_list', e)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-screen-xl w-full mx-auto px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <LayoutDashboard className="text-primary" size={28} />
              Quản lý CV
            </h1>
            <p className="text-slate-500 mt-1">
              Khởi tạo, chỉnh sửa và quản lý các mẫu CV của bạn
            </p>
          </div>
          
          <Button 
            size="lg" 
            className="gap-2 shrink-0 bg-primary hover:bg-primary/90 text-white shadow-soft-md hover:shadow-soft-lg transition-all"
            onClick={() => navigate('/cv-builder')}
          >
            <Plus size={18} strokeWidth={2.5} />
            Tạo mới CV
          </Button>
        </div>

        {cvList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 flex flex-col items-center justify-center text-center shadow-soft-sm">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Chưa có CV nào</h2>
            <p className="text-slate-500 max-w-md mb-6">
              Bạn chưa tạo CV nào trên hệ thống. Hãy bắt đầu tạo một CV thật chuyên nghiệp để ghi điểm với nhà tuyển dụng nhé!
            </p>
            <Button 
              onClick={() => navigate('/cv-builder')}
              className="gap-2"
            >
              <Plus size={16} />
              Tạo CV ngay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {cvList.map((cv, idx) => (
                <motion.div
                  key={cv.id}
                  layout 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                  transition={{ duration: 0.25 }}
                >
                  <CVCard 
                    cv={cv} 
                    index={idx} 
                    onDelete={handleDelete} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}
