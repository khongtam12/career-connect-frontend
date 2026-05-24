'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Printer,
  Save,
  PenLine,
  Bot,
  User as UserIcon,
  Loader2
} from 'lucide-react'
import html2pdf from 'html2pdf.js'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import TemplateSelector from './components/TemplateSelector'
import CVForm from './components/CVForm'
import CVPreview from './components/CVPreview'
import AIAssistant from './components/AIAssistant'
import * as cvService from '../../../service/cvService'
import { useUserStore } from '../../../stores/useUserStore'
import { toast } from 'react-toastify'

const EMPTY_CV = {
  personal: { fullName: '', email: '', phone: '', address: '', dob: '', jobTitle: '', linkedin: '', summary: '', avatar: null },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certificates: [],
}

export default function EditorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const isPrintMode = searchParams.get('print') === '1'

  // States
  const templateParam = parseInt(searchParams.get('template') || '1', 10)
  const [templateId, setTemplateId] = useState(templateParam)
  const [cvData, setCvData] = useState(EMPTY_CV)
  const [cvName, setCvName] = useState('CV của tôi')
  const [saved, setSaved] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [zoom, setZoom] = useState(80)
  const [activeTab, setActiveTab] = useState('form')
  
  const [isValidating, setIsValidating] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Guard Clause Luồng Bảo Vệ (Protection Flow)
  useEffect(() => {
    const loadCV = async () => {
      if (!editId || editId.startsWith('cv_')) {
        setIsValidating(false)
        setMounted(true)
        return
      }

      try {
        const data = await cvService.getCVById(editId)
        if (data) {
          // Map backend flat structure to frontend nested personal object
          const mappedData = {
            personal: {
              fullName: data.fullName || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              dob: data.dob || '',
              jobTitle: data.jobTitle || '',
              linkedin: data.linkedin || '',
              summary: data.summary || '',
              avatar: data.avatarUrl || null
            },
            skills: data.skills || [],
            experience: (data.experiences || []).map(e => ({
              ...e,
              start: e.startDate,
              end: e.endDate,
              desc: e.description
            })),
            education: (data.educations || []).map(e => ({
              ...e,
              start: e.startDate,
              end: e.endDate,
              desc: e.description
            })),
            projects: (data.projects || []).map(p => ({
              ...p,
              start: p.startDate,
              end: p.endDate,
              desc: p.description
            })),
            certificates: (data.certificates || []).map(c => ({
              ...c,
              org: c.issuer
            }))
          }
          setCvData(mappedData)
          setTemplateId(data.templateId || 1)
          setCvName(data.name || 'CV của tôi')
        }
      } catch (err) {
        console.warn('Flow Guard Blocked:', err.message)
        navigate('/cv-dashboard', { replace: true })
      } finally {
        setIsValidating(false)
        setMounted(true)
      }
    }

    loadCV()
  }, [editId, navigate])

  // Auto-trigger print if arrived with ?print=1
  useEffect(() => {
    if (isPrintMode && mounted && !isValidating) {
      const exportPdf = async () => {
        try {
          const element = document.getElementById('cv-preview-root');
          if (element) {
            const opt = {
              margin: 0,
              filename: `${cvName || 'CV'}.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true, logging: false },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            toast.info('Đang chuẩn bị tải xuống PDF...');
            await html2pdf().set(opt).from(element).save();
            toast.success('Tải PDF thành công!');
            setTimeout(() => {
              navigate('/cv-dashboard');
            }, 2000);
          } else {
            setTimeout(() => window.print(), 500);
          }
        } catch (err) {
            console.error('Lỗi khi xuất PDF:', err);
            toast.error('Không thể xuất PDF. Vui lòng thử lại.');
            navigate('/cv-dashboard');
        }
      };
      
      setTimeout(exportPdf, 800); // Wait a bit for images to load
    }
  }, [isPrintMode, mounted, isValidating, cvName, navigate])

  const { user } = useUserStore()

  // Auto-fill personal info from user-service if it's a new CV
  useEffect(() => {
    if ((!editId || editId.startsWith('cv_')) && user && cvData.personal.fullName === '') {
      setCvData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          avatar: user.avatar || null
        }
      }))
    }
  }, [user, editId])

  const saveCVData = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu CV')
      return null
    }

    try {
      const payload = {
        ...cvData.personal,
        avatarUrl: cvData.personal.avatar,
        skills: cvData.skills,
        experiences: cvData.experience.map(e => ({
          ...e,
          startDate: e.start,
          endDate: e.end,
          description: e.desc
        })),
        educations: cvData.education.map(e => ({
          ...e,
          startDate: e.start,
          endDate: e.end,
          description: e.desc
        })),
        projects: cvData.projects.map(p => ({
          ...p,
          startDate: p.start,
          endDate: p.end,
          description: p.desc
        })),
        certificates: cvData.certificates.map(c => ({
          ...c,
          issuer: c.org
        })),
        id: editId && !editId.startsWith('cv_') ? editId : null,
        userId: user.userId || user.id, // Đồng nhất với user-service
        name: cvName,
        templateId,
        status: 'PUBLISHED'
      }

      console.log('📦 [CV Flow] Dữ liệu CV đã sẵn sàng gửi lên Backend:', payload);

      let result
      if (payload.id) {
        result = await cvService.updateCV(payload.id, payload)
        console.log('✨ [CV Flow] Cập nhật CV thành công:', result);
      } else {
        result = await cvService.createCV(payload)
        console.log('✨ [CV Flow] Tạo mới CV thành công:', result);
      }

      // Cập nhật URL động không load lại trang để lưu trữ đúng ID thực tế
      if (!payload.id && result && result.id) {
        const newUrl = `${window.location.pathname}?id=${result.id}&template=${templateId}`;
        window.history.replaceState(null, '', newUrl);
      }

      return result
    } catch (err) {
      console.error('❌ [CV Flow] Lỗi khi lưu dữ liệu:', err)
      throw err
    }
  }

  const handleSave = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để lưu CV')
      return
    }

    setSaved(true)
    try {
      const result = await saveCVData()
      if (!result) {
        setSaved(false)
        return
      }

      toast.success('Đã lưu thông tin CV. Đang đồng bộ bản PDF...')

      // --- Bước 2: Tự động chụp bản Preview thành PDF và lưu lên S3 ---
      try {
        const element = document.getElementById('cv-preview-root');
        if (element) {
          const opt = {
            margin: 0,
            filename: `CV_${result.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          // Chuyển component thành Blob PDF
          const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
          
          // Gửi file lên server để lưu vào S3
          const formData = new FormData();
          formData.append('file', pdfBlob, `CV_${result.id}.pdf`);
          await cvService.uploadCVFile(result.id, formData);
          
          console.log('✅ [CV Flow] Đã đồng bộ bản PDF lên S3 thành công');
        }
      } catch (pdfErr) {
        console.error('⚠️ [CV Flow] Lỗi khi tạo/upload PDF:', pdfErr);
      }

      setTimeout(() => {
        setSaved(false)
        navigate('/cv-dashboard')
      }, 1500)

    } catch (err) {
      toast.error('Không thể lưu CV. Vui lòng thử lại.')
      setSaved(false)
    }
  }

  const handleExportPDF = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thực hiện xuất PDF')
      return
    }

    setSaved(true)
    try {
      toast.info('Đang tự động lưu CV trước khi xuất PDF...')
      const result = await saveCVData()
      if (!result) {
        setSaved(false)
        return
      }

      toast.success('Đã lưu dữ liệu! Đang chuẩn bị tải xuống PDF...')

      // Đợi 300ms để đảm bảo DOM được đồng bộ
      await new Promise(resolve => setTimeout(resolve, 300))

      const element = document.getElementById('cv-preview-root');
      if (element) {
        const opt = {
          margin: 0,
          filename: `${cvName || 'CV'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Chuyển component thành PDF và tải về máy người dùng
        await html2pdf().set(opt).from(element).save();
        
        // Đồng thời tải bản PDF mới lên S3 luôn để cập nhật đồng bộ
        try {
          const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
          const formData = new FormData();
          formData.append('file', pdfBlob, `CV_${result.id}.pdf`);
          await cvService.uploadCVFile(result.id, formData);
          console.log('✅ [CV Flow] Đã cập nhật bản PDF lên S3 thành công');
        } catch (pdfErr) {
          console.error('⚠️ [CV Flow] Lỗi khi upload PDF lên S3:', pdfErr);
        }

        toast.success('Xuất PDF thành công! Đang quay về trang quản lý...')
        
        setTimeout(() => {
          setSaved(false)
          navigate('/cv-dashboard')
        }, 1500)
      } else {
        throw new Error('Công cụ xuất PDF chưa sẵn sàng')
      }
    } catch (err) {
      console.error('❌ [CV Flow] Lỗi khi tự động lưu và xuất PDF:', err)
      toast.error('Không thể xuất PDF. Vui lòng thử lại.')
      setSaved(false)
    }
  }

  // Hydration & Guard safeguard: Render Soft Loading
  if (isValidating || !mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-zinc-50 w-full">
        <Loader2 className="animate-spin text-primary shrink-0" size={32} />
        <p className="mt-4 text-sm text-zinc-500 font-medium">Đang khởi tạo không gian thiết kế CV...</p>
      </div>
    )
  }

  // Print Mode
  if (isPrintMode) {
    return (
      <div className="bg-white min-h-screen w-full flex justify-center">
        <div id="cv-preview-root" className="w-[210mm] shadow-none">
          <CVPreview data={cvData} templateId={templateId} />
        </div>
      </div>
    )
  }

  // Tiêu chuẩn UI Designer (Premium Aesthetic) - Nền tối, đổ bóng mượt
  return (
    <div className="h-[calc(100vh-64px)] bg-zinc-100 flex flex-col font-sans overflow-hidden">

      {/* Floating Toolbar (Header Bo Góc Cao Cấp) */}
      <div className="flex-none px-6 py-4">
         <div className="h-14 bg-white/70 backdrop-blur-md border border-white/60 shadow-soft-sm rounded-2xl flex items-center justify-between px-6 z-20 relative ring-1 ring-zinc-950/5">
            
            {/* LEFT: Back + Rename input */}
            <div className="flex items-center gap-3">
               <button
                  onClick={() => navigate('/cv-dashboard')}
                  className="size-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors"
                  aria-label="Về trang tổng quan"
               >
                  <ChevronLeft size={16} strokeWidth={2.5} />
               </button>
               <div className="h-4 w-[1px] bg-zinc-300 mx-1" />
               <div className="flex items-center gap-2 bg-transparent focus-within:bg-zinc-100 px-3 py-1.5 rounded-lg transition-colors border border-transparent focus-within:border-zinc-200">
                  <PenLine size={14} className="text-zinc-400" />
                  <input
                     value={cvName}
                     onChange={e => setCvName(e.target.value)}
                     className="bg-transparent border-none outline-none text-[15px] font-semibold text-zinc-800 placeholder-zinc-400 min-w-[200px]"
                     placeholder="Ví dụ: Frontend Developer - Nguyễn Văn A"
                  />
               </div>
            </div>

            {/* RIGHT: Tools */}
            <div className="flex items-center gap-4">
               {/* Zoom Control */}
               <div className="hidden lg:flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl shadow-inner border border-zinc-200/60">
                 <Button variant="ghost" size="icon-xs" onClick={() => setZoom(z => Math.max(40, z - 10))} className="text-zinc-500 hover:text-zinc-900 rounded-lg">
                   <ZoomOut size={14} />
                 </Button>
                 <span className="text-[13px] font-bold text-zinc-700 w-11 text-center font-mono">{zoom}%</span>
                 <Button variant="ghost" size="icon-xs" onClick={() => setZoom(z => Math.min(150, z + 10))} className="text-zinc-500 hover:text-zinc-900 rounded-lg">
                   <ZoomIn size={14} />
                 </Button>
               </div>

               <div className="h-5 w-[1px] bg-zinc-300 hidden md:block" />

               {/* Export & Save Action */}
               <Button variant="secondary" size="sm" onClick={handleExportPDF} className="gap-2 bg-white border-zinc-200 border text-zinc-700 hover:bg-zinc-50 shadow-sm hidden sm:flex">
                  <Printer size={14} /> Xuất PDF
               </Button>
               <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className={cn(
                     'gap-2 min-w-[120px] transition-all duration-300 font-bold shadow-md hover:shadow-lg',
                     saved ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-500/50 ring-offset-2' : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  )}
               >
                  {saved ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Đang lưu...</span> : <span className="flex items-center gap-2"><Save size={14}/> Lưu hồ sơ</span>}
               </Button>
            </div>
         </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-6">

         {/* TRÁI: DOCK TEMPLATE LƠ LỬNG */}
         <motion.div
           initial={false}
           animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
           className={cn(
             'shrink-0 h-full relative rounded-2xl bg-white/60 backdrop-blur-3xl border border-white/60 shadow-soft-md flex flex-col',
             !sidebarOpen && 'invisible'
           )}
         >
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <TemplateSelector selectedId={templateId} onSelect={setTemplateId} />
           </div>

           {/* Toggle Sidebar Button Outside */}
           <button
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className={cn(
                "absolute top-1/2 -translate-y-1/2 min-w-6 min-h-12 rounded-r-xl bg-white/80 backdrop-blur-md border border-white/80 shadow-soft-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 z-50 transition-all",
                sidebarOpen ? "-right-6" : "-right-2"
             )}
           >
             {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
           </button>
         </motion.div>

         {/* GIỮA: TRUNG TÂM KIỂM SOÁT (FORM + AI) */}
         <div className="w-[440px] shrink-0 h-full rounded-2xl bg-white border border-zinc-200/70 shadow-soft-xl flex flex-col z-10 overflow-hidden ring-1 ring-zinc-950/5">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
               {/* Custom Tab List Component */}
               <div className="h-14 border-b border-zinc-100 flex items-center px-2 bg-zinc-50/50 shrink-0">
                  <TabsList className="h-10 w-full bg-zinc-100/80 p-1 flex justify-between gap-1 rounded-xl">
                     <TabsTrigger 
                        value="form" 
                        className="flex-1 gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm font-semibold transition-all"
                     >
                        <PenLine size={15} /> Nhập liệu CV
                     </TabsTrigger>
                     <TabsTrigger 
                        value="ai" 
                        className="flex-1 gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm text-sm font-semibold transition-all relative overflow-hidden"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity" />
                        <Bot size={15} /> AI Phân Tích
                     </TabsTrigger>
                  </TabsList>
               </div>
               
               <div className="flex-1 overflow-y-auto bg-zinc-50/30 p-5 custom-scrollbar relative">
                  <TabsContent value="form" className="mt-0 h-full data-[state=inactive]:hidden focus:outline-none">
                     <CVForm data={cvData} onChange={setCvData} />
                  </TabsContent>
                  <TabsContent value="ai" className="mt-0 h-full data-[state=inactive]:hidden focus:outline-none">
                     <AIAssistant data={cvData} onSave={saveCVData} />
                  </TabsContent>
               </div>
            </Tabs>
         </div>

         {/* PHẢI: XEM TRƯỚC BẢN IN LƠ LỬNG */}
         <div className="flex-1 h-full rounded-2xl bg-zinc-200/50 border border-zinc-200/50 shadow-inner overflow-auto p-10 flex justify-center items-start custom-scrollbar relative">
            
            <div
               className="transition-all duration-300 origin-top bg-white print-area-shadow flex-none"
               style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  width: '210mm',
                  minHeight: '297mm',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.02)',
                  margin: '0 auto'
               }}
            >
               <div id="cv-preview-root" style={{ width: '210mm', minHeight: '297mm', background: 'white' }}>
                  <CVPreview data={cvData} templateId={templateId} />
               </div>
            </div>

         </div>

      </div>

    </div>
  )
}
