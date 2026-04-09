import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from './app.js'

const TABLE = 'TestPlayers'

function createMockDoc() {
  const store = new Map()
  return {
    store,
    send: vi.fn(async (cmd) => {
      const input = cmd.input

      if (input.UpdateExpression) {
        const name = input.Key.playerName
        const w = input.ExpressionAttributeValues[':w']
        const l = input.ExpressionAttributeValues[':l']
        const row = { playerName: name, wins: w, losses: l }
        store.set(name, row)
        return { Attributes: { ...row } }
      }

      if (input.Item) {
        const item = input.Item
        if (store.has(item.playerName)) {
          const err = new Error('exists')
          err.name = 'ConditionalCheckFailedException'
          throw err
        }
        store.set(item.playerName, { ...item })
        return {}
      }

      if (input.Key && !input.Item) {
        const item = store.get(input.Key.playerName)
        return item ? { Item: { ...item } } : {}
      }

      throw new Error('Unknown command')
    }),
  }
}

describe('Players API', () => {
  let mockDoc
  let app

  beforeEach(() => {
    mockDoc = createMockDoc()
    app = createApp(mockDoc, TABLE)
  })

  it('GET /players/:name returns 404 when missing', async () => {
    const res = await request(app).get('/players/Alice')
    expect(res.status).toBe(404)
  })

  it('POST /players creates a new player', async () => {
    const res = await request(app).post('/players').send({ name: 'Bob' })
    expect(res.status).toBe(201)
    expect(res.body).toEqual({ name: 'Bob', wins: 0, losses: 0 })

    const get = await request(app).get('/players/Bob')
    expect(get.status).toBe(200)
    expect(get.body.wins).toBe(0)
    expect(get.body.losses).toBe(0)
  })

  it('POST /players returns 409 when player exists', async () => {
    await request(app).post('/players').send({ name: 'Cara' })
    const res = await request(app).post('/players').send({ name: 'Cara' })
    expect(res.status).toBe(409)
  })

  it('PUT /players/:name updates wins and losses', async () => {
    await request(app).post('/players').send({ name: 'Dan' })
    const res = await request(app).put('/players/Dan').send({
      wins: 2,
      losses: 1,
    })
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ name: 'Dan', wins: 2, losses: 1 })
  })

  it('PUT /players/:name rejects invalid body', async () => {
    const res = await request(app).put('/players/Dan').send({
      wins: -1,
      losses: 0,
    })
    expect(res.status).toBe(400)
  })
})
