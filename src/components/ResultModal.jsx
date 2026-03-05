function ResultModal({ isOpen, didWin, word, onNewGame }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="result-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Game result"
      >
        <h2>{didWin ? 'You Won!' : 'You Lost'}</h2>
        <p>
          {didWin ? 'Great guessing.' : 'Better luck next time.'} The word was{' '}
          <strong>{word}</strong>.
        </p>
        <button type="button" className="new-game-btn" onClick={onNewGame}>
          Play Again
        </button>
      </section>
    </div>
  )
}

export default ResultModal
