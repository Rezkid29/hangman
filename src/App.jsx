import { useMemo, useState } from 'react'
import ChosenLetters from './components/ChosenLetters'
import HangmanFigure from './components/HangmanFigure'
import Keyboard from './components/Keyboard'
import ResultModal from './components/ResultModal'
import WordDisplay from './components/WordDisplay'
import { WORDS } from './data/words'
import './App.css'

const MAX_WRONG_GUESSES = 5

const pickRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * WORDS.length)
  return WORDS[randomIndex]
}

function App() {
  const [targetWord, setTargetWord] = useState(() => pickRandomWord())
  const [selectedLetters, setSelectedLetters] = useState([])

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

    setSelectedLetters((currentLetters) => [...currentLetters, letter])
  }

  const startNewGame = () => {
    setSelectedLetters([])
    setTargetWord(pickRandomWord())
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Hangman</h1>
        <p>Guess the hidden word before the drawing is complete.</p>
      </header>

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

      <ResultModal
        isOpen={isGameOver}
        didWin={hasWon}
        word={targetWord}
        onNewGame={startNewGame}
      />
    </main>
  )
}

export default App
