'use client'

import { useEffect, useState } from 'react'

interface Props {
  onCancel: () => void
}

const DOTS = ['·', '··', '···']

export function MatchmakingView({ onCancel }: Props) {
  const [dotIdx, setDotIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setDotIdx(i => (i + 1) % 3), 500)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '24px 32px',
    }}>
      <div>
        <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '0 0 4px' }}>Finding a match</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', margin: 0, fontFamily: 'var(--font-display)' }}>
          Waiting for opponent
        </h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--avatar-you-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--avatar-you-fg)',
              letterSpacing: '0.05em',
            }}>
              YO
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg)' }}>You</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
          </div>

          <span style={{ fontSize: 18, color: 'var(--fg-muted)', marginBottom: 22, fontFamily: 'var(--font-display)' }}>
            vs
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--surface)',
              border: '1.5px dashed var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="8" r="4" stroke="var(--fg-muted)" strokeWidth="1.2"/>
                <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="var(--fg-muted)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Opponent</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, color: 'var(--fg-muted)', letterSpacing: 2, fontFamily: 'monospace', minWidth: 28 }}>
            {DOTS[dotIdx]}
          </span>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Searching for a player</span>
        </div>
      </div>

      <button
        onClick={onCancel}
        style={{
          width: '100%',
          padding: '14px',
          background: 'transparent',
          color: 'var(--fg-muted)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-display)',
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'var(--surface)')}
        onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
      >
        Cancel
      </button>
    </div>
  )
}