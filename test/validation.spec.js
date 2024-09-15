import { validateDob, validateEmailModRules, validateEmailProperty, validateUser } from "../src/validation.js";
import { mockBadUser_Name, mockBadUser_UserId, mockBadUser_UserIdName, mockUser } from "./mocks.js";

// We're specifically not checking error strings cause those aren't
// necessarily business rules at this point.

describe("validation", () => {
  describe("dob validation", () => {
    it('valiadates dob', () => {
      const validation = validateDob('12/1/2005');
      expect(validation).toBeUndefined();
    });

    it('fails when a number', () => {
      const validation = validateDob(123);
      expect(validation).toHaveProperty('error');
    });

    it('fails when undefined', () => {
      const validation = validateDob();
      expect(validation).toHaveProperty('error');
    });
    
    it('fails when in the future', () => {
      const validation = validateDob('1/1/2051');
      expect(validation).toHaveProperty('error');
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
      expect(validation).toHaveProperty('error');
    });

    it('fails when too many emails', () => {
      const validation = validateEmailProperty(['bob@mail.com', 'mary@mail.com', 'smith@longdomain.com', 'toomany@mail.com']);
      expect(validation).toHaveProperty('error');
    });
  });

  describe('user validation', () => {
    it('validates a user', () => {
      const [_, errors] = validateUser(mockUser);
      expect(errors).toEqual([]);
    });

    it('fails on a bad userId', () => {
      const [_, errors] = validateUser(mockBadUser_UserId);
      expect(errors).toHaveLength(1);
    });

    it('fails on a bad name', () => {
      const [_, errors] = validateUser(mockBadUser_Name);
      expect(errors).toHaveLength(1);
    });

    it('fails on a bad name and id', () => {
      const [_, errors] = validateUser(mockBadUser_UserIdName);
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