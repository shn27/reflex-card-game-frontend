'use client'
import { useState } from 'react'
import type { RoomPlayer } from '@/types/game'

interface Props {
  secret: string
  players: RoomPlayer[]
  isHost: boolean
  myPlayerId: number | null
  onStart: () => void
  onLeave: () => void
}

export function RoomWaitingView({ secret, players, isHost, myPlayerId, onStart, onLeave }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(secret).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const canStart = isHost && players.length >= 2

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 24px' }}>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ fontSize: 10, color: '#c9a84c', letterSpacing: '0.18em', marginBottom: 6 }}>
          {isHost ? 'YOUR ROOM' : 'JOINED ROOM'}
        </p>
        <div style={{ width: 36, height: 1, background: '#9a7a2e', margin: '0 auto' }} />
      </div>

      {/* secret code */}
      <div style={{
        background: 'rgba(0,0,0,0.28)', border: '1.5px solid rgba(201,168,76,0.35)',
        borderRadius: 14, padding: '18px 20px', marginBottom: 24, textAlign: 'center',
      }}>
        <p style={{ fontSize: 10, color: 'rgba(253,246,227,0.4)', letterSpacing: '0.14em', marginBottom: 8 }}>
          SECRET CODE — SHARE WITH FRIENDS
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 900, color: '#c9a84c', letterSpacing: '0.22em' }}>
            {secret}
          </span>
          <button
            onClick={handleCopy}
            style={{
              background: copied ? 'rgba(76,175,80,0.2)' : 'rgba(201,168,76,0.12)',
              border: `1px solid ${copied ? 'rgba(76,175,80,0.4)' : 'rgba(201,168,76,0.3)'}`,
              borderRadius: 8, padding: '6px 12px',
              color: copied ? '#81c784' : '#c9a84c',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              letterSpacing: '0.06em', transition: 'all 0.2s',
            }}
          >{copied ? 'COPIED!' : 'COPY'}</button>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(253,246,227,0.3)', marginTop: 8 }}>Valid for 5 minutes</p>
      </div>

      {/* player list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <p style={{ fontSize: 10, color: 'rgba(253,246,227,0.4)', letterSpacing: '0.12em', marginBottom: 12 }}>
          PLAYERS IN ROOM — {players.length} JOINED
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {players.map((p) => {
            const isMe = p.id === myPlayerId
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: isMe ? 'rgba(201,168,76,0.08)' : 'rgba(0,0,0,0.2)',
                border: `1px solid ${isMe ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.1)'}`,
                borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: p.isHost ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${p.isHost ? '#9a7a2e' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700,
                  color: p.isHost ? '#c9a84c' : 'rgba(253,246,227,0.5)',
                }}>
                  {isMe ? 'Y' : p.name.slice(0, 1).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#fdf6e3', margin: 0, lineHeight: 1.3 }}>
                    {isMe ? 'You' : p.name}
                    {isMe && (
                      <span style={{ marginLeft: 8, fontSize: 10, color: 'rgba(201,168,76,0.6)', fontWeight: 500, letterSpacing: '0.06em' }}>
                        (you)
                      </span>
                    )}
                  </p>
                  {p.isHost && (
                    <p style={{ fontSize: 10, color: '#c9a84c', letterSpacing: '0.08em', margin: 0 }}>HOST</p>
                  )}
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50', flexShrink: 0 }} />
              </div>
            )
          })}

          {/* empty slot while alone */}
          {players.length < 2 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              border: '1.5px dashed rgba(154,122,46,0.25)',
              borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '1.5px dashed rgba(154,122,46,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: 'rgba(154,122,46,0.3)',
              }}>?</div>
              <p style={{ fontSize: 12, color: 'rgba(253,246,227,0.22)', margin: 0 }}>
                Waiting for someone to join...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        {isHost ? (
          <>
            <button
              onClick={onStart}
              disabled={!canStart}
              style={{
                width: '100%', padding: '16px',
                background: canStart ? '#c9a84c' : 'rgba(201,168,76,0.12)',
                color: canStart ? '#1a1a1a' : 'rgba(253,246,227,0.2)',
                border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
                letterSpacing: '0.1em', fontFamily: 'Georgia, serif',
                cursor: canStart ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseOver={e => { if (canStart) e.currentTarget.style.background = '#e8c96a' }}
              onMouseOut={e => { if (canStart) e.currentTarget.style.background = '#c9a84c' }}
            >
              {canStart ? `START GAME (${players.length} PLAYERS)` : 'NEED AT LEAST 1 MORE PLAYER'}
            </button>
            <p style={{ fontSize: 11, color: 'rgba(253,246,227,0.28)', textAlign: 'center' }}>
              You can start with 2 or more players
            </p>
          </>
        ) : (
          <div style={{
            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(201,168,76,0.12)',
            borderRadius: 12, padding: '14px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: 'rgba(253,246,227,0.5)', margin: 0 }}>
              Waiting for host to start the game...
            </p>
          </div>
        )}
        <button
          onClick={onLeave}
          style={{
            width: '100%', padding: '13px', background: 'transparent',
            color: 'rgba(201,168,76,0.5)', border: '1.5px solid rgba(154,122,46,0.3)',
            borderRadius: 12, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.06em', transition: 'border-color 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.borderColor = '#9a7a2e')}
          onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(154,122,46,0.3)')}
        >
          LEAVE ROOM
        </button>
      </div>
    </div>
  )
}