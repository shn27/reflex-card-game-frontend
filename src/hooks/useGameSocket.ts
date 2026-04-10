'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Card, ResultKind, ServerEvent } from '@/types/game'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws'

export interface SocketState {
  connected: boolean
  waitingMessage: string        // from "waiting" event
  myPlayerId: number | null     // from "game_start"
  currentCard: Card | null      // from "card_reveal"
  cardIndex: number             // 1-based, out of 52
  result: ResultKind | null     // from "game_over"
  opponentDisconnected: boolean
}

const initial: SocketState = {
  connected: false,
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

  const connect = useCallback(() => {
    wsRef.current?.close()
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => setState({ ...initial, connected: true })

    ws.onmessage = (e) => {
      let evt: ServerEvent
      try { evt = JSON.parse(e.data) } catch { return }

      setState(prev => {
        switch (evt.type) {
          case 'waiting':
            return { ...prev, waitingMessage: evt.message }

          case 'game_start':
            return { ...prev, myPlayerId: evt.player_id }

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
              result: { type: evt.result, reason: evt.reason },
            }

          default:
            return prev
        }
      })
    }

    ws.onclose = () => setState(prev => ({ ...prev, connected: false, opponentDisconnected: true }))
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setState(initial)
  }, [])

  // The only client → server message: { type: "click" }
  const sendClick = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'click' }))
    }
  }, [])

  useEffect(() => () => { wsRef.current?.close() }, [])

  return { state, connect, disconnect, sendClick }
}