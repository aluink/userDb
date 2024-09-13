const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");

const {
  validateDob,
  validateUser
} = require('./tools');

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/users/:userId", async (req, res) => {
  try {
    const command = new GetCommand({
      TableName: USERS_TABLE,
      Key: {
        userId: req.params.userId,
      },
    });

    const { Item } = await docClient.send(command);
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
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
  const [{ userId, name, dob, email, email2, email3 }, errors] = validateUser(req.body);

  if (errors.length > 0) {
    res
      .status
      .json({ errors });
  }

  try {
    const item = { userId, name, dob, email, email2, email3 };
    const command = new PutCommand({
      TableName: USERS_TABLE,
      Item: item,
    });
    await docClient.send(command);
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

// app.put("/users/:userId", async (req, res) => {
//   const { userId, name } = req.body;


// });

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
