# ♟️ Bloody Chess

A featured multiplayer and single-player chess application built with **Next.js**, **Redux Toolkit**, and **Supabase**, offering real-time gameplay, Stockfish AI integration, and customizable game settings.

---

## 🚀 Features

### 🧠 Game Modes
- **Play vs Bot**: Face off against a Stockfish-powered AI with **20 difficulty levels** (1–20).
- **Play vs Player**: Real-time **multiplayer chess** using Supabase real-time channels.

### ⏱️ Timer Options
- Multiple chess clock formats:
  - **Bullet**: 1+0, 2+1
  - **Blitz**: 3+0, 3+2, 5+0, 5+3
  - **Rapid**: 10+0, 10+5, 15+10

### 🕹️ In-Game Actions
- Offer **draw** during play.
- **Moves animation** and **drag and drop**.
- **Resign** at any moment.
- **Request rematch** instantly after a game ends.
- Full **move history** + the ability to **undo moves** in bot mode.

### ⚙️ Settings Panel
- **Move animations**: control duration or disable.
- **Sound toggles**:
  - Move sounds
  - Game start/end sounds
  - Time alerts

### 👤 Profile
- Track and view **your match history**
- See outcomes of previously played games (win, loss, draw)

---

## 🔐 Authentication

- Email/password sign-up with **email confirmation required** before sign-in.
- **Password reset** support (via email).
- Built using **NextAuth** and **Supabase auth**.

---

## 🛠️ Tech Stack

| Tech         | Purpose                            |
|--------------|-------------------------------------|
| **Next.js**  | App framework & SSR                 |
| **Supabase** | Realtime backend & auth             |
| **Redux Toolkit** | Global state management       |
| **NextAuth.js** | Custom auth flow                |
| **Motion** | UI animations                |
| **dnd-kit**  | Drag-and-drop behavior   |
| **Chess.js** | Game rules engine                  |
| **Stockfish API** | Bot move logic                |

---

## 🧪 Coming Features / Ideas

- Spectator mode
- Chess puzzle mode
- Game review
- ELO-style rating system

---

## 🧭 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/redarasmy/bloody-chess.git
cd bloody-chess
pnpm install
```

### 2. Create a .env.local file:
use env.example file as guide

