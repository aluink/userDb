export function validateDob(dob) {
  if (typeof dob !== 'string') return 
}

export function validateUser(user) {
  const { userId, name, dob, email, email2, email3 } = user;
  const errors = [];
  // TODO genericize this
  if (typeof userId !== "string") {
    errors.push({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    errors.push({ error: '"name" must be a string' });
  } else if (typeof dob !== "string" || validateDob(dob)) {
    errors.push({ error: '"dob" must be a string' });
  } else if (typeof email !== "string") {
    errors.push({ error: '"email" must be a string' });
  } else if (email2 && typeof email2 !== "string") {
    errors.push({ error: '"email2" must be a string' });
  } else if (email3 && typeof email3 !== "string") {
    errors.push({ error: '"email3" must be a string' });
  }

  return [{ userId, name, dob, email, email2, email3 }, errors];
}