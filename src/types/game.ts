export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  rank: Rank
  suit: Suit
}

export type ViewName = 'welcome' | 'matchmaking' | 'game' | 'result'

// Result derived from game_over payload
export type ResultKind =
  | { type: 'win';  reason: string }
  | { type: 'lose'; reason: string }
  | { type: 'draw'; reason: string }

// Server → client (OutMessage)
export type ServerEvent =
  | { type: 'waiting';     message: string }
  | { type: 'game_start';  player_id: number }
  | { type: 'card_reveal'; card: Card; card_index: number }
  | { type: 'game_over';   result: 'win' | 'lose' | 'draw'; reason: string; winner_id: number }

// Client → server (InMessage): { type: "click" }