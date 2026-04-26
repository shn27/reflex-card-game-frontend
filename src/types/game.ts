export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  rank: Rank
  suit: Suit
}

export type ViewName =
  | 'welcome'
  | 'matchmaking'        // anonymous queue
  | 'friends'            // choose create or join
  | 'join-entry'         // enter secret code
  | 'room-waiting'       // waiting room (host + guests)
  | 'game'
  | 'result'

export type ResultKind =
  | { type: 'win';  reason: string }
  | { type: 'lose'; reason: string }
  | { type: 'draw'; reason: string }

export interface RoomPlayer {
  id: number
  name: string
  isHost: boolean
}

// ── Server → client (OutMessage) ─────────────────────────────────────────────
export type ServerEvent =
  | { type: 'rate_limited';   message: string }
  | { type: 'waiting';        message: string }
  | { type: 'game_start';     player_id: number }
  | { type: 'card_reveal';    card: Card; card_index: number }
  | { type: 'game_over';      result: 'win' | 'lose' | 'draw'; reason: string; winner_id: number }
  // friends room events
  | { type: 'room_created';   secret: string; player_id: number }
  | { type: 'room_joined';    secret: string; player_id: number; players: RoomPlayer[] }
  | { type: 'room_updated';   players: RoomPlayer[]; secret: string }
  | { type: 'room_invalid';   message: string }         // bad secret or room not in waiting state
  | { type: 'room_started';   }                         // host clicked start → transition to game
  | { type: 'room_host_left'; }                         // host left waiting → everyone back to friends

// Client → server: { type: "click" } | { type: "room_start", secret: string } | { type: "room_leave", secret: string }