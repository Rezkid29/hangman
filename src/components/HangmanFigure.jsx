function HangmanFigure({ wrongGuessCount, maxWrongGuesses }) {
  const stage = Math.min(wrongGuessCount, maxWrongGuesses)
  const imagePath = `/hangman/hangman-${stage}.svg`

  return (
    <section className="panel" aria-label="Current hangman status">
      <h2>Hangman Status</h2>
      <img
        className="hangman-image"
        src={imagePath}
        alt={`Hangman stage ${stage} of ${maxWrongGuesses}`}
      />
      <p className="helper-text">
        Wrong guesses: {wrongGuessCount} / {maxWrongGuesses}
      </p>
    </section>
  )
}

export default HangmanFigure
