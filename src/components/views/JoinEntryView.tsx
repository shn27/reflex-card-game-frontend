'use client'
import { useState } from 'react'
import type { RoomError } from '@/hooks/useRoomSocket'

interface Props {
  onJoin: (secret: string) => void
  onBack: () => void
  error: RoomError
  errorMessage: string
  onClearError: () => void
  connecting: boolean
}

export function JoinEntryView({ onJoin, onBack, error, errorMessage, onClearError, connecting }: Props) {
  const [secret, setSecret] = useState('')

  const handleSubmit = () => {
    const trimmed = secret.trim().toUpperCase()
    if (!trimmed) return
    onJoin(trimmed)
  }

  const handleChange = (val: string) => {
    setSecret(val.toUpperCase())
    if (error) onClearError()
  }

  const isInvalid = error === 'room_invalid'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 28px' }}>

      {/* back */}
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start', background: 'none', border: 'none',
          color: 'rgba(201,168,76,0.55)', fontSize: 13, cursor: 'pointer',
          letterSpacing: '0.06em', padding: 0, marginBottom: 32,
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        ← BACK
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          border: '2px solid #9a7a2e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, color: '#c9a84c', margin: '0 auto 20px',
        }}>♦</div>

        <h2 style={{
          fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 900,
          color: '#c9a84c', textAlign: 'center', margin: '0 0 6px',
        }}>JOIN ROOM</h2>

        <p style={{
          fontSize: 12, color: 'rgba(253,246,227,0.4)', textAlign: 'center',
          letterSpacing: '0.1em', marginBottom: 40,
        }}>ENTER THE SECRET CODE</p>

        {/* input */}
        <div style={{ marginBottom: 8 }}>
          <input
            type="text"
            value={secret}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. X7K2P"
            maxLength={10}
            autoFocus
            style={{
              width: '100%',
              padding: '16px 18px',
              background: 'rgba(0,0,0,0.25)',
              border: `1.5px solid ${isInvalid ? 'rgba(239,83,80,0.6)' : 'rgba(154,122,46,0.5)'}`,
              borderRadius: 12,
              color: '#fdf6e3',
              fontSize: 22,
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textAlign: 'center',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { if (!isInvalid) e.target.style.borderColor = '#c9a84c' }}
            onBlur={e => { if (!isInvalid) e.target.style.borderColor = 'rgba(154,122,46,0.5)' }}
          />
        </div>

        {/* error message */}
        <div style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          {isInvalid && (
            <p style={{ fontSize: 13, color: '#ef9a9a', textAlign: 'center' }}>
              {errorMessage || 'Invalid code. Check with your friend and try again.'}
            </p>
          )}
          {error === 'rate_limited' && (
            <p style={{ fontSize: 13, color: '#ef9a9a', textAlign: 'center' }}>
              Connection refused. Please try again shortly.
            </p>
          )}
          {error === 'server_unavailable' && (
            <p style={{ fontSize: 13, color: '#ef9a9a', textAlign: 'center' }}>
              Could not reach the server.
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!secret.trim() || connecting}
          style={{
            width: '100%', padding: '16px',
            background: secret.trim() && !connecting ? '#c9a84c' : 'rgba(201,168,76,0.18)',
            color: secret.trim() && !connecting ? '#1a1a1a' : 'rgba(253,246,227,0.25)',
            border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 700, letterSpacing: '0.1em',
            fontFamily: 'Georgia, serif',
            cursor: secret.trim() && !connecting ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseOver={e => { if (secret.trim() && !connecting) e.currentTarget.style.background = '#e8c96a' }}
          onMouseOut={e => { if (secret.trim() && !connecting) e.currentTarget.style.background = '#c9a84c' }}
        >
          {connecting ? 'JOINING...' : 'JOIN ROOM'}
        </button>
      </div>
    </div>
  )
}