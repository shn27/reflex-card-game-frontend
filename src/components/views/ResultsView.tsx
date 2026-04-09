import type { GameOverData, RoundOutcome } from '@/src/types/game'

interface Props {
  data: GameOverData
  myId: string
  onPlayAgain: () => void
  onQuit: () => void
}

const OUTCOME_LABELS: Record<RoundOutcome, string> = {
  win: 'W',
  loss: 'L',
  penalty: 'P',
}

const OUTCOME_COLORS: Record<RoundOutcome, { bg: string; fg: string }> = {
  win: { bg: 'var(--green-bg)', fg: 'var(--green)' },
  loss: { bg: 'var(--red-bg)', fg: 'var(--red)' },
  penalty: { bg: 'var(--orange-bg)', fg: 'var(--orange)' },
}

export function ResultsView({ data, myId, onPlayAgain, onQuit }: Props) {
  const iWon = data.winnerId === myId
  const me = data.players.find(p => p.id === myId)
  const opponent = data.players.find(p => p.id !== myId)

  const sortedPlayers = [...data.players].sort(
    (a, b) => (data.finalScores[b.id] ?? 0) - (data.finalScores[a.id] ?? 0)
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '0 0 4px' }}>Game over</p>
        <h2 style={{
          fontSize: 28,
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          color: iWon ? 'var(--green)' : 'var(--red)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          {iWon ? 'You win!' : 'You lose'}
        </h2>
      </div>

      <div style={{
        background: 'var(--surface)',
        borderRadius: 14,
        padding: '4px 0',
        marginBottom: 16,
        border: '1px solid var(--border)',
      }}>
        {sortedPlayers.map((player, i) => {
          const isMe = player.id === myId
          const isWinner = player.id === data.winnerId
          const score = data.finalScores[player.id] ?? 0
          return (
            <div key={player.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: i < sortedPlayers.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: isMe ? 'var(--avatar-you-bg)' : 'var(--avatar-opp-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: isMe ? 'var(--avatar-you-fg)' : 'var(--avatar-opp-fg)',
                }}>
                  {player.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>
                    {isMe ? 'You' : player.name}
                  </p>
                  {isWinner && (
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--green)', fontWeight: 600, letterSpacing: '0.04em' }}>
                      WINNER
                    </p>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--fg)' }}>
                {score}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{
        background: 'var(--surface)',
        borderRadius: 14,
        padding: '14px 16px',
        border: '1px solid var(--border)',
        marginBottom: 'auto',
      }}>
        <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 10 }}>Round breakdown</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {data.rounds.map((outcome, i) => (
            <span key={i} style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 99,
              background: OUTCOME_COLORS[outcome].bg,
              color: OUTCOME_COLORS[outcome].fg,
              letterSpacing: '0.04em',
            }}>
              {OUTCOME_LABELS[outcome]}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--fg-disabled)', marginTop: 8, marginBottom: 0 }}>
          W = win · L = loss · P = early tap penalty
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <button
          onClick={onPlayAgain}
          style={{
            width: '100%',
            padding: '15px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          Play again
        </button>
        <button
          onClick={onQuit}
          style={{
            width: '100%',
            padding: '15px',
            background: 'transparent',
            color: 'var(--fg-muted)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
          }}
          onMouseOver={e => (e.currentTarget.style.background = 'var(--surface)')}
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
          Quit
        </button>
      </div>
    </div>
  )
}