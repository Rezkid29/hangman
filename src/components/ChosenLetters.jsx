function ChosenLetters({ correctLetters, wrongLetters }) {
  return (
    <section className="panel" aria-label="Chosen letters">
      <h2>Chosen Letters</h2>
      <div className="chosen-letters">
        <div>
          <h3>Correct</h3>
          <p>{correctLetters.length > 0 ? correctLetters.join(', ') : 'None yet'}</p>
        </div>
        <div>
          <h3>Wrong</h3>
          <p>{wrongLetters.length > 0 ? wrongLetters.join(', ') : 'None yet'}</p>
        </div>
      </div>
    </section>
  )
}

export default ChosenLetters
