import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Wrench, BriefcaseBusiness, GraduationCap,
  Rocket, Award, Plus, Trash2, ChevronDown, Camera, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as cvService from '../../../../service/cvService'
import { toast } from 'react-toastify'

/* ---------- config ---------- */
const SECTIONS = [
  { id: 'personal',     icon: User,              label: 'Thông tin cá nhân',       desc: 'Họ tên, liên hệ, địa chỉ, ảnh đại diện' },
  { id: 'skills',       icon: Wrench,            label: 'Kỹ năng chuyên môn',      desc: 'Kỹ năng kỹ thuật & mềm' },
  { id: 'experience',   icon: BriefcaseBusiness, label: 'Kinh nghiệm làm việc',    desc: 'Lịch sử công tác' },
  { id: 'education',    icon: GraduationCap,     label: 'Học vấn',                 desc: 'Trường, chuyên ngành, thành tích' },
  { id: 'projects',     icon: Rocket,            label: 'Dự án cá nhân',           desc: 'Sản phẩm & công trình nổi bật' },
  { id: 'certificates', icon: Award,             label: 'Chứng chỉ / Giải thưởng', desc: 'Bằng cấp & danh hiệu' },
]

/* ---------- small helpers ---------- */
function SectionLabel({ children }) {
  return (
    <Label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none mb-1.5 block">
      {children}
    </Label>
  )
}

function Field({ label, children, className, error, warning }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <SectionLabel>{label}</SectionLabel>}
      {children}
      {error && <span className="text-[10px] text-red-500 font-semibold mt-0.5 flex items-center gap-1">❌ {error}</span>}
      {!error && warning && <span className="text-[10px] text-amber-500 font-semibold mt-0.5 flex items-center gap-1">⚠️ {warning}</span>}
    </div>
  )
}

function ItemCard({ children, onRemove, label, icon: Icon }) {
  return (
    <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-500">
          {Icon && <Icon size={13} strokeWidth={2.5} />}
          <span className="text-xs font-semibold text-zinc-500">{label}</span>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          className="text-zinc-400 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 size={14} />
        </Button>
      </div>
      {children}
    </div>
  )
}

function AddButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-center gap-2 py-3 px-4',
        'border-2 border-dashed border-zinc-200 rounded-xl',
        'text-xs font-semibold text-zinc-400',
        'hover:border-zinc-400 hover:text-zinc-700 hover:bg-zinc-50',
        'transition-all duration-200'
      )}
    >
      <Plus size={14} strokeWidth={2.5} />
      {children}
    </button>
  )
}

/* ---------- main component ---------- */
export default function CVForm({ data, onChange }) {
  const [openSection, setOpenSection] = useState('personal')
  const [uploading, setUploading] = useState(false)

  const updateP = (field, val) =>
    onChange({ ...data, personal: { ...data.personal, [field]: val } })

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const url = await cvService.uploadCVAvatar(file)
      updateP('avatar', url)
      toast.success('Tải ảnh lên thành công')
    } catch (err) {
      console.error('Avatar upload failed:', err)
      toast.error('Không thể tải ảnh lên. Vui lòng thử lại.')
    } finally {
      setUploading(false)
    }
  }

  const updateArr = (key, idx, field, val) => {
    const arr = [...(data[key] || [])]
    arr[idx] = { ...arr[idx], [field]: val }
    onChange({ ...data, [key]: arr })
  }
  const addArr = (key, template) =>
    onChange({ ...data, [key]: [...(data[key] || []), template] })
  const removeArr = (key, idx) => {
    const arr = [...(data[key] || [])]
    arr.splice(idx, 1)
    onChange({ ...data, [key]: arr })
  }

  const p = data.personal || {}

  // Instant real-time validation errors
  const errors = {
    email: p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) ? 'Email không đúng định dạng (Ví dụ hợp lệ: nguyenvana@gmail.com)' : '',
    phone: p.phone && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(p.phone) ? 'Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 03,05,07,08,09 (Ví dụ hợp lệ: 0912345678)' : '',
    linkedin: p.linkedin && !/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(p.linkedin) ? 'Đường dẫn LinkedIn không đúng định dạng (Ví dụ hợp lệ: https://linkedin.com/in/nguyenvana)' : '',
    dob: p.dob && new Date(p.dob) > new Date() ? 'Ngày sinh phải ở quá khứ (Ví dụ hợp lệ: 20/10/2000)' : ''
  }

  const warnings = {
    fullName: !p.fullName ? 'Chưa nhập họ và tên' : '',
    dob: !p.dob ? 'Chưa nhập ngày sinh' : '',
    email: !p.email ? 'Chưa nhập email liên hệ' : '',
    phone: !p.phone ? 'Chưa nhập số điện thoại' : '',
    address: !p.address ? 'Chưa nhập địa chỉ liên hệ' : '',
    jobTitle: !p.jobTitle ? 'Chưa nhập vị trí / chức danh công việc' : '',
    linkedin: !p.linkedin ? 'Chưa nhập đường dẫn LinkedIn / Portfolio' : '',
    summary: !p.summary ? 'Chưa nhập mục tiêu nghề nghiệp' : ''
  }

  return (
    <div className="space-y-2 pb-24">
      {SECTIONS.map((sec) => {
        const isOpen = openSection === sec.id
        return (
          <div
            key={sec.id}
            className={cn(
              'rounded-2xl border bg-white overflow-hidden',
              'transition-all duration-200',
              isOpen
                ? 'border-zinc-300 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                : 'border-zinc-200 hover:border-zinc-300 shadow-sm'
            )}
          >
            {/* Accordion Header */}
            <button
              onClick={() => setOpenSection(isOpen ? null : sec.id)}
              className="w-full flex items-center justify-between px-5 py-4 focus:outline-none group"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'size-8 rounded-xl flex items-center justify-center transition-colors duration-200',
                  isOpen
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200'
                )}>
                  <sec.icon size={15} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className={cn(
                    'text-sm font-semibold leading-none transition-colors',
                    isOpen ? 'text-zinc-900' : 'text-zinc-700'
                  )}>
                    {sec.label}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{sec.desc}</p>
                </div>
              </div>
              <ChevronDown
                size={15}
                className={cn(
                  'text-zinc-400 transition-transform duration-300 shrink-0',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Accordion Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="px-5 pb-6 pt-1 border-t border-zinc-100 space-y-5">

                    {/* ── Personal ── */}
                    {sec.id === 'personal' && (
                      <div className="space-y-5">
                        {/* Avatar */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                          <div className="relative size-16 rounded-full border border-zinc-200 bg-white overflow-hidden shadow-sm shrink-0">
                            {uploading ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                <Loader2 className="animate-spin text-zinc-400" size={16} />
                              </div>
                            ) : p.avatar ? (
                              <img src={p.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <User size={22} className="absolute inset-0 m-auto text-zinc-300" />
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="avatar-upload"
                              className={cn(
                                'inline-flex items-center gap-1.5 cursor-pointer',
                                'text-xs font-semibold px-3 py-1.5 rounded-lg',
                                'bg-white border border-zinc-200 text-zinc-700',
                                'hover:bg-zinc-50 hover:border-zinc-400 hover:text-zinc-900',
                                'transition-colors shadow-sm'
                              )}
                            >
                              <Camera size={13} />
                              Tải ảnh lên
                            </Label>
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="hidden"
                              onChange={handleAvatarUpload}
                            />
                            {p.avatar && (
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => updateP('avatar', null)}
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              >
                                Xoá ảnh
                              </Button>
                            )}
                            <p className="text-[10px] text-zinc-400">PNG, JPG. Tỷ lệ 1:1 là tốt nhất.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Họ và tên" className="col-span-2" warning={warnings.fullName}>
                            <Input value={p.fullName || ''} onChange={e => updateP('fullName', e.target.value)} placeholder="Nguyễn Văn A" />
                          </Field>
                          <Field label="Ngày sinh" error={errors.dob} warning={warnings.dob}>
                            <Input type="date" value={p.dob || ''} onChange={e => updateP('dob', e.target.value)} className={cn("w-full h-9 text-xs px-2", errors.dob && 'border-red-500 focus-visible:ring-red-500')} />
                          </Field>
                          <Field label="Email" error={errors.email} warning={warnings.email}>
                            <Input type="email" value={p.email || ''} onChange={e => updateP('email', e.target.value)} placeholder="name@example.com" className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''} />
                          </Field>
                          <Field label="Số điện thoại" error={errors.phone} warning={warnings.phone}>
                            <Input value={p.phone || ''} onChange={e => updateP('phone', e.target.value)} placeholder="09xx xxx xxx" className={errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''} />
                          </Field>
                          <Field label="Địa chỉ" warning={warnings.address}>
                            <Input value={p.address || ''} onChange={e => updateP('address', e.target.value)} placeholder="TP. Hồ Chí Minh" />
                          </Field>
                          <Field label="Vị trí / Chức danh" className="col-span-2" warning={warnings.jobTitle}>
                            <Input value={p.jobTitle || ''} onChange={e => updateP('jobTitle', e.target.value)} placeholder="Senior Frontend Engineer" />
                          </Field>
                          <Field label="LinkedIn / Portfolio URL" className="col-span-2" error={errors.linkedin} warning={warnings.linkedin}>
                            <Input value={p.linkedin || ''} onChange={e => updateP('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." className={errors.linkedin ? 'border-red-500 focus-visible:ring-red-500' : ''} />
                          </Field>
                          <Field label="Mục tiêu nghề nghiệp" className="col-span-2" warning={warnings.summary}>
                            <Textarea
                              rows={4}
                              value={p.summary || ''}
                              onChange={e => updateP('summary', e.target.value)}
                              placeholder="Tóm tắt ngắn gọn kinh nghiệm, thế mạnh và định hướng phát triển..."
                            />
                          </Field>
                        </div>
                      </div>
                    )}

                    {/* ── Skills ── */}
                    {sec.id === 'skills' && (
                      <div className="space-y-3">
                        {(data.skills || []).map((sk, i) => {
                          const skWarning = {
                            name: !sk.name ? 'Chưa nhập tên kỹ năng' : ''
                          }
                          return (
                            <ItemCard
                              key={i}
                              label={`Kỹ năng ${i + 1}`}
                              icon={Wrench}
                              onRemove={() => removeArr('skills', i)}
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <Field label="Tên kỹ năng" className="col-span-2" warning={skWarning.name}>
                                  <Input
                                    value={sk.name || ''}
                                    onChange={e => updateArr('skills', i, 'name', e.target.value)}
                                    placeholder="React, Node.js, Figma..."
                                  />
                                </Field>
                                <Field label={`Thành thạo — ${sk.level || 50}%`} className="col-span-2">
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-2 flex-1 bg-zinc-200 rounded-full overflow-hidden">
                                      <div
                                        className="absolute inset-y-0 left-0 bg-zinc-900 rounded-full transition-all duration-300"
                                        style={{ width: `${sk.level || 50}%` }}
                                      />
                                    </div>
                                    <input
                                      type="range" min="0" max="100" step="5"
                                      value={sk.level || 50}
                                      onChange={e => updateArr('skills', i, 'level', parseInt(e.target.value))}
                                      className="sr-only"
                                      aria-label="Skill level"
                                    />
                                    <input
                                      type="range" min="0" max="100" step="5"
                                      value={sk.level || 50}
                                      onChange={e => updateArr('skills', i, 'level', parseInt(e.target.value))}
                                      className="w-full h-2 cursor-pointer accent-zinc-900"
                                      style={{ position: 'absolute', opacity: 0, width: 'calc(100% - 80px)' }}
                                    />
                                  </div>
                                  <input
                                    type="range" min="0" max="100" step="5"
                                    value={sk.level || 50}
                                    onChange={e => updateArr('skills', i, 'level', parseInt(e.target.value))}
                                    className="w-full cursor-pointer accent-zinc-900 mt-1"
                                  />
                                </Field>
                              </div>
                            </ItemCard>
                          )
                        })}
                        <AddButton onClick={() => addArr('skills', { name: '', level: 50 })}>
                          Thêm kỹ năng
                        </AddButton>
                      </div>
                    )}

                    {/* ── Experience ── */}
                    {sec.id === 'experience' && (
                      <div className="space-y-3">
                        {(data.experience || []).map((exp, i) => {
                          const expError = {
                            start: exp.start && exp.end && exp.start > exp.end ? 'Bắt đầu không thể sau kết thúc (Ví dụ hợp lệ: Bắt đầu 09/2022 - Kết thúc 12/2023)' : '',
                            end: exp.start && exp.end && exp.start > exp.end ? 'Kết thúc không thể trước bắt đầu (Ví dụ hợp lệ: Bắt đầu 09/2022 - Kết thúc 12/2023)' : ''
                          }
                          const expWarning = {
                            company: !exp.company ? 'Chưa nhập tên công ty' : '',
                            role: !exp.role ? 'Chưa nhập vị trí công việc' : '',
                            start: !exp.start ? 'Chưa chọn thời gian bắt đầu' : '',
                            end: !exp.end ? 'Chưa chọn thời gian kết thúc' : ''
                          }
                          return (
                            <ItemCard
                              key={i}
                              label={`Vị trí ${i + 1}`}
                              icon={BriefcaseBusiness}
                              onRemove={() => removeArr('experience', i)}
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <Field label="Tên công ty" className="col-span-2" warning={expWarning.company}>
                                  <Input value={exp.company || ''} onChange={e => updateArr('experience', i, 'company', e.target.value)} placeholder="Acme Corp, Google..." />
                                </Field>
                                <Field label="Vị trí công việc" className="col-span-2" warning={expWarning.role}>
                                  <Input value={exp.role || ''} onChange={e => updateArr('experience', i, 'role', e.target.value)} placeholder="Frontend Engineer" />
                                </Field>
                                <div className="grid grid-cols-2 gap-3 col-span-2">
                                  <Field label="Bắt đầu" error={expError.start} warning={expWarning.start}>
                                    <Input type="month" value={exp.start || ''} onChange={e => updateArr('experience', i, 'start', e.target.value)} className={cn("w-full h-9 text-xs px-2", expError.start && 'border-red-500 focus-visible:ring-red-500')} />
                                  </Field>
                                  <Field label="Kết thúc" error={expError.end} warning={expWarning.end}>
                                    <Input type="month" value={exp.end || ''} onChange={e => updateArr('experience', i, 'end', e.target.value)} className={cn("w-full h-9 text-xs px-2", expError.end && 'border-red-500 focus-visible:ring-red-500')} />
                                  </Field>
                                </div>
                                <Field label="Mô tả công việc" className="col-span-2">
                                  <Textarea rows={4} value={exp.desc || ''} onChange={e => updateArr('experience', i, 'desc', e.target.value)} placeholder="— Xây dựng tính năng X giúp tăng conversion Y%&#10;— Tech stack: React, TypeScript..." />
                                </Field>
                              </div>
                            </ItemCard>
                          )
                        })}
                        <AddButton onClick={() => addArr('experience', { company: '', role: '', start: '', end: '', desc: '' })}>
                          Thêm kinh nghiệm
                        </AddButton>
                      </div>
                    )}

                    {/* ── Education ── */}
                    {sec.id === 'education' && (
                      <div className="space-y-3">
                        {(data.education || []).map((edu, i) => {
                          const eduError = {
                            start: edu.start && edu.end && edu.start > edu.end ? 'Bắt đầu không thể sau kết thúc (Ví dụ hợp lệ: Bắt đầu 09/2023 - Kết thúc 05/2024)' : '',
                            end: edu.start && edu.end && edu.start > edu.end ? 'Kết thúc không thể trước bắt đầu (Ví dụ hợp lệ: Bắt đầu 09/2023 - Kết thúc 05/2024)' : ''
                          }
                          const eduWarning = {
                            school: !edu.school ? 'Chưa nhập tên trường / cơ sở đào tạo' : '',
                            major: !edu.major ? 'Chưa nhập ngành học' : '',
                            start: !edu.start ? 'Chưa chọn thời gian bắt đầu' : '',
                            end: !edu.end ? 'Chưa chọn thời gian kết thúc' : ''
                          }
                          return (
                            <ItemCard
                              key={i}
                              label={`Trường ${i + 1}`}
                              icon={GraduationCap}
                              onRemove={() => removeArr('education', i)}
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <Field label="Trường / Cơ sở đào tạo" className="col-span-2" warning={eduWarning.school}>
                                  <Input value={edu.school || ''} onChange={e => updateArr('education', i, 'school', e.target.value)} placeholder="Đại học Bách Khoa TP.HCM" />
                                </Field>
                                <Field label="Ngành học" className="col-span-2" warning={eduWarning.major}>
                                  <Input value={edu.major || ''} onChange={e => updateArr('education', i, 'major', e.target.value)} placeholder="Kỹ thuật phần mềm" />
                                </Field>
                                <div className="grid grid-cols-2 gap-3 col-span-2">
                                  <Field label="Bắt đầu" error={eduError.start} warning={eduWarning.start}>
                                    <Input type="month" value={edu.start || ''} onChange={e => updateArr('education', i, 'start', e.target.value)} className={cn("w-full h-9 text-xs px-2", eduError.start && 'border-red-500 focus-visible:ring-red-500')} />
                                  </Field>
                                  <Field label="Kết thúc" error={eduError.end} warning={eduWarning.end}>
                                    <Input type="month" value={edu.end || ''} onChange={e => updateArr('education', i, 'end', e.target.value)} className={cn("w-full h-9 text-xs px-2", eduError.end && 'border-red-500 focus-visible:ring-red-500')} />
                                  </Field>
                                </div>
                                <Field label="GPA / Chi tiết" className="col-span-2">
                                  <Textarea rows={2} value={edu.desc || ''} onChange={e => updateArr('education', i, 'desc', e.target.value)} placeholder="GPA: 3.7/4.0 — Tốt nghiệp loại Giỏi" />
                                </Field>
                              </div>
                            </ItemCard>
                          )
                        })}
                        <AddButton onClick={() => addArr('education', { school: '', major: '', start: '', end: '', desc: '' })}>
                          Thêm học vấn
                        </AddButton>
                      </div>
                    )}

                    {/* ── Projects ── */}
                    {sec.id === 'projects' && (
                      <div className="space-y-3">
                        {(data.projects || []).map((prj, i) => {
                          const prjError = {
                            start: prj.start && prj.end && prj.start > prj.end ? 'Bắt đầu không thể sau kết thúc (Ví dụ hợp lệ: Bắt đầu 01/2024 - Kết thúc 04/2024)' : '',
                            end: prj.start && prj.end && prj.start > prj.end ? 'Kết thúc không thể trước bắt đầu (Ví dụ hợp lệ: Bắt đầu 01/2024 - Kết thúc 04/2024)' : ''
                          }
                          const prjWarning = {
                            name: !prj.name ? 'Chưa nhập tên dự án' : '',
                            start: !prj.start ? 'Chưa chọn thời gian bắt đầu' : '',
                            end: !prj.end ? 'Chưa chọn thời gian kết thúc' : ''
                          }
                          return (
                            <ItemCard
                              key={i}
                              label={`Dự án ${i + 1}`}
                              icon={Rocket}
                              onRemove={() => removeArr('projects', i)}
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <Field label="Tên dự án" className="col-span-2" warning={prjWarning.name}>
                                  <Input value={prj.name || ''} onChange={e => updateArr('projects', i, 'name', e.target.value)} placeholder="E-commerce Platform" />
                                </Field>
                                <div className="grid grid-cols-2 gap-3 col-span-2">
                                  <Field label="Bắt đầu" error={prjError.start} warning={prjWarning.start}>
                                    <Input type="month" value={prj.start || ''} onChange={e => updateArr('projects', i, 'start', e.target.value)} className={cn("w-full h-9 text-xs px-2", prjError.start && 'border-red-500 focus-visible:ring-red-500')} />
                                  </Field>
                                  <Field label="Kết thúc" error={prjError.end} warning={prjWarning.end}>
                                    <Input type="month" value={prj.end || ''} onChange={e => updateArr('projects', i, 'end', e.target.value)} className={cn("w-full h-9 text-xs px-2", prjError.end && 'border-red-500 focus-visible:ring-red-500')} />
                                  </Field>
                                </div>
                                <Field label="Link dự án / Source" className="col-span-2">
                                  <Input value={prj.link || ''} onChange={e => updateArr('projects', i, 'link', e.target.value)} placeholder="https://github.com/..." />
                                </Field>
                                <Field label="Mô tả" className="col-span-2">
                                  <Textarea rows={4} value={prj.desc || ''} onChange={e => updateArr('projects', i, 'desc', e.target.value)} placeholder="— Stack: Next.js, Prisma&#10;— Vai trò: Lead Developer&#10;— Kết quả: 10k MAU" />
                                </Field>
                              </div>
                            </ItemCard>
                          )
                        })}
                        <AddButton onClick={() => addArr('projects', { name: '', start: '', end: '', link: '', desc: '' })}>
                          Thêm dự án mới
                        </AddButton>
                      </div>
                    )}

                    {/* ── Certificates ── */}
                    {sec.id === 'certificates' && (
                      <div className="space-y-3">
                        {(data.certificates || []).map((cert, i) => {
                          const certWarning = {
                            name: !cert.name ? 'Chưa nhập tên chứng chỉ / giải thưởng' : '',
                            org: !cert.org ? 'Chưa nhập tổ chức cấp' : '',
                            date: !cert.date ? 'Chưa chọn thời gian đạt được' : ''
                          }
                          return (
                            <ItemCard
                              key={i}
                              label={`Chứng chỉ ${i + 1}`}
                              icon={Award}
                              onRemove={() => removeArr('certificates', i)}
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <Field label="Tên chứng chỉ" className="col-span-2" warning={certWarning.name}>
                                  <Input value={cert.name || ''} onChange={e => updateArr('certificates', i, 'name', e.target.value)} placeholder="AWS Solutions Architect" />
                                </Field>
                                <Field label="Tháng/Năm đạt được" warning={certWarning.date}>
                                  <Input type="month" value={cert.date || ''} onChange={e => updateArr('certificates', i, 'date', e.target.value)} className="w-full h-9 text-xs px-2" />
                                </Field>
                                <Field label="Tổ chức cấp" warning={certWarning.org}>
                                  <Input value={cert.org || ''} onChange={e => updateArr('certificates', i, 'org', e.target.value)} placeholder="Amazon Web Services" />
                                </Field>
                              </div>
                            </ItemCard>
                          )
                        })}
                        <AddButton onClick={() => addArr('certificates', { name: '', date: '', org: '' })}>
                          Thêm chứng chỉ
                        </AddButton>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
