interface Props {
  onPlay: () => void
}

export function WelcomeView({ onPlay }: Props) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 0,
      padding: '0 32px',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{
          width: 72,
          height: 72,
          border: '1px solid var(--border)',
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
          background: 'var(--surface)',
        }}>
          <span style={{ fontSize: 36 }}>🃏</span>
        </div>
        <h1 style={{
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          fontFamily: 'var(--font-display)',
          color: 'var(--fg)',
          margin: 0,
        }}>
          Reflex
        </h1>
        <p style={{ fontSize: 15, color: 'var(--fg-muted)', margin: 0, textAlign: 'center' }}>
          React fast. Hit the ace.
        </p>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
        <button
          onClick={onPlay}
          style={{
            width: '100%',
            padding: '16px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.02em',
            fontFamily: 'var(--font-display)',
            transition: 'opacity 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          Play
        </button>
        <button
          disabled
          style={{
            width: '100%',
            padding: '16px',
            background: 'transparent',
            color: 'var(--fg-disabled)',
            border: '1px solid var(--border-disabled)',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'not-allowed',
            letterSpacing: '0.02em',
            fontFamily: 'var(--font-display)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          Play with friends
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            background: 'var(--badge-bg)',
            color: 'var(--badge-fg)',
            padding: '2px 6px',
            borderRadius: 4,
          }}>
            SOON
          </span>
        </button>
      </div>
    </div>
  )
}