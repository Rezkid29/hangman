import { createApp } from './app.js'
import { createDynamoStack, ensurePlayersTable } from './dynamo.js'

const PORT = Number(process.env.PORT || 3001)
const TABLE = process.env.PLAYERS_TABLE || 'HangmanPlayers'

const { base, doc } = createDynamoStack()

await ensurePlayersTable(base, TABLE)

const app = createApp(doc, TABLE)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Hangman API listening on port ${PORT}`)
  console.log(`DynamoDB table: ${TABLE}`)
})
