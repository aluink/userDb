export function validateDob(dob) {
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

export function validateEmailProperty(email) {
  if (!(typeof email === "object" && email.constructor === Array)) {
    const t = typeof email;
    console.log('email type', t);
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
  if (typeof userId !== "string") {
    errors.push({ error: '"userId" must be a string' });
  }

  if (typeof name !== "string") {
    errors.push({ error: '"name" must be a string' });
  }
  
  if (tmpError = validateDob(dob)) {
    errors.push(tmpError);
  }

  errors.push(...(validateEmailProperty(email) ?? []));

  return [{ userId, name, dob, email }, errors];
}

export function validateEmailModRules(dbUserEmail, userEmails) {
  const errors = [];
  for (let e of dbUserEmail) {
    if (!userEmails.some(x => x === e)) {
      errors.push({ error: `${e} email missing in payload`});
    }
  }

  if (errors.length > 0) return errors;

  errors.push(...(validateEmailProperty(userEmails) ?? []));

  return errors;
}
