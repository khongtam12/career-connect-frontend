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
  User as UserIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import Header from '@/component/user/Header'
import TemplateSelector from './components/TemplateSelector'
import CVForm from './components/CVForm'
import CVPreview from './components/CVPreview'
import AIAssistant from './components/AIAssistant'

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

  const [templateId, setTemplateId] = useState(1)
  const [cvData, setCvData] = useState(EMPTY_CV)
  const [cvName, setCvName] = useState('CV của tôi')
  const [saved, setSaved] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [zoom, setZoom] = useState(80)
  const [activeTab, setActiveTab] = useState('form')

  const [mounted, setMounted] = useState(false)

  // Load existing CV
  useEffect(() => {
    setMounted(true)
    if (editId) {
      try {
        const list = JSON.parse(localStorage.getItem('cv_list') || '[]')
        const found = list.find(c => c.id === editId)
        if (found) {
          setCvData(found.data)
          setTemplateId(found.templateId || 1)
          setCvName(found.name || 'CV của tôi')
        }
      } catch (e) {}
    }
  }, [editId])

  // Auto-trigger print if arrived with ?print=1
  useEffect(() => {
    if (isPrintMode && mounted) {
      setTimeout(() => window.print(), 500)
    }
  }, [isPrintMode, mounted])

  const handleSave = () => {
    const list = JSON.parse(localStorage.getItem('cv_list') || '[]')
    const newId = editId && editId !== 'new' ? editId : `cv_${Date.now()}`
    const entry = {
      id: newId,
      name: cvName,
      templateId,
      data: cvData,
      updatedAt: new Date().toISOString(),
    }
    const existing = list.findIndex(c => c.id === newId)
    if (existing >= 0) list[existing] = entry
    else list.unshift(entry)
    localStorage.setItem('cv_list', JSON.stringify(list))
    
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      navigate('/cv-dashboard')
    }, 1200)
  }

  const handleExportPDF = () => {
    window.print()
  }

  // Hydration safeguard
  if (!mounted) return <div className="min-h-screen bg-background" />

  /**
   * Print View (only visible during print)
   */
  if (isPrintMode) {
    return (
      <div className="bg-white min-h-screen w-full flex justify-center">
        <div className="w-[210mm] shadow-none">
          <CVPreview data={cvData} templateId={templateId} />
        </div>
      </div>
    )
  }

  /**
   * Standard Editor View
   */
  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Navbar with embedded Toolbar */}
      <Header
        rightSlot={
          <div className="flex items-center gap-3">
            {/* Zoom controls */}
            <div className="hidden md:flex items-center gap-1 border border-gray-200 rounded-md px-2 py-1">
              <button
                onClick={() => setZoom(z => Math.max(40, z - 10))}
                className="text-gray-500 hover:text-gray-800 px-1 text-sm font-bold"
              >−</button>
              <span className="text-xs font-semibold w-10 text-center text-gray-600">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(120, z + 10))}
                className="text-gray-500 hover:text-gray-800 px-1 text-sm font-bold"
              >+</button>
            </div>

            {/* Xuất PDF */}
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Xuất PDF</span>
            </button>

            {/* Lưu CV */}
            <button
              onClick={handleSave}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-300 w-[110px] justify-center',
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 text-white hover:bg-green-600'
              )}
            >
              <Save size={14} />
              {saved ? 'Đã lưu!' : 'Lưu CV'}
            </button>
          </div>
        }
      />

      {/* Editor sub-header (Title) */}
      <div className="h-12 bg-white border-b border-border flex items-center px-4 md:px-6 shrink-0 z-10 shadow-soft-xs relative gap-2">
        <button
          onClick={() => navigate('/cv-dashboard')}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-2"
        >
          &larr; Dashboard
        </button>
        <div className="h-4 w-px bg-border" />
        <input
          value={cvName}
          onChange={e => setCvName(e.target.value)}
          className="border-none bg-transparent outline-none font-semibold text-sm text-foreground focus:ring-0 w-[200px] ml-2"
          placeholder="Nhập tên CV..."
        />
        <PenLine size={12} className="text-muted-foreground" />
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT BAR: Templates */}
        <motion.div
           initial={false}
           animate={{ width: sidebarOpen ? 240 : 0 }}
           className={cn(
             'shrink-0 bg-white border-r border-border relative flex flex-col',
             !sidebarOpen && 'invisible lg:visible'
           )}
        >
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             <TemplateSelector selectedId={templateId} onSelect={setTemplateId} />
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-white border border-border shadow-soft-sm flex items-center justify-center text-muted-foreground hover:text-foreground z-20"
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </motion.div>

        {/* MIDDLE BAR: Form & AI */}
        <div className="w-[400px] shrink-0 bg-white border-r border-border flex flex-col shadow-soft-md z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full h-12 border-b justify-start px-4 gap-6 shrink-0">
              <TabsTrigger value="form" className="px-1 gap-2 border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none h-full bg-transparent pb-0 mb-0">
                <PenLine size={14} /> Nhập liệu
              </TabsTrigger>
              <TabsTrigger value="ai" className="px-1 gap-2 border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none h-full bg-transparent pb-0 mb-0">
                <Bot size={14} /> AI Phân tích
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 custom-scrollbar relative">
              <TabsContent value="form" className="mt-0 h-full">
                <CVForm data={cvData} onChange={setCvData} />
              </TabsContent>
              <TabsContent value="ai" className="mt-0 h-full">
               <AIAssistant data={cvData} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* RIGHT AREA: Preview Board */}
        <div className="flex-1 overflow-auto bg-slate-200/50 p-8 flex justify-center items-start custom-scrollbar relative">
          
          <div
            className="transition-all duration-300 origin-top shadow-soft-xl rounded-sm"
            style={{ 
              width: `${zoom}%`,
              minWidth: '600px',
              maxWidth: '1200px'
            }}
          >
            <CVPreview data={cvData} templateId={templateId} />
          </div>

        </div>

      </div>

    </div>
  )
}
