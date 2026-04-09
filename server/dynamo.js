import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const region = process.env.AWS_REGION || 'us-east-1'
const endpoint = process.env.DYNAMODB_ENDPOINT

function buildBaseClient() {
  return new DynamoDBClient({
    region,
    ...(endpoint ? { endpoint } : {}),
    ...(endpoint
      ? {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
          },
        }
      : {}),
  })
}

export function createDynamoStack() {
  const base = buildBaseClient()
  const doc = DynamoDBDocumentClient.from(base, {
    marshallOptions: { removeUndefinedValues: true },
  })
  return { base, doc }
}

export async function ensurePlayersTable(baseClient, tableName) {
  try {
    await baseClient.send(
      new DescribeTableCommand({ TableName: tableName }),
    )
    return
  } catch (e) {
    if (e.name !== 'ResourceNotFoundException') throw e
  }

  await baseClient.send(
    new CreateTableCommand({
      TableName: tableName,
      KeySchema: [{ AttributeName: 'playerName', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'playerName', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }),
  )
}
