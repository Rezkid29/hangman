import { useState } from 'react'
import { playersCollectionUrl, playersUrl } from '../utils/api'

/**
 * @param {{ onLoggedIn: (player: { name: string, wins: number, losses: number }) => void }} props
 */
function PlayerLogin({ onLoggedIn }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter your name.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const getRes = await fetch(playersUrl(trimmed), { method: 'GET' })

      if (getRes.ok) {
        const data = await getRes.json()
        onLoggedIn({
          name: data.name,
          wins: data.wins,
          losses: data.losses,
        })
        return
      }

      if (getRes.status === 404) {
        const postRes = await fetch(playersCollectionUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmed }),
        })

        if (postRes.ok) {
          const created = await postRes.json()
          onLoggedIn({
            name: created.name,
            wins: created.wins,
            losses: created.losses,
          })
          return
        }

        if (postRes.status === 409) {
          const retry = await fetch(playersUrl(trimmed), { method: 'GET' })
          if (retry.ok) {
            const data = await retry.json()
            onLoggedIn({
              name: data.name,
              wins: data.wins,
              losses: data.losses,
            })
            return
          }
        }

        const errBody = await postRes.json().catch(() => ({}))
        setError(errBody.error || 'Could not create player.')
        return
      }

      setError('Could not look up player.')
    } catch {
      setError('Network error. Is the API running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel player-login" aria-label="Player sign in">
      <h2>Welcome</h2>
      <p className="player-login__hint">
        Enter your name to track wins, losses, and win rate.
      </p>
      <form className="player-login__form" onSubmit={handleSubmit}>
        <label className="player-login__label" htmlFor="player-name">
          Your name
        </label>
        <input
          id="player-name"
          className="player-login__input"
          type="text"
          autoComplete="username"
          maxLength={64}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          placeholder="e.g. Alex"
        />
        {error ? (
          <p className="player-login__error" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="new-game-btn player-login__submit"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Start'}
        </button>
      </form>
    </section>
  )
}

export default PlayerLogin
