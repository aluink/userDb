import { DOB_PAST_ERROR, DOB_STRING_ERROR, EMAIL_LENGTH_ERROR, EMAIL_STRING_ERROR, USER_ID_STRING_ERROR, USER_NAME_STRING_ERROR, validateDob, validateEmailModRules, validateEmailProperty, validateUser } from "../src/validation.js";
import { mockBadUser_Name, mockBadUser_UserId, mockBadUser_UserIdName, mockUser } from "./mocks.js";

describe("validation", () => {
  describe("dob validation", () => {
    it('valiadates dob', () => {
      const validation = validateDob('12/1/2005');
      expect(validation).toBeUndefined();
    });

    it('fails when a number', () => {
      const validation = validateDob(123);
      expect(validation).toEqual({ error: DOB_STRING_ERROR });
    });
    
    it('fails when undefined', () => {
      const validation = validateDob();
      expect(validation).toEqual({ error: DOB_STRING_ERROR });
    });
    
    it('fails when in the future', () => {
      const validation = validateDob('1/1/2051');
      expect(validation).toEqual({ error: DOB_PAST_ERROR });
    });
  });
  
  describe('email validation', () => {
    it('validates an empty email array', () => {
      const validation = validateEmailProperty([]);
      expect(validation).toBeUndefined();
    });
    
    it('validate a single email in an array', () => {
      const validation = validateEmailProperty(['bob@mail.com']);
      expect(validation).toBeUndefined();
    });
    
    it('validates a full email array', () => {
      const validation = validateEmailProperty(['bob@mail.com', 'mary@mail.com', 'smith@longdomain.com']);
      expect(validation).toBeUndefined();
    });
    
    it('fails when undefined', () => {
      const validation = validateEmailProperty();
      expect(validation).toEqual({ error: EMAIL_STRING_ERROR });
    });
    
    it('fails when too many emails', () => {
      const validation = validateEmailProperty(['bob@mail.com', 'mary@mail.com', 'smith@longdomain.com', 'toomany@mail.com']);
      expect(validation).toEqual({ error: EMAIL_LENGTH_ERROR });
    });
  });
  
  describe('user validation', () => {
    it('validates a user', () => {
      const [_, errors] = validateUser(mockUser);
      expect(errors).toEqual([]);
    });
    
    it('fails on a bad userId', () => {
      const [_, errors] = validateUser(mockBadUser_UserId);
      expect(errors).toEqual([{ error: USER_ID_STRING_ERROR }]);
      expect(errors).toHaveLength(1);
    });
    
    it('fails on a bad name', () => {
      const [_, errors] = validateUser(mockBadUser_Name);
      expect(errors).toEqual([{ error: USER_NAME_STRING_ERROR }]);
      expect(errors).toHaveLength(1);
    });
    
    it('fails on a bad name and id', () => {
      const [_, errors] = validateUser(mockBadUser_UserIdName);
      expect(errors).toEqual(expect.arrayContaining([
        { error: USER_ID_STRING_ERROR },
        { error: USER_NAME_STRING_ERROR },
      ]));
      expect(errors).toHaveLength(2);
    });
  });

  describe('email mod rules', () => {
    it('validates empty no change', () => {
      const errors = validateEmailModRules([], []);
      expect(errors).toHaveLength(0);
    });

    it('validates same emails', () => {
      const errors = validateEmailModRules(['bob@mail.com'], ['bob@mail.com']);
      expect(errors).toHaveLength(0);
    });

    it('validates same emails out of order', () => {
      const errors = validateEmailModRules(['mary@mail.com', 'bob@mail.com'], ['bob@mail.com', 'mary@mail.com']);
      expect(errors).toHaveLength(0);
    });

    if('validates adding first email', () => {
      const errors = validateEmailModRules([], ['bob@mail.com']);
      expect(errors).toHaveLength(0);
    });

    if('validates adding second email before', () => {
      const errors = validateEmailModRules(['mary@mail.com'], ['mary@mail.com', 'bob@mail.com']);
      expect(errors).toHaveLength(0);
    });

    if('validates adding second email after', () => {
      const errors = validateEmailModRules(['mary@mail.com'], ['bob@mail.com', 'mary@mail.com']);
      expect(errors).toHaveLength(0);
    });

    if('fails removing email', () => {
      const errors = validateEmailModRules(['mary@mail.com'], []);
      expect(errors).toHaveLength(1);
    });

    if('fails replacing email', () => {
      const errors = validateEmailModRules(['mary@mail.com'], ['bob@mail.com']);
      expect(errors).toHaveLength(1);
    });

    if('fails replacing and adding email', () => {
      const errors = validateEmailModRules(['mary@mail.com'], ['bob@mail.com', 'eric@mail.com']);
      expect(errors).toHaveLength(1);
    });
  });
});