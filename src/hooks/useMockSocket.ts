'use client'

import { useCallback, useRef, useState } from 'react'
import type { Card, GameOverData, Player, RoundOutcome, RoundResult } from '@/src/types/game'
import type { GameState } from './useGameSocket'

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const
const TOTAL_ROUNDS = 10
const CARD_INTERVAL_MS = 2000

const ME: Player = { id: 'player-1', name: 'You' }
const OPPONENT: Player = { id: 'player-2', name: 'Alex' }

const initialState: GameState = {
  myId: null,
  players: [],
  currentCard: null,
  cardIndex: 0,
  scores: {},
  roundResult: null,
  gameOver: null,
  roundHistory: [],
  totalRounds: TOTAL_ROUNDS,
  connected: false,
  opponentDisconnected: false,
}

function buildDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank })
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export function useMockSocket() {
  const [state, setState] = useState<GameState>(initialState)
  const deckRef = useRef<Card[]>([])
  const cardIdxRef = useRef(0)
  const roundRef = useRef(0)
  const roundHistoryRef = useRef<RoundOutcome[]>([])
  const scoresRef = useRef<Record<string, number>>({ 'player-1': 0, 'player-2': 0 })
  const currentCardRef = useRef<Card | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aceActiveRef = useRef(false)
  const roundOverRef = useRef(false)

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const endGame = useCallback(() => {
    clearTimer()
    const gameOver: GameOverData = {
      finalScores: { ...scoresRef.current },
      rounds: [...roundHistoryRef.current],
      winnerId: scoresRef.current['player-1'] >= scoresRef.current['player-2'] ? 'player-1' : 'player-2',
      players: [ME, OPPONENT],
    }
    setState(prev => ({ ...prev, gameOver }))
  }, [])

  const dealNextCard = useCallback(() => {
    if (roundRef.current >= TOTAL_ROUNDS) {
      endGame()
      return
    }

    aceActiveRef.current = false
    roundOverRef.current = false

    const card = deckRef.current[cardIdxRef.current % deckRef.current.length]
    cardIdxRef.current += 1
    currentCardRef.current = card

    setState(prev => ({
      ...prev,
      currentCard: card,
      cardIndex: roundRef.current + 1,
      roundResult: null,
    }))

    if (  card.rank === 'A') {
      aceActiveRef.current = true
      // opponent reacts between 300ms–1200ms
      const opponentReactionMs = 300 + Math.random() * 900
      timerRef.current = setTimeout(() => {
        if (!roundOverRef.current) {
          opponentWinsRound()
        }
      }, opponentReactionMs)
    } else {
      // auto-advance to next card after interval
      timerRef.current = setTimeout(() => {
        roundRef.current += 1
        dealNextCard()
      }, CARD_INTERVAL_MS)
    }
  }, [endGame])

  const resolveRound = useCallback((outcome: RoundOutcome, winnerId: string) => {
    if (roundOverRef.current) return
    roundOverRef.current = true
    aceActiveRef.current = false
    clearTimer()

    if (outcome === 'win') scoresRef.current['player-1'] += 1
    else if (outcome === 'loss') scoresRef.current['player-2'] += 1

    roundHistoryRef.current.push(outcome)

    const result: RoundResult = {
      winnerId,
      penalty: outcome === 'penalty',
      scores: { ...scoresRef.current },
      outcome,
    }

    setState(prev => ({
      ...prev,
      scores: { ...scoresRef.current },
      roundResult: result,
      roundHistory: [...roundHistoryRef.current],
    }))

    roundRef.current += 1

    timerRef.current = setTimeout(() => {
      if (roundRef.current >= TOTAL_ROUNDS) {
        endGame()
      } else {
        dealNextCard()
      }
    }, 1200)
  }, [dealNextCard, endGame])

  const opponentWinsRound = useCallback(() => {
    resolveRound('loss', 'player-2')
  }, [resolveRound])

  const connect = useCallback(() => {
    clearTimer()
    deckRef.current = buildDeck()
    cardIdxRef.current = 0
    roundRef.current = 0
    roundHistoryRef.current = []
    scoresRef.current = { 'player-1': 0, 'player-2': 0 }
    currentCardRef.current = null
    aceActiveRef.current = false
    roundOverRef.current = false

    setState({
      ...initialState,
      connected: true,
    })

    // simulate matchmaking delay
    timerRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        myId: ME.id,
        players: [ME, OPPONENT],
        scores: { 'player-1': 0, 'player-2': 0 },
        totalRounds: TOTAL_ROUNDS,
      }))

      timerRef.current = setTimeout(() => {
        dealNextCard()
      }, 800)
    }, 1500)
  }, [dealNextCard])

  const disconnect = useCallback(() => {
    clearTimer()
    setState(initialState)
  }, [])

  const sendClick = useCallback(() => {
    if (!aceActiveRef.current) {
      // early tap — penalty
      resolveRound('penalty', 'player-2')
      return
    }
    resolveRound('win', 'player-1')
  }, [resolveRound])

  return { state, connect, disconnect, sendClick }
}