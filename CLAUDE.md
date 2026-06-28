# Wonder Sprouts — Claude Code Guide

## Project Overview

A trivia game for kids 5–8 (React 18 + TypeScript + Vite 6). Parent-child bonding through learning.

## Commands

```bash
npm run dev       # Start Vite dev server (HMR on localhost:5173)
npm run build     # tsc -b && vite build (type-check then bundle)
npm run preview   # Serve production build locally
```

## Tech Stack

- **React 18.3** with TypeScript 5.6 (strict mode enabled)
- **Vite 6** with `@vitejs/plugin-react`
- **Framer Motion 11.15** for animations
- **CSS Modules** (`.module.css`) for component styles
- **Sound.js** — Web Audio API IIFE on `window.FTSound`
- **Confetti.js** — `<confetti-burst>` custom element
- No router library — screen state via `useReducer`

## Architecture

### State Management
- `GameContext.tsx` wraps the app in React Context with a `useReducer`
- `gameReducer.ts` handles all actions: navigation, scoring, persistence
- State is `AppState = GameProgress & SessionState` (intersection type)
- Persisted to localStorage on every meaningful action (inside the reducer)

### Screen Navigation
- `state.screen` controls which screen renders in `App.tsx`
- Screens are code-split with `React.lazy()` + dynamic imports
- Wrap screen renders in `<Suspense>` with a loading fallback
- `BottomNav` renders on home/topics/progress/parents/settings

### Screens
| Screen | Purpose |
|---|---|
| `landing` | First-visit tutorial before entering the app |
| `home` | Greeting, hero card, wonder prompt |
| `topics` | Topic grid with category filter sheet |
| `trivia` | Quiz with timer, 4 answer buttons, feedback block |
| `summary` | Score, XP/coin rewards, progress ring |
| `progress` | Level stats, badges, play time |
| `parents` | Math-gated adult dashboard (daily limit, feedback, reset) |
| `settings` | Child name, avatar, reduce motion, big text |

### Component Patterns
- **CSS Modules**: Each component has a co-located `.module.css` file
- **Framer Motion**: `motion.div`, `AnimatePresence` for enter/exit animations
- **Inline styles**: Used for dynamic values (esp. in AnswerArt illustrations)
- **Avoid `React.memo`** — currently not used (re-renders acceptable given app scale)

### Animation Conventions
- **Use `transform` and `opacity`** for performant animations (compositor-friendly)
- Avoid animating `height`, `width`, `box-shadow` (triggers layout/paint)
- Global keyframes defined in `src/index.css`:
  - `aaFloat` — gentle bobbing (used by all AnswerArt illustrations)
  - `aaTwinkle` — pulsing scale+opacity (used on star elements)
  - `aaSpin` — continuous rotation (used by Milkyway illustration)
  - `sparkleTwinkle` — used by mascot sparkle effects

## AnswerArt System

81 procedural CSS illustrations, one per correct trivia answer.

### How it works
- `AnswerArt.tsx` takes `kind: string` and `theme?: string` props
- Looks up the matching `*Art` component from the `ILLUSTRATIONS` registry
- Renders inside a tinted square tile (`border-radius: 26%`, `overflow: hidden`)
- A float animation wrapper (`aaFloat`) is applied to the art layer
- Tile color comes from `TILE_COLORS[theme]` or falls back to `#EAEBF6`

### Creating/modifying illustrations
- Each topic has its own file in `src/components/AnswerArt/illustrations/`
- Use the `p(left, top, width, height, extra?)` helper for positioning
- All values are percentages (strings like `'22%'`)
- Register new illustrations in the `ILLUSTRATIONS` map in `AnswerArt.tsx`
- Source of truth: `answer-art-reference.html` at the project root
- Manifest: `answer-art-manifest.json` maps each kind → topic + tileColor

### Performance notes
- All 81 illustration components are eagerly imported into one module (~89 KB / 13 KB gzipped)
- Used only in `FeedbackBlock` (after answering a trivia question) and `ArtGalleryScreen` (debug)
- If this becomes a bottleneck, they could be lazy-loaded by topic

## Performance Rules

- **Code splitting**: All screens are `React.lazy()` — keep them that way
- **Scripts**: `Sound.js` and `Confetti.js` are loaded with `defer` in `index.html`
- **Vendor chunks**: `framer-motion` and `react`/`react-dom` are split into separate chunks via `vite.config.ts` `manualChunks`
- **CSS animations**: Prefer `transform`/`opacity` over layout-triggering properties
- **Fonts**: Google Fonts loaded with `display=swap` to avoid FOIT
- **Reduce motion**: `state.reduceMotion` disables animations via `.ft-reduce` class

## Key Files

| File | Purpose |
|---|---|
| `src/types/index.ts` | All TypeScript interfaces (`AppState`, `GameProgress`, `SessionState`) |
| `src/context/gameReducer.ts` | All game logic and state transitions |
| `src/data/topics.ts` | 16 topics with 80 questions, SVG icons, facts |
| `src/constants/game.ts` | XP values, level thresholds, localStorage keys |
| `vite.config.ts` | Build config with manualChunks for vendor splitting |
| `index.html` | Entry point with splash screen, font loading, defer'd scripts |

## Debug Routes

- `?art-gallery` — renders all 81 AnswerArt illustrations for visual comparison (dev mode only via `import.meta.env.DEV`)
