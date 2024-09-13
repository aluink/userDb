

import { jest } from '@jest/globals';

import { getUserHandler } from "../router.js";
import dbF from "../db-api.js";

// const mockGetUserById = jest.fn();
// , () => {
//   return {
//     getUserById: (userId) => {
//       mockGetUserById.mockImplementation(() => {
//         return {
//           userId,
//           name: 'Mock User',
//           dob: '12/1/2005',
//           email: ['bob@mail.com'],
//         };
//       })();
//     }
//   };
// });

const mockUser = {
  userId: 1,
  name: 'Mock User',
  dob: '12/1/1995',
  email: ['bob@mail.com'],
};

describe("GET /user/:userId", () => {
  let res;

  beforeEach(() => {
    res = { text: '', json: '', statusCode: '',
      send: function(input) { this.text = input },
      json: function(input) { this.json = input },
      status: function(input) { this.statusCode = input; return this; },
    };
  });

  it("should return a user", async () => {
      const spy = jest.spyOn(dbF, 'getUserById');
      spy.mockResolvedValueOnce(mockUser);

      const req = { params: { userId: 1 } };
      await getUserHandler(req, res);

      expect(res.statusCode).toEqual(200);
      expect(res.json).toEqual(mockUser);
  });
});