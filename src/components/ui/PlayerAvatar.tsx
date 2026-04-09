interface Props {
  name: string
  score: number
  isMe?: boolean
  isWinner?: boolean
}

const COLORS = [
  { bg: '#1a1a2e', text: '#e0e0ff' },
  { bg: '#2e1a1a', text: '#ffe0e0' },
]

export function PlayerAvatar({ name, score, isMe, isWinner }: Props) {
  const color = isMe ? COLORS[0] : COLORS[1]
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: color.bg,
        color: color.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.05em',
        border: isWinner ? '2px solid var(--accent)' : '1px solid transparent',
        flexShrink: 0,
      }}>
        {initials}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)', lineHeight: 1.2 }}>
          {isMe ? 'You' : name}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--fg)', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>
          {score}
        </div>
      </div>
    </div>
  )
}