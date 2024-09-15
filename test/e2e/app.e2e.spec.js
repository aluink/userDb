import request from "supertest";
import { app } from "../../src/app.js";
import { jest } from '@jest/globals';

import dbF from "../../src/db-api.js";

const mockUser = {
  userId: "1",
  name: 'Mock User',
  dob: '12/1/1995',
  email: ['bob@mail.com'],
};

describe("route-handlers", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a user", async () => {
    const spy = jest.spyOn(dbF, 'getUserById');
    spy.mockResolvedValueOnce(mockUser);

    const res = await request(app).get("/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  it("should create a user", async () => {
    const spy = jest.spyOn(dbF, 'putUser');
    spy.mockResolvedValueOnce();

    const res = await request(app).post("/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mockUser);
  });

  it("should update a user", async () => {
    const putSpy = jest.spyOn(dbF, 'putUser');
    putSpy.mockResolvedValueOnce();

    const getSpy = jest.spyOn(dbF, 'getUserById');
    getSpy.mockResolvedValueOnce(mockUser);

    const res = await request(app).put("/users/1").send(mockUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  it("should delete a user", async () => {
    const spy = jest.spyOn(dbF, 'deleteUserById');
    spy.mockResolvedValueOnce();

    const res = await request(app).delete("/users/1");
    expect(res.statusCode).toBe(204);
  });
});