

import { jest } from '@jest/globals';

import { deleteUserHandler, getUserHandler, postUserHandler, putUserHandler } from "../src/route-handlers.js";
import dbF from "../src/db-api.js";

import { mockBadUser_UserId, mockUser, mockUser2 } from "./mocks.js";

describe("handlers", () => {
  let res;

  beforeEach(() => {
    res = {
      send: jest.fn(function () { return this; }),
      json: jest.fn(function () { return this; }),
      status: jest.fn(function () { return this; }),
    };
  });

  describe("GET /users/:userId", () => {
    it("should return a user", async () => {
        const spy = jest.spyOn(dbF, 'getUserById');
        spy.mockResolvedValueOnce(mockUser);

        const req = { params: { userId: 1 } };
        await getUserHandler(req, res);

        expect(res.json).toBeCalledWith(mockUser);
        expect(res.status).toBeCalledWith(200);
    });

    it("should return 500 when DB call fails", async () => {
      const spy = jest.spyOn(dbF, 'getUserById');
      spy.mockRejectedValue();

      const req = { params: { userId: 1 } };
      await getUserHandler(req, res);

      expect(res.status).toBeCalledWith(500);
    });

    it("should return 404 when user not found", async () => {
      const spy = jest.spyOn(dbF, 'getUserById');
      spy.mockResolvedValue();

      const req = { params: { userId: 1 } };
      await getUserHandler(req, res);

      expect(res.status).toBeCalledWith(404);
    });

    // Express should prevent this from happening with URL params
    // but it's an extra layer of precaution
    it("should return 400 when userId not passed", async () => {
      const spy = jest.spyOn(dbF, 'getUserById');

      const req = { params: {} };
      await getUserHandler(req, res);

      expect(res.status).toBeCalledWith(400);
    });
  });

  describe("POST /users", () => {
    it("should create new user", async () => {
      const spy = jest.spyOn(dbF, 'putUser');
      spy.mockResolvedValue();

      const req = { body: mockUser };
      await postUserHandler(req, res);

      expect(res.json).toBeCalledWith(mockUser);
      expect(res.status).toBeCalledWith(201);
    });

    it("should return 404 when user is malformed", async () => {
      const spy = jest.spyOn(dbF, 'putUser');
      spy.mockResolvedValue();

      const req = { body: mockBadUser_UserId };
      await postUserHandler(req, res);

      expect(res.status).toBeCalledWith(400);
    });

    it("should return 500 when DB call fails", async () => {
      const spy = jest.spyOn(dbF, 'putUser');
      spy.mockRejectedValue();

      const req = { body: mockUser };
      await postUserHandler(req, res);

      expect(res.status).toBeCalledWith(500);
    });
  });

  describe("PUT /users/:userId", () => {
    it("should update a user", async () => {
      const putSpy = jest.spyOn(dbF, 'putUser');
      putSpy.mockResolvedValue();

      const getSpy = jest.spyOn(dbF, 'getUserById');
      getSpy.mockResolvedValue(mockUser);
      
      const req = { params: { userId: mockUser.userId }, body: mockUser };
      await putUserHandler(req, res);
      
      expect(res.json).toBeCalledWith(mockUser);
      expect(res.status).toBeCalledWith(200);
    });

    // Express should prevent this from happening with URL params
    // but it's an extra layer of precaution
    it("should return 400 when userId not passed", async () => {
      const getSpy = jest.spyOn(dbF, 'getUserById');
      getSpy.mockResolvedValue();

      const req = { params: { }, body: mockUser };
      await putUserHandler(req, res);

      expect(res.status).toBeCalledWith(400);
    });

    it("should return 404 when user is malformed", async () => {
      const spy = jest.spyOn(dbF, 'putUser');
      spy.mockResolvedValue();

      const req = { params: { userId: mockUser.userId }, body: mockBadUser_UserId };
      await putUserHandler(req, res);

      expect(res.status).toBeCalledWith(400);
    });

    it("should return 400 when userId doesn't match the URL", async () => {
      const req = { params: { userId: "2" }, body: mockUser };
      await putUserHandler(req, res);

      expect(res.status).toBeCalledWith(400);
    });

    it("should return 404 when user not found", async () => {
      const getSpy = jest.spyOn(dbF, 'getUserById');
      getSpy.mockResolvedValue();

      const req = { params: { userId: mockUser.userId }, body: mockUser };
      await putUserHandler(req, res);

      expect(res.status).toBeCalledWith(404);
    });

    it("should return 400 when email modification is illegal", async () => {
      const getSpy = jest.spyOn(dbF, 'getUserById');
      getSpy.mockResolvedValue(mockUser);
      
      const req = { params: { userId: mockUser.userId }, body: mockUser2 };
      await putUserHandler(req, res);
      
      expect(res.status).toBeCalledWith(400);
    });

    it("should return 500 when DB call fails", async () => {
      const putSpy = jest.spyOn(dbF, 'putUser');
      putSpy.mockRejectedValue();

      const getSpy = jest.spyOn(dbF, 'getUserById');
      getSpy.mockResolvedValue(mockUser);
      
      const req = { params: { userId: mockUser.userId }, body: mockUser };
      await putUserHandler(req, res);
      
      expect(res.status).toBeCalledWith(500);
    });
  })

  describe("DELETE /users/:userId", () => {
    it("should delete user", async () => {
      const putSpy = jest.spyOn(dbF, 'deleteUserById');
      putSpy.mockResolvedValue();

      const req = { params: { userId: mockUser.userId } };
      await deleteUserHandler(req, res);

      expect(res.status).toBeCalledWith(204);
      expect(res.send).toBeCalled();
    });
  })
});