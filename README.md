# Wonder Sprouts

A trivia game for kids 5–8 — made for parent-child bonding. Learn together. Grow together.

Built with React 18, TypeScript, Vite 6, and Framer Motion.

## Quick Start

```bash
cd wonder-sprouts
npm install
npm run dev       # Start dev server (localhost:5173)
npm run build     # TypeScript check + production build
npm run preview   # Serve production build locally
```

## Project Structure

```
wonder-sprouts/
├── src/
│   ├── screens/          # App screens (landing, home, topics, trivia, summary, progress, parents, settings)
│   ├── components/       # Reusable UI components (AnswerArt, BottomNav, Mascot, etc.)
│   ├── context/          # React Context + useReducer (gameReducer.ts)
│   ├── data/             # Topic data, badges, prompts
│   ├── services/         # localStorage persistence, sound, confetti
│   ├── hooks/            # Custom hooks (useResponsive, useCoinFly)
│   ├── types/            # TypeScript interfaces
│   ├── constants/        # Game constants, storage keys
│   └── utils/            # Shuffle, format, greetings
├── public/               # Static assets (Sound.js, Confetti.js, icons, manifest)
└── index.html
```

## Tech Stack

- **React 18** with TypeScript
- **Vite 6** for dev server and bundling
- **Framer Motion 11** for animations
- **CSS Modules** for scoped component styles
- **Sound.js** — Web Audio API sound synthesis
- **Confetti.js** — Custom element for celebration effects

## Screen Navigation

Screen state is managed via a `useReducer` in `GameContext`. No router library. The `state.screen` value determines which screen renders in `App.tsx`. Screens are code-split with `React.lazy()` for performance.
