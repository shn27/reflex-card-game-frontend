'use client'

import { useCallback, useRef, useState } from 'react'
import type { Card, ResultKind } from '@/types/game'
import type { SocketState } from './useGameSocket'

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const

const initial: SocketState = {
  connected: false,
  waitingMessage: '',
  myPlayerId: null,
  currentCard: null,
  cardIndex: 0,
  result: null,
  opponentDisconnected: false,
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

const SUIT_NAMES: Record<string, string> = {
  hearts: 'Hearts', diamonds: 'Diamonds', clubs: 'Clubs', spades: 'Spades',
}

export function useMockSocket() {
  const [state, setState] = useState<SocketState>(initial)
  const deckRef      = useRef<Card[]>([])
  const idxRef       = useRef(0)
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aceActiveRef = useRef(false)
  const gameOverRef  = useRef(false)

  const clear = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }

  const endGame = useCallback((result: ResultKind) => {
    if (gameOverRef.current) return
    gameOverRef.current = true
    clear()
    setState(prev => ({ ...prev, result }))
  }, [])

  const dealNext = useCallback(() => {
    if (gameOverRef.current) return
    if (idxRef.current >= deckRef.current.length) {
      endGame({ type: 'draw', reason: 'All 52 cards were dealt. Neither player tapped.' })
      return
    }

    const card = deckRef.current[idxRef.current]
    idxRef.current++
    aceActiveRef.current = card.rank === 'A'

    setState(prev => ({ ...prev, currentCard: card, cardIndex: idxRef.current, result: null }))

    if (card.rank === 'A') {
      // opponent reacts between 400–1400ms
      timerRef.current = setTimeout(() => {
        if (aceActiveRef.current) {
          endGame({
            type: 'lose',
            reason: `Your opponent clicked the ${card.rank} of ${SUIT_NAMES[card.suit]} before you.`,
          })
        }
      }, 400 + Math.random() * 1000)
    } else {
      timerRef.current = setTimeout(dealNext, 1800)
    }
  }, [endGame])

  const connect = useCallback(() => {
    clear()
    deckRef.current = buildDeck()
    idxRef.current = 0
    aceActiveRef.current = false
    gameOverRef.current = false
    setState({ ...initial, connected: true, waitingMessage: 'Waiting for an opponent...' })

    // simulate matchmaking delay
    timerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, myPlayerId: 1, waitingMessage: '' }))
      timerRef.current = setTimeout(dealNext, 900)
    }, 1500)
  }, [dealNext])

  const disconnect = useCallback(() => { clear(); setState(initial) }, [])

  const sendClick = useCallback(() => {
    if (gameOverRef.current) return
    const card = deckRef.current[idxRef.current - 1]
    if (!card) return

    clear()
    aceActiveRef.current = false

    if (card.rank === 'A') {
      endGame({
        type: 'win',
        reason: `You clicked the ${card.rank} of ${SUIT_NAMES[card.suit]} faster than your opponent.`,
      })
    } else {
      endGame({
        type: 'lose',
        reason: `You clicked the ${card.rank} of ${SUIT_NAMES[card.suit]} — that wasn't an Ace.`,
      })
    }
  }, [endGame])

  return { state, connect, disconnect, sendClick }
}