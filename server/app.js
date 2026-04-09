import express from 'express'
import cors from 'cors'
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'

export function createApp(docClient, tableName) {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.get('/players/:name', async (req, res) => {
    const name = decodeURIComponent(req.params.name).trim()
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    try {
      const result = await docClient.send(
        new GetCommand({
          TableName: tableName,
          Key: { playerName: name },
        }),
      )

      if (!result.Item) {
        return res.status(404).json({ error: 'Player not found' })
      }

      const wins = Number(result.Item.wins ?? 0)
      const losses = Number(result.Item.losses ?? 0)
      return res.json({
        name: result.Item.playerName,
        wins,
        losses,
      })
    } catch (err) {
      console.error('GET /players', err)
      return res.status(500).json({ error: 'Failed to load player' })
    }
  })

  app.post('/players', async (req, res) => {
    const name = String(req.body?.name ?? '').trim()
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    try {
      await docClient.send(
        new PutCommand({
          TableName: tableName,
          Item: { playerName: name, wins: 0, losses: 0 },
          ConditionExpression: 'attribute_not_exists(playerName)',
        }),
      )
      return res.status(201).json({ name, wins: 0, losses: 0 })
    } catch (err) {
      if (err.name === 'ConditionalCheckFailedException') {
        return res.status(409).json({ error: 'Player already exists' })
      }
      console.error('POST /players', err)
      return res.status(500).json({ error: 'Failed to create player' })
    }
  })

  app.put('/players/:name', async (req, res) => {
    const name = decodeURIComponent(req.params.name).trim()
    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const wins = Number(req.body?.wins)
    const losses = Number(req.body?.losses)
    if (
      !Number.isInteger(wins) ||
      !Number.isInteger(losses) ||
      wins < 0 ||
      losses < 0
    ) {
      return res
        .status(400)
        .json({ error: 'wins and losses must be non-negative integers' })
    }

    try {
      const result = await docClient.send(
        new UpdateCommand({
          TableName: tableName,
          Key: { playerName: name },
          UpdateExpression: 'SET wins = :w, losses = :l',
          ExpressionAttributeValues: { ':w': wins, ':l': losses },
          ReturnValues: 'ALL_NEW',
        }),
      )

      const attrs = result.Attributes ?? {}
      return res.json({
        name: attrs.playerName,
        wins: Number(attrs.wins ?? wins),
        losses: Number(attrs.losses ?? losses),
      })
    } catch (err) {
      console.error('PUT /players', err)
      return res.status(500).json({ error: 'Failed to update player' })
    }
  })

  return app
}
