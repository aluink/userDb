export const DOB_STRING_ERROR = '"dob" must be a string';
export const DOB_FORMAT_ERROR = '"dob" must be a valid date format';
export const DOB_PAST_ERROR = '"dob" must be in the past';

export const EMAIL_STRING_ERROR = '"email" must be an array';
export const EMAIL_LENGTH_ERROR = 'A maximum of three emails are allowed';

export const USER_ID_STRING_ERROR = '"userId" must be a string';
export const USER_NAME_STRING_ERROR = '"name" must be a string';

export function validateDob(dob) {
  if (typeof dob !== 'string'){
    return [{ error: DOB_STRING_ERROR }];
  }

  const date = new Date(dob);

  if (!date) {
    return [{ error: DOB_FORMAT_ERROR }];
  }

  if (new Date() < date) {
    return [{ error: DOB_PAST_ERROR }];
  }

  return [];
}

export function validateEmailProperty(email) {
  if (!(typeof email === "object" && email.constructor === Array)) {
    const t = typeof email;
    return [{ error: EMAIL_STRING_ERROR }];
  }

  if (email.length > 3) {
    return [{ error: EMAIL_LENGTH_ERROR }];
  }

  return [];
}

export function validateUser(user) {
  const { userId, name, dob, email } = user;
  const errors = [];
  if (typeof userId !== "string") {
    errors.push({ error: USER_ID_STRING_ERROR });
  }

  if (typeof name !== "string") {
    errors.push({ error: USER_NAME_STRING_ERROR });
  }
  
  errors.push(...validateDob(dob));

  errors.push(...validateEmailProperty(email));

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

  errors.push(...validateEmailProperty(userEmails));

  return errors;
}
