'use client'
import { useEffect, useState } from 'react'
import { PlayingCard, CardBack } from '@/components/ui/PlayingCard'
import type { Card } from '@/types/game'

interface Props {
  currentCard: Card | null
  cardIndex: number            // 1-based, out of 52 (from card_index)
  onTap: () => void
}

export function GameView({ currentCard, cardIndex, onTap }: Props) {
  const isAce = currentCard?.rank === 'A'
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (!currentCard) return
    setFlash(true)
    const id = setTimeout(() => setFlash(false), 160)
    return () => clearTimeout(id)
  }, [currentCard])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px 28px' }}>

      {/* card counter — always 52 total */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'baseline', gap: 4,
          background: 'rgba(0,0,0,0.22)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 8, padding: '5px 16px',
        }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>
            {cardIndex}
          </span>
          <span style={{ fontSize: 13, color: 'rgba(253,246,227,0.4)' }}> / 52</span>
        </div>
      </div>

      {/* card */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: flash ? 0.65 : 1, transition: 'opacity 0.1s',
      }}>
        {currentCard
          ? <PlayingCard card={currentCard} glowing={isAce} size="large" />
          : <CardBack size="large" />
        }
      </div>

      {/* ace alert — visible only when ace */}
      <div style={{
        height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '16px 0 12px',
        opacity: isAce ? 1 : 0,
        transition: 'opacity 0.15s',
      }}>
        <div style={{
          background: 'rgba(201,168,76,0.12)',
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: 8, padding: '8px 20px',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#c9a84c', letterSpacing: '0.1em' }}>
            ACE! TAP NOW
          </span>
        </div>
      </div>

      {/* tap button — gold on ace, dimmed otherwise */}
      <button
        onPointerDown={onTap}
        style={{
          width: '100%', padding: '22px',
          background: isAce ? '#c9a84c' : 'rgba(255,255,255,0.05)',
          color: isAce ? '#1a1a1a' : 'rgba(253,246,227,0.2)',
          border: isAce ? 'none' : '1.5px solid rgba(255,255,255,0.07)',
          borderRadius: 14, fontSize: 20, fontWeight: 700,
          cursor: isAce ? 'pointer' : 'default',
          letterSpacing: '0.12em', fontFamily: 'Georgia, serif',
          transition: 'background 0.15s, color 0.15s',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
        }}
        onMouseOver={e => { if (isAce) e.currentTarget.style.background = '#e8c96a' }}
        onMouseOut={e => { if (isAce) e.currentTarget.style.background = '#c9a84c' }}
      >
        TAP
      </button>
    </div>
  )
}