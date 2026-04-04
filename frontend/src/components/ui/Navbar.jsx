'use client'

import { useRouter } from 'next/navigation'

export default function Navbar({ rightContent }) {
  const router = useRouter()

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24
      }}>
        {/* Logo */}
        <div
          onClick={() => router.push('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0c7fda, #22d3ee)',
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '-0.5px'
          }}>
            CV
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#0c7fda', letterSpacing: '-0.3px' }}>
            TopCV
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1 }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, color: '#4a5568',
              padding: '4px 0',
              borderBottom: '2px solid transparent',
              transition: 'color 0.15s'
            }}
            onMouseOver={e => e.target.style.color = '#0c7fda'}
            onMouseOut={e => e.target.style.color = '#4a5568'}
          >
            Tạo CV
          </button>
          <button
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, color: '#4a5568',
              padding: '4px 0'
            }}
            onMouseOver={e => e.target.style.color = '#0c7fda'}
            onMouseOut={e => e.target.style.color = '#4a5568'}
          >
            Cẩm nang nghề nghiệp
          </button>
        </nav>

        {/* Right content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {rightContent || (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 20,
              background: '#f7fafc', border: '1px solid #e2e8f0',
              cursor: 'pointer', fontSize: 13, color: '#4a5568', fontWeight: 500
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 12, fontWeight: 700
              }}>U</div>
              <span>Người dùng</span>
              <span style={{ fontSize: 10, color: '#a0aec0' }}>▼</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
