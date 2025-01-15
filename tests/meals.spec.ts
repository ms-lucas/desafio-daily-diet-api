import { describe, it } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("meals routes", async () => {
  it("should be able to create a meal", async () => {
    const createAccountResponse = await request(app.server)
      .post("/accounts")
      .send({
        name: "Jonh Doe",
        email: "jonhdoe@example.com",
        password: "12345678",
      });

    const cookies = createAccountResponse.get("Set-Cookie") ?? [];

    const response = await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Meal",
        description: "Meal 01",
        eat_at: "2024-10-09T00:03:10.695Z",
        within_diet: "true",
      })
      .expect(200);
  });
});
