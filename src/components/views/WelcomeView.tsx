interface Props { onPlay: () => void }

export function WelcomeView({ onPlay }: Props) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 32px',
      gap: 0,
    }}>
      {/* logo */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: '2px solid #9a7a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
        color: '#c9a84c',
        marginBottom: 20,
      }}>♠</div>

      <h1 style={{
        fontFamily: 'Georgia, serif',
        fontSize: 42,
        fontWeight: 900,
        color: '#c9a84c',
        letterSpacing: '0.04em',
        lineHeight: 1,
        margin: 0,
      }}>REFLEX</h1>

      <p style={{
        fontSize: 11,
        color: 'rgba(253,246,227,0.45)',
        letterSpacing: '0.18em',
        marginTop: 6,
        marginBottom: 56,
      }}>CARD DUEL</p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={onPlay}
          style={{
            width: '100%',
            padding: '18px',
            background: '#c9a84c',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: 12,
            fontSize: 17,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.1em',
            fontFamily: 'Georgia, serif',
            transition: 'background 0.15s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#e8c96a')}
          onMouseOut={e => (e.currentTarget.style.background = '#c9a84c')}
        >
          PLAY
        </button>

        <button
          disabled
          style={{
            width: '100%',
            padding: '15px',
            background: 'transparent',
            color: 'rgba(201,168,76,0.35)',
            border: '1.5px solid rgba(154,122,46,0.35)',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'not-allowed',
            letterSpacing: '0.07em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          PLAY WITH FRIENDS
          <span style={{
            fontSize: 9,
            background: 'rgba(201,168,76,0.12)',
            color: 'rgba(201,168,76,0.5)',
            padding: '2px 6px',
            borderRadius: 4,
            letterSpacing: '0.08em',
          }}>SOON</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: 18, marginTop: 36, fontSize: 18, color: '#9a7a2e' }}>
        <span>♥</span><span>♦</span><span>♣</span><span>♠</span>
      </div>
    </div>
  )
}