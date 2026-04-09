import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import PlayerLogin from './PlayerLogin'

describe('PlayerLogin', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({}),
        }),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('calls onLoggedIn when GET returns existing player', async () => {
    const user = userEvent.setup()
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ name: 'Ada', wins: 3, losses: 1 }),
    })

    const onLoggedIn = vi.fn()
    render(<PlayerLogin onLoggedIn={onLoggedIn} />)

    await user.type(screen.getByLabelText(/your name/i), 'Ada')
    await user.click(screen.getByRole('button', { name: /start/i }))

    await waitFor(() => {
      expect(onLoggedIn).toHaveBeenCalledWith({
        name: 'Ada',
        wins: 3,
        losses: 1,
      })
    })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/players/Ada'),
      { method: 'GET' },
    )
  })

  it('creates player when GET is 404 and POST succeeds', async () => {
    const user = userEvent.setup()
    fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ name: 'Ben', wins: 0, losses: 0 }),
      })

    const onLoggedIn = vi.fn()
    render(<PlayerLogin onLoggedIn={onLoggedIn} />)

    await user.type(screen.getByLabelText(/your name/i), 'Ben')
    await user.click(screen.getByRole('button', { name: /start/i }))

    await waitFor(() => {
      expect(onLoggedIn).toHaveBeenCalledWith({
        name: 'Ben',
        wins: 0,
        losses: 0,
      })
    })
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
