import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import express  from "express";
import serverless from "serverless-http";

import {
  validateUser,
  getUserById
} from './tools.js';

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/users/:userId", async (req, res) => {
  try {
    const user = getUserById(docClient, req.params.userId);
    if (user) {
      const { userId, name, dob, email } = user;
      res.json({ userId, name, dob, email });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve user" });
  }
});

app.post("/users", async (req, res) => {
  const [user, errors] = validateUser(req.body);

  if (errors.length > 0) {
    res
      .status(400)
      .json({ errors });

    return;
  }

  try {
    const command = new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    });
    await docClient.send(command);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.put("/users/:userId", async (req, res) => {
  const [user, errors] = validateUser(req.body);

  if (req.params.userId !== user.userId) {
    errors.push({error: "\"userId\" does not match the URL's \"userId\"" });
  }

  const dbUser = getUserById(docClient, req.params.userId);

  if (!dbUser) {
    errors.push({ error: 'No user found for userId in URL' });
  }

  errors.push(...validateEmailModRules(dbUser.email, user.email));

  if (errors.length > 0) {
    res
      .status(400)
      .json({ errors });
  }

  try {
    const command = new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    });
    await docClient.send(command);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
