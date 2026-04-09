import { winPercentage } from '../utils/stats'

/**
 * @param {{ player: { name: string, wins: number, losses: number } }} props
 */
function PlayerStatsBar({ player }) {
  const pct = winPercentage(player.wins, player.losses)

  return (
    <div className="player-stats" role="status" aria-live="polite">
      <span className="player-stats__name">
        <strong>{player.name}</strong>
      </span>
      <span className="player-stats__meta">
        Wins: {player.wins} · Losses: {player.losses} · Win rate:{' '}
        <strong>{pct}%</strong>
      </span>
    </div>
  )
}

export default PlayerStatsBar
