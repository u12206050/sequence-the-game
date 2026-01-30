# Sequence

A multiplayer turn-based strategy game where players flip, swap, and arrange bricks to form **sum-8 pairs**, **twins**, and **sequential paths** for points.

**[Play online](https://u12206050.github.io/sequence-the-game/)** · [Report a bug](https://github.com/gerardlamusse/sequence-the-game/issues)

---

## How to Play

- **Your turn:** Flip any facedown brick. Once it’s revealed you can:
  - **Keep** — Leave it where it is and score.
  - **Swap** — Click another facedown brick to swap; both end up face-up.
- **Scoring:**
  - **Pairs (1 pt):** Adjacent bricks that sum to **8** (e.g. 1+7, 2+6, 4+4).
  - **Twins (1 pt):** Adjacent bricks with the **same number** (e.g. 3 next to 3).
  - **Sequences (1 pt per brick):** Three or more numbers in order (up or down), wrapping 7→1 (e.g. 5, 6, 7, 1, 2 = 5 points).
- **Handicaps:** Turn order is random each round; later players get bonus starting points (2nd: +1, 3rd: +2, 4th: +3) to balance the advantage.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** (dev & build)
- **Lucide React** (icons)
- **canvas-confetti** (celebrations)

---

## Run Locally

**Prerequisites:** Node.js (v18+ recommended)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`).

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Deploy

The app is built and deployed to **GitHub Pages** on every push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). No extra config is required beyond enabling GitHub Pages for the repo.

---

## Project Structure

```
sequence/
├── App.tsx              # Main game state and flow
├── types.ts             # Game types (Player, Brick, TurnPhase, etc.)
├── utils.ts             # Grid generation, scoring, brick logic
├── components/
│   ├── Brick.tsx        # Single brick UI
│   ├── Lobby.tsx        # Player setup and game start
│   ├── PlayerStats.tsx  # Scores and turn order
│   ├── ScoreOverlay.tsx # Turn scoring breakdown
│   ├── RoundSummary.tsx # End-of-round summary
│   ├── HelpModal.tsx    # How to play
│   └── ConfirmationModal.tsx
├── index.html
├── index.tsx
└── vite.config.ts
```

---

## License

**CC-BY-NC-SA 4.0** — [Creative Commons Attribution-NonCommercial-ShareAlike 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

© [Gerard Lamusse](https://github.com/gerardlamusse)
