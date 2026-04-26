'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Card, ResultKind, ServerEvent } from '@/types/game'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws'

const WS_CLOSE_POLICY_VIOLATION = 1008

export type ConnectionError =
  | 'rate_limited'
  | 'server_unavailable'
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
  const rateLimitedRef = useRef(false)

  // ── Core: open a socket and fire a setup message once connected ───────────
  //
  // All three modes (anonymous, create, join) follow the same pattern:
  //   1. Open WebSocket
  //   2. onopen → send one setup message that tells the server which mode
  //   3. onmessage → drive state from server events
  //
  // The `onOpen` callback receives the live WebSocket so the caller controls
  // exactly which message gets sent.

  const openSocket = useCallback((onOpen: (ws: WebSocket) => void) => {
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

    ws.onopen = () => {
      onOpen(ws)
    }

    ws.onerror = () => {
      if (!rateLimitedRef.current) {
        setState({ ...initial, error: 'server_unavailable' })
      }
    }

    ws.onmessage = (e: MessageEvent) => {
      let evt: ServerEvent
      try { evt = JSON.parse(e.data as string) as ServerEvent } catch { return }

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
            return { ...prev, currentCard: evt.card, cardIndex: evt.card_index, result: null }

          case 'game_over':
            return { ...prev, status: 'done', result: { type: evt.result, reason: evt.reason } }

          default:
            return prev
        }
      })
    }

    ws.onclose = (e: CloseEvent) => {
      const isRateLimited = rateLimitedRef.current || e.code === WS_CLOSE_POLICY_VIOLATION
      if (isRateLimited) {
        setState(prev => ({
          ...prev,
          connected: false,
          rateLimitedMessage: prev.error ?? 'rate_limited',
        }))
        return
      }
      setState(prev => {
        if (prev.error) return prev
        if (prev.status === 'playing') return { ...prev, opponentDisconnected: true }
        return prev
      })
    }
  }, [])

  // ── Public actions — each sends a different first message ─────────────────

  /** Play button — joins the global anonymous matchmaking queue. */
  const connect = useCallback(() => {
    openSocket(ws => {
      ws.send(JSON.stringify({ type: 'room_anonymous' }))
    })
  }, [openSocket])

  /** Play with Friends — creates a new secret room. */
  const createRoom = useCallback(() => {
    openSocket(ws => {
      ws.send(JSON.stringify({ type: 'room_create' }))
    })
  }, [openSocket])

  /** Play with Friends — joins an existing secret room by code. */
  const joinRoom = useCallback((secret: string) => {
    openSocket(ws => {
      ws.send(JSON.stringify({ type: 'room_join', secret }))
    })
  }, [openSocket])

  // ── In-game actions ───────────────────────────────────────────────────────

  const sendClick = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'click' }))
    }
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    rateLimitedRef.current = false
    setState(initial)
  }, [])

  useEffect(() => () => { wsRef.current?.close() }, [])

  return { state, connect, createRoom, joinRoom, sendClick, disconnect }
}