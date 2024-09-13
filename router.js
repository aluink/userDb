import {
  validateEmailModRules,
  validateUser,
} from './validation.js';
import dbClient from "./db-api.js";

import { Router } from 'express';

const router = Router();

router.get("/users/:userId", getUserHandler);
export async function getUserHandler(req, res) {
  try {
    const user = await dbClient.getUserById(req.params.userId);
    if (user) {
      const { userId, name, dob, email } = user;
      res.status(200).json({ userId, name, dob, email });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve user" });
  }
}

router.post("/users", postUserHandler);
export async function postUserHandler(req, res) {
  const [user, errors] = validateUser(req.body);

  if (errors.length > 0) {
    res
      .status(400)
      .json({ errors });

    return;
  }

  try {
    await dbClient.putUser(user);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user" });
  }
}

router.put("/users/:userId", putUserHandler);
export async function putUserHandler(req, res) {
  const [user, errors] = validateUser(req.body);

  if (req.params.userId !== user.userId) {
    errors.push({error: "\"userId\" does not match the URL's \"userId\"" });
  }

  const dbUser = await dbClient.getUserById(req.params.userId);

  if (!dbUser) {
    res
      .status(404)
      .json({ error: 'Could not find user with provided "userId"' });

    return;
  }

  errors.push(...validateEmailModRules(dbUser.email, user.email));

  if (errors.length > 0) {
    res
      .status(400)
      .json({ errors });
    return;
  }

  try {
    await dbClient.putUser(docClient, user);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user" });
  }
}

router.delete("/users/:userId", deleteUserHandler);
export async function deleteUserHandler(req, res) {
  try {
    const { userId } = req.params;
    await dbClient.deleteUserById(userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user" });
  }
}

// router.use((req, res, next) => {
//   return res.status(404).json({
//     error: "Not Found",
//   });
// });

export default router;
