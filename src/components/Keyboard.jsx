const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function Keyboard({ selectedLetters, onSelectLetter, isGameOver }) {
  return (
    <section className="panel" aria-label="Letter selection">
      <h2>Choose a letter</h2>
      <div className="keyboard">
        {ALPHABET.map((letter) => {
          const isSelected = selectedLetters.includes(letter)

          return (
            <button
              key={letter}
              type="button"
              className="key-btn"
              onClick={() => onSelectLetter(letter)}
              disabled={isSelected || isGameOver}
              aria-label={`Guess letter ${letter}`}
            >
              {letter}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default Keyboard
