'use client'

const TEMPLATE_COLORS = {
  1: { primary: '#0c7fda', secondary: '#ebf8ff', accent: '#2b6cb0' },
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

  const sectionTitle = (title) => (
    <div style={{ marginBottom: 8 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 800, color: colors.primary,
        textTransform: 'uppercase', letterSpacing: '1px',
        borderBottom: `2px solid ${colors.primary}`,
        paddingBottom: 4, marginBottom: 6
      }}>{title}</h2>
    </div>
  )

  // Template 1 & 7: Two-column layout
  if ([1, 7].includes(templateId)) {
    return (
      <div id="cv-print-area" style={{
        background: 'white', width: '100%', minHeight: '297mm',
        fontSize: 11, fontFamily: "'Segoe UI', Arial, sans-serif",
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 4,
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
          padding: '24px 28px', color: 'white', display: 'flex', gap: 24, alignItems: 'center'
        }}>
          {p.avatar && (
            <div style={{ width: 90, height: 90, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.3)', overflow: 'hidden', flexShrink: 0, background: 'white' }}>
              <img src={p.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>
              {p.fullName || 'Họ và tên của bạn'}
            </h1>
            <p style={{ fontSize: 12, margin: '4px 0 10px', opacity: 0.9, fontWeight: 500 }}>
              {p.jobTitle || 'Vị trí / Chức danh'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: 10.5, opacity: 0.9 }}>
              {p.phone && <span>📱 {p.phone}</span>}
              {p.email && <span>✉ {p.email}</span>}
              {p.address && <span>📍 {p.address}</span>}
              {p.linkedin && <span>🔗 {p.linkedin}</span>}
            </div>
          </div>
        </div>

        {/* Body: 2 column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 0, minHeight: '230mm' }}>
          {/* Left col */}
          <div style={{ background: colors.secondary, padding: '20px 16px', borderRight: `1px solid ${colors.primary}20` }}>
            {p.summary && (
              <div style={{ marginBottom: 16 }}>
                {sectionTitle('Mục tiêu')}
                <p style={{ fontSize: 10.5, lineHeight: 1.6, color: '#4a5568' }}>{p.summary}</p>
              </div>
            )}

            {(data.skills || []).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                {sectionTitle('Kỹ năng')}
                {(data.skills || []).map(skill => (
                  <div key={skill.id} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: '#2d3748' }}>{skill.name}</span>
                      <span style={{ fontSize: 10, color: colors.primary, fontWeight: 700 }}>{skill.level}%</span>
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: 4, height: 5 }}>
                      <div style={{
                        width: `${skill.level}%`, background: colors.primary,
                        height: '100%', borderRadius: 4,
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(data.education || []).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                {sectionTitle('Học vấn')}
                {(data.education || []).map(edu => (
                  <div key={edu.id} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 10.5, color: '#2d3748' }}>{edu.school}</div>
                    <div style={{ fontSize: 10, color: colors.primary, fontWeight: 600 }}>{edu.major}</div>
                    <div style={{ fontSize: 9.5, color: '#718096' }}>
                      {fmt(edu.startDate)} – {fmt(edu.endDate)}
                      {edu.gpa && ` | GPA: ${edu.gpa}`}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(data.certificates || []).length > 0 && (
              <div>
                {sectionTitle('Chứng chỉ')}
                {(data.certificates || []).map(cert => (
                  <div key={cert.id} style={{ marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 10.5, color: '#2d3748' }}>{cert.name}</div>
                    <div style={{ fontSize: 9.5, color: '#718096' }}>{cert.issuer} {cert.date && `· ${fmt(cert.date)}`}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right col */}
          <div style={{ padding: '20px 20px' }}>
            {(data.experience || []).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                {sectionTitle('Kinh nghiệm làm việc')}
                {(data.experience || []).map(exp => (
                  <div key={exp.id} style={{ marginBottom: 12, paddingLeft: 8, borderLeft: `3px solid ${colors.primary}40` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 11, color: '#2d3748' }}>{exp.position}</div>
                        <div style={{ fontSize: 10.5, color: colors.primary, fontWeight: 600 }}>{exp.company}</div>
                      </div>
                      <span style={{ fontSize: 9.5, color: '#718096', whiteSpace: 'nowrap', marginLeft: 8 }}>
                        {fmt(exp.startDate)} – {exp.currentlyWorking ? 'Hiện tại' : fmt(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && (
                      <p style={{ fontSize: 10, color: '#4a5568', marginTop: 4, lineHeight: 1.5 }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {(data.projects || []).length > 0 && (
              <div>
                {sectionTitle('Dự án cá nhân')}
                {(data.projects || []).map(proj => (
                  <div key={proj.id} style={{ marginBottom: 10, paddingLeft: 8, borderLeft: `3px solid ${colors.primary}40` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 700, fontSize: 11, color: '#2d3748' }}>{proj.name}</div>
                      {proj.role && <span style={{ fontSize: 9.5, color: colors.primary, fontWeight: 600 }}>{proj.role}</span>}
                    </div>
                    {proj.description && <p style={{ fontSize: 10, color: '#4a5568', marginTop: 3, lineHeight: 1.5 }}>{proj.description}</p>}
                    {proj.technologies && (
                      <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {proj.technologies.split(',').map((t, i) => (
                          <span key={i} style={{
                            background: colors.secondary, color: colors.primary,
                            fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 4,
                            border: `1px solid ${colors.primary}30`
                          }}>{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: 9.5, color: '#718096', marginTop: 4, display: 'flex', gap: 10 }}>
                      {proj.github && <span>GitHub: {proj.github}</span>}
                      {proj.demo && <span>Demo: {proj.demo}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Template 3, 4, 5: Dark header single column
  if ([3, 4, 5].includes(templateId)) {
    return (
      <div id="cv-print-area" style={{
        background: 'white', width: '100%', minHeight: '297mm',
        fontSize: 11, fontFamily: "'Segoe UI', Arial, sans-serif",
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 4, overflow: 'hidden'
      }}>
        <div style={{ background: colors.primary, padding: '28px 32px', color: 'white', display: 'flex', gap: 24, alignItems: 'center' }}>
          {p.avatar && (
            <div style={{ width: 90, height: 90, borderRadius: '5px', border: '3px solid rgba(255,255,255,0.2)', overflow: 'hidden', flexShrink: 0, background: 'white' }}>
              <img src={p.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>{p.fullName || 'Họ và tên'}</h1>
            <p style={{ margin: '4px 0 12px', fontSize: 13, opacity: 0.8 }}>{p.jobTitle || 'Chức danh'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', fontSize: 10.5, opacity: 0.85 }}>
              {p.phone && <span>📱 {p.phone}</span>}
              {p.email && <span>✉ {p.email}</span>}
              {p.address && <span>📍 {p.address}</span>}
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 32px' }}>
          {p.summary && (
            <div style={{ marginBottom: 16 }}>
              {sectionTitle('Mục tiêu nghề nghiệp')}
              <p style={{ fontSize: 10.5, lineHeight: 1.6, color: '#4a5568' }}>{p.summary}</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
            <div>
              {(data.experience || []).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  {sectionTitle('Kinh nghiệm')}
                  {(data.experience || []).map(exp => (
                    <div key={exp.id} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 11 }}>{exp.position}</div>
                      <div style={{ color: colors.primary, fontSize: 10.5, fontWeight: 600 }}>{exp.company}</div>
                      <div style={{ fontSize: 9.5, color: '#718096' }}>{fmt(exp.startDate)} – {exp.currentlyWorking ? 'Hiện tại' : fmt(exp.endDate)}</div>
                      {exp.description && <p style={{ fontSize: 10, color: '#4a5568', marginTop: 3 }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}
              {(data.projects || []).length > 0 && (
                <div>
                  {sectionTitle('Dự án')}
                  {(data.projects || []).map(proj => (
                    <div key={proj.id} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 11 }}>{proj.name} {proj.role && <span style={{ color: colors.primary }}>· {proj.role}</span>}</div>
                      {proj.description && <p style={{ fontSize: 10, color: '#4a5568', marginTop: 3 }}>{proj.description}</p>}
                      {proj.technologies && <p style={{ fontSize: 10, color: '#718096' }}>{proj.technologies}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              {(data.skills || []).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  {sectionTitle('Kỹ năng')}
                  {(data.skills || []).map(skill => (
                    <div key={skill.id} style={{ marginBottom: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 600 }}>{skill.name}</span>
                        <span style={{ fontSize: 10, color: colors.primary }}>{skill.level}%</span>
                      </div>
                      <div style={{ background: '#e2e8f0', borderRadius: 4, height: 5 }}>
                        <div style={{ width: `${skill.level}%`, background: colors.primary, height: '100%', borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {(data.education || []).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  {sectionTitle('Học vấn')}
                  {(data.education || []).map(edu => (
                    <div key={edu.id} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 10.5 }}>{edu.school}</div>
                      <div style={{ fontSize: 10, color: colors.primary }}>{edu.major}</div>
                      <div style={{ fontSize: 9.5, color: '#718096' }}>{fmt(edu.startDate)} – {fmt(edu.endDate)} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                    </div>
                  ))}
                </div>
              )}
              {(data.certificates || []).length > 0 && (
                <div>
                  {sectionTitle('Chứng chỉ')}
                  {(data.certificates || []).map(cert => (
                    <div key={cert.id} style={{ marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 10.5 }}>{cert.name}</div>
                      <div style={{ fontSize: 9.5, color: '#718096' }}>{cert.issuer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Templates 2, 6, 8: Accent side bar
  return (
    <div id="cv-print-area" style={{
      background: 'white', width: '100%', minHeight: '297mm',
      fontSize: 11, fontFamily: "'Segoe UI', Arial, sans-serif",
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)', borderRadius: 4, overflow: 'hidden',
      display: 'grid', gridTemplateColumns: '35% 1fr'
    }}>
      {/* Sidebar */}
      <div style={{ background: `linear-gradient(180deg, ${colors.primary}, ${colors.accent})`, padding: '28px 16px', color: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          {p.avatar ? (
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'white', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.5)', overflow: 'hidden' }}>
              <img src={p.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: '3px solid rgba(255,255,255,0.5)' }}>👤</div>
          )}
          <h1 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 3px' }}>{p.fullName || 'Họ và tên'}</h1>
          <p style={{ fontSize: 10, opacity: 0.85, margin: 0 }}>{p.jobTitle || 'Chức danh'}</p>
        </div>
        <div style={{ borderTop: 'rgba(255,255,255,0.3) 1px solid', paddingTop: 12, marginBottom: 14, fontSize: 9.5 }}>
          {p.phone && <div style={{ marginBottom: 4 }}>📱 {p.phone}</div>}
          {p.email && <div style={{ marginBottom: 4 }}>✉ {p.email}</div>}
          {p.address && <div style={{ marginBottom: 4 }}>📍 {p.address}</div>}
        </div>
        {(data.skills || []).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, opacity: 0.7 }}>Kỹ năng</div>
            {(data.skills || []).map(skill => (
              <div key={skill.id} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, fontSize: 10 }}>
                  <span>{skill.name}</span><span>{skill.level}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 4, height: 4 }}>
                  <div style={{ width: `${skill.level}%`, background: 'white', height: '100%', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {(data.education || []).length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, opacity: 0.7 }}>Học vấn</div>
            {(data.education || []).map(edu => (
              <div key={edu.id} style={{ marginBottom: 8, fontSize: 9.5 }}>
                <div style={{ fontWeight: 700 }}>{edu.school}</div>
                <div style={{ opacity: 0.8 }}>{edu.major}</div>
                <div style={{ opacity: 0.6 }}>{fmt(edu.startDate)} – {fmt(edu.endDate)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ padding: '28px 20px' }}>
        {p.summary && (
          <div style={{ marginBottom: 16 }}>
            {sectionTitle('Mục tiêu nghề nghiệp')}
            <p style={{ fontSize: 10.5, lineHeight: 1.6, color: '#4a5568' }}>{p.summary}</p>
          </div>
        )}
        {(data.experience || []).length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {sectionTitle('Kinh nghiệm làm việc')}
            {(data.experience || []).map(exp => (
              <div key={exp.id} style={{ marginBottom: 10, paddingLeft: 8, borderLeft: `3px solid ${colors.primary}50` }}>
                <div style={{ fontWeight: 700, fontSize: 11, color: '#2d3748' }}>{exp.position}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: colors.primary, fontSize: 10.5, fontWeight: 600 }}>{exp.company}</span>
                  <span style={{ fontSize: 9.5, color: '#718096' }}>{fmt(exp.startDate)} – {exp.currentlyWorking ? 'Hiện tại' : fmt(exp.endDate)}</span>
                </div>
                {exp.description && <p style={{ fontSize: 10, color: '#4a5568', marginTop: 4 }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {(data.projects || []).length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {sectionTitle('Dự án cá nhân')}
            {(data.projects || []).map(proj => (
              <div key={proj.id} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 11 }}>{proj.name} {proj.role && <span style={{ color: colors.primary, fontWeight: 500 }}>· {proj.role}</span>}</div>
                {proj.description && <p style={{ fontSize: 10, color: '#4a5568', marginTop: 3 }}>{proj.description}</p>}
                {proj.technologies && <p style={{ fontSize: 9.5, color: '#718096', marginTop: 2 }}>Tech: {proj.technologies}</p>}
                <div style={{ fontSize: 9.5, color: colors.primary, marginTop: 2, display: 'flex', gap: 10 }}>
                  {proj.github && <span>GitHub</span>}
                  {proj.demo && <span>Demo</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        {(data.certificates || []).length > 0 && (
          <div>
            {sectionTitle('Chứng chỉ')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(data.certificates || []).map(cert => (
                <div key={cert.id} style={{
                  background: colors.secondary, border: `1px solid ${colors.primary}30`,
                  borderRadius: 6, padding: '5px 10px'
                }}>
                  <div style={{ fontWeight: 700, fontSize: 10.5, color: colors.accent }}>{cert.name}</div>
                  <div style={{ fontSize: 9.5, color: '#718096' }}>{cert.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
