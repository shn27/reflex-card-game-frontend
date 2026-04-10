import type { Card } from '@/types/game'

const SYMBOLS: Record<string, string> = {
  hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠',
}
const RED = new Set(['hearts', 'diamonds'])

interface Props {
  card: Card
  glowing?: boolean   // gold border when Ace
  size?: 'normal' | 'large'
  style?: React.CSSProperties
}

export function PlayingCard({ card, glowing, size = 'normal', style }: Props) {
  const sym    = SYMBOLS[card.suit]
  const isRed  = RED.has(card.suit)
  const color  = isRed ? '#c0392b' : '#1a1a1a'
  const w      = size === 'large' ? 200 : 160
  const h      = size === 'large' ? 280 : 224
  const rank   = size === 'large' ? 26 : 22
  const suit   = size === 'large' ? 20 : 16
  const center = size === 'large' ? 80 : 64

  return (
    <div style={{
      width: w,
      height: h,
      background: '#fffef8',
      borderRadius: 16,
      border: glowing ? '2.5px solid #c9a84c' : '1px solid #ddd5bb',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      flexShrink: 0,
      ...style,
    }}>
      {/* top-left */}
      <div style={{ position: 'absolute', top: 12, left: 14, lineHeight: 1.1 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: rank, fontWeight: 900, color }}>{card.rank}</div>
        <div style={{ fontSize: suit, color }}>{sym}</div>
      </div>

      {/* center */}
      <div style={{ fontSize: center, lineHeight: 1, color }}>{sym}</div>

      {/* bottom-right rotated */}
      <div style={{ position: 'absolute', bottom: 12, right: 14, lineHeight: 1.1, transform: 'rotate(180deg)' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: rank, fontWeight: 900, color }}>{card.rank}</div>
        <div style={{ fontSize: suit, color }}>{sym}</div>
      </div>

      {/* gold overlay ring when glowing */}
      {glowing && (
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: 15,
          border: '2px solid rgba(201,168,76,0.4)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  )
}

export function CardBack({ size = 'normal' }: { size?: 'normal' | 'large' }) {
  const w = size === 'large' ? 200 : 160
  const h = size === 'large' ? 280 : 224
  return (
    <div style={{
      width: w, height: h,
      background: '#1a3d2b',
      borderRadius: 16,
      border: '1px solid #9a7a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <div style={{
        width: w - 24,
        height: h - 24,
        border: '1.5px solid rgba(201,168,76,0.35)',
        borderRadius: 10,
        backgroundImage: 'repeating-linear-gradient(45deg,rgba(201,168,76,0.07) 0,rgba(201,168,76,0.07) 1px,transparent 1px,transparent 8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        color: 'rgba(201,168,76,0.3)',
      }}>♠</div>
    </div>
  )
}