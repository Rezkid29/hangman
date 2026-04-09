import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PlayerStatsBar from './PlayerStatsBar'

describe('PlayerStatsBar', () => {
  it('shows player name and win rate', () => {
    render(
      <PlayerStatsBar
        player={{ name: 'Casey', wins: 1, losses: 1 }}
      />,
    )
    expect(screen.getByText('Casey')).toBeInTheDocument()
    expect(screen.getByText(/Win rate:/i)).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })
})
