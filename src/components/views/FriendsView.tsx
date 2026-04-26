interface Props {
  onCreateRoom: () => void
  onJoinRoom: () => void
  onBack: () => void
}

export function FriendsView({ onCreateRoom, onJoinRoom, onBack }: Props) {
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
        {/* icon */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          border: '2px solid #9a7a2e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, color: '#c9a84c', margin: '0 auto 20px',
        }}>♣</div>

        <h2 style={{
          fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 900,
          color: '#c9a84c', letterSpacing: '0.04em', textAlign: 'center',
          margin: '0 0 6px',
        }}>PLAY WITH FRIENDS</h2>

        <p style={{
          fontSize: 12, color: 'rgba(253,246,227,0.4)', textAlign: 'center',
          letterSpacing: '0.1em', marginBottom: 48,
        }}>CREATE OR JOIN A PRIVATE ROOM</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Create Room */}
          <button
            onClick={onCreateRoom}
            style={{
              width: '100%', padding: '20px 18px',
              background: '#c9a84c', color: '#1a1a1a',
              border: 'none', borderRadius: 12,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
              cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e8c96a')}
            onMouseOut={e => (e.currentTarget.style.background = '#c9a84c')}
          >
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em' }}>
              CREATE ROOM
            </span>
            <span style={{ fontSize: 12, opacity: 0.65, fontWeight: 500 }}>
              Get a secret code and invite friends
            </span>
          </button>

          {/* Join Room */}
          <button
            onClick={onJoinRoom}
            style={{
              width: '100%', padding: '20px 18px',
              background: 'transparent', color: '#c9a84c',
              border: '1.5px solid #9a7a2e', borderRadius: 12,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4,
              cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s', textAlign: 'left',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.borderColor = '#c9a84c' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#9a7a2e' }}
          >
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em' }}>
              JOIN ROOM
            </span>
            <span style={{ fontSize: 12, opacity: 0.65 }}>
              Enter a secret code from your friend
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}