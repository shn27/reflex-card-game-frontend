'use client'
import { useEffect, useState } from 'react'
import { useGameSocket }   from '@/hooks/useGameSocket'
//import { useMockSocket }   from '@/hooks/useMockSocket'
import { WelcomeView }     from '@/components/views/WelcomeView'
import { MatchmakingView } from '@/components/views/MatchmakingView'
import { GameView }        from '@/components/views/GameView'
import { ResultView }      from '@/components/views/ResultsView'
import type { ViewName }   from '@/types/game'

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

export function GameShell() {
  const [view, setView] = useState<ViewName>('welcome')
  const real = useGameSocket()
  const { state, connect, disconnect, sendClick } =  real

  // waiting → game once server sends game_start (player_id assigned)
  useEffect(() => {
    if (state.myPlayerId !== null && view === 'matchmaking') setView('game')
  }, [state.myPlayerId])

  // game → result when game_over arrives
  useEffect(() => {
    if (state.result && view === 'game') setView('result')
  }, [state.result])

  const handlePlay      = () => { setView('matchmaking'); connect() }
  const handleCancel    = () => { disconnect(); setView('welcome') }
  // Stay on the matchmaking view and reconnect — the error state inside the
  // hook resets on connect(), so MatchmakingView switches back to waiting UI.
  const handleRetry     = () => { connect() }
  const handlePlayAgain = () => { setView('matchmaking'); connect() }
  const handleQuit      = () => { disconnect(); setView('welcome') }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0e2018',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        height: '100dvh',
        maxHeight: 860,
        background: '#1a3d2b',
        border: '2px solid #9a7a2e',
        borderRadius: 'clamp(0px, calc((100dvh - 860px) * 999), 32px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* felt texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.025) 0,rgba(255,255,255,0.025) 1px,transparent 1px,transparent 8px)',
          backgroundSize: '8px 8px',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {IS_MOCK && (
          <div style={{
            position: 'absolute', top: 10, right: 12,
            background: 'rgba(201,168,76,0.15)', color: '#c9a84c',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
            padding: '3px 7px', borderRadius: 4, zIndex: 10,
          }}>MOCK</div>
        )}

        {state.opponentDisconnected && view === 'game' && (
          <div style={{
            position: 'absolute', top: 12, left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(239,83,80,0.15)', color: '#ef9a9a',
            borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600,
            zIndex: 10, whiteSpace: 'nowrap', border: '1px solid rgba(239,83,80,0.3)',
          }}>Opponent disconnected</div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
          {view === 'welcome'     && <WelcomeView onPlay={handlePlay} />}
          {view === 'matchmaking' && (
            <MatchmakingView
              onCancel={handleCancel}
              onRetry={handleRetry}
              waitingMessage={state.waitingMessage}
              error={state.error}
            />
          )}
          {view === 'game' && (
            <GameView
              currentCard={state.currentCard}
              cardIndex={state.cardIndex}
              onTap={sendClick}
            />
          )}
          {view === 'result' && state.result && (
            <ResultView
              result={state.result}
              onPlayAgain={handlePlayAgain}
              onQuit={handleQuit}
            />
          )}
        </div>
      </div>
    </div>
  )
}