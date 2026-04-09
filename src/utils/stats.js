/**
 * @param {number} wins
 * @param {number} losses
 * @returns {number} percentage 0–100 with one decimal, or 0 if no games played
 */
export function winPercentage(wins, losses) {
  const w = Number(wins) || 0
  const l = Number(losses) || 0
  const total = w + l
  if (total === 0) return 0
  return Math.round((w / total) * 1000) / 10
}
