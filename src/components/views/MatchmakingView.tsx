'use client'
import { useEffect, useState } from 'react'
import type { ConnectionError } from '@/hooks/useGameSocket'

interface Props {
  onCancel: () => void
  onRetry: () => void
  waitingMessage?: string
  error: ConnectionError
}

const ERROR_CONFIG: Record<NonNullable<ConnectionError>, { title: string; message: string; badge: string }> = {
  rate_limited: {
    title: 'CONNECTION REFUSED',
    message: 'The server is currently full or your\nconnection was rate limited.\nPlease try again in a moment.',
    badge: 'RATE LIMITED',
  },
  server_unavailable: {
    title: 'CONNECTION FAILED',
    message: 'Could not reach the server.\nCheck your connection and try again.',
    badge: 'UNAVAILABLE',
  },
}

export function MatchmakingView({ onCancel, onRetry, waitingMessage, error }: Props) {
  const [dot, setDot] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setDot(d => (d + 1) % 3), 500)
    return () => clearInterval(id)
  }, [])

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    const cfg = ERROR_CONFIG[error]
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: 10, color: '#c9a84c', letterSpacing: '0.18em', marginBottom: 6 }}>
            {cfg.title}
          </p>
          <div style={{ width: 36, height: 1, background: '#9a7a2e', margin: '0 auto' }} />
        </div>

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 24,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(239,83,80,0.1)',
            border: '2px solid rgba(239,83,80,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, color: 'rgba(239,83,80,0.75)',
          }}>✕</div>

          <p style={{
            fontSize: 14, color: 'rgba(253,246,227,0.62)',
            textAlign: 'center', lineHeight: 1.7, whiteSpace: 'pre-line',
          }}>
            {cfg.message}
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.22)',
            border: '1px solid rgba(239,83,80,0.2)',
            borderRadius: 6, padding: '4px 12px',
          }}>
            <span style={{ fontSize: 11, color: 'rgba(239,83,80,0.55)', letterSpacing: '0.08em' }}>
              {cfg.badge}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onRetry}
            style={{
              width: '100%', padding: '15px', background: '#c9a84c', color: '#1a1a1a',
              border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.1em', fontFamily: 'Georgia, serif',
              transition: 'background 0.15s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e8c96a')}
            onMouseOut={e => (e.currentTarget.style.background = '#c9a84c')}
          >
            TRY AGAIN
          </button>
          <button
            onClick={onCancel}
            style={{
              width: '100%', padding: '13px', background: 'transparent',
              color: 'rgba(201,168,76,0.6)', border: '1.5px solid rgba(154,122,46,0.4)',
              borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              letterSpacing: '0.06em', transition: 'border-color 0.15s',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = '#9a7a2e')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(154,122,46,0.4)')}
          >
            CANCEL
          </button>
        </div>
      </div>
    )
  }

  // ── Waiting state ────────────────────────────────────────────────────────────
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 28px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ fontSize: 10, color: '#c9a84c', letterSpacing: '0.18em', marginBottom: 6 }}>
          FINDING OPPONENT
        </p>
        <div style={{ width: 36, height: 1, background: '#9a7a2e', margin: '0 auto' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'rgba(201,168,76,0.12)', border: '2px solid #9a7a2e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#c9a84c',
            }}>Y</div>
            <span style={{ fontSize: 12, color: '#fdf6e3', fontWeight: 500 }}>You</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50' }} />
          </div>

          <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: 'rgba(253,246,227,0.35)' }}>VS</span>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)', border: '2px dashed #9a7a2e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, color: '#9a7a2e',
            }}>?</div>
            <span style={{ fontSize: 12, color: 'rgba(253,246,227,0.45)' }}>Waiting...</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#9a7a2e' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%', background: '#c9a84c',
              opacity: dot === i ? 1 : 0.2, transition: 'opacity 0.3s',
            }} />
          ))}
          <span style={{ fontSize: 12, color: 'rgba(253,246,227,0.45)', marginLeft: 6, letterSpacing: '0.04em' }}>
            {waitingMessage || 'Searching for a player'}
          </span>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.22)',
          border: '1px solid rgba(201,168,76,0.18)',
          borderRadius: 10, padding: '14px 18px', width: '100%', textAlign: 'center',
        }}>
          <p style={{ fontSize: 11, color: 'rgba(253,246,227,0.4)', letterSpacing: '0.08em', marginBottom: 4 }}>
            HOW TO WIN
          </p>
          <p style={{ fontSize: 13, color: 'rgba(253,246,227,0.7)', lineHeight: 1.6 }}>
            Wait for an Ace — then tap fast.<br />
            Tap any other card and you lose.
          </p>
        </div>
      </div>

      <button
        onClick={onCancel}
        style={{
          width: '100%', padding: '14px', background: 'transparent',
          color: 'rgba(201,168,76,0.6)', border: '1.5px solid rgba(154,122,46,0.4)',
          borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          letterSpacing: '0.06em', marginTop: 8, transition: 'border-color 0.15s',
        }}
        onMouseOver={e => (e.currentTarget.style.borderColor = '#9a7a2e')}
        onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(154,122,46,0.4)')}
      >
        CANCEL
      </button>
    </div>
  )
}