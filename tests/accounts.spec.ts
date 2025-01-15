import { execSync } from "node:child_process";

import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";

import { app } from "../src/app";

describe("accounts routes", async () => {
  it("should be able to create an account", async () => {
    const createAccountResponse = await request(app.server)
      .post("/accounts")
      .send({
        name: "Jonh Doe",
        email: "jonhdoe@example.com",
        password: "12345678",
      })
      .expect(201);

    const cookies = createAccountResponse.get("Set-Cookie") ?? [];

    expect(createAccountResponse.body).toEqual(
      expect.objectContaining({
        accountId: expect.any(String),
      })
    );

    expect(cookies).toEqual(
      expect.arrayContaining([
        expect.stringContaining(createAccountResponse.body.accountId),
      ])
    );
  });

  it("should be able to authenticate with an already existing account", async () => {
    const createAccountFirstResponse = await request(app.server)
      .post("/accounts")
      .send({
        name: "Jonh Doe",
        email: "jonhdoe@example.com",
        password: "12345678",
      })
      .expect(201);

    const createAccountSecondResponse = await request(app.server)
      .post("/accounts")
      .send({
        name: "Jonh Doe 1",
        email: "jonhdoe1@example.com",
        password: "12345678",
      })
      .expect(201);

    const cookiesSecondResponse =
      createAccountSecondResponse.get("Set-Cookie") ?? [];

    expect(cookiesSecondResponse).toEqual(
      expect.arrayContaining([
        expect.stringContaining(createAccountSecondResponse.body.accountId),
      ])
    );

    const createAccountAuthResponse = await request(app.server)
      .post("/accounts")
      .send({
        name: "Jonh Doe",
        email: "jonhdoe@example.com",
        password: "12345678",
      })
      .expect(200);

    const cookiesAuthResponse =
      createAccountAuthResponse.get("Set-Cookie") ?? [];

    expect(cookiesAuthResponse).toEqual(
      expect.arrayContaining([
        expect.stringContaining(createAccountFirstResponse.body.accountId),
      ])
    );
  });

  it("should not be able to authenticate with an already existing account with the incorrect password", async () => {
    await request(app.server)
      .post("/accounts")
      .send({
        name: "Jonh Doe",
        email: "jonhdoe@example.com",
        password: "12345678",
      })
      .expect(201);

    await request(app.server)
      .post("/accounts")
      .send({
        name: "Jonh Doe 1",
        email: "jonhdoe1@example.com",
        password: "12345678",
      })
      .expect(201);

    await request(app.server)
      .post("/accounts")
      .send({
        name: "Jonh Doe",
        email: "jonhdoe@example.com",
        password: "123456789",
      })
      .expect(401);
  });
});
