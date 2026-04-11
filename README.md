# Reflex — Frontend

Two-player reflex card game. Built with Next.js 14.

## Requirements

- Node.js 20+
- A running instance of the Go backend (or mock mode for local testing)

## Environment variables

Copy the example and edit:

```bash
cp .env.local.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_WS_URL` | WebSocket URL of the Go backend | `ws://localhost:8080/ws` |
| `NEXT_PUBLIC_MOCK_MODE` | To Skip backend and test frontend, use built-in mock | `true` |

## Run locally

```bash
git clone git@github.com:shn27/reflex-card-game-frontend.git
cd reflex-card-game-frontend
```

```bash
npm install
npm run build
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To connect a real backend set `NEXT_PUBLIC_MOCK_MODE=false` and point `NEXT_PUBLIC_WS_URL` at your Go server.

## Run with Docker

```bash
# Build
docker build --build-arg NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws -t reflex-frontend .

# Run
docker run -p 3000:3000 reflex-frontend
```

Open [http://localhost:3000](http://localhost:3000).

> `NEXT_PUBLIC_*` variables are baked in at build time by Next.js, so they must be passed as `--build-arg`, not `-e` at runtime.

## Project structure

```
src/
├── app/                  # Next.js App Router entry
├── components/
│   ├── GameShell.tsx     # View state machine
│   ├── views/            # One file per screen
│   │   ├── WelcomeView.tsx
│   │   ├── MatchmakingView.tsx
│   │   ├── GameView.tsx
│   │   └── ResultView.tsx
│   └── ui/
│       └── PlayingCard.tsx
├── hooks/
│   ├── useGameSocket.ts  # Real WebSocket connection
│   └── useMockSocket.ts  # Mock for local testing
└── types/
    └── game.ts           # Shared types matching backend
```

## WebSocket protocol

**Client → server**

| Message | When |
|---|---|
| `{ type: "click" }` | Player taps the button |

**Server → client**

| Type | Key fields | Meaning |
|---|---|---|
| `waiting` | `message` | In queue, waiting for opponent |
| `game_start` | `player_id` | Match found, game begins |
| `card_reveal` | `card`, `card_index` | Next card to display |
| `game_over` | `result`, `reason` | Game ended — win / lose / draw |
