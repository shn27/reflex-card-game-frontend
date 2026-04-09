'use client'

import { useEffect, useState } from 'react'
import { PlayingCard } from '@/src/components/ui/PlayingCard'
import { PlayerAvatar } from '@/src/components/ui/PlayerAvatar'
import type { Card, Player, RoundResult } from '@/src/types/game'

interface Props {
  currentCard: Card | null
  players: Player[]
  myId: string
  scores: Record<string, number>
  roundResult: RoundResult | null
  cardIndex: number
  totalRounds: number
  onTap: () => void
}

export function GameView({
  currentCard,
  players,
  myId,
  scores,
  roundResult,
  cardIndex,
  totalRounds,
  onTap,
}: Props) {
  const [flash, setFlash] = useState<'win' | 'loss' | 'penalty' | null>(null)
  const isAce = currentCard?.rank === 'A'
  const me = players.find(p => p.id === myId)
  const opponent = players.find(p => p.id !== myId)

  useEffect(() => {
    if (!roundResult) return
    setFlash(roundResult.outcome)
    const id = setTimeout(() => setFlash(null), 900)
    return () => clearTimeout(id)
  }, [roundResult])

  const flashColors: Record<string, string> = {
    win: 'rgba(39, 174, 96, 0.12)',
    loss: 'rgba(192, 57, 43, 0.10)',
    penalty: 'rgba(230, 126, 34, 0.12)',
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '20px 24px',
      background: flash ? flashColors[flash] : 'transparent',
      transition: 'background 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        {me && <PlayerAvatar name={me.name} score={scores[me.id] ?? 0} isMe />}

        <div style={{
          background: 'var(--surface)',
          borderRadius: 8,
          padding: '4px 12px',
          fontSize: 12,
          color: 'var(--fg-muted)',
        }}>
          <span style={{ color: 'var(--fg)', fontWeight: 600 }}>{cardIndex}</span>
          <span> / {totalRounds}</span>
        </div>

        {opponent && <PlayerAvatar name={opponent.name} score={scores[opponent.id] ?? 0} />}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        {currentCard ? (
          <PlayingCard card={currentCard} highlight={isAce} />
        ) : (
          <div style={{
            width: 180,
            height: 252,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Get ready...</span>
          </div>
        )}

        {isAce && !roundResult && (
          <div style={{
            background: 'var(--danger-bg)',
            color: 'var(--danger-fg)',
            borderRadius: 8,
            padding: '8px 20px',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-display)',
            animation: 'pulse 0.4s ease-out',
          }}>
            ACE! TAP NOW
          </div>
        )}

        {roundResult && (
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: roundResult.outcome === 'win'
              ? 'var(--green)'
              : roundResult.outcome === 'penalty'
              ? 'var(--orange)'
              : 'var(--red)',
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-display)',
          }}>
            {roundResult.outcome === 'win' && '✓ You got it!'}
            {roundResult.outcome === 'loss' && 'Too slow'}
            {roundResult.outcome === 'penalty' && '✗ Early tap — penalty!'}
          </div>
        )}
      </div>

      <button
        onPointerDown={onTap}
        style={{
          width: '100%',
          padding: '22px',
          background: isAce ? 'var(--accent)' : 'var(--surface)',
          color: isAce ? '#fff' : 'var(--fg-muted)',
          border: isAce ? 'none' : '1px solid var(--border)',
          borderRadius: 14,
          fontSize: 20,
          fontWeight: 800,
          cursor: 'pointer',
          letterSpacing: '0.06em',
          fontFamily: 'var(--font-display)',
          transition: 'background 0.15s, color 0.15s',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
        }}
      >
        TAP
      </button>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.92); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}