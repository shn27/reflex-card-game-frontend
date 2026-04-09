import type { Card } from '@/src/types/game'

interface Props {
  card: Card
  highlight?: boolean
}

const SUIT_SYMBOLS: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const RED_SUITS = new Set(['hearts', 'diamonds'])

export function PlayingCard({ card, highlight }: Props) {
  const symbol = SUIT_SYMBOLS[card.suit]
  const isRed = RED_SUITS.has(card.suit)
  const color = isRed ? '#C0392B' : 'var(--fg)'

  return (
    <div
      style={{
        width: 180,
        height: 252,
        background: 'var(--card-bg)',
        border: highlight
          ? '2px solid var(--accent)'
          : '1px solid var(--card-border)',
        borderRadius: 16,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        transition: 'border-color 0.15s',
        boxShadow: highlight ? '0 0 0 4px var(--accent-subtle)' : 'none',
      }}
    >
      <div style={{ position: 'absolute', top: 14, left: 16, textAlign: 'left', lineHeight: 1.1 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>
          {card.rank}
        </div>
        <div style={{ fontSize: 18, color }}>{symbol}</div>
      </div>

      <div style={{ fontSize: 72, color, lineHeight: 1 }}>{symbol}</div>

      <div style={{ position: 'absolute', bottom: 14, right: 16, textAlign: 'right', lineHeight: 1.1, transform: 'rotate(180deg)' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>
          {card.rank}
        </div>
        <div style={{ fontSize: 18, color }}>{symbol}</div>
      </div>
    </div>
  )
}

export function CardBack() {
  return (
    <div
      style={{
        width: 180,
        height: 252,
        background: 'var(--card-back)',
        border: '1px solid var(--card-border)',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      <div style={{
        width: 150,
        height: 222,
        border: '2px solid var(--card-back-pattern)',
        borderRadius: 10,
        backgroundImage: 'repeating-linear-gradient(45deg, var(--card-back-pattern) 0px, var(--card-back-pattern) 1px, transparent 1px, transparent 8px)',
      }} />
    </div>
  )
}