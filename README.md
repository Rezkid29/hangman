# Hangman (React + Vite)

A component-based Hangman game built with React and scaffolded using Vite.

## Features

- **Current hangman image**: 6 staged SVG images in `public/hangman` for 5 lives (0-5 wrong guesses).
- **Letter selection**: clickable on-screen keyboard (`A-Z`).
- **Chosen letters display**: correct and incorrect guesses are shown separately.
- **New game control**: `New Game` button resets state and picks a fresh random word.
- **End-state popup**: modal appears for both win and loss states and reveals the solution.
- **Component architecture**: game UI is split across reusable React components.

## Component Breakdown

- `src/App.jsx`: game state, derived state, and shared handlers.
- `src/components/HangmanFigure.jsx`: renders hangman stage image from wrong guess count.
- `src/components/WordDisplay.jsx`: renders hidden/revealed letters.
- `src/components/Keyboard.jsx`: letter input controls.
- `src/components/ChosenLetters.jsx`: lists correct and wrong selected letters.
- `src/components/ResultModal.jsx`: win/loss popup with replay action.
- `src/data/words.js`: source word list.

## Run Locally

### Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm

### Commands

```bash
npm install
npm run dev
```

Open the URL printed by Vite (typically [http://localhost:5173](http://localhost:5173)).

## Run with Docker

This project includes a multi-stage Docker build (Node build + Nginx runtime).

### Option A: Docker Compose

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

### Option B: Docker CLI

```bash
docker build -t hangman-react .
docker run --rm -p 8080:80 hangman-react
```

Open [http://localhost:8080](http://localhost:8080).

## Scripts

- `npm run dev` - start Vite development server.
- `npm run build` - create production build in `dist`.
- `npm run preview` - preview production build locally.
- `npm run lint` - run ESLint.

## Prototype Affordance Checklist

- [x] Show current hangman status with staged pictures
- [x] Allow user to select letters
- [x] Show user-chosen letters
- [x] Provide a new game button
- [x] Show popup for win/loss outcome
