import { describe, it, expect } from 'vitest'
import { winPercentage } from './stats'

describe('winPercentage', () => {
  it('returns 0 when no games played', () => {
    expect(winPercentage(0, 0)).toBe(0)
  })

  it('computes percentage with one decimal', () => {
    expect(winPercentage(2, 1)).toBeCloseTo(66.7, 1)
    expect(winPercentage(1, 0)).toBe(100)
    expect(winPercentage(0, 4)).toBe(0)
  })
})
