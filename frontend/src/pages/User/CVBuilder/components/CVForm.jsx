'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Wrench,
  BriefcaseBusiness,
  GraduationCap,
  Rocket,
  Award,
  Plus,
  Trash2,
  ChevronDown,
  Camera,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Label, FormField } from '@/components/ui/label'

const SECTIONS = [
  { id: 'personal',     icon: User,              label: 'Thông tin cá nhân' },
  { id: 'skills',       icon: Wrench,            label: 'Kỹ năng chuyên môn' },
  { id: 'experience',   icon: BriefcaseBusiness, label: 'Kinh nghiệm làm việc' },
  { id: 'education',    icon: GraduationCap,     label: 'Học vấn' },
  { id: 'projects',     icon: Rocket,            label: 'Dự án cá nhân' },
  { id: 'certificates', icon: Award,             label: 'Chứng chỉ / Giải thưởng' },
]

export default function CVForm({ data, onChange }) {
  const [openSection, setOpenSection] = useState('personal')

  // Helpers
  const updateP = (field, val) => onChange({ ...data, personal: { ...data.personal, [field]: val } })
  
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => updateP('avatar', event.target.result)
    reader.readAsDataURL(file)
  }

  const handleAvatarRemove = () => updateP('avatar', null)

  const updateArr = (key, idx, field, val) => {
    const arr = [...(data[key] || [])]
    arr[idx] = { ...arr[idx], [field]: val }
    onChange({ ...data, [key]: arr })
  }
  const addArr = (key, template) => onChange({ ...data, [key]: [...(data[key] || []), template] })
  const removeArr = (key, idx) => {
    const arr = [...(data[key] || [])]
    arr.splice(idx, 1)
    onChange({ ...data, [key]: arr })
  }

  const p = data.personal || {}

  return (
    <div className="space-y-4 pb-20">
      {SECTIONS.map((sec) => {
        const isOpen = openSection === sec.id
        return (
          <div
            key={sec.id}
            className={cn(
              'rounded-2xl border bg-white overflow-hidden transition-all duration-300',
              isOpen ? 'border-primary/40 shadow-soft-md' : 'border-border shadow-soft-xs hover:border-border/80'
            )}
          >
            {/* Header toggle */}
            <button
              onClick={() => setOpenSection(isOpen ? null : sec.id)}
              className="w-full flex items-center justify-between px-5 py-4 focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'size-8 rounded-xl flex items-center justify-center transition-colors',
                  isOpen ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                )}>
                  <sec.icon size={16} strokeWidth={2.5} />
                </div>
                <span className={cn('text-sm font-semibold', isOpen ? 'text-foreground' : 'text-foreground/80')}>
                  {sec.label}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={cn('text-muted-foreground transition-transform duration-300', isOpen && 'rotate-180')}
              />
            </button>

            {/* Content body */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="px-5 pb-5 pt-1 border-t border-border/50 space-y-5">
                    
                    {/* PERSONAL SECTION */}
                    {sec.id === 'personal' && (
                      <div className="space-y-5">
                        
                        {/* Avatar Upload */}
                        <div className="flex items-center gap-4">
                          <Label className="shrink-0 mb-0">Ảnh đại diện</Label>
                          <div className="flex items-center gap-4">
                            <div className="relative size-16 rounded-full border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden">
                              {p.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.avatar} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <User size={24} className="text-muted-foreground/50" />
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Label
                                  htmlFor="avatar-upload"
                                  className="m-0 inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                >
                                  <Camera size={14} />
                                  Tải ảnh lên
                                </Label>
                                <input
                                  id="avatar-upload"
                                  type="file"
                                  accept="image/png, image/jpeg, image/webp"
                                  className="hidden"
                                  onChange={handleAvatarUpload}
                                />
                                {p.avatar && (
                                  <Button variant="ghost" size="xs" onClick={handleAvatarRemove} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                                    Xóa
                                  </Button>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground">Khuyên dùng ảnh vuông, tỷ lệ 1:1</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="Họ và tên">
                            <Input value={p.fullName || ''} onChange={e => updateP('fullName', e.target.value)} placeholder="Nhập họ và tên..." />
                          </FormField>
                          <FormField label="Ngày sinh">
                            <Input type="date" value={p.dob || ''} onChange={e => updateP('dob', e.target.value)} />
                          </FormField>
                          <FormField label="Email">
                            <Input type="email" value={p.email || ''} onChange={e => updateP('email', e.target.value)} placeholder="email@example.com" />
                          </FormField>
                          <FormField label="Số điện thoại">
                            <Input value={p.phone || ''} onChange={e => updateP('phone', e.target.value)} placeholder="09xx xxx xxx" />
                          </FormField>
                          <FormField label="Vị trí / Chức danh" className="col-span-2">
                            <Input value={p.jobTitle || ''} onChange={e => updateP('jobTitle', e.target.value)} placeholder="VD: Senior Frontend Engineer" />
                          </FormField>
                          <FormField label="Địa chỉ" className="col-span-2">
                            <Input value={p.address || ''} onChange={e => updateP('address', e.target.value)} placeholder="Thủ Đức, TP. Hồ Chí Minh" />
                          </FormField>
                          <FormField label="LinkedIn / Portfolio" className="col-span-2">
                            <Input value={p.linkedin || ''} onChange={e => updateP('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
                          </FormField>
                          <FormField label="Mục tiêu nghề nghiệp" className="col-span-2">
                            <Textarea rows={4} value={p.summary || ''} onChange={e => updateP('summary', e.target.value)} placeholder="Tóm tắt ngắn gọn về kinh nghiệm và định hướng công việc..." />
                          </FormField>
                        </div>
                      </div>
                    )}

                    {/* SKILLS SECTION */}
                    {sec.id === 'skills' && (
                      <div className="space-y-4">
                        {(data.skills || []).map((sk, i) => (
                          <div key={i} className="p-4 rounded-xl border border-border bg-slate-50/50 space-y-4">
                            <div className="flex gap-3 items-start">
                              <FormField label={`Kỹ năng ${i + 1}`} className="flex-1">
                                <Input value={sk.name || ''} onChange={e => updateArr('skills', i, 'name', e.target.value)} placeholder="VD: React, Node.js, Problem Solving..." />
                              </FormField>
                              <Button variant="ghost" size="icon" onClick={() => removeArr('skills', i)} className="text-muted-foreground hover:text-destructive mt-6">
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            <FormField label="Mức độ thành thạo">
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min="0" max="100" step="5"
                                  value={sk.level || 50}
                                  onChange={e => updateArr('skills', i, 'level', parseInt(e.target.value))}
                                  className="flex-1"
                                />
                                <span className="text-xs font-bold text-primary w-8 text-right bg-primary/10 py-1 rounded-md">{sk.level || 50}%</span>
                              </div>
                            </FormField>
                          </div>
                        ))}
                        <Button variant="dashed" onClick={() => addArr('skills', { name: '', level: 50 })} className="gap-2">
                          <Plus size={16} /> Thêm kỹ năng
                        </Button>
                      </div>
                    )}

                    {/* EXPERIENCE SECTION */}
                    {sec.id === 'experience' && (
                      <div className="space-y-4">
                        {(data.experience || []).map((exp, i) => (
                          <div key={i} className="p-4 rounded-xl border border-border bg-slate-50/50 space-y-4">
                            <div className="flex justify-between items-start mb-2">
                              <Label className="text-primary text-sm flex items-center gap-1.5"><BriefcaseBusiness size={14}/>Kinh nghiệm {i+1}</Label>
                              <Button variant="ghost" size="icon-sm" onClick={() => removeArr('experience', i)} className="text-muted-foreground hover:text-destructive shrink-0">
                                <Trash2 size={15} />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField label="Tên công ty" className="col-span-2">
                                <Input value={exp.company || ''} onChange={e => updateArr('experience', i, 'company', e.target.value)} placeholder="VD: Công ty TNHH Phần mềm XYZ" />
                              </FormField>
                              <FormField label="Vị trí công việc" className="col-span-2">
                                <Input value={exp.role || ''} onChange={e => updateArr('experience', i, 'role', e.target.value)} placeholder="VD: Frontend Engineer" />
                              </FormField>
                              <FormField label="Bắt đầu">
                                <Input type="month" value={exp.start || ''} onChange={e => updateArr('experience', i, 'start', e.target.value)} />
                              </FormField>
                              <FormField label="Kết thúc">
                                <Input type="month" value={exp.end || ''} onChange={e => updateArr('experience', i, 'end', e.target.value)} />
                              </FormField>
                              <FormField label="Mô tả công việc" className="col-span-2">
                                <Textarea rows={4} value={exp.desc || ''} onChange={e => updateArr('experience', i, 'desc', e.target.value)} placeholder="- Đã làm gì...&#10;- Kết quả đạt được..." />
                              </FormField>
                            </div>
                          </div>
                        ))}
                        <Button variant="dashed" onClick={() => addArr('experience', { company: '', role: '', start: '', end: '', desc: '' })} className="gap-2">
                          <Plus size={16} /> Thêm kinh nghiệm
                        </Button>
                      </div>
                    )}

                    {/* EDUCATION SECTION */}
                    {sec.id === 'education' && (
                      <div className="space-y-4">
                        {(data.education || []).map((edu, i) => (
                          <div key={i} className="p-4 rounded-xl border border-border bg-slate-50/50 space-y-4">
                            <div className="flex justify-between items-start mb-2">
                              <Label className="text-primary text-sm flex items-center gap-1.5"><GraduationCap size={14}/>Trường lớp {i+1}</Label>
                              <Button variant="ghost" size="icon-sm" onClick={() => removeArr('education', i)} className="text-muted-foreground hover:text-destructive shrink-0">
                                <Trash2 size={15} />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField label="Trường / Cơ sở đào tạo" className="col-span-2">
                                <Input value={edu.school || ''} onChange={e => updateArr('education', i, 'school', e.target.value)} placeholder="VD: Đại học Công nghệ TT" />
                              </FormField>
                              <FormField label="Ngành học" className="col-span-2">
                                <Input value={edu.major || ''} onChange={e => updateArr('education', i, 'major', e.target.value)} placeholder="VD: Kỹ thuật phần mềm" />
                              </FormField>
                              <FormField label="Bắt đầu">
                                <Input type="month" value={edu.start || ''} onChange={e => updateArr('education', i, 'start', e.target.value)} />
                              </FormField>
                              <FormField label="Kết thúc">
                                <Input type="month" value={edu.end || ''} onChange={e => updateArr('education', i, 'end', e.target.value)} />
                              </FormField>
                              <FormField label="Điểm GPA / Chi tiết" className="col-span-2">
                                <Textarea rows={2} value={edu.desc || ''} onChange={e => updateArr('education', i, 'desc', e.target.value)} placeholder="VD: Tốt nghiệp loại Giỏi, GPA 3.8/4.0" />
                              </FormField>
                            </div>
                          </div>
                        ))}
                        <Button variant="dashed" onClick={() => addArr('education', { school: '', major: '', start: '', end: '', desc: '' })} className="gap-2">
                          <Plus size={16} /> Thêm trường học
                        </Button>
                      </div>
                    )}

                    {/* PROJECTS SECTION */}
                    {sec.id === 'projects' && (
                      <div className="space-y-4">
                        {(data.projects || []).map((prj, i) => (
                          <div key={i} className="p-4 rounded-xl border border-border bg-slate-50/50 space-y-4">
                            <div className="flex justify-between items-start mb-2">
                              <Label className="text-primary text-sm flex items-center gap-1.5"><Rocket size={14}/>Dự án {i+1}</Label>
                              <Button variant="ghost" size="icon-sm" onClick={() => removeArr('projects', i)} className="text-muted-foreground hover:text-destructive shrink-0">
                                <Trash2 size={15} />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField label="Tên dự án" className="col-span-2">
                                <Input value={prj.name || ''} onChange={e => updateArr('projects', i, 'name', e.target.value)} placeholder="VD: E-commerce Website" />
                              </FormField>
                              <FormField label="Ngày bắt đầu">
                                <Input type="month" value={prj.start || ''} onChange={e => updateArr('projects', i, 'start', e.target.value)} />
                              </FormField>
                              <FormField label="Ngày kết thúc">
                                <Input type="month" value={prj.end || ''} onChange={e => updateArr('projects', i, 'end', e.target.value)} />
                              </FormField>
                              <FormField label="Link dự án / Source code" className="col-span-2">
                                <Input value={prj.link || ''} onChange={e => updateArr('projects', i, 'link', e.target.value)} placeholder="https://github.com/..." />
                              </FormField>
                              <FormField label="Mô tả dự án" className="col-span-2">
                                <Textarea rows={4} value={prj.desc || ''} onChange={e => updateArr('projects', i, 'desc', e.target.value)} placeholder="- Tech stack đã dùng...&#10;- Vai trò trong dự án..." />
                              </FormField>
                            </div>
                          </div>
                        ))}
                        <Button variant="dashed" onClick={() => addArr('projects', { name: '', start: '', end: '', link: '', desc: '' })} className="gap-2">
                          <Plus size={16} /> Thêm dự án mới
                        </Button>
                      </div>
                    )}

                    {/* CERTIFICATES SECTION */}
                    {sec.id === 'certificates' && (
                      <div className="space-y-4">
                        {(data.certificates || []).map((cert, i) => (
                          <div key={i} className="p-4 rounded-xl border border-border bg-slate-50/50 space-y-4">
                            <div className="flex justify-between items-start mb-2">
                              <Label className="text-primary text-sm flex items-center gap-1.5"><Award size={14}/>Chứng chỉ {i+1}</Label>
                              <Button variant="ghost" size="icon-sm" onClick={() => removeArr('certificates', i)} className="text-muted-foreground hover:text-destructive shrink-0">
                                <Trash2 size={15} />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField label="Tên chứng chỉ / Giải thưởng" className="col-span-2">
                                <Input value={cert.name || ''} onChange={e => updateArr('certificates', i, 'name', e.target.value)} placeholder="VD: AWS Solutions Architect" />
                              </FormField>
                              <FormField label="Tháng/Năm đạt được">
                                <Input type="month" value={cert.date || ''} onChange={e => updateArr('certificates', i, 'date', e.target.value)} />
                              </FormField>
                              <FormField label="Tổ chức cấp">
                                <Input value={cert.org || ''} onChange={e => updateArr('certificates', i, 'org', e.target.value)} placeholder="VD: Amazon Web Services" />
                              </FormField>
                            </div>
                          </div>
                        ))}
                        <Button variant="dashed" onClick={() => addArr('certificates', { name: '', date: '', org: '' })} className="gap-2">
                          <Plus size={16} /> Thêm chứng chỉ
                        </Button>
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
