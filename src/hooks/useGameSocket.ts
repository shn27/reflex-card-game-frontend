'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Card, GameEvent, GameOverData, Player, RoundResult, RoundOutcome } from '@/src/types/game'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws'

export interface GameState {
  myId: string | null
  players: Player[]
  currentCard: Card | null
  cardIndex: number
  scores: Record<string, number>
  roundResult: RoundResult | null
  gameOver: GameOverData | null
  roundHistory: RoundOutcome[]
  totalRounds: number
  connected: boolean
  opponentDisconnected: boolean
}

const initialState: GameState = {
  myId: null,
  players: [],
  currentCard: null,
  cardIndex: 0,
  scores: {},
  roundResult: null,
  gameOver: null,
  roundHistory: [],
  totalRounds: 10,
  connected: false,
  opponentDisconnected: false,
}

export function useGameSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const [state, setState] = useState<GameState>(initialState)

  const send = useCallback((type: string, payload?: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }))
    }
  }, [])

  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
    }

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      setState(prev => ({ ...prev, connected: true }))
      ws.send(JSON.stringify({ type: 'queue:join' }))
    }

    ws.onmessage = (event) => {
      let parsed: GameEvent
      try {
        parsed = JSON.parse(event.data)
      } catch {
        return
      }

      switch (parsed.type) {
        case 'game:start':
          setState(prev => ({
            ...prev,
            myId: parsed.payload.myId,
            players: parsed.payload.players,
            totalRounds: parsed.payload.totalRounds,
            scores: Object.fromEntries(parsed.payload.players.map(p => [p.id, 0])),
            currentCard: null,
            roundResult: null,
            gameOver: null,
            roundHistory: [],
            opponentDisconnected: false,
          }))
          break

        case 'card:show':
          setState(prev => ({
            ...prev,
            currentCard: parsed.payload.card,
            cardIndex: parsed.payload.index,
            roundResult: null,
          }))
          break

        case 'round:result':
          setState(prev => ({
            ...prev,
            scores: parsed.payload.scores,
            roundResult: parsed.payload,
            roundHistory: [...prev.roundHistory, parsed.payload.outcome],
          }))
          break

        case 'game:over':
          setState(prev => ({ ...prev, gameOver: parsed.payload }))
          break

        case 'opponent:disconnected':
          setState(prev => ({ ...prev, opponentDisconnected: true }))
          break
      }
    }

    ws.onclose = () => {
      setState(prev => ({ ...prev, connected: false }))
    }
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setState(initialState)
  }, [])

  const sendClick = useCallback(() => {
    send('player:click')
  }, [send])

  useEffect(() => {
    return () => { wsRef.current?.close() }
  }, [])

  return { state, connect, disconnect, sendClick }
}