'use client'

import { useCallback, useRef, useState } from 'react'
import type { Card, ResultKind, RoomPlayer } from '@/types/game'
import type { RoomState } from './useRoomSocket'

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const
const SUIT_NAMES: Record<string, string> = {
  hearts: 'Hearts', diamonds: 'Diamonds', clubs: 'Clubs', spades: 'Spades',
}

function buildDeck(): Card[] {
  const d: Card[] = []
  for (const suit of SUITS) for (const rank of RANKS) d.push({ suit, rank })
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]]
  }
  return d
}

const initial: RoomState = {
  status: 'idle', error: null, errorMessage: '',
  secret: '', myPlayerId: null, isHost: false, players: [],
  currentCard: null, cardIndex: 0, result: null, opponentDisconnected: false,
}

export function useMockRoomSocket() {
  const [state, setState] = useState<RoomState>(initial)
  const deckRef      = useRef<Card[]>([])
  const idxRef       = useRef(0)
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aceActiveRef = useRef(false)
  const gameOverRef  = useRef(false)

  const clear = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null } }

  const endGame = useCallback((result: ResultKind) => {
    if (gameOverRef.current) return
    gameOverRef.current = true
    clear()
    setState(prev => ({ ...prev, status: 'done', result }))
  }, [])

  const dealNext = useCallback(() => {
    if (gameOverRef.current) return
    if (idxRef.current >= deckRef.current.length) {
      endGame({ type: 'draw', reason: 'All 52 cards were dealt. Neither player tapped.' })
      return
    }
    const card = deckRef.current[idxRef.current++]
    aceActiveRef.current = card.rank === 'A'
    setState(prev => ({ ...prev, currentCard: card, cardIndex: idxRef.current }))
    if (card.rank === 'A') {
      timerRef.current = setTimeout(() => {
        if (aceActiveRef.current)
          endGame({ type: 'lose', reason: `Your opponent clicked the ${card.rank} of ${SUIT_NAMES[card.suit]} before you.` })
      }, 400 + Math.random() * 1000)
    } else {
      timerRef.current = setTimeout(dealNext, 1800)
    }
  }, [endGame])

  const createRoom = useCallback(() => {
    setState({
      ...initial, status: 'waiting', isHost: true,
      secret: 'X7K2P',
      myPlayerId: 1,
      players: [{ id: 1, name: 'You', isHost: true }],
    })
    // simulate a guest joining after 2s
    timerRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        players: [
          { id: 1, name: 'You', isHost: true },
          { id: 2, name: 'Player 2', isHost: false },
        ],
      }))
    }, 2000)
  }, [])

  const joinRoom = useCallback((secret: string) => {
    if (secret.toUpperCase() !== 'X7K2P') {
      setState({ ...initial, error: 'room_invalid', errorMessage: 'Room not found or already started.' })
      return
    }
    setState({
      ...initial, status: 'waiting', isHost: false,
      secret: 'X7K2P',
      myPlayerId: 2,
      players: [
        { id: 1, name: 'Player 1', isHost: true },
        { id: 2, name: 'You', isHost: false },
      ],
    })
  }, [])

  const startGame = useCallback(() => {
    clear()
    deckRef.current = buildDeck()
    idxRef.current = 0
    aceActiveRef.current = false
    gameOverRef.current = false
    setState(prev => ({ ...prev, status: 'playing' }))
    timerRef.current = setTimeout(dealNext, 800)
  }, [dealNext])

  const sendClick = useCallback(() => {
    if (gameOverRef.current) return
    const card = deckRef.current[idxRef.current - 1]
    if (!card) return
    clear()
    aceActiveRef.current = false
    if (card.rank === 'A') {
      endGame({ type: 'win', reason: `You clicked the ${card.rank} of ${SUIT_NAMES[card.suit]} faster than your opponent.` })
    } else {
      endGame({ type: 'lose', reason: `You clicked the ${card.rank} of ${SUIT_NAMES[card.suit]} — that wasn't an Ace.` })
    }
  }, [endGame])

  const disconnect = useCallback(() => { clear(); setState(initial) }, [])
  const clearError = useCallback(() => setState(prev => ({ ...prev, error: null, errorMessage: '' })), [])

  return { state, createRoom, joinRoom, startGame, sendClick, disconnect, clearError }
}