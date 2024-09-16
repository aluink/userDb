import EmailValidator from 'email-validator';

export const DOB_STRING_ERROR = '"dob" must be a string';
export const DOB_FORMAT_ERROR = '"dob" must be a valid date format';
export const DOB_PAST_ERROR = '"dob" must be in the past';

export const EMAIL_ARRAY_ERROR = '"email" must be an array';
export const EMAIL_LENGTH_ERROR = 'A maximum of three emails are allowed';

export const USER_ID_STRING_ERROR = '"userId" must be a string';
export const USER_NAME_STRING_ERROR = '"name" must be a string';

/**
 * 
 * Validates a `dob` string. The value should be a valid Javascript date
 * string.
 * 
 * @param dob 
 * @returns An array of errors, if any, or an empty array on success.
 */
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

/**
 * 
 * Validates an array of emails
 * 
 * @param email 
 * @returns An array of errors, if any, or an empty array on success.
 */
export function validateEmailProperty(email) {
  if (!(typeof email === "object" && email.constructor === Array)) {
    return [{ error: EMAIL_ARRAY_ERROR }];
  }

  if (email.length > 3) {
    return [{ error: EMAIL_LENGTH_ERROR }];
  }

  const errors = [];
  for (const e of email) {
    console.log('email', e);
    if (typeof e !== "string") {
      console.log('here1', typeof email);
      errors.push({ error: `${e} is not a valid string` });
    } else if (!EmailValidator.validate(e)) {
      console.log('here2');
      errors.push({ error: `${e} is not a valid email string` });
    }
  }

  return errors;
}

/**
 * 
 * Validates a user model.
 * 
 * @param user 
 * @returns An array of errors, if any, or an empty array on success.
 */
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

/**
 * 
 * Validates changes to the email list for a given user.
 * 
 * 1. Emails can only be added, not removed.
 * 2. A maximum of 3 emails
 * 
 * @param dbUserEmail Existing user email array in the DB
 * @param userEmails Suggested changes to the list
 * @returns 
 */
export function validateEmailModRules(dbUserEmail, userEmails) {
  const errors = [];
  for (let e of dbUserEmail) {
    if (!userEmails.some(x => x === e)) {
      errors.push({ error: `${e} cannot be removed as an email`});
    }
  }

  if (errors.length > 0) return errors;

  errors.push(...validateEmailProperty(userEmails));

  return errors;
}
