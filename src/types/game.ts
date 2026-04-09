export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: Suit
  rank: Rank
}

export type ViewName = 'welcome' | 'matchmaking' | 'game' | 'results'

export type RoundOutcome = 'win' | 'loss' | 'penalty'

export interface RoundResult {
  winnerId: string
  penalty: boolean
  scores: Record<string, number>
  outcome: RoundOutcome
}

export interface Player {
  id: string
  name: string
}

export interface GameOverData {
  finalScores: Record<string, number>
  rounds: RoundOutcome[]
  winnerId: string
  players: Player[]
}

export type GameEvent =
  | { type: 'game:start'; payload: { players: Player[]; myId: string; totalRounds: number } }
  | { type: 'card:show'; payload: { card: Card; index: number } }
  | { type: 'round:result'; payload: RoundResult }
  | { type: 'game:over'; payload: GameOverData }
  | { type: 'opponent:disconnected' }