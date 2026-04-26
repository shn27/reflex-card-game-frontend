'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Card, ResultKind, RoomPlayer, ServerEvent } from '@/types/game'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws'

export type RoomError =
  | 'rate_limited'
  | 'room_invalid'       // bad secret or room not in waiting state
  | 'server_unavailable'
  | null

export interface RoomState {
  status: 'idle' | 'connecting' | 'waiting' | 'playing' | 'done'
  error: RoomError
  errorMessage: string        // human readable, from server
  secret: string              // room secret shown to players
  myPlayerId: number | null
  isHost: boolean
  players: RoomPlayer[]       // live player list in waiting room
  currentCard: Card | null
  cardIndex: number
  result: ResultKind | null
  opponentDisconnected: boolean
  hostLeft: boolean           // waiting phase: host disconnected → go back
}

const initial: RoomState = {
  status: 'idle',
  error: null,
  errorMessage: '',
  secret: '',
  myPlayerId: null,
  isHost: false,
  players: [],
  currentCard: null,
  cardIndex: 0,
  result: null,
  opponentDisconnected: false,
  hostLeft: false,
}

export function useRoomSocket() {
  const wsRef          = useRef<WebSocket | null>(null)
  const rateLimitedRef = useRef(false)
  const [state, setState] = useState<RoomState>(initial)

  const openSocket = useCallback((onOpen: (ws: WebSocket) => void) => {
    wsRef.current?.close()
    rateLimitedRef.current = false
    setState({ ...initial, status: 'connecting' })

    let ws: WebSocket
    try { ws = new WebSocket(WS_URL) } catch {
      setState({ ...initial, error: 'server_unavailable', errorMessage: 'Could not reach the server.' })
      return
    }
    wsRef.current = ws

    ws.onerror = () => {
      if (!rateLimitedRef.current) {
        setState({ ...initial, error: 'server_unavailable', errorMessage: 'Could not reach the server.' })
      }
    }

    ws.onopen = () => onOpen(ws)

    ws.onmessage = (e) => {
      let evt: ServerEvent
      try { evt = JSON.parse(e.data) } catch { return }

      setState(prev => {
        switch (evt.type) {
          case 'rate_limited':
            rateLimitedRef.current = true
            return { ...initial, error: 'rate_limited', errorMessage: evt.message }

          case 'room_created':
            return {
              ...prev,
              status: 'waiting',
              secret: evt.secret,
              myPlayerId: evt.player_id,
              isHost: true,
              // Seed the list with the host immediately.
              // room_updated keeps it in sync as guests join/leave.
              players: [{ id: evt.player_id, name: 'You', isHost: true }],
            }

          case 'room_joined':
            return {
              ...prev,
              status: 'waiting',
              secret: evt.secret,
              myPlayerId: evt.player_id,
              isHost: false,
              players: evt.players,
            }

          case 'room_updated':
            return { ...prev, players: evt.players }

          case 'room_invalid':
            return { ...prev, status: 'idle', error: 'room_invalid', errorMessage: evt.message }

          case 'room_started':
            return { ...prev, status: 'playing' }

          case 'room_host_left':
            // Host left the waiting room — signal GameShell to send everyone back
            return { ...prev, hostLeft: true }



          case 'game_start':
            return { ...prev, status: 'playing', myPlayerId: evt.player_id }

          case 'card_reveal':
            return { ...prev, currentCard: evt.card, cardIndex: evt.card_index, result: null }

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
      setState(prev => {
        if (prev.error) return prev
        if (prev.status === 'playing') return { ...prev, opponentDisconnected: true }
        return prev
      })
    }
  }, [])

  const createRoom = useCallback(() => {
    openSocket(ws => {
      ws.send(JSON.stringify({ type: 'room_create' }))
    })
  }, [openSocket])

  const joinRoom = useCallback((secret: string) => {
    openSocket(ws => {
      ws.send(JSON.stringify({ type: 'room_join', secret }))
    })
  }, [openSocket])

  const startGame = useCallback(() => {
    wsRef.current?.send(JSON.stringify({ type: 'room_start', secret: state.secret }))
  }, [state.secret])

  const sendClick = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'click' }))
    }
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setState(initial)
  }, [])

  // Sends an explicit leave message before closing so the server can
  // cleanly remove the player and notify others, rather than inferring
  // a leave from a dropped connection.
  const leaveRoom = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'room_leave', secret: state.secret }))
    }
    wsRef.current?.close()
    wsRef.current = null
    setState(initial)
  }, [state.secret])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null, errorMessage: '' }))
  }, [])

  useEffect(() => () => { wsRef.current?.close() }, [])

  return { state, createRoom, joinRoom, startGame, sendClick, disconnect, leaveRoom, clearError }
}