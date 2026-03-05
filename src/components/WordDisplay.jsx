function WordDisplay({ word, selectedLetters, revealWord }) {
  return (
    <section className="panel" aria-label="Hidden word display">
      <h2>Word</h2>
      <div className="word-display">
        {word.split('').map((letter, index) => {
          const isVisible = revealWord || selectedLetters.includes(letter)

          return (
            <span
              key={`${letter}-${index}`}
              className={`word-slot ${isVisible ? 'word-slot--filled' : ''}`}
            >
              {isVisible ? letter : ''}
            </span>
          )
        })}
      </div>
    </section>
  )
}

export default WordDisplay
