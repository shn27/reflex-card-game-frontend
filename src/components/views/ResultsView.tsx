import type { ResultKind } from '@/types/game'

interface Props {
  result: ResultKind
  onPlayAgain: () => void
  onQuit: () => void
}

interface Config {
  icon: string
  iconColor: string
  headline: string
  headlineColor: string
}

function getConfig(type: ResultKind['type']): Config {
  switch (type) {
    case 'win':
      return { icon: '♠', iconColor: '#c9a84c',                   headline: 'You Win!',  headlineColor: '#c9a84c' }
    case 'lose':
      return { icon: '♠', iconColor: 'rgba(239,83,80,0.75)',       headline: 'You Lose!', headlineColor: '#ef9a9a' }
    case 'draw':
      return { icon: '♦', iconColor: 'rgba(201,168,76,0.4)',       headline: 'Draw!',     headlineColor: 'rgba(253,246,227,0.55)' }
  }
}

export function ResultView({ result, onPlayAgain, onQuit }: Props) {
  const cfg = getConfig(result.type)

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px', gap: 0,
    }}>
      {/* icon */}
      <div style={{ fontSize: 52, color: cfg.iconColor, marginBottom: 16, lineHeight: 1 }}>
        {cfg.icon}
      </div>

      {/* headline */}
      <h2 style={{
        fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 900,
        color: cfg.headlineColor, letterSpacing: '0.02em', margin: 0, lineHeight: 1,
      }}>
        {cfg.headline}
      </h2>

      {/* reason — sent directly from the backend */}
      <p style={{
        fontSize: 14, color: 'rgba(253,246,227,0.62)',
        textAlign: 'center', lineHeight: 1.7,
        margin: '16px 0 0', padding: '0 8px',
        whiteSpace: 'pre-line',
      }}>
        {result.reason}
      </p>

      {/* divider */}
      <div style={{ width: '70%', height: 1, background: '#9a7a2e', opacity: 0.4, margin: '32px 0' }} />

      {/* buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={onPlayAgain}
          style={{
            width: '100%', padding: '16px', background: '#c9a84c', color: '#1a1a1a',
            border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.1em', fontFamily: 'Georgia, serif',
            transition: 'background 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#e8c96a')}
          onMouseOut={e => (e.currentTarget.style.background = '#c9a84c')}
        >
          PLAY AGAIN
        </button>
        <button
          onClick={onQuit}
          style={{
            width: '100%', padding: '14px', background: 'transparent',
            color: 'rgba(201,168,76,0.6)', border: '1.5px solid rgba(154,122,46,0.4)',
            borderRadius: 12, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.07em', transition: 'border-color 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.borderColor = '#9a7a2e')}
          onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(154,122,46,0.4)')}
        >
          QUIT
        </button>
      </div>
    </div>
  )
}