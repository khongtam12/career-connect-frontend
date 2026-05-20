'use client'

import { Phone, Mail, Calendar, MapPin, Link as LinkIcon } from 'lucide-react'

const TEMPLATE_COLORS = {
  1: { primary: '#0c7fda', secondary: '#f0f7ff', accent: '#1d4ed8' },
  2: { primary: '#7c3aed', secondary: '#f5f3ff', accent: '#5b21b6' },
  3: { primary: '#374151', secondary: '#f9fafb', accent: '#111827' },
  4: { primary: '#4c1d95', secondary: '#f5f3ff', accent: '#2e1065' },
  5: { primary: '#111827', secondary: '#f9fafb', accent: '#000000' },
  6: { primary: '#be185d', secondary: '#fdf2f8', accent: '#9d174d' },
  7: { primary: '#065f46', secondary: '#ecfdf5', accent: '#064e3b' },
  8: { primary: '#64748b', secondary: '#f8fafc', accent: '#475569' },
}

const fmt = (dateStr) => {
  if (!dateStr) return ''
  const [y, m] = dateStr.split('-')
  return `${m}/${y}`
}

export default function CVPreview({ data, templateId }) {
  const colors = TEMPLATE_COLORS[templateId] || TEMPLATE_COLORS[1]
  const p = data.personal || {}

  const styleBlock = (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
      
      .cv-preview-font-wrapper {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      }
      
      .cv-preview-font-wrapper h1, 
      .cv-preview-font-wrapper h2, 
      .cv-preview-font-wrapper h3 {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
      }
    `}} />
  )

  const sectionTitle = (title) => (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{
        fontSize: 11.5, fontWeight: 800, color: colors.primary,
        textTransform: 'uppercase', letterSpacing: '1.2px',
        borderBottom: `2.5px solid ${colors.primary}`,
        paddingBottom: 6, margin: 0
      }}>{title}</h2>
    </div>
  )

  // ==========================================
  // TEMPLATE 1 & 7: Two-column layout (Coordinated Grid)
  // ==========================================
  if ([1, 7].includes(templateId)) {
    return (
      <div className="cv-preview-font-wrapper" style={{
        background: 'white', width: '100%', minHeight: '297mm',
        fontSize: 11, color: '#2d3748', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
      }}>
        {styleBlock}
        
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
          padding: '32px 36px', color: 'white', display: 'flex', gap: 28, alignItems: 'center',
          position: 'relative'
        }}>
          {p.avatar && (
            <div style={{ 
              width: 96, height: 96, borderRadius: '50%', 
              border: '4px solid rgba(255,255,255,0.35)', 
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
              overflow: 'hidden', flexShrink: 0, background: 'white' 
            }}>
              <img src={p.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 25, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
              {p.fullName || 'Họ và tên của bạn'}
            </h1>
            <p style={{ fontSize: 12.5, margin: '6px 0 14px', opacity: 0.95, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              {p.jobTitle || 'Vị trí / Chức danh'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 10.5, opacity: 0.9 }}>
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Phone size={12} strokeWidth={2} /> {p.phone}</span>}
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Mail size={12} strokeWidth={2} /> {p.email}</span>}
              {p.dob && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Calendar size={12} strokeWidth={2} /> {p.dob}</span>}
              {p.address && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><MapPin size={12} strokeWidth={2} /> {p.address}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><LinkIcon size={12} strokeWidth={2} /> {p.linkedin}</span>}
            </div>
          </div>
        </div>

        {/* Body: 2 column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr', gap: 0, flex: 1 }}>
          {/* Left col */}
          <div style={{ background: colors.secondary, padding: '28px 24px', borderRight: `1px solid ${colors.primary}12`, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {p.summary && (
              <div>
                {sectionTitle('Mục tiêu')}
                <p style={{ fontSize: 10.5, lineHeight: 1.6, color: '#4a5568', margin: 0 }}>{p.summary}</p>
              </div>
            )}

            {(data.skills || []).length > 0 && (
              <div>
                {sectionTitle('Kỹ năng')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(data.skills || []).map(skill => (
                    <div key={skill.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: '#2d3748' }}>{skill.name}</span>
                        <span style={{ fontSize: 10, color: colors.primary, fontWeight: 700 }}>{skill.level}%</span>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 10, height: 6, overflow: 'hidden' }}>
                        <div style={{
                          width: `${skill.level}%`, background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                          height: '100%', borderRadius: 10,
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(data.education || []).length > 0 && (
              <div>
                {sectionTitle('Học vấn')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(data.education || []).map(edu => (
                    <div key={edu.id}>
                      <div style={{ fontWeight: 700, fontSize: 11, color: '#1a202c' }}>{edu.school}</div>
                      <div style={{ fontSize: 10, color: colors.primary, fontWeight: 600, marginTop: 1 }}>{edu.major}</div>
                      <div style={{ fontSize: 9.5, color: '#718096', marginTop: 2, fontWeight: 500 }}>
                        {fmt(edu.start)} – {fmt(edu.end)}
                      </div>
                      {edu.desc && <div style={{ fontSize: 9.5, color: '#4a5568', marginTop: 4, fontStyle: 'italic', lineHeight: 1.5 }}>{edu.desc}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(data.certificates || []).length > 0 && (
              <div>
                {sectionTitle('Chứng chỉ')}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(data.certificates || []).map(cert => (
                    <div key={cert.id}>
                      <div style={{ fontWeight: 700, fontSize: 11, color: '#1a202c' }}>{cert.name}</div>
                      <div style={{ fontSize: 9.5, color: colors.accent, fontWeight: 600, marginTop: 1 }}>{cert.org}</div>
                      {cert.date && <div style={{ fontSize: 9, color: '#718096', marginTop: 2 }}>Tháng {fmt(cert.date)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right col */}
          <div style={{ padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {(data.experience || []).length > 0 && (
              <div>
                {sectionTitle('Kinh nghiệm làm việc')}
                <div style={{ position: 'relative', borderLeft: `2px solid ${colors.primary}20`, paddingLeft: 18, marginLeft: 8, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {(data.experience || []).map(exp => (
                    <div key={exp.id} style={{ position: 'relative' }}>
                      {/* Timeline Node */}
                      <div style={{
                        position: 'absolute', left: -23, top: 4, width: 8, height: 8,
                        borderRadius: '50%', background: colors.primary, border: '2px solid white',
                        boxShadow: `0 0 0 2px ${colors.primary}30`
                      }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 12, color: '#1a202c' }}>{exp.role}</div>
                          <div style={{ fontSize: 11, color: colors.primary, fontWeight: 600, marginTop: 2 }}>{exp.company}</div>
                        </div>
                        <span style={{ fontSize: 9.5, color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>
                          {fmt(exp.start)} – {exp.currentlyWorking ? 'Hiện tại' : fmt(exp.end)}
                        </span>
                      </div>
                      {exp.desc && (
                        <p style={{ fontSize: 10, color: '#4b5563', marginTop: 6, lineHeight: 1.6, whiteSpace: 'pre-line', margin: '6px 0 0 0' }}>
                          {exp.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(data.projects || []).length > 0 && (
              <div>
                {sectionTitle('Dự án cá nhân')}
                <div style={{ position: 'relative', borderLeft: `2px solid ${colors.primary}20`, paddingLeft: 18, marginLeft: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {(data.projects || []).map(proj => (
                    <div key={proj.id} style={{ position: 'relative' }}>
                      {/* Timeline Node */}
                      <div style={{
                        position: 'absolute', left: -23, top: 4, width: 8, height: 8,
                        borderRadius: '50%', background: colors.primary, border: '2px solid white',
                        boxShadow: `0 0 0 2px ${colors.primary}30`
                      }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 12, color: '#1a202c' }}>{proj.name}</div>
                          {proj.role && <div style={{ fontSize: 10.5, color: colors.primary, fontWeight: 600, marginTop: 2 }}>{proj.role}</div>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: 9.5, color: '#64748b', fontWeight: 600 }}>
                          {(proj.start || proj.end) && (
                            <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, marginBottom: 4 }}>
                              {fmt(proj.start)} – {fmt(proj.end)}
                            </span>
                          )}
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: colors.primary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <LinkIcon size={9} /> Xem dự án
                            </a>
                          )}
                        </div>
                      </div>
                      {proj.desc && <p style={{ fontSize: 10, color: '#4b5563', marginTop: 6, lineHeight: 1.6, whiteSpace: 'pre-line', margin: '6px 0 0 0' }}>{proj.desc}</p>}
                      {proj.technologies && (
                        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {proj.technologies.split(',').map((t, i) => (
                            <span key={i} style={{
                              background: colors.secondary, color: colors.primary,
                              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                              border: `1px solid ${colors.primary}15`
                            }}>{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // TEMPLATE 3, 4, 5: Dark header (Single-column Grid Layout)
  // ==========================================
  if ([3, 4, 5].includes(templateId)) {
    return (
      <div className="cv-preview-font-wrapper" style={{
        background: 'white', width: '100%', minHeight: '297mm',
        fontSize: 11, color: '#2d3748', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
      }}>
        {styleBlock}
        
        <div style={{ 
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`, 
          padding: '36px 40px', color: 'white', display: 'flex', gap: 28, alignItems: 'center' 
        }}>
          {p.avatar && (
            <div style={{ 
              width: 96, height: 96, borderRadius: '8px', 
              border: '3px solid rgba(255,255,255,0.3)', 
              boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
              overflow: 'hidden', flexShrink: 0, background: 'white' 
            }}>
              <img src={p.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>{p.fullName || 'Họ và tên'}</h1>
            <p style={{ margin: '6px 0 14px', fontSize: 13, fontWeight: 600, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>{p.jobTitle || 'Chức danh'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 10.5, opacity: 0.9 }}>
              {p.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Phone size={12} strokeWidth={2} /> {p.phone}</span>}
              {p.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Mail size={12} strokeWidth={2} /> {p.email}</span>}
              {p.dob && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Calendar size={12} strokeWidth={2} /> {p.dob}</span>}
              {p.address && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><MapPin size={12} strokeWidth={2} /> {p.address}</span>}
              {p.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><LinkIcon size={12} strokeWidth={2} /> {p.linkedin}</span>}
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {p.summary && (
            <div>
              {sectionTitle('Mục tiêu nghề nghiệp')}
              <p style={{ fontSize: 10.5, lineHeight: 1.6, color: '#4a5568', margin: 0 }}>{p.summary}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '0 32px', flex: 1 }}>
            {/* Column 1: Experience & Projects */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {(data.experience || []).length > 0 && (
                <div>
                  {sectionTitle('Kinh nghiệm làm việc')}
                  <div style={{ position: 'relative', borderLeft: `2px solid ${colors.primary}20`, paddingLeft: 16, marginLeft: 6, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {(data.experience || []).map(exp => (
                      <div key={exp.id} style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute', left: -21, top: 4, width: 8, height: 8,
                          borderRadius: '50%', background: colors.primary, border: '2px solid white',
                          boxShadow: `0 0 0 2px ${colors.primary}30`
                        }} />
                        <div style={{ fontWeight: 800, fontSize: 11.5, color: '#1a202c' }}>{exp.role}</div>
                        <div style={{ color: colors.primary, fontSize: 10.5, fontWeight: 600, marginTop: 1 }}>{exp.company}</div>
                        <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600, marginTop: 2 }}>{fmt(exp.start)} – {exp.currentlyWorking ? 'Hiện tại' : fmt(exp.end)}</div>
                        {exp.desc && <p style={{ fontSize: 10, color: '#4b5563', marginTop: 4, lineHeight: 1.5, margin: '4px 0 0 0' }}>{exp.desc}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(data.projects || []).length > 0 && (
                <div>
                  {sectionTitle('Dự án cá nhân')}
                  <div style={{ position: 'relative', borderLeft: `2px solid ${colors.primary}20`, paddingLeft: 16, marginLeft: 6, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {(data.projects || []).map(proj => (
                      <div key={proj.id} style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute', left: -21, top: 4, width: 8, height: 8,
                          borderRadius: '50%', background: colors.primary, border: '2px solid white',
                          boxShadow: `0 0 0 2px ${colors.primary}30`
                        }} />
                        <div style={{ fontWeight: 800, fontSize: 11.5, color: '#1a202c' }}>{proj.name}</div>
                        {proj.role && <div style={{ color: colors.primary, fontSize: 10, fontWeight: 600, marginTop: 1 }}>{proj.role}</div>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2, fontSize: 9 }}>
                          <span style={{ color: '#64748b', fontWeight: 600 }}>{fmt(proj.start)} – {fmt(proj.end)}</span>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: colors.primary, textDecoration: 'none', fontWeight: 600 }}>Xem dự án</a>
                          )}
                        </div>
                        {proj.desc && <p style={{ fontSize: 10, color: '#4b5563', marginTop: 4, lineHeight: 1.5, margin: '4px 0 0 0' }}>{proj.desc}</p>}
                        {proj.technologies && <p style={{ fontSize: 9, color: '#64748b', marginTop: 4, margin: '4px 0 0 0', fontWeight: 500 }}>Tech: {proj.technologies}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Skills, Education, Certs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {(data.skills || []).length > 0 && (
                <div>
                  {sectionTitle('Kỹ năng')}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(data.skills || []).map(skill => (
                      <div key={skill.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 600, color: '#2d3748' }}>{skill.name}</span>
                          <span style={{ fontSize: 10, color: colors.primary, fontWeight: 700 }}>{skill.level}%</span>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 10, height: 6, overflow: 'hidden' }}>
                          <div style={{ width: `${skill.level}%`, background: colors.primary, height: '100%', borderRadius: 10 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(data.education || []).length > 0 && (
                <div>
                  {sectionTitle('Học vấn')}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(data.education || []).map(edu => (
                      <div key={edu.id}>
                        <div style={{ fontWeight: 700, fontSize: 11, color: '#1a202c' }}>{edu.school}</div>
                        <div style={{ fontSize: 10, color: colors.primary, fontWeight: 600, marginTop: 1 }}>{edu.major}</div>
                        <div style={{ fontSize: 9, color: '#64748b', marginTop: 2, fontWeight: 600 }}>{fmt(edu.start)} – {fmt(edu.end)}</div>
                        {edu.desc && <div style={{ fontSize: 9.5, color: '#4b5563', marginTop: 4, lineHeight: 1.4 }}>{edu.desc}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(data.certificates || []).length > 0 && (
                <div>
                  {sectionTitle('Chứng chỉ')}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(data.certificates || []).map(cert => (
                      <div key={cert.id}>
                        <div style={{ fontWeight: 700, fontSize: 11, color: '#1a202c' }}>{cert.name}</div>
                        <div style={{ fontSize: 9.5, color: colors.accent, fontWeight: 600, marginTop: 1 }}>{cert.org}</div>
                        {cert.date && <div style={{ fontSize: 9, color: '#718096', marginTop: 2 }}>{fmt(cert.date)}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // TEMPLATE 2, 6, 8: Elegant Sidebar
  // ==========================================
  return (
    <div className="cv-preview-font-wrapper cv-preview-container" style={{
      width: '100%', minHeight: '297mm',
      fontSize: 11, color: '#2d3748', overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '32% 68%', flex: 1, boxSizing: 'border-box'
    }}>
      {styleBlock}
      
      {/* Sidebar */}
      <div style={{ 
        background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})`, 
        padding: '32px 20px', color: 'white', display: 'flex', flexDirection: 'column', gap: 24 
      }}>
        <div style={{ textAlign: 'center' }}>
          {p.avatar ? (
            <div style={{ 
              width: 96, height: 96, borderRadius: '50%', background: 'white', 
              margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              overflow: 'hidden' 
            }}>
              <img src={p.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', 
              margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: 32, border: '4px solid rgba(255,255,255,0.3)' 
            }}>👤</div>
          )}
          <h1 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.3px', textTransform: 'capitalize' }}>{p.fullName || 'Họ và tên'}</h1>
          <p style={{ fontSize: 10.5, opacity: 0.9, margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{p.jobTitle || 'Chức danh'}</p>
        </div>
        
        <div style={{ borderTop: 'rgba(255,255,255,0.2) 1px solid', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 10 }}>
          {p.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={12} strokeWidth={2.5} /> {p.phone}</div>}
          {p.email && <div style={{ display: 'flex', alignItems: 'center', gap: 8, wordBreak: 'break-all' }}><Mail size={12} strokeWidth={2.5} /> {p.email}</div>}
          {p.dob && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={12} strokeWidth={2.5} /> {p.dob}</div>}
          {p.address && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={12} strokeWidth={2.5} /> {p.address}</div>}
          {p.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><LinkIcon size={12} strokeWidth={2.5} /> {p.linkedin}</div>}
        </div>
        
        {(data.skills || []).length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, opacity: 0.85 }}>Kỹ năng</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(data.skills || []).map(skill => (
                <div key={skill.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10, fontWeight: 500 }}>
                    <span>{skill.name}</span><span>{skill.level}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, height: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${skill.level}%`, background: 'white', height: '100%', borderRadius: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(data.education || []).length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, opacity: 0.85 }}>Học vấn</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(data.education || []).map(edu => (
                <div key={edu.id} style={{ fontSize: 9.5 }}>
                  <div style={{ fontWeight: 700 }}>{edu.school}</div>
                  <div style={{ opacity: 0.9, marginTop: 1 }}>{edu.major}</div>
                  <div style={{ opacity: 0.7, marginTop: 2, fontWeight: 500 }}>{fmt(edu.start)} – {fmt(edu.end)}</div>
                  {edu.desc && <div style={{ opacity: 0.8, fontSize: 8.5, marginTop: 4, fontStyle: 'italic', lineHeight: 1.4 }}>{edu.desc}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {p.summary && (
          <div>
            {sectionTitle('Mục tiêu nghề nghiệp')}
            <p style={{ fontSize: 10.5, lineHeight: 1.6, color: '#4a5568', margin: 0 }}>{p.summary}</p>
          </div>
        )}
        
        {(data.experience || []).length > 0 && (
          <div>
            {sectionTitle('Kinh nghiệm làm việc')}
            <div style={{ position: 'relative', borderLeft: `2px solid ${colors.primary}20`, paddingLeft: 18, marginLeft: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(data.experience || []).map(exp => (
                <div key={exp.id} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: -23, top: 4, width: 8, height: 8,
                    borderRadius: '50%', background: colors.primary, border: '2px solid white',
                    boxShadow: `0 0 0 2px ${colors.primary}30`
                  }} />
                  <div style={{ fontWeight: 800, fontSize: 11.5, color: '#1a202c' }}>{exp.role}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                    <span style={{ color: colors.primary, fontSize: 10.5, fontWeight: 600 }}>{exp.company}</span>
                    <span style={{ fontSize: 9.5, color: '#64748b', fontWeight: 600 }}>{fmt(exp.start)} – {exp.currentlyWorking ? 'Hiện tại' : fmt(exp.end)}</span>
                  </div>
                  {exp.desc && <p style={{ fontSize: 10, color: '#4b5563', marginTop: 4, lineHeight: 1.5, margin: '4px 0 0 0' }}>{exp.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(data.projects || []).length > 0 && (
          <div>
            {sectionTitle('Dự án cá nhân')}
            <div style={{ position: 'relative', borderLeft: `2px solid ${colors.primary}20`, paddingLeft: 18, marginLeft: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(data.projects || []).map(proj => (
                <div key={proj.id} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: -23, top: 4, width: 8, height: 8,
                    borderRadius: '50%', background: colors.primary, border: '2px solid white',
                    boxShadow: `0 0 0 2px ${colors.primary}30`
                  }} />
                  <div style={{ fontWeight: 800, fontSize: 11.5, color: '#1a202c' }}>{proj.name} {proj.role && <span style={{ color: colors.primary, fontWeight: 600 }}> · {proj.role}</span>}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                    {(proj.start || proj.end) && (
                      <span style={{ fontSize: 9.5, color: '#64748b', fontWeight: 600 }}>{fmt(proj.start)} – {fmt(proj.end)}</span>
                    )}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" style={{ fontSize: 9.5, color: colors.primary, textDecoration: 'none', fontWeight: 600 }}>Xem dự án</a>
                    )}
                  </div>
                  {proj.desc && <p style={{ fontSize: 10, color: '#4b5563', marginTop: 4, lineHeight: 1.5, margin: '4px 0 0 0' }}>{proj.desc}</p>}
                  {proj.technologies && <p style={{ fontSize: 9, color: '#64748b', marginTop: 4, margin: '4px 0 0 0', fontWeight: 500 }}>Tech: {proj.technologies}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(data.certificates || []).length > 0 && (
          <div>
            {sectionTitle('Chứng chỉ')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(data.certificates || []).map(cert => (
                <div key={cert.id} style={{
                  background: colors.secondary, border: `1px solid ${colors.primary}15`,
                  borderRadius: 6, padding: '6px 12px'
                }}>
                  <div style={{ fontWeight: 700, fontSize: 10.5, color: colors.accent }}>{cert.name}</div>
                  <div style={{ fontSize: 9.5, color: '#64748b', marginTop: 2, fontWeight: 500 }}>{cert.org} {cert.date && `| ${fmt(cert.date)}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
