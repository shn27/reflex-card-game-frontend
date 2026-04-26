'use client'
import { useEffect, useRef, useState } from 'react'
import { useGameSocket }    from '@/hooks/useGameSocket'
import { useRoomSocket }    from '@/hooks/useRoomSocket'
import { WelcomeView }      from '@/components/views/WelcomeView'
import { MatchmakingView }  from '@/components/views/MatchmakingView'
import { FriendsView }      from '@/components/views/FriendsView'
import { JoinEntryView }    from '@/components/views/JoinEntryView'
import { RoomWaitingView }  from '@/components/views/RoomWaitingView'
import { GameView }         from '@/components/views/GameView'
import { ResultView }       from '@/components/views/ResultsView'
import type { ViewName }    from '@/types/game'

// Which flow is active — anonymous queue or friends room
type Flow = 'anon' | 'room'

export function GameShell() {
  const [view, setView] = useState<ViewName>('welcome')
  const [flow, setFlow] = useState<Flow>('anon')

  // ── Anonymous queue ────────────────────────────────────────────────────────
  const anon     =  useGameSocket()
  const room     =  useRoomSocket()

  const anonState = anon.state
  const roomState = room.state

  // anon: matchmaking → game
  useEffect(() => {
    if (flow === 'anon' && anonState.status === 'playing' && view === 'matchmaking')
      setView('game')
  }, [anonState.status])

  // anon: game → result
  useEffect(() => {
    if (flow === 'anon' && anonState.status === 'done' && view === 'game')
      setView('result')
  }, [anonState.status])

  // room: waiting room — once server confirms joined/created
  useEffect(() => {
    if (flow === 'room' && roomState.status === 'waiting' && view !== 'room-waiting')
      setView('room-waiting')
  }, [roomState.status])

  // room: host left waiting room → send everyone back to friends chooser
  // We use a ref so the effect always has the latest disconnect fn, not a stale closure.
  const roomDisconnectRef = useRef(room.disconnect)
  useEffect(() => { roomDisconnectRef.current = room.disconnect })

  useEffect(() => {
    if (flow === 'room' && roomState.hostLeft && view === 'room-waiting') {
      // Show the "Host disconnected" banner in RoomWaitingView for 2s
      // before navigating away and closing the socket.
      const id = setTimeout(() => {
        roomDisconnectRef.current()
        setView('friends')
      }, 2000)
      return () => clearTimeout(id)
    }
  }, [flow, roomState.hostLeft, view])

  // room: waiting → game (host clicked start)
  useEffect(() => {
    if (flow === 'room' && roomState.status === 'playing' && view === 'room-waiting')
      setView('game')
  }, [roomState.status])

  // room: game → result
  useEffect(() => {
    if (flow === 'room' && roomState.status === 'done' && view === 'game')
      setView('result')
  }, [roomState.status])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handlePlay = () => {
    setFlow('anon')
    setView('matchmaking')
    anon.connect()
  }

  const handlePlayWithFriends = () => {
    setView('friends')
  }

  const handleCreateRoom = () => {
    setFlow('room')
    room.createRoom()
    // view transition handled by useEffect above when status → 'waiting'
  }

  const handleGoJoin = () => setView('join-entry')

  const handleJoinRoom = (secret: string) => {
    setFlow('room')
    room.joinRoom(secret)
  }

  const handleStartGame = () => room.startGame()

  const handleLeaveRoom = () => {
    room.leaveRoom()
    setView('welcome')
  }

  const handleCancel = () => {
    anon.disconnect()
    setView('welcome')
  }

  const handlePlayAgain = () => {
    if (flow === 'anon') {
      setView('matchmaking')
      anon.connect()
    } else {
      room.disconnect()
      setView('friends')
    }
  }

  const handleQuit = () => {
    anon.disconnect()
    room.disconnect()
    setView('welcome')
  }

  // Active state/actions depend on current flow
  const activeCard   = flow === 'anon' ? anonState.currentCard  : roomState.currentCard
  const activeIndex  = flow === 'anon' ? anonState.cardIndex    : roomState.cardIndex
  const activeResult = flow === 'anon' ? anonState.result       : roomState.result
  const activeTap    = flow === 'anon' ? anon.sendClick         : room.sendClick
  const activeDiscon = flow === 'anon' ? anonState.opponentDisconnected : roomState.opponentDisconnected

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0e2018',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        height: '100dvh', maxHeight: 860,
        background: '#1a3d2b', border: '2px solid #9a7a2e',
        borderRadius: 'clamp(0px, calc((100dvh - 860px) * 999), 32px)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        {/* felt texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.025) 0,rgba(255,255,255,0.025) 1px,transparent 1px,transparent 8px)',
          backgroundSize: '8px 8px', pointerEvents: 'none', zIndex: 0,
        }} />

        {activeDiscon && view === 'game' && (
          <div style={{
            position: 'absolute', top: 12, left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(239,83,80,0.15)', color: '#ef9a9a',
            borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600,
            zIndex: 10, whiteSpace: 'nowrap', border: '1px solid rgba(239,83,80,0.3)',
          }}>Opponent disconnected</div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

          {view === 'welcome' && (
            <WelcomeView onPlay={handlePlay} onPlayWithFriends={handlePlayWithFriends} />
          )}

          {view === 'matchmaking' && (
            <MatchmakingView
              onCancel={handleCancel}
              onRetry={() => anon.connect()}
              waitingMessage={anonState.waitingMessage}
              error={anonState.error}
            />
          )}

          {view === 'friends' && (
            <FriendsView
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleGoJoin}
              onBack={() => setView('welcome')}
            />
          )}

          {view === 'join-entry' && (
            <JoinEntryView
              onJoin={handleJoinRoom}
              onBack={() => setView('friends')}
              error={roomState.error}
              errorMessage={roomState.errorMessage}
              onClearError={room.clearError}
              connecting={roomState.status === 'connecting'}
            />
          )}

          {view === 'room-waiting' && (
            <RoomWaitingView
              secret={roomState.secret}
              players={roomState.players}
              isHost={roomState.isHost}
              myPlayerId={roomState.myPlayerId}
              hostLeft={roomState.hostLeft}
              onStart={handleStartGame}
              onLeave={handleLeaveRoom}
            />
          )}

          {view === 'game' && (
            <GameView
              currentCard={activeCard}
              cardIndex={activeIndex}
              onTap={activeTap}
            />
          )}

          {view === 'result' && activeResult && (
            <ResultView
              result={activeResult}
              onPlayAgain={handlePlayAgain}
              onQuit={handleQuit}
            />
          )}
        </div>
      </div>
    </div>
  )
}