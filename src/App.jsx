import { useMemo, useRef, useState } from 'react'
import ChosenLetters from './components/ChosenLetters'
import HangmanFigure from './components/HangmanFigure'
import Keyboard from './components/Keyboard'
import PlayerLogin from './components/PlayerLogin'
import PlayerStatsBar from './components/PlayerStatsBar'
import ResultModal from './components/ResultModal'
import WordDisplay from './components/WordDisplay'
import { WORDS } from './data/words'
import { playersUrl } from './utils/api'
import './App.css'

const MAX_WRONG_GUESSES = 5

const pickRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * WORDS.length)
  return WORDS[randomIndex]
}

function App() {
  const [player, setPlayer] = useState(null)
  const [targetWord, setTargetWord] = useState(() => pickRandomWord())
  const [selectedLetters, setSelectedLetters] = useState([])

  const roundIdRef = useRef(0)
  const statsSyncedRoundRef = useRef(null)

  const uniqueLettersInWord = useMemo(
    () => [...new Set(targetWord.split(''))],
    [targetWord],
  )

  const wrongLetters = useMemo(
    () => selectedLetters.filter((letter) => !targetWord.includes(letter)),
    [selectedLetters, targetWord],
  )

  const correctLetters = useMemo(
    () => selectedLetters.filter((letter) => targetWord.includes(letter)),
    [selectedLetters, targetWord],
  )

  const hasWon = uniqueLettersInWord.every((letter) =>
    selectedLetters.includes(letter),
  )
  const hasLost = wrongLetters.length >= MAX_WRONG_GUESSES
  const isGameOver = hasWon || hasLost

  const handleLetterSelect = (letter) => {
    if (isGameOver || selectedLetters.includes(letter)) {
      return
    }

    const nextSelected = [...selectedLetters, letter]
    setSelectedLetters(nextSelected)

    if (!player) {
      return
    }

    const wrongNext = nextSelected.filter((l) => !targetWord.includes(l))
    const hasWonNext = uniqueLettersInWord.every((l) =>
      nextSelected.includes(l),
    )
    const hasLostNext = wrongNext.length >= MAX_WRONG_GUESSES

    if (!hasWonNext && !hasLostNext) {
      return
    }

    const rid = roundIdRef.current
    if (statsSyncedRoundRef.current === rid) {
      return
    }
    statsSyncedRoundRef.current = rid

    const nextWins = hasWonNext ? player.wins + 1 : player.wins
    const nextLosses = hasWonNext ? player.losses : player.losses + 1

    setPlayer((prev) => {
      if (!prev) return prev
      return { ...prev, wins: nextWins, losses: nextLosses }
    })

    ;(async () => {
      try {
        await fetch(playersUrl(player.name), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wins: nextWins, losses: nextLosses }),
        })
      } catch {
        // Network errors do not block UI; stats stay locally updated
      }
    })()
  }

  const startNewGame = () => {
    roundIdRef.current += 1
    setSelectedLetters([])
    setTargetWord(pickRandomWord())
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Hangman</h1>
        <p>Guess the hidden word before the drawing is complete.</p>
        {player ? <PlayerStatsBar player={player} /> : null}
      </header>

      {!player ? (
        <PlayerLogin
          onLoggedIn={(p) => {
            setPlayer(p)
            roundIdRef.current += 1
            statsSyncedRoundRef.current = null
            setSelectedLetters([])
            setTargetWord(pickRandomWord())
          }}
        />
      ) : null}

      {player ? (
        <section className="game-board" aria-label="Hangman game board">
          <HangmanFigure
            wrongGuessCount={wrongLetters.length}
            maxWrongGuesses={MAX_WRONG_GUESSES}
          />

          <WordDisplay
            word={targetWord}
            selectedLetters={selectedLetters}
            revealWord={hasLost}
          />

          <ChosenLetters
            correctLetters={correctLetters}
            wrongLetters={wrongLetters}
          />

          <Keyboard
            selectedLetters={selectedLetters}
            onSelectLetter={handleLetterSelect}
            isGameOver={isGameOver}
          />

          <button type="button" className="new-game-btn" onClick={startNewGame}>
            New Game
          </button>
        </section>
      ) : null}

      <ResultModal
        isOpen={isGameOver && Boolean(player)}
        didWin={hasWon}
        word={targetWord}
        onNewGame={startNewGame}
      />
    </main>
  )
}

export default App
