'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Card, ResultKind, ServerEvent } from '@/types/game'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws'

export type ConnectionError =
  | 'rate_limited'       // server sent rate_limited event before closing
  | 'server_unavailable' // could not connect at all
  | null

export interface SocketState {
  status: 'idle' | 'connecting' | 'waiting' | 'playing' | 'done'
  error: ConnectionError
  waitingMessage: string
  myPlayerId: number | null
  currentCard: Card | null
  cardIndex: number
  result: ResultKind | null
  opponentDisconnected: boolean
}

const initial: SocketState = {
  status: 'idle',
  error: null,
  waitingMessage: '',
  myPlayerId: null,
  currentCard: null,
  cardIndex: 0,
  result: null,
  opponentDisconnected: false,
}

export function useGameSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const [state, setState] = useState<SocketState>(initial)

  // Track whether a rate_limited message arrived before onclose fires.
  // onclose always fires after the server closes — we use this flag to
  // distinguish "rate limited close" from "unexpected disconnect".
  const rateLimitedRef = useRef(false)

  const connect = useCallback(() => {
    wsRef.current?.close()
    rateLimitedRef.current = false
    setState({ ...initial, status: 'connecting' })

    let ws: WebSocket
    try {
      ws = new WebSocket(WS_URL)
    } catch {
      setState({ ...initial, error: 'server_unavailable' })
      return
    }
    wsRef.current = ws

    ws.onerror = () => {
      // Only set unavailable if we haven't already received a rate_limited
      // message — in that case onmessage fires first, sets the error, then
      // onerror/onclose follow.
      if (!rateLimitedRef.current) {
        setState({ ...initial, error: 'server_unavailable' })
      }
    }

    ws.onmessage = (e) => {
      let evt: ServerEvent
      try { evt = JSON.parse(e.data) } catch { return }

      setState(prev => {
        switch (evt.type) {
          case 'rate_limited':
            rateLimitedRef.current = true
            return { ...initial, error: 'rate_limited' }

          case 'waiting':
            return { ...prev, status: 'waiting', waitingMessage: evt.message }

          case 'game_start':
            return { ...prev, status: 'playing', myPlayerId: evt.player_id }

          case 'card_reveal':
            return {
              ...prev,
              currentCard: evt.card,
              cardIndex: evt.card_index,
              result: null,
            }

          case 'game_over':
            return {
              ...prev,
              status: 'done',
              result: { type: evt.result, reason: evt.reason },
            }

          default:
            return prev
        }
      })
    }

    ws.onclose = () => {
      // If rate_limited already set the error, don't overwrite it.
      // If the game was in progress and we get an unexpected close,
      // flag the opponent as disconnected.
      setState(prev => {
        if (prev.error) return prev
        if (prev.status === 'playing') {
          return { ...prev, opponentDisconnected: true }
        }
        return prev
      })
    }
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setState(initial)
  }, [])

  const sendClick = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'click' }))
    }
  }, [])

  useEffect(() => () => { wsRef.current?.close() }, [])

  return { state, connect, disconnect, sendClick }
}