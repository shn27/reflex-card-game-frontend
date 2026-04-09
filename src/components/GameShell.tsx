// 'use client'

// import { useEffect, useState } from 'react'
// import { useGameSocket } from '@/src/hooks/useGameSocket'
// import { WelcomeView } from '@/src/components/views/WelcomeView'
// import { MatchmakingView } from '@/src/components/views/MatchmakingView'
// import { GameView } from '@/src/components/views/GameView'
// import { ResultsView } from '@/src/components/views/ResultsView'
// import type { ViewName } from '@/src/types/game'

// export function GameShell() {
//   const [view, setView] = useState<ViewName>('welcome')
//   const { state, connect, disconnect, sendClick } = useGameSocket()

//   useEffect(() => {
//     if (state.myId && view === 'matchmaking') {
//       setView('game')
//     }
//   }, [state.myId])

//   useEffect(() => {
//     if (state.gameOver) {
//       setView('results')
//     }
//   }, [state.gameOver])

//   const handlePlay = () => {
//     setView('matchmaking')
//     connect()
//   }

//   const handleCancel = () => {
//     disconnect()
//     setView('welcome')
//   }

//   const handlePlayAgain = () => {
//     setView('matchmaking')
//     connect()
//   }

//   const handleQuit = () => {
//     disconnect()
//     setView('welcome')
//   }

//   return (
//     <div style={{
//       minHeight: '100dvh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: 'var(--bg)',
//       fontFamily: 'var(--font-body)',
//     }}>
//       <div style={{
//         width: '100%',
//         maxWidth: 390,
//         height: '100dvh',
//         maxHeight: 844,
//         background: 'var(--panel)',
//         border: '1px solid var(--border)',
//         borderRadius: 'clamp(0px, calc((100dvh - 844px) * 999), 36px)',
//         overflow: 'hidden',
//         position: 'relative',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {state.opponentDisconnected && view === 'game' && (
//           <div style={{
//             position: 'absolute',
//             top: 12,
//             left: '50%',
//             transform: 'translateX(-50%)',
//             background: 'var(--orange-bg)',
//             color: 'var(--orange)',
//             borderRadius: 8,
//             padding: '6px 14px',
//             fontSize: 12,
//             fontWeight: 600,
//             zIndex: 10,
//             whiteSpace: 'nowrap',
//           }}>
//             Opponent disconnected
//           </div>
//         )}

//         <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
//           {view === 'welcome' && (
//             <WelcomeView onPlay={handlePlay} />
//           )}
//           {view === 'matchmaking' && (
//             <MatchmakingView onCancel={handleCancel} />
//           )}
//           {view === 'game' && state.myId && (
//             <GameView
//               currentCard={state.currentCard}
//               players={state.players}
//               myId={state.myId}
//               scores={state.scores}
//               roundResult={state.roundResult}
//               cardIndex={state.cardIndex}
//               totalRounds={state.totalRounds}
//               onTap={sendClick}
//             />
//           )}
//           {view === 'results' && state.gameOver && state.myId && (
//             <ResultsView
//               data={state.gameOver}
//               myId={state.myId}
//               onPlayAgain={handlePlayAgain}
//               onQuit={handleQuit}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import { useGameSocket } from '@/src/hooks/useGameSocket'
import { useMockSocket } from '@/src/hooks/useMockSocket'
import { WelcomeView } from '@/src/components/views/WelcomeView'
import { MatchmakingView } from '@/src/components/views/MatchmakingView'
import { GameView } from '@/src/components/views/GameView'
import { ResultsView } from '@/src/components/views/ResultsView'
import type { ViewName } from '@/src/types/game'

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

export function GameShell() {
  const [view, setView] = useState<ViewName>('welcome')
  const realSocket = useGameSocket()
  const mockSocket = useMockSocket()
  const { state, connect, disconnect, sendClick } = IS_MOCK ? mockSocket : realSocket

  useEffect(() => {
    if (state.myId && view === 'matchmaking') {
      setView('game')
    }
  }, [state.myId])

  useEffect(() => {
    if (state.gameOver) {
      setView('results')
    }
  }, [state.gameOver])

  const handlePlay = () => {
    setView('matchmaking')
    connect()
  }

  const handleCancel = () => {
    disconnect()
    setView('welcome')
  }

  const handlePlayAgain = () => {
    setView('matchmaking')
    connect()
  }

  const handleQuit = () => {
    disconnect()
    setView('welcome')
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 390,
        height: '100dvh',
        maxHeight: 844,
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 'clamp(0px, calc((100dvh - 844px) * 999), 36px)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {IS_MOCK && (
          <div style={{
            position: 'absolute',
            top: 10,
            right: 12,
            background: 'var(--orange-bg)',
            color: 'var(--orange)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            borderRadius: 6,
            zIndex: 10,
          }}>
            MOCK
          </div>
        )}

        {state.opponentDisconnected && view === 'game' && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--orange-bg)',
            color: 'var(--orange)',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}>
            Opponent disconnected
          </div>
        )}

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {view === 'welcome' && <WelcomeView onPlay={handlePlay} />}
          {view === 'matchmaking' && <MatchmakingView onCancel={handleCancel} />}
          {view === 'game' && state.myId && (
            <GameView
              currentCard={state.currentCard}
              players={state.players}
              myId={state.myId}
              scores={state.scores}
              roundResult={state.roundResult}
              cardIndex={state.cardIndex}
              totalRounds={state.totalRounds}
              onTap={sendClick}
            />
          )}
          {view === 'results' && state.gameOver && state.myId && (
            <ResultsView
              data={state.gameOver}
              myId={state.myId}
              onPlayAgain={handlePlayAgain}
              onQuit={handleQuit}
            />
          )}
        </div>
      </div>
    </div>
  )
}