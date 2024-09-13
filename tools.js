function validateDob(dob) {
  if (typeof dob !== 'string'){
    return { error: '"dob" must be a string' };
  }

  const date = new Date(dob);

  if (!date) {
    return { error: '"dob" must be a valid date format' };
  }

  if (new Date() < date) {
    return { error: '"dob" must be in the past' };
  }
}

function validateEmail(email) {
  if (typeof email !== "array") {
    return { error: '"email" must be an array' };
  }

  if (email.length > 3) {
    return { error: 'A maximum of three emails are allowed' };
  }
}

export function validateUser(user) {
  const { userId, name, dob, email } = user;
  const errors = [];
  let tmpError;
  // TODO genericize this, maybe
  if (typeof userId !== "string") {
    errors.push({ error: '"userId" must be a string' });
  }

  if (typeof name !== "string") {
    errors.push({ error: '"name" must be a string' });
  }
  
  if (tmpError = validateDob(dob)) {
    errors.push(tmpError);
  }

  if (tmpError = validateEmail(email)) {
    errors.push(tmpError);
  }

  return [{ userId, name, dob, email }, errors];
}

export async function getUserById(docClient, userId) {
  const command = new GetCommand({
    TableName: USERS_TABLE,
    Key: { userId },
  });

  const { Item } = await docClient.send(command);

  return Item;
}

export function validateEmailModRules(dbUserEmail, userEmails) {
  const errors = [];
  for (let e of dbUserEmail) {
    if (!userEmails.contains(e)) {
      errors.push({ error: `${e} email missing in payload`})
    }
  }

  if (errors.length > 0) return errors;

  errors.push(...validateEmail(userEmails));

  return errors;
}
