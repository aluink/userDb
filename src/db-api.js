import {
  GetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const USERS_TABLE = process.env.USERS_TABLE;

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

class DbClient {
  async getUserById(userId) {
    const command = new GetCommand({
      TableName: process.env.USERS_TABLE,
      Key: { userId },
    });

    const { Item } = await docClient.send(command);

    return Item;
  }

  async putUser(user) {
    const command = new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    });
    await docClient.send(command);
  }

  async deleteUserById(userId) {
    const command = new DeleteCommand({
      TableName: USERS_TABLE,
      Key: { userId },
    });

    await docClient.send(command);
  }
}

export default new DbClient();
