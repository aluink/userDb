import {
  validateEmailModRules,
  validateUser,
} from './validation.js';
import dbClient from "./db-api.js";

export async function getUserHandler(req, res) {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ errors: [{ error: '"userId" required' }] });
      return;
    }
    const user = await dbClient.getUserById(userId);
    if (user) {
      const { userId, name, dob, email } = user;
      res.status(200).json({ userId, name, dob, email });
    } else {
      res
        .status(404)
        .json({ errors: [{ error: 'Could not find user with provided "userId"' }] });
    }
  } catch (error) {
    console.error(error, res);
    res.status(500).json({ errors: [{ error: "Could not retrieve user" }] });
  }
}

export async function postUserHandler(req, res) {
  const [user, errors] = validateUser(req.body);

  if (errors.length > 0) {
    res
      .status(400)
      .json({ errors });

    return;
  }

  const existingUser = await dbClient.getUserById(user.userId);
  if (existingUser) {
    res
      .status(400)
      .json({ errors: [ { error: 'User with the specific userId already exists' } ] });

    return;
  }

  try {
    await dbClient.putUser(user);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ error: "Could not create user" }] });
  }
}

export async function putUserHandler(req, res) {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({ errors: [{ error: '"userId" required' }] });
    return;
  }


  const [user, errors] = validateUser(req.body);

  if (errors.length > 0) {
    res
      .status(400)
      .json({ errors });
    return;
  }

  if (req.params.userId !== user.userId) {
    res.status(400).json({ errors: [{error: "\"userId\" does not match the URL's \"userId\"" }] });
    return;
  }

  const dbUser = await dbClient.getUserById(userId);
  if (!dbUser) {
    res
      .status(404)
      .json({ errors: [{ error: 'Could not find user with provided "userId"' }] });

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
    await dbClient.putUser(user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ error: "Could not create user" }] });
  }
}

export async function deleteUserHandler(req, res) {
  try {
    const { userId } = req.params;
    await dbClient.deleteUserById(userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ error: "Could not create user" }] });
  }
}
